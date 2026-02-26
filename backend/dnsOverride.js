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
const originalDnsPromisesLookup = dns.promises.lookup;

// Ensure globalAgent options object exists
if (!https.globalAgent.options) {
    https.globalAgent.options = {};
}
const originalAgentLookup = https.globalAgent.options.lookup || originalDnsLookup;

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

// 1. Monkey-patch global dns.lookup (Intercepts Undici/Node 18+ native fetch in many cases)
dns.lookup = customLookup;

// 2. Monkey-patch dns.promises.lookup
dns.promises.lookup = function (hostname, options) {
    return new Promise((resolve, reject) => {
        customLookup(hostname, options || {}, (err, address, family) => {
            if (err) return reject(err);
            if (options && options.all) {
                // When 'all' is true, address is already the formatted array
                resolve(address);
            } else {
                resolve({ address, family });
            }
        });
    });
};

// 3. Monkey-patch https.globalAgent just in case older libraries/polyfills use it
https.globalAgent.options.lookup = customLookup;

console.log('[DNS Override] Patched dns.lookup and https.globalAgent for *.supabase.co to bypass ISP blocks');
