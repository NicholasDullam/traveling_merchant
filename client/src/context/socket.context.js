import { createContext } from 'react';

const SocketContext = createContext({
    isConnected: false,
    socket: null,
    setSocket: () => {}
});

export default SocketContext;