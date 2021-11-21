import { createContext } from 'react';

const ClientContext = createContext({
    width: 0,
    height: 0,
    setWidth: () => {},
    setHeight: () => {}
});

export default ClientContext