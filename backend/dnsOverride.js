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

const originalDnsLookup = dns.lookup;

function customLookup(hostname, options, callback) {
    if (typeof options === 'function') {
        callback = options;
        options = {};
    }

    if (hostname && hostname.endsWith('.supabase.co')) {
        resolver.resolve4(hostname)
            .then(addresses => {
                if (addresses && addresses.length > 0) {
                    if (options && options.all) {
                        const formatted = addresses.map(addr => ({ address: addr, family: 4 }));
                        callback(null, formatted);
                    } else {
                        callback(null, addresses[0], 4);
                    }
                } else {
                    originalDnsLookup(hostname, options, callback);
                }
            })
            .catch(err => {
                console.error(`[DNS Override] Resolution failed for ${hostname}:`, err.message);
                originalDnsLookup(hostname, options, callback);
            });
    } else {
        originalDnsLookup(hostname, options, callback);
    }
}

// 1. Monkey-patch global dns.lookup (Intercepts legacy HTTP agents)
dns.lookup = customLookup;

// 2. Monkey-patch dns.promises.lookup
dns.promises.lookup = function (hostname, options) {
    return new Promise((resolve, reject) => {
        customLookup(hostname, options || {}, (err, address, family) => {
            if (err) return reject(err);
            if (options && options.all) {
                resolve(address);
            } else {
                resolve({ address, family });
            }
        });
    });
};

// 3. Monkey-patch https.globalAgent just in case older libraries/polyfills use it
if (!https.globalAgent.options) https.globalAgent.options = {};
https.globalAgent.options.lookup = customLookup;

// 4. Undici (Native Fetch in Node 18+) Patch
// Native global.fetch ignores globalAgent and dns.lookup globally if not set BEFORE its initialization.
// Supabase-js uses native fetch. We dynamically import undici to set the global dispatcher.
import('undici').then(({ Agent, setGlobalDispatcher }) => {
    const customAgent = new Agent({
        connect: {
            lookup: customLookup
        }
    });
    setGlobalDispatcher(customAgent);
    console.log('[DNS Override] Patched Undici global fetch dispatcher for *.supabase.co');
}).catch(err => {
    console.error('[DNS Override] Could not patch native fetch (undici not found):', err.message);
});

console.log('[DNS Override] Patched dns.lookup and https.globalAgent for *.supabase.co to bypass ISP blocks');
