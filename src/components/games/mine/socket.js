// socket.js (Global WebSocket Instance)
import { io } from "socket.io-client";
console.log("Socket URL????????:", import.meta.env.VITE_SOCKET_URL);
const socket = io(import.meta.env.VITE_SOCKET_URL);
window.socket = socket;
export default socket;
