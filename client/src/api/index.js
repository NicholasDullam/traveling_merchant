import axios from 'axios'

const connection = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? `${process.env.PUBLIC_URL}/api` : 'http://localhost:8000/api',
	withCredentials: true 
})

const login = (payload) => connection.post('/auth/login', payload)
const logout = (payload) => connection.post('/auth/logout', payload)
const verifyToken = (payload) => connection.post('/auth/token', payload)
const getOrderById = (order_id) => connection.get(`/orders/${order_id}`)
const getProductById = (product_id) => connection.get(`/products/${product_id}`)
const getGameById = (game_id) => connection.get(`/games/${game_id}`)
const getUserById = (user_id) => connection.get(`/users/${user_id}`)
const getClientSecret = (pi_id) => connection.get(`/stripe/payment-intents/${pi_id}/secret`)
const getFavorites = (req) => connection.get(`/favorites`, req)
let api = {
    login,
    logout,
    verifyToken,
    getOrderById,
    getProductById,
    getGameById,
    getUserById,
    getClientSecret,
    getFavorites
}

export default api