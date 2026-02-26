import { Agent, setGlobalDispatcher } from 'undici';
import dns from 'dns';

export function setup() {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(['8.8.8.8', '1.1.1.1']);

    const agent = new Agent({
        connect: {
            lookup: (hostname, options, callback) => {
                console.log('[Custom Undici Lookup]', hostname);
                if (hostname.endsWith('.supabase.co')) {
                    resolver.resolve4(hostname).then(addrs => {
                        console.log('[Resolved to]', addrs);
                        callback(null, addrs[0], 4);
                    }).catch(err => {
                        console.error('Error resolving', err);
                        callback(err);
                    });
                } else {
                    dns.lookup(hostname, options, callback);
                }
            }
        }
    });

    setGlobalDispatcher(agent);
}

setup();

fetch('https://qkexrvwllivvdfaxpbyb.supabase.co/rest/v1/?apikey=123').then(x => console.log('Fetch success', x.status)).catch(console.error);
