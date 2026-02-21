import { WebSocket } from 'ws';

// Polyfill for libraries that expect global.WebSocket
if (!global.WebSocket) {
    global.WebSocket = WebSocket;
}

// Polyfill for RTCPeerConnection (if needed by other libs, mostly for LiveKit which is gone, but safe to keep/remove)
// removing unnecessary ones.
