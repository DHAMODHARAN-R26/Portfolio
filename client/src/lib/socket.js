import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';

let socket = null;

/**
 * Initializes and returns a single socket connection instance
 */
export function getSocket() {
  if (typeof window === 'undefined') return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false, // Don't connect immediately, let pages activate connection
    });

    socket.on('connect', () => {
      console.log('Socket.io connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Socket.io disconnected from server');
    });
  }

  return socket;
}
