import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // Cambiar en producción

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      this.socket.on('connect', () => {
        console.log('✅ Conectado a Socket.IO');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Desconectado de Socket.IO');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión:', error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('join-match', matchId);
    }
  }

  leaveMatch(matchId: string) {
    if (this.socket) {
      this.socket.emit('leave-match', matchId);
    }
  }

  onMatchEvent(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('new-match-event', callback);
    }
  }

  offMatchEvent() {
    if (this.socket) {
      this.socket.off('new-match-event');
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
