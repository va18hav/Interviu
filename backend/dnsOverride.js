import https from 'https';
import dns from 'dns';

/**
 * --- JIO NETWORK DNS OVERRIDE FOR SUPABASE ---
 * Why this exists: 
 * Resolves an issue where Indian Jio ISP users cannot access Supabase endpoints due to ISP network/DNS blocks.
 * This intercepts the resolution just for Supabase and uses Google/Cloudflare public DNS instead.
 * 
 * Note: This is a temporary fix and can be removed once the ISP issue resolves.
 * It is completely isolated and does not affect other APIs.
 */

const resolver = new dns.promises.Resolver();
resolver.setServers(['8.8.8.8', '1.1.1.1']); // Google, Cloudflare

// Ensure globalAgent options object exists
if (!https.globalAgent.options) {
    https.globalAgent.options = {};
}

const originalLookup = https.globalAgent.options.lookup || dns.lookup;

https.globalAgent.options.lookup = (hostname, options, callback) => {
    // dns.lookup allows options to be optional
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    if (hostname && hostname.endsWith('.supabase.co')) {
        resolver.resolve4(hostname)
            .then(addresses => {
                if (addresses && addresses.length > 0) {
                    // Node's dns.lookup handles `{all: true}` differently
                    if (options && options.all) {
                        const formatted = addresses.map(addr => ({ address: addr, family: 4 }));
                        callback(null, formatted);
                    } else {
                        callback(null, addresses[0], 4);
                    }
                } else {
                    // In case we somehow get an empty array without throwing
                    originalLookup(hostname, options, callback);
                }
            })
            .catch(err => {
                console.error(`[DNS Override] Resolution failed for ${hostname}:`, err.message);
                // Fallback safely so the app doesn't crash on timeouts
                originalLookup(hostname, options, callback);
            });
    } else {
        originalLookup(hostname, options, callback);
    }
};

console.log('[DNS Override] Patched https.globalAgent.lookup for *.supabase.co to bypass ISP blocks');
