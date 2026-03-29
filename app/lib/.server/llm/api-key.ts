import { env } from 'node:process';

export function getAPIKey(cloudflareEnv: Env) {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  return env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
}

export function getOllamaConfig(cloudflareEnv: Env) {
  const baseURL =
    env.OLLAMA_API_URL ||
    cloudflareEnv.OLLAMA_API_URL ||
    'http://localhost:11434/api';
  const apiKey = env.OLLAMA_API_KEY || cloudflareEnv.OLLAMA_API_KEY;
  const model = env.OLLAMA_MODEL || cloudflareEnv.OLLAMA_MODEL || 'phi3';

  return {
    baseURL,
    apiKey,
    model,
  };
}
