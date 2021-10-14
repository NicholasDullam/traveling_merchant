import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutInterface } from '../components'
import { useParams } from "react-router-dom"
import { useHistory } from "react-router-dom";
import api from '../api'

const stripePromise = loadStripe('pk_test_51JgZaNI1DlY4C11AjLqdA60NeGBqOpb4g1lJIfGuxCKPqX7PKbaNRKuk5WhaW1PYb6G2F5cWuHbvDsmDkZ5xPPUh004SfLzcZL')

const Checkout = (props) => {
    const [order, setOrder] = useState(null)
    const { order_id } = useParams()
    const history = useHistory()

    useEffect(() => {
        api.getOrderById(order_id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            history.push('/')
        })
    }, [order_id])

    return (
        <Elements stripe={stripePromise}>
            <CheckoutInterface order={order}/>
        </Elements>
    )
}

export default Checkout