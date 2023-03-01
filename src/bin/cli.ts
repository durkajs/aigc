import fs from 'fs'
import ora from 'ora'
import clip from 'clipboardy'
import { cmd, env, opt, sub } from '@serpent/common-cli/cmder'
import { COMMAND } from 'src/config/constant.js'
import { aigc } from 'src/util/openai.js'
import { tryRun } from 'src/util/tryRun.js'

export default cmd(
  {
    usage: `${COMMAND} [options] path/to/file`,
    desc:  [
      `Generate Content:`,
      `  ${COMMAND} --prompt "Write unit test for the code below" path/to/your/codeFile`,
      `  ${COMMAND} --prompt "Write unit test for the code below" --stdin`,
      '',
      'Reference: https://platform.openai.com/docs/api-reference/completions/create',
    ],
    version: '__BUILD_VERSION__',
    options: {
      spinner:           opt('boolean', 'Display spinner or not, enabled by default. You can disable it by using `--spinner=false` {{ true }}'),
      stdin:             opt('boolean', 'Read additional prompt information from stdin'),
      echo:              opt('boolean', 'Echo the prompt in terminal'),
      code:              opt('boolean', '<c> Setting the GPT model to "code-davinci-002" is equivalent to using the option `--model=code-davinci-002`'),
      temperature:       opt('number', '[GPT] <t> Between 0 and 2. Higher values make the output more random, lower values make it more focused and deterministic {{ 0.7 }}'),
      model:             opt('string', `[GPT] <m> ID of the model to use, using \`${COMMAND} models\` show currently available models {{ "text-davinci-003" }}`),
      prompt:            opt('string', '[GPT] <p> The prompt to generate completions for, or the key of the prompt saved in the environment variable'),
      presence_penalty:  opt('number', '[GPT] Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far {{ 0 }}'),
      frequency_penalty: opt('number', '[GPT] Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far {{ 0 }}'),
      max_tokens:        opt('number', '[GPT] <M> The maximum number of tokens to generate in the completion {{ 1000 }}'),
      top_p:             opt('number', '[GPT] <P> An alternative to sampling with temperature {{ 1 }}'),
      n:                 opt('number', '[GPT] How many completions to generate for each prompt {{ 1 }}'),
      best_of:           opt('number', '[GPT] Generates `best_of` completions and returns the "best"'),
      logprobs:          opt('number', '[GPT] Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens'),
      logit_bias:        opt('string', '[GPT] Modify the likelihood of specified tokens appearing in the completion, Accepts a json object that maps tokens to an associated bias value from -100 to 100'),
      suffix:            opt('string', '[GPT] The suffix that comes after a completion of inserted text'),
      stop:              opt('string', '[GPT] Up to 4 sequences where the API will stop generating further tokens, If there are multiple, separate them with a comma'),
      user:              opt('string', '[GPT] A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse'),
    },
    env: {
      OPENAI_API_KEY: env('string', 'OpenAI API key. Retrieve from https://platform.openai.com/account/api-keys'),
    },
    commands: {
      '<list-models> Lists the currently available models': sub('./cli-list-models.js'),
      '<tokenizer> Convert text to token IDs':              sub('./cli-tokenizer.js'),
      '<image> Creates an image given a prompt':            sub('./cli-image.js'),
    },
  },
  async ctx => {
    const { prompt = '', stdin, spinner: enableSpinner, echo, code, ...opts } = ctx.options

    const newPrompt = [
      prompt && process.env[prompt] ? process.env[prompt] : prompt,
      await (stdin ? readContentFromStdin() : readContentFromFiles(ctx.args)),
    ].filter(str => !!str.trim()).join('\n\n')

    if (echo) console.log(newPrompt + '\n')
    return tryRun(ora({ isEnabled: enableSpinner, prefixText: 'The AI is generating content' }), async(spinner) => {
      const stop = opts.stop && opts.stop.split(/\s*,\s*/) // turn `stop` prop to array
      const logit_bias = opts.logit_bias && JSON.parse(opts.logit_bias) // turn `logit_bias` prop to json
      if (code) opts.model = 'code-davinci-002'
      const res = await aigc({ ...opts, stop, logit_bias, prompt: `${newPrompt}` })

      // stop spinner and output result
      spinner.stop()
      const choices = res.choices.filter(c => c.text) as { text: string }[]
      if (!choices.length) {
        ctx.logger.warn(res)
      } else if (choices.length === 1) {
        console.log(choices[0].text)
        clip.write(choices[0].text)
          .then(() => ctx.logger.clog(`\n%c%s`, 'gray', 'The content has been copied to the clipboard'))
          .catch(() => {})
      } else {
        choices.forEach((choice, i) => {
          ctx.logger.head(`Choice ${i + 1}`)
          ctx.logger.body(choice.text)
        })
      }
    })
  },
)

function readContentFromStdin() {
  return new Promise<string>((resolve, reject) => {
    let input = ''
    process.stdin.setEncoding('utf-8')
    process.stdin.on('data', function(data) {
      input += data.toString()
    })
    process.stdin.once('end', () => resolve(input))
    process.stdin.once('error', reject)
  })
}

function readContentFromFiles(files: string[]) {
  return Promise.all(files.map(file => new Promise<string>((resolve, reject) => {

    fs.access(file, (err) => {
      if (err) return err.code !== 'ENOENT' && reject(err)

      fs.readFile(file, (err, data) => {
        if (err) return reject(err)
        resolve(data.toString())
      })
    })

  }))).then(codes => codes.join('\n\n'))
}
