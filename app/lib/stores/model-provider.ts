import { atom } from 'nanostores';

export type ModelProvider = 'ollama' | 'anthropic';

export const kModelProvider = 'bolt_model_provider';
export const DEFAULT_MODEL_PROVIDER: ModelProvider = 'ollama';

export const modelProviderStore = atom<ModelProvider>(initModelProvider());

function initModelProvider() {
  if (!import.meta.env.SSR) {
    const persisted = localStorage.getItem(kModelProvider) as ModelProvider | null;

    if (persisted === 'ollama' || persisted === 'anthropic') {
      return persisted;
    }
  }

  return DEFAULT_MODEL_PROVIDER;
}

export function setModelProvider(provider: ModelProvider) {
  modelProviderStore.set(provider);

  if (!import.meta.env.SSR) {
    localStorage.setItem(kModelProvider, provider);
  }
}
