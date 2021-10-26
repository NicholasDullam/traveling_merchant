import { createContext } from 'react';

const MessengerContext = createContext({
    isConnected: false,
    isOpen: false,
    open: () => {},
    close: () => {}
});

export default MessengerContext;