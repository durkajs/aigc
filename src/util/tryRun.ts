import { Ora } from 'ora'

export async function tryRun<T extends((spinner: Ora) => Promise<void>)>(spinner: Ora, fn: T) {
  try {
    spinner.start()
    await fn(spinner)
  } catch (e: any) {
    process.exitCode = 1
    spinner.prefixText = ''
    if (e.response) {
      spinner.fail(`${e.response.status} ${JSON.stringify(e.response.data)}`)
    } else {
      spinner.fail(e.message)
    }
  }
}
