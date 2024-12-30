import { io } from "socket.io-client";

const socketInstance = io(process.env.REACT_APP_API_BASE_URL, {
  withCredentials: true,
  secure: true,
  transports: ["websocket"],
});

export default socketInstance;
