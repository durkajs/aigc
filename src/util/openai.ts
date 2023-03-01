import { Configuration, OpenAIApi, CreateCompletionRequest } from 'openai'

export function openai() {
  const { env } = process
  const key = env.OPENAI_KEY || env.OPENAI_API_KEY

  if (!key) {
    throw new Error('Please set your OpenAI API key "OPENAI_API_KEY" in env.')
  }

  return new OpenAIApi(new Configuration({ apiKey: key }))
}

export async function aigc(options: { prompt: string } & Omit<Partial<CreateCompletionRequest>, 'prompt'>) {
  const {
    prompt,
    model,
    temperature,
    best_of,
    echo,
    presence_penalty = 0,
    frequency_penalty = 0,
    logit_bias,
    logprobs,
    max_tokens,
    n,
    stop,
    stream,
    suffix,
    top_p,
    user,
  } = options

  if (typeof prompt !== 'string' || !prompt.trim()) throw new Error('No prompt for OpenAI')
  if (typeof model !== 'string' || !model.trim()) throw new Error('No model for OpenAI')

  const completion = await openai().createCompletion({
    prompt,
    model,
    temperature,
    best_of,
    echo,
    presence_penalty,
    frequency_penalty,
    logit_bias,
    logprobs,
    max_tokens,
    n,
    stop,
    stream,
    suffix,
    top_p,
    user,
  })

  return completion.data
}
