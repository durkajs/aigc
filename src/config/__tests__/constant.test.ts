import { COMMAND_KEY } from '../constant.js'
import { cmd } from '@serpent/common-cli/cmder'

// ES Module 中如果想用全局的 jest 变量，参考：
// https://jestjs.io/docs/ecmascript-modules#differences-between-esm-and-commonjs
const globalJest = (import.meta as any).jest as typeof jest

describe('COMMAND_KEY', () => {
  const jest = globalJest

  it('should behave...', () => {
    expect(typeof cmd).toBe('function')
    expect(typeof COMMAND_KEY).toBe('string')
    expect(typeof jest.fn === 'function').toBe(true)
    const obj = { a: true }
    expect({ ...obj }).toEqual(obj) // 触发导入 tslib，确保不会报错（低版本 jest 会报错）
  })
})
