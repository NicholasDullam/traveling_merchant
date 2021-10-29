import { createContext } from 'react';

const MessengerContext = createContext({
    isConnected: false,
    isOpen: false,
    threads: [],
    activeThread: null,
    activeThreadId: null,
    messages: {},
    open: () => {},
    close: () => {},
    connect: () => {},
    setActiveThread: () => {},
    setActiveThreadId: () => {},
    setMessages: () => {},
    setThreads: () => {},
});

export default MessengerContext;