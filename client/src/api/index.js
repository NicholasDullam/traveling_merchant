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
const getUsers = (req) => connection.get('/users', req)
const banUserById = (user_id) => connection.put(`/users/${user_id}/ban`)
const unbanUserById = (user_id) => connection.put(`/users/${user_id}/unban`)
const deleteUserById = (user_id) => connection.delete(`/users/${user_id}`)
const createUser = (payload) => connection.post('/users', payload)
const getFavorites = (req) => connection.get(`/favorites`, req)
const getGames = (req) => connection.get('/games', req)
const getViews = (req) => connection.get('/views', req)
const getProducts = (req) => connection.get('/products', req)
const getOrders = (req) => connection.get('/orders', req)
const getReviews = (req) => connection.get('/reviews', req)
const updateUserById = (user_id, payload) => connection.put(`/users/${user_id}`, payload)
const createOrder = (payload) => connection.post('/orders', payload)
const createView = (payload) => connection.post('/views', payload)
const getPaymentMethods = (customer_id) => connection.get(`/stripe/customers/${customer_id}/payment-methods`)
const deletePaymentMethod = (pm_id) => connection.delete(`/stripe/payment-methods/${pm_id}`)
const createFavorite = (payload) => connection.post('/favorites', payload)
const deleteFavoriteById = (favorite_id) => connection.delete(`/favorites/${favorite_id}`)
const verifyPurchase = (order_id) => connection.put(`/orders/${order_id}/verify`)
const getMessageThreads = (req) => connection.get(`/messages/threads`, req)
const getMessagesFromThread = (thread_id) => connection.get(`/messages/threads/${thread_id}`)
const getReviewRating = (user_id) => connection.get(`/reviews/rating/${user_id}`)
const getSimilarProducts = (product_id, req) => connection.get(`/products/${product_id}/similar`, req)
const getRecommendedProducts = (req) => connection.get(`/products/recommended`, req)

let api = {
    login,
    logout,
    verifyToken,
    getOrderById,
    getProductById,
    getGameById,
    getUserById,
    getClientSecret,
    getUsers,
    banUserById,
    unbanUserById,
    deleteUserById,
    createUser,
    getFavorites,
    getGames,
    getViews,
    getProducts,
    getReviews,
    updateUserById,
    getOrders,
    createOrder,
    createView,
    getPaymentMethods,
    deletePaymentMethod,
    createFavorite,
    deleteFavoriteById,
    verifyPurchase,
    getMessageThreads,
    getMessagesFromThread,
    getReviewRating,
    getSimilarProducts,
    getRecommendedProducts
}

export default api