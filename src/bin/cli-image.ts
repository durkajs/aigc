import { cmd, opt } from '@serpent/common-cli/cmder'
import { writeFile, exists } from '@serpent/common-cli/fs'
import ora from 'ora'
import { COMMAND } from 'src/config/constant.js'
import { openai } from 'src/util/openai.js'
import { tryRun } from 'src/util/tryRun.js'

export default cmd({
  usage:   `${COMMAND} image <prompt>`,
  options: {
    spinner: opt('boolean', 'Display spinner or not, enabled by default. You can disable it by using `--spinner=false` {{ true }}'),
    output:  opt('string', '<o> Specify the path for the output file. If there are multiple files, a number will be automatically appended to the end of the filename'),
    size:    opt('string', '[GPT] <s> The size of the generated images. Must be one of "sm", "md", or "lg" {{ "lg" }}'),
    user:    opt('string', '[GPT] A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse'),
    n:       opt('number', '[GPT] The number of images to generate. Must be between 1 and 10'),
  },
}, async(ctx) => {
  const { spinner: enableSpinner, output, size, ...opts } = ctx.options

  await tryRun(ora({ isEnabled: enableSpinner }), async(spinner) => {
    const res = await openai().createImage({
      prompt:          ctx.args.join(' '),
      n:               opts.n,
      response_format: output ? 'b64_json' : 'url',
      size:            ({ sm: '256x256', md: '512x512', lg: '1024x1024' } as const)[size as 'lg'],
      user:            opts.user,
    })
    spinner.stop()
    const images = res.data.data
    images.forEach((image, i) => {
      if (output) {
        const buffer = Buffer.from(image.b64_json as string, 'base64')
        const dist = write(buffer, output, images.length ? i + 1 : 0)
        console.log(`Create file ${dist}`)
      } else {
        console.log(image.url)
      }
    })
  })
})

function write(buffer: Buffer, dist: string, indexSuffix?: number) {
  const match = dist.match(/^(?<base>.*)(?<ext>\.[\w\d]+)$/)
  let base = dist
  let ext = '.png'
  let suffix = indexSuffix ? `-${indexSuffix}` : ''
  if (match && match.groups) {
    base = match.groups.base
    ext = match.groups.ext
  }

  let tryIndex = 2
  dist = `${base}${suffix}${ext}`
  while (exists(dist)) {
    dist = `${base}(${tryIndex})${ext}`
  }

  writeFile(dist, buffer)
  return dist
}
