import { createContext } from 'react';

 const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;