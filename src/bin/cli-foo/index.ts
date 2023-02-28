import { cmd, opt } from '@serpent/common-cli/cmder'
import { COMMAND_KEY } from 'src/config/index.js'

export default cmd(
  {
    usage: `${COMMAND_KEY} foo [options] [name@version]`,

    options: {
      name: opt('string', '选项配置'),
      ab:   opt('string', '选项配置'),
    },
  },
  async ctx => {
    ctx.help()
  },
)
