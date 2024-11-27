// frontend/src/services/websocket.js
class WebSocketService {
  constructor() {
      this.ws = null;
      this.handlers = [];
  }

  connect() {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      this.ws = new WebSocket(`ws://localhost:8000/ws/notifications/`);
      
      this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handlers.forEach(handler => handler(data));
      };

      this.ws.onclose = () => {
          setTimeout(() => {
              this.connect();
          }, 3000);
      };
  }

  addHandler(handler) {
      this.handlers.push(handler);
  }

  removeHandler(handler) {
      this.handlers = this.handlers.filter(h => h !== handler);
  }
}

export const webSocketService = new WebSocketService();