import React, { useContext, useEffect, useState } from 'react'
import {useParams, useHistory} from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


import MessengerContext from '../context/messenger-context'
import { ProductCard } from '../components'
import Chart from '../components/Chart/Chart'

const Product = (props) => {
   
    const [pricing, setPricing] = useState([])
    const [user, setUser] = useState(null)
    const [product, setProduct] = useState(null)
    const [similarProducts, setSimilarProducts] = useState([])
    const [otherProducts, setOtherProducts] = useState([])
    const [favorited, setFavorited] = useState(null)
    const [reviews, setReviews] = useState([])
    const [quantity, setQuantity] = useState('')
    const auth = useContext(AuthContext)
    const { product_id } = useParams()

    const history = useHistory()

    const data = [
        {
          name: 'Dec 12',//date
          price: 100
  
        },
        {
          name: 'Dec 13', //date
          price:200
   
        },
        {
            name: 'Dec 15', //date
            price:80
     
          },]


    const handlePurchase = (e) => {
        e.stopPropagation()
        if (!auth.isLoggedIn) history.push(`/login?redirect_uri=${props.location.pathname}`)
        api.createOrder({ quantity: Number(quantity) || product.min_quantity, product: product._id }).then((response) => {
            history.push(`/orders/${response.data._id}/checkout`)
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleQuantity = (e) => {
        setQuantity(e.target.value)
    }


    useEffect(() => {
        api.getPricing(product_id).then((response) => {
            setPricing(JSON.parse(response).points)
            console.log(pricing) // TODO : Does this work? Does it display anything in the console (i.e, if you open localhost:3000 on your browser and right click and go to inspect > console ?  
        }).catch((error) => {
            console.log(error)
        })
    }, [product_id])

    useEffect(() => {
        api.getProductById(product_id).then((response) => {
            setProduct(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product_id])

    useEffect(() => {
        api.getFavorites({ params: { product: product_id }}).then((response) => {
            setFavorited(response.data.length ? response.data[0]._id : null )
        }).catch((error) => {
            console.log(error)
        })
    }, [product_id])

    useEffect(() => {
        api.createView({ product: product_id }).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (!product) return
        api.getUserById(product.user).then((response) => {
            setUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    useEffect(() => {
        if (!user) return
        api.getReviews({ params: { seller: user._id, limit: 3 }}).then((response) => {
            setReviews(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    useEffect(() => {
        if (!product) return
        api.getSimilarProducts(product._id, { params: { limit: 3 }}).then((response) => {
            setSimilarProducts(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    useEffect(() => {
        if (!product) return
        api.getOtherProducts(product._id, { params: { limit: 3 }}).then((response) => {
            setOtherProducts(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    const handleFavorite = () => {
        api.createFavorite({ product: product_id }).then((response) => {
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

    return (
        <Layout navbar>
            { product ? <div style={{ position: 'relative', maxWidth: '100%' }}>
                <div style={{ width: '100%', display: 'flex' }}>
                    <div style={{ width: '50%' }}>
                        <img src={product.media.length ? product.media[0] : null } style={{ height: '600px', width: '80%', backgroundColor: 'grey', borderRadius: '10px', position: 'sticky' }}/>
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
                        <p style={{ marginBottom: '0px' }}> Product Type: {product.type} </p>
                        <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
                        <p style={{ marginBottom: '0px' }}> Delivery Method: {product.delivery_type} </p>
                        <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', margin: '10px 0px 10px 0px' }}/>
                        

                        <button style={{ width: '100%', marginTop: '20px' }} class="btn btn-primary" onClick={handlePurchase}> Buy Now </button>
                        { user ? <div>
                            <h5 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '40px' }}> Sold by </h5>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }} onClick={() => history.push(`/users/${user._id}`)}>
                                    <img src={user.profile_img} style={{ height: '60px', width: '60px', borderRadius: '50%' }}/>
                                    <div style={{ marginLeft: '20px'}}>
                                        <h5 style={{ marginBottom: '0px' }}> {user.first} {user.last} </h5>
                                        <Ratings user_id={user._id}/>
                                    </div>
                                </div>
                            </div> 
                            <h5 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '40px' }}> Seller Reviews </h5>
                            <div style={{ marginTop: '10px', height: reviews ? 'calc(auto)' : '0px' , overflow: 'hidden', transition: 'height 300ms ease' }}>
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
                </div>
                <div>
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Similar Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            similarProducts.map((similarProduct) => {
                                return <ProductCard product={similarProduct}/>
                            })
                        }
                    </div>
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Other Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            otherProducts.map((otherProduct) => {
                                return <ProductCard product={otherProduct}/>
                            })
                        }
                    </div>

                    <div class="price-history" style={{ borderBottom: '1px solid rgba(0,0,0,.1)'}}>
                            <h4>Price History</h4>

<LineChart
  width={400}
  height={400}
  data={data}
>

  <Tooltip />
  <Line type="monotone" dataKey="price" stroke="#ff7300" isAnimationActive={false} />
  <XAxis dataKey="name" />
  <YAxis/>
  

</LineChart>
                            {/* <Chart ></Chart> */}
                    </div>
                </div>
            </div> : null }
        </Layout>
    )
}

export default Product