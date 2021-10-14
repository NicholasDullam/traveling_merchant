import React, { useEffect, useState, useContext } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../context/auth-context"
import api from '../../api';
import { Ratings } from '..';

const CheckoutInterface = (props) => {
    const auth = useContext(AuthContext)

    const stripe = useStripe()
    const elements = useElements()
    const history = useHistory()

    const [product, setProduct] = useState(null)
    const [game, setGame] = useState(null)
    const [seller, setSeller] = useState(null)
    const [clientSecret, setClientSecret] = useState(null)

    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (!auth.user) history.push(`/login?redirect_uri=/checkout/${props.order_id}`)
        else {
            setFirst(auth.user.first)
            setLast(auth.user.last)
            setEmail(auth.user.email)
        }
    }, [])

    useEffect(() => {
        if (!props.order) return null
        api.getProductById(props.order.product_id).then((response) => {
            setProduct(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.order])

    useEffect(() => {
        if (!props.order) return null
        api.getClientSecret(props.order.pi_id).then((response) => {
            setClientSecret(response.data.client_secret)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.order])

    useEffect(() => {
        if (!product) return null
        api.getGameById(product.game_id).then((response) => {
            setGame(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    useEffect(() => {
        if (!product) return null
        api.getUserById(product.user_id).then((response) => {
            console.log(response.data)
            setSeller(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [product])

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!stripe || !elements) return
        
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: `${first} ${last}`,
                    email
                }
            }
        })

        if (result.error) {
            console.log(result.error.message)
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                history.push('/')
            }
        }
    }

    return (
        <div>
            <div style={{ backgroundColor: 'black', height: '100%', width: '50%', position: 'absolute', overflow: 'hidden' }}>
                <Link to="/" className="navbar-brand navbar-brand-black" style={{ position: 'absolute', top: '20px', left: '20px', color: 'white' }}>TM</Link>
                { seller ? <div style={{ padding: '50px', top: '50%', transform: 'translateY(-50%)', position: 'absolute' }}>
                    <h1 style={{ color: 'white' }}> Pay ${(props.order.unit_price / 100)* props.order.quantity} </h1>
                    <h4 style={{ color: 'white', opacity: '.7', marginBottom: '30px' }}> To <span> {seller.first} {seller.last} </span></h4>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={seller.profile_img} style={{ height: '100px', width: '100px', borderRadius: '50%' }}/>
                        <div style={{ marginLeft: '40px' }}>
                            <h3 style={{ marginBottom: '0px', color: 'white' }}> {seller.first} {seller.last} </h3>
                            <Ratings count={5}/>
                            <p style={{ color: 'white', opacity: '.7' }}> No Reviews </p>
                        </div>
                    </div>
                </div> : null }
            </div>
            <div style={{ position: 'absolute', left: '50%', width: '50%', minHeight: '100%', padding: '50px'}}>
                <h3> Order Summary </h3>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.1)' }}/>
                { product && game ? <div style={{ padding: '30px', display: 'flex', alignItems: 'center' }}>
                    <img src={product.media.length ? product.media[0] : null} style={{ backgroundColor: 'grey', borderRadius: '5px', width: '60px', height: '60px' }}/>
                    <div style={{ marginLeft: '15px' }}>
                        <p style={{ marginBottom: '0px' }}> { product.name } </p>
                        <p style={{ opacity: '.7', marginBottom: '0px', fontSize: '12px' }}> { game.name }</p>
                    </div>
                    <div style={{ marginLeft: '40px' }}>
                        <p style={{ marginBottom: '0px' }}> ${props.order.unit_price / 100} x { props.order.quantity } </p>
                    </div>
                    <h5 style={{ marginBottom: '0px', marginLeft: 'auto' }}> ${(props.order.unit_price / 100)* props.order.quantity } </h5>
                </div> : null }
                <h6> Checkout </h6>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.1)' }}/>
                <div style={{ position: 'relative', padding: '30px'}}>
                    <div style={{ display: 'flex', marginBottom: '10px' }}>
                        <div style={{ width: '100%', marginRight: '10px' }}>
                            <label for="first" className="form-label">First Name</label>
                            <input value={first} onChange={(e) => setFirst(e.target.value)} type="text" className="form-control" id="first"/> 
                        </div>
                        <div style={{ width: '100%' }}>
                            <label for="last" className="form-label">Last Name</label>
                            <input value={last} onChange={(e) => setLast(e.target.value)} type="text" className="form-control" id="last"/> 
                        </div>
                    </div>
                    <div style={{ width: '100%', marginBottom: '10px'  }}>
                        <label for="email" className="form-label">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" id="email"/> 
                    </div>

                    <label className="form-label">Card</label>
                    <div style={{ borderRadius: '5px', padding: '10px', border: '1px solid rgba(0,0,0,.15)' }}>
                        <CardElement/>
                    </div>
                </div>
                <div style={{ backgroundColor: '#68B2A0', width: '100%', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'}} onClick={handleSubmit}>
                    <h6 style={{ color: 'white', textAlign: 'center', marginBottom: '0px' }}> Place Order </h6>
                </div>
            </div>
        </div>
    )
}

export default CheckoutInterface