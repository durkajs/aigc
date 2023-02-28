import { cmd, env, opt, sub } from '@serpent/common-cli/cmder'
import { COMMAND_KEY } from 'src/config/index.js'

export default cmd(
  {
    usage:   `${COMMAND_KEY} <command> [options]`,
    version: '__BUILD_VERSION__',
    // 选项
    options: {
      test: opt('boolean', '这是一个布尔变量'),
    },
    // 环境变量
    env: {
      FOO: env('boolean', '环境变量解析'),
    },
    // 子命令
    commands: {
      '<foo>             根据模板项目初始化一个新项目': sub('./cli-foo.js'),
      '<bar>             将当前项目打包成一个模板项目': sub('./cli-bar.js'),
    },
  },
  ctx => {
    ctx.help()
  },
)
