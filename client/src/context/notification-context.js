import { createContext } from 'react';

const NotificationContext = createContext({
    isOpen: false,
    notifications: [],
    open: () => {},
    close: () => {},
    setNotifications: () => {}
});

export default NotificationContext;