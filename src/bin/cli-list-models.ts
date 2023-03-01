import { cmd } from '@serpent/common-cli/cmder'
import ora from 'ora'
import { openai } from 'src/util/openai.js'
import { tryRun } from 'src/util/tryRun.js'

const EXPLAIN: Record<string, string> = {
  'code-davinci-002': 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.',
  'code-cushman-001': 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.',

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
