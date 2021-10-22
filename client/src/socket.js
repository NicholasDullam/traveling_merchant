import { io } from "socket.io-client";

// URL of server
const URL = "http://localhost:8000";
const socket = io(URL, { autoConnect: false });

export default socket;