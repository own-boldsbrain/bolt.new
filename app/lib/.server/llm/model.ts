import { env } from 'node:process';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOllama } from 'ollama-ai-provider-v2';
import { getAPIKey, getOllamaConfig } from './api-key';

export type ModelProvider = 'ollama' | 'anthropic';

export function getLLMModel(cloudflareEnv: Env, provider?: ModelProvider) {
  const ollamaConfig = getOllamaConfig(cloudflareEnv);

  const isOllamaEnabled = !!(
    ollamaConfig.apiKey ||
    env.OLLAMA_API_URL ||
    env.OLLAMA_MODEL ||
    cloudflareEnv.OLLAMA_API_URL ||
    cloudflareEnv.OLLAMA_MODEL
  );

  const shouldUseOllama =
    provider === 'ollama' || (provider === undefined && isOllamaEnabled);
  const shouldUseAnthropic =
    provider === 'anthropic' ||
    (provider === undefined && !isOllamaEnabled);

  if (shouldUseOllama) {
    const ollama = createOllama({
      baseURL: ollamaConfig.baseURL,
      headers: ollamaConfig.apiKey
        ? { Authorization: `Bearer ${ollamaConfig.apiKey}` }
        : undefined,
    });

    return ollama(ollamaConfig.model);
  }

  if (shouldUseAnthropic) {
    const anthropicKey = getAPIKey(cloudflareEnv);
    if (!anthropicKey) {
      throw new Error(
        'Anthropic provider selected but no ANTHROPIC_API_KEY is available.'
      );
    }

    const anthropic = createAnthropic({ apiKey: anthropicKey });
    return anthropic('claude-3-5-sonnet-20240620');
  }

  throw new Error('Invalid model provider selected.');
}
