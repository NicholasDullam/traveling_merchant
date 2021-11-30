import React, { useContext, useEffect, useState, useRef, createRef } from 'react'
import {useParams, useHistory, Link} from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProductCard, Collapsable } from '../components'
import { VscRemote, VscGraphLine } from 'react-icons/vsc'
import { MdOutlineMarkEmailUnread } from 'react-icons/md'
import MessengerContext from '../context/messenger-context'

const DeliverySelector = (props) => {
    const [refs, setRefs] = useState({})
    const [selectedRef, setSelectedRef] = useState(null)
    const containerRef = useRef()

    useEffect(() => {
        let newRefs = {}
        props.types.forEach((type) => {
            newRefs[type.type] = createRef()
        })
        setRefs({ ...newRefs })
    }, [props.types])

    useEffect(() => {
        setSelectedRef(refs[props.selected])
    }, [refs, props.selected])

    const getSelectedRect = () => {
        if (!selectedRef || !selectedRef.current) return null
        let dimensions = selectedRef.current.getBoundingClientRect()
        if (!containerRef || !containerRef.current) return null
        let containerDimensions = containerRef.current.getBoundingClientRect()
        return { bottom: containerDimensions.bottom - dimensions.bottom, top: dimensions.top - containerDimensions.top, right: containerDimensions.right - dimensions.right, width: dimensions.width, height: dimensions.height }
    }

    return (
        <div ref={containerRef} style={{ position: 'relative', backgroundColor: 'rgba(0,0,0,.05)', borderRadius: '15px', zIndex: '0', ...props.style }}>
            { getSelectedRect() ? <div style={{ position: 'absolute', top: `${getSelectedRect().top}px`, right: `${getSelectedRect().right}px`, width: `${getSelectedRect().width}px`, height: `${getSelectedRect().height}px`, backgroundColor: 'black', zIndex: '0', transition: 'top 300ms ease, width 300ms ease, opacity 300ms ease', borderRadius: '15px' }}/> : null }
            {
                props.types.map((type, i) => {
                    return <div key={i} ref={refs[type.type]} style={{ display: 'flex', alignItems: 'center', userSelect: 'none', color: props.selected === type.type ? 'white' : 'black', zIndex: '5', transition: 'color 300ms ease', cursor: 'pointer', userSelect: 'none' }} onClick={() => props.handleChange(type.type)}>
                        { getDeliveryMethod(type.type) }
                    </div>
                })
            }
        </div>
    )
}

const getDeliveryMethod = (method) => {
    switch (method) {
        case ('remote') : {
            return (
                <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '15px', zIndex: '1' }}>
                    <VscRemote style={{ fontSize: '24px' }}/>
                    <div style={{ marginLeft: '20px' }}>
                        <h6 style={{ margin: '0px' }}> Remote </h6>
                        <p style={{ margin: '0px', opacity: '.7', fontSize: '14px' }}> Estimated Delivery, November 24th </p>
                    </div>
                </div>
            )
        }

        case ('auto') : {
            return (
                <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '15px', zIndex: '1' }}>
                    <MdOutlineMarkEmailUnread style={{ fontSize: '24px' }}/>
                    <div style={{ marginLeft: '20px' }}>
                        <h6 style={{ margin: '0px' }}> Auto </h6>
                        <p style={{ margin: '0px', opacity: '.7', fontSize: '14px' }}> Estimated Delivery, November 24th </p>
                    </div>
                </div>
            )
        }

        default : {
            return (
                <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderRadius: '15px', zIndex: '1' }}>
                    <MdOutlineMarkEmailUnread style={{ fontSize: '24px' }}/>
                    <div style={{ marginLeft: '20px' }}>
                        <h6 style={{ margin: '0px' }}> Remote </h6>
                        <p style={{ margin: '0px', opacity: '.7', fontSize: '14px' }}> Estimated Delivery, November 24th </p>
                    </div>
                </div>
            )
        }
    }
}

const Product = (props) => {
    const [pricing, setPricing] = useState([])
    const [product, setProduct] = useState(null)
    const [similarProducts, setSimilarProducts] = useState([])
    const [otherProducts, setOtherProducts] = useState([])
    const [favorited, setFavorited] = useState(null)
    const [reviews, setReviews] = useState([])
    const [quantity, setQuantity] = useState('')
    const [selectedMedia, setSelectedMedia] = useState(0)
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null)

    const { product_id } = useParams()
    const auth = useContext(AuthContext)
    const messenger = useContext(MessengerContext)
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
     
        }
    ]

    const handlePurchase = (e) => {
        e.stopPropagation()
        if (!auth.isLoggedIn) history.push(`/login?redirect_uri=${props.location.pathname}`)
        api.createOrder({ quantity: Number(quantity) || product.min_quantity, product: product._id, delivery_type: selectedDeliveryMethod }).then((response) => {
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
        api.getProductById(product_id, { params: { expand: ['user'] }}).then((response) => {
            setProduct(response.data)
            setQuantity(response.data.min_quantity)
            setSelectedDeliveryMethod(response.data.delivery_types[0].type)
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
        api.getReviews({ params: { seller: product.user._id, limit: 3 }}).then((response) => {
            setReviews(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

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

    const renderDesktop = () => {
        return <div style={{ position: 'relative', maxWidth: '100%' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: window.innerWidth < 600 ? 'column' : 'row' }}>
                    { /* Media column */ }
                    <div style={{ width: '60%', marginRight: '50px' }}>
                        <img src={product.media[selectedMedia]} style={{ height: '600px', width: '100%', backgroundColor: 'grey', borderRadius: '15px' }}/>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                product.media.map((image, i) => {
                                    return <img key={i} src={image} style={{ height: '50px', width: '50px', backgroundColor: 'grey', borderRadius: '10px', margin: '10px', boxShadow: i === selectedMedia ? '0px 0px 0px 4px #68B2A0' : null, transition: 'box-shadow 300ms ease', cursor: 'pointer' }} onClick={() => setSelectedMedia(i)}/>
                                })
                            }
                        </div>   

                        <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '0px' }}> {reviews.length} Reviews </h4>
                        <div style={{ height: reviews ? 'calc(auto)' : '0px' , overflow: 'hidden', transition: 'height 300ms ease' }}>
                            {
                                reviews.map((review, i) => {
                                    return (
                                        <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Ratings count={review.rating}/>
                                                <h6 style={{ marginBottom: '-3px' , marginLeft: '10px'}}> {review.content} </h6>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>                
                    </div>

                    { /* Product info and buy */ }
                    <div style={{ width: '40%' }}>
                        <div style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '20px', cursor: 'pointer', transform: favorited ? 'scale(1.1)' : '', transition: 'transform 300ms ease' }}>
                            { favorited ? <AiFillHeart onClick={handleUnfavorite}/> : <AiOutlineHeart onClick={handleFavorite}/> }
                        </div>
                        <Link to={`/users/${product.user._id}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', textDecoration: 'none', color: 'inherit', highlight: 'none' }}>
                            <img src={product.user.profile_img} style={{ height: '40px', width: '40px', borderRadius: '50%' }}/>
                            <div style={{ marginLeft: '15px'}}>
                                <p style={{ margin: '0px' }}> {product.user.first} {product.user.last} </p>
                                <Ratings user_id={product.user._id} style={{ fontSize: '14px', marginTop: '0px' }}/>
                            </div>
                        </Link>

                        <h2> {product.name} </h2>
                        <h3 style={{ marginTop: '10px', marginBottom: '0px' }}> <b>${product.unit_price / 100 * quantity}</b> </h3>
                        <p style={{ marginTop: '0px', marginBottom: '10px' }}>${product.unit_price / 100} <span style={{ fontSize: '14px', opacity: '.7' }}>/unit</span> <VscGraphLine style={{ marginLeft: '8px', fontSize: '22px', color: 'white', padding: '5px 5px 4px 4px', borderRadius: '5px', backgroundColor: '#8baf83' }} /> </p>
                        <div>
                            <label className="form-label" style={{ marginTop: '10px' }}>Quantity</label>
                            <input type="number" style={{ maxWidth: '200px', marginBottom: '20px' }} value={quantity} className="form-control" id="emailInput" placeholder={`${product.min_quantity}`} onChange={handleQuantity}></input>
                        </div>

                        <h6> Delivery Method </h6>
                        <DeliverySelector selected={selectedDeliveryMethod} types={product.delivery_types} handleChange={(value) =>  setSelectedDeliveryMethod(value)}/>

                        <button style={{ width: '100%', marginTop: '20px', borderRadius: '10px', marginBottom: '40px' }} className="btn btn-primary" onClick={handlePurchase}> Buy Now </button>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Description</b> </h5>}>
                            <p> {product.description} </p>
                        </Collapsable>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Attributes</b> </h5>}>

                        </Collapsable>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Meet your seller</b> </h5>}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <Link to={`/users/${product.user._id}`} style={{ textDecoration: 'none', highlight: 'none', color: 'inherit', display: 'flex', alignItems: 'center'}}>
                                    <img src={product.user.profile_img} style={{ height: '60px', width: '60px', borderRadius: '50%' }}/>
                                    <div style={{ marginLeft: '20px'}}>
                                        <p style={{ margin: '0px', fontSize: '18px' }}> {product.user.first} {product.user.last} </p>
                                        <Ratings user_id={product.user._id} style={{ fontSize: '14px', marginTop: '0px' }}/>
                                    </div>
                                </Link>
                                <button style={{ marginLeft: 'auto' }} className="btn btn-primary" onClick={() => messenger.open(product.user._id)}> Message </button>
                            </div>                        
                        </Collapsable>
                    </div>
                </div>
                <div>
                    <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Similar Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            similarProducts.map((similarProduct, i) => {
                                return <ProductCard key={i} product={similarProduct}/>
                            })
                        }
                    </div>
                    <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Other Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            otherProducts.map((otherProduct, i) => {
                                return <ProductCard key={i} product={otherProduct}/>
                            })
                        }
                    </div>

                    <div className="price-history" style={{ borderBottom: '1px solid rgba(0,0,0,.1)'}}>
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
            </div>
    }

    const renderMobile = () => {
        return <div style={{ width: '100%' }}>
                <div style={{ width: '100%' }}>
                    { /* Media column */ }
                        <img src={product.media[selectedMedia]} style={{ height: '600px', width: '100%', backgroundColor: 'grey', borderRadius: '15px' }}/>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                product.media.map((image, i) => {
                                    return <img key={i} src={image} style={{ height: '50px', width: '50px', backgroundColor: 'grey', borderRadius: '10px', margin: '10px', boxShadow: i === selectedMedia ? '0px 0px 0px 4px #68B2A0' : null, transition: 'box-shadow 300ms ease', cursor: 'pointer' }} onClick={() => setSelectedMedia(i)}/>
                                })
                            }
                        </div>                

                    { /* Product info and buy */ }
                        <div style={{ position: 'absolute', top: '0px', right: '0px', fontSize: '20px', cursor: 'pointer', transform: favorited ? 'scale(1.1)' : '', transition: 'transform 300ms ease' }}>
                            { favorited ? <AiFillHeart onClick={handleUnfavorite}/> : <AiOutlineHeart onClick={handleFavorite}/> }
                        </div>

                        <h2> {product.name} </h2>
                        <h3 style={{ marginTop: '10px', marginBottom: '0px' }}> <b>${product.unit_price / 100 * quantity}</b> </h3>
                        <p style={{ marginTop: '0px', marginBottom: '10px' }}>${product.unit_price / 100} <span style={{ fontSize: '14px', opacity: '.7' }}>/unit</span> </p>
                        <div>
                            <label className="form-label" style={{ marginTop: '10px' }}>Quantity</label>
                            <input type="number" style={{ maxWidth: '200px', marginBottom: '20px' }} value={quantity} className="form-control" id="emailInput" placeholder={`${product.min_quantity}`} onChange={handleQuantity}></input>
                        </div>

                        <h6> Delivery Method </h6>
                        <DeliverySelector selected={selectedDeliveryMethod} types={product.delivery_types} handleChange={(value) =>  setSelectedDeliveryMethod(value)}/>

                        <button style={{ width: '100%', marginTop: '20px', borderRadius: '10px', marginBottom: '40px'  }} className="btn btn-primary" onClick={handlePurchase}> Buy Now </button>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Description</b> </h5>}>
                            <p> {product.description} </p>
                        </Collapsable>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Attributes</b> </h5>}>

                        </Collapsable>
                        <Collapsable head={<h5 style={{ marginBottom: '0px' }}> <b>Meet your seller</b> </h5>}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <Link to={`/users/${product.user._id}`} style={{ textDecoration: 'none', highlight: 'none', color: 'inherit', display: 'flex', alignItems: 'center'}}>
                                    <img src={product.user.profile_img} style={{ height: '60px', width: '60px', borderRadius: '50%' }}/>
                                    <div style={{ marginLeft: '20px'}}>
                                        <p style={{ margin: '0px', fontSize: '18px' }}> {product.user.first} {product.user.last} </p>
                                        <Ratings user_id={product.user._id} style={{ fontSize: '14px', marginTop: '0px' }}/>
                                    </div>
                                </Link>
                                <button style={{ marginLeft: 'auto' }} className="btn btn-primary" onClick={() => messenger.open(product.user._id)}> Message </button>
                            </div>                        
                        </Collapsable>
                    </div>
                    <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '0px' }}> {reviews.length} Reviews </h4>
                    <div style={{ height: reviews ? 'calc(auto)' : '0px' , overflow: 'hidden', transition: 'height 300ms ease' }}>
                        {
                            reviews.map((review, i) => {
                                return (
                                    <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Ratings count={review.rating}/>
                                            <h6 style={{ marginBottom: '-3px' , marginLeft: '10px'}}> {review.content} </h6>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>   
                <div>
                    <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Similar Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            similarProducts.map((similarProduct, i) => {
                                return <ProductCard key={i} product={similarProduct}/>
                            })
                        }
                    </div>
                    <h4 style={{ paddingBottom: '10px', marginTop: '40px', marginBottom: '10px' }}> Other Products </h4>
                    <div style={{ marginTop: '10px' }}>
                        {
                            otherProducts.map((otherProduct, i) => {
                                return <ProductCard key={i} product={otherProduct}/>
                            })
                        }
                    </div>
                </div>
            </div>
    }

    return <Layout style={{ width: '100%' }} navbar>
        { product ? (window.innerWidth < 800 ? renderMobile() : renderDesktop()) : null }
    </Layout>
}

export default Product