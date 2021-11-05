import axios from 'axios'

const connection = axios.create({
	baseURL: process.env.NODE_ENV === 'production' ? `${process.env.PUBLIC_URL}/api` : 'http://localhost:8000/api',
	withCredentials: true 
})

// view functions
const createView = (payload) => connection.post('/views', payload)
const getViews = (req) => connection.get('/views', req)

// user functions
const createUser = (payload) => connection.post('/users', payload)
const updateUserById = (user_id, payload) => connection.put(`/users/${user_id}`, payload)
const banUserById = (user_id) => connection.put(`/users/${user_id}/ban`)
const getUserById = (user_id) => connection.get(`/users/${user_id}`)
const getUsers = (req) => connection.get('/users', req)
const unbanUserById = (user_id) => connection.put(`/users/${user_id}/unban`)
const deleteUserById = (user_id) => connection.delete(`/users/${user_id}`)

// auth functions
const login = (payload) => connection.post('/auth/login', payload)
const logout = (payload) => connection.post('/auth/logout', payload)
const verifyToken = (payload) => connection.post('/auth/token', payload)

// favorite functions
const getFavorites = (req) => connection.get(`/favorites`, req)
const createFavorite = (payload) => connection.post('/favorites', payload)
const deleteFavoriteById = (favorite_id) => connection.delete(`/favorites/${favorite_id}`)

// message functions
const getMessageThreads = (req) => connection.get(`/messages/threads`, req)
const getMessagesFromThread = (thread_id) => connection.get(`/messages/threads/${thread_id}`)

// review functions
const getReviews = (req) => connection.get('/reviews', req)
const getReviewRating = (user_id) => connection.get(`/reviews/rating/${user_id}`)
const updateReviewById = (review_id, payload) => connection.put(`/reviews/${review_id}`, payload)
const deleteReviewById = (review_id) => connection.delete(`/reviews/${review_id}`)

// filter functions
const getFilters = (req) => connection.get('/filters', req)
const createFilter = (payload) => connection.post('/filters', payload)
const deleteFilterById = (filter_id) => connection.delete(`/filters/${filter_id}`)

// follower functions
const createFollower = (req) => connection.post('/followers', req)
const getFollowerById = (user_id) => connection.get(`/followers/${user_id}`)

// notification functions
const getNotifications = (req) => connection.get('/notifications', req)
const deleteNotificationById = (notification_id) => connection.delete(`/notifications/${notification_id}`)
const clearNotifications = () => connection.post('/notifications/clear')

// product functions
const getProductById = (product_id) => connection.get(`/products/${product_id}`)
const getProducts = (req) => connection.get('/products', req)
const getSimilarProducts = (product_id, req) => connection.get(`/products/${product_id}/similar`, req)
const getRecommendedProducts = (req) => connection.get(`/products/recommended`, req)

// game functions 
const getGames = (req) => connection.get('/games', req)
const getGameById = (game_id) => connection.get(`/games/${game_id}`)

// order functions
const getOrders = (req) => connection.get('/orders', req)
const createOrder = (payload) => connection.post('/orders', payload)
const getOrderById = (order_id) => connection.get(`/orders/${order_id}`)
const confirmOrder = (order_id) => connection.put(`/orders/${order_id}/confirm`)
const denyOrder = (order_id) => connection.put(`/orders/${order_id}/deny`)
const deliverOrder = (order_id) => connection.put(`/orders/${order_id}/deliver`)
const cancelOrder = (order_id) => connection.put(`/orders/${order_id}/cancel`)
const verifyPurchase = (order_id) => connection.put(`/orders/${order_id}/verify`)

// stripe functions
const getClientSecret = (pi_id) => connection.get(`/stripe/payment-intents/${pi_id}/secret`)
const getPaymentMethods = (customer_id) => connection.get(`/stripe/customers/${customer_id}/payment-methods`)
const deletePaymentMethod = (pm_id) => connection.delete(`/stripe/payment-methods/${pm_id}`)
const getAccountOnboarding = (acct_id) => connection.get(`/stripe/accounts/${acct_id}/onboarding`)
const createAccount = () => connection.post('/stripe/accounts')

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
    updateReviewById,
    deleteReviewById,
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
    getRecommendedProducts,
    getFilters,
    createFilter,
    deleteFilterById,
    createFollower,
    confirmOrder,
    denyOrder,
    cancelOrder,
    createAccount,
    getAccountOnboarding,
    deliverOrder,
    getNotifications,
    getFollowerById,
    deleteNotificationById,
    clearNotifications
}

export default api