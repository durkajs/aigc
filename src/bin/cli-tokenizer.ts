import { cmd } from '@serpent/common-cli/cmder'
import { decode, encode } from 'gpt-3-encoder'

export default cmd({}, (ctx) => {
  const str = ctx.args.join(' ')
  const encoded = encode(str)
  for (let token of encoded){
    console.log({ token, string: decode([token]) })
  }
})
