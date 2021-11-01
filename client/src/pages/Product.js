import React, { useContext, useEffect, useState } from 'react'
import {useParams, useHistory} from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'

import MessengerContext from '../context/messenger-context'

const Product = (props) => {
    const [user, setUser] = useState(null)
    const [product, setProduct] = useState(null)
    const [favorited, setFavorited] = useState(null)
    const [reviews, setReviews] = useState([])
    const [quantity, setQuantity] = useState('')
    const auth = useContext(AuthContext)
    const { product_id } = useParams()

    const history = useHistory()

    const handlePurchase = (e) => {
        e.stopPropagation()
        if (!auth.isLoggedIn) history.push(`/login?redirect_uri=${props.location.pathname}`)
        api.createOrder({ quantity: Number(quantity) || product.min_quantity, product_id: product._id }).then((response) => {
            history.push(`/orders/${response.data._id}/checkout`)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleQuantity = (e) => {
        setQuantity(e.target.value)
    }

    useEffect(() => {
        api.getProductById(product_id).then((response) => {
            setProduct(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        api.getFavorites({ params: { product_id }}).then((response) => {
            setFavorited(response.data.length ? response.data[0]._id : null )
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        api.createView({ product_id }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (!product) return
        api.getUserById(product.user_id).then((response) => {
            setUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    useEffect(() => {
        if (!user) return
        api.getReviews({ params: { seller: user._id }}).then((response) => {
            setReviews(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    const handleFavorite = () => {
        api.createFavorite({ product_id }).then((response) => {
            setFavorited(response.data._id)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleUnfavorite = () => {
        api.deleteFavoriteById(favorited).then((response) => {
            setFavorited(false)
        }).catch((error) => {
            console.log(error)
        })
    }
    var icon ="";
    

    function displayIcon() {
    if (product.type == "currency") {
     icon = <FaCoins/>   
    }

    return icon;
}


    return (
        <Layout navbar>
            { product ? <div style={{ display: 'flex', position: 'relative', maxWidth: '100%' }}>
                <div style={{ width: '50%', height: '100%'}}>
                    <img src={product.media.length ? product.media[0] : null } style={{ height: '600px', width: '80%', backgroundColor: 'grey', borderRadius: '10px' }}/>
                </div>
                <div style={{ width: '50%'}}>
                    <div style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '20px', cursor: 'pointer' }}>
                        { favorited ? <AiFillHeart onClick={handleUnfavorite}/> : <AiOutlineHeart onClick={handleFavorite}/> }
                    </div>
                    <h2> {product.name} </h2>
                    <h5 style={{ marginTop: '10px', marginBottom: '10px' }}> ${product.unit_price / 100} per unit </h5>
                    <label for="emailInput" className="form-label" style={{ marginTop: '10px' }}>Quantity</label>
                    <input type="number" style={{ maxWidth: '200px', marginBottom: '20px' }} value={quantity} className="form-control" id="emailInput" placeholder={`${product.min_quantity}`}
                    onChange={handleQuantity}></input>

                    <p style={{ marginBottom: '0px' }}> Product ID: {product._id} </p>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
                    <p style={{ marginBottom: '0px' }}> {displayIcon()} {product.type} </p>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
                    <p style={{ marginBottom: '0px' }}> Delivery Method: {product.delivery_type} </p>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
                    

                    <button style={{ width: '100%', marginTop: '20px' }} class="btn btn-primary" onClick={handlePurchase}> Buy Now </button>
                    { user ? <div>
                        <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '20px 0px 20px 0px' }}/>
                        <div>
                            <h5> Sold by </h5>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }} onClick={() => history.push(`/users/${user._id}`)}>
                                <img src={user.profile_img} style={{ height: '60px', width: '60px', borderRadius: '50%' }}/>
                                <div style={{ marginLeft: '20px'}}>
                                    <h5 style={{ marginBottom: '0px' }}> {user.first} {user.last} </h5>
                                    <Ratings user_id={user._id}/>
                                </div>
                            </div>
                        </div> 
                        <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '20px 0px 20px 0px' }}/>
                        <h5> Seller Reviews </h5>
                        <div style={{ marginTop: '20px' }}>
                            {
                                reviews.map((review, i) => {
                                    return (
                                        <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Ratings count={review.rating}/>
                                                <h6 style={{ marginBottom: '-3px' , marginLeft: '10px'}}> {review.content} </h6>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div> : null }
            
                </div>
            </div> : null }
        </Layout>
    )
}

export default Product