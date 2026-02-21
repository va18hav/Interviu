import { AzureTTSProvider } from './azure-tts-provider.js';

/**
 * TTS Provider Factory
 * Creates the appropriate TTS provider based on name
 */
export function createTTSProvider(providerName = 'azure') {
    // We have consolidated on Azure TTS
    return new AzureTTSProvider();
}

/**
 * Get list of available providers
 */
export function getAvailableProviders() {
    return [
        { id: 'azure', name: 'Azure TTS' }
    ];
}
