import { io } from "socket.io-client";

const socketInstance = io("http://localhost:3050", { withCredentials: true, secure: true });

export default socketInstance;
