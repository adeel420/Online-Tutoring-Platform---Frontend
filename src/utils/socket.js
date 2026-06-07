import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  if (!socket) {
    socket = io(import.meta.env.VITE_SERVER_API, {
      auth: { token },
      transports: ["websocket", "polling"],
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
