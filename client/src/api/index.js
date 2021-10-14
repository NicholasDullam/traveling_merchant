import axios from 'axios'

const connection = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? `${process.env.PUBLIC_URL}/api` : 'http://localhost:8000/api',
	withCredentials: true 
})

// Auth Calls
const login = (payload) => connection.post('/auth/login', payload)
const logout = (payload) => connection.post('/auth/logout', payload)
const verifyToken = (payload) => connection.post('/auth/token', payload)

let api = {
    login,
    logout,
    verifyToken
}

export default api