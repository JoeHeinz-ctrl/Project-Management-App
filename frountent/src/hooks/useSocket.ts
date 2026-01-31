import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    socket = io("http://127.0.0.1:8000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, []);

  return { socket, connected };
};

