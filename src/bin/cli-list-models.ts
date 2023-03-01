import { cmd } from '@serpent/common-cli/cmder'
import ora from 'ora'
import { openai } from 'src/util/openai.js'
import { tryRun } from 'src/util/tryRun.js'

const EXPLAIN: Record<string, string> = {
  'code-davinci-002': 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code',
  'code-cushman-001': 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications',

  'text-davinci-003': 'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text',
  'text-curie-001':   'Very capable, but faster and lower cost than Davinci',
  'text-babbage-001': 'Capable of straightforward tasks, very fast, and lower cost',
  'text-ada-001':     'Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost',
}

export default cmd({}, async(ctx) => {
  await tryRun(ora(), async(spinner) => {
    const res = await openai().listModels()
    spinner.stop()
    console.log(ctx.table(
      res.data.data
        .map(model => [ model.id, '   ', ctx.logger.format('%c%s', 'gray', EXPLAIN[model.id] || '') ]),
    ))
  })
})
