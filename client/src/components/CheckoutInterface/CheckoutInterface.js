import React, { useEffect, useState, useContext } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { Link, useHistory } from "react-router-dom";
import AuthContext from "../../context/auth-context"
import api from '../../api';
import { Ratings } from '..';

import { ReactComponent as Visa } from '../../images/visa.svg'
import { ReactComponent as Amex } from '../../images/amex.svg'
import { ReactComponent as Mastercard } from '../../images/mastercard.svg'
import { ReactComponent as Discover } from '../../images/discover.svg'

const CheckoutInterface = (props) => {
    const auth = useContext(AuthContext)

    const stripe = useStripe()
    const elements = useElements()
    const history = useHistory()

    const [clientSecret, setClientSecret] = useState(null)

    const [first, setFirst] = useState('')
    const [last, setLast] = useState('')
    const [email, setEmail] = useState('')

    const [paymentMethods, setPaymentMethods] = useState([])
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
    const [savePaymentMethod, setSavePaymentMethod] = useState(false)

    useEffect(() => {
        api.getPaymentMethods(auth.user.cust_id).then((response) => {
            setPaymentMethods(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (!auth.user) history.push(`/login?redirect_uri=/checkout/${props.order_id}`)
        else {
            setFirst(auth.user.first)
            setLast(auth.user.last)
            setEmail(auth.user.email)
        }
    }, [])

    useEffect(() => {
        console.log(props.order)
        if (!props.order) return null
        api.getClientSecret(props.order.pi_id).then((response) => {
            setClientSecret(response.data.client_secret)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.order])

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!stripe || !elements) return
        
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: selectedPaymentMethod !== 'new' ? selectedPaymentMethod : {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: `${first} ${last}`,
                    email
                },
            },
            setup_future_usage: savePaymentMethod && selectedPaymentMethod === 'new' ? 'off_session' : ''
        })

        if (result.error) {
            console.log(result.error.message)
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                api.verifyPurchase(props.order._id).then((response) => {
                    history.push(`/orders/${props.order._id}`)
                }).catch((error) => {
                    console.log('Failed to verify purchase')
                })
            }
        }
    }

    const renderBrand = (brand) => {
        switch(brand) {
            case ('visa') : {
                return <Visa style={{ height: '30px', width: '30px' }}/>
            }

            case ('mastercard') : {
                return <Mastercard style={{ height: '30px', width: '30px' }}/>
            }

            case ('amex') : {
                return <Amex style={{ height: '30px', width: '30px' }}/>
            }

            case ('discover') : {
                return <Discover style={{ height: '30px', width: '20px', width: '30px' }}/>
            }

            default: {
                return <Visa/>
            }
        }
    }


    return (
        <div>
            <div style={{ backgroundColor: 'black', height: '100%', width: '50%', position: 'absolute', overflow: 'hidden' }}>
                <Link to="/" className="navbar-brand navbar-brand-black" style={{ position: 'absolute', top: '20px', left: '20px', color: 'white' }}>TM</Link>
                { props.order ? <div style={{ padding: '50px', top: '50%', transform: 'translateY(-50%)', position: 'absolute' }}>
                    <h1 style={{ color: 'white' }}> Pay ${(props.order.unit_price / 100)* props.order.quantity} </h1>
                    <h4 style={{ color: 'white', opacity: '.7', marginBottom: '30px' }}> To <span> {props.order.seller.first} {props.order.seller.last} </span></h4>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={props.order.seller.profile_img} style={{ height: '100px', width: '100px', borderRadius: '50%' }}/>
                        <div style={{ marginLeft: '25px', color: 'white' }}>
                            <h3 style={{ marginBottom: '0px' }}> {props.order.seller.first} {props.order.seller.last} </h3>
                            <Ratings user_id={props.order.seller._id}/>
                        </div>
                    </div>
                </div> : null }
            </div>
            <div style={{ position: 'absolute', left: '50%', width: '50%', minHeight: '100%', padding: '50px'}}>
                <h3> Order Summary </h3>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.1)' }}/>
                { props.order ? <div style={{ padding: '30px 0px 30px 0px', display: 'flex', alignItems: 'center', margin: '5px' }}>
                    <img src={props.order.product.media.length ? props.order.product.media[0] : null} style={{ backgroundColor: 'grey', borderRadius: '5px', width: '60px', height: '60px' }}/>
                    <div style={{ marginLeft: '15px' }}>
                        <p style={{ marginBottom: '0px' }}> { props.order.product.name } </p>
                        <p style={{ opacity: '.7', marginBottom: '0px', fontSize: '12px' }}> { props.order.product.game.name }</p>
                    </div>
                    <div style={{ marginLeft: '40px' }}>
                        <p style={{ marginBottom: '0px' }}> ${props.order.unit_price / 100} x { props.order.quantity } </p>
                    </div>
                    <h5 style={{ marginBottom: '0px', marginLeft: 'auto' }}> ${(props.order.unit_price / 100)* props.order.quantity } </h5>
                </div> : null }
                <h5> Checkout </h5>
                <div style={{ borderTop: '1px solid rgba(0,0,0,.1)' }}/>
                <h6 style={{ marginTop: '20px', marginBottom: '20px' }}> Select a payment method </h6>
                <div>
                    {
                        paymentMethods.map((paymentMethod, i) => {
                            return (
                                <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer', boxShadow: selectedPaymentMethod === paymentMethod.id ? '0px 0px 0px 1px blue' : '', transition: 'box-shadow 300ms ease' }} onClick={() => setSelectedPaymentMethod(paymentMethod.id)}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {renderBrand(paymentMethod.card.brand)}
                                        <p style={{ marginBottom: '0px', marginLeft: '10px' }}> Ending in {paymentMethod.card.last4} </p>
                                        <p style={{ marginBottom: '0px', marginLeft: 'auto', opacity: '.7', fontSize: '14px' }}> Expires {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year} </p>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <p style={{ textAlign: 'center', color: 'blue', opacity: '.5', margin: '10px 10px 20px 10px', fontSize: '14px', cursor: 'pointer' }} onClick={() => setSelectedPaymentMethod('new')}> Use New Payment Method </p>
                </div>
                <div style={{ height: selectedPaymentMethod !== 'new' ? '0px' : '320px', overflow: 'hidden', transition: 'height 300ms ease' }}>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,.1)' }}/>
                    <div style={{ position: 'relative', margin: '5px', marginTop: '20px' }}>
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

                        <div style={{ marginTop: '20px' }}>
                            <input type="checkbox" checked={savePaymentMethod} onChange={(e) => setSavePaymentMethod(e.target.checked)} className="form-check-input" /> 
                            <label className="form-label" style={{ marginLeft: '10px' }}>Save payment method for future use</label>
                        </div>
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