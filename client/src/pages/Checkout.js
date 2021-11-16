import React, { useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { CheckoutInterface } from '../components'
import { useParams } from "react-router-dom"
import api from '../api'

const stripePromise = loadStripe('pk_test_51JgZaNI1DlY4C11AjLqdA60NeGBqOpb4g1lJIfGuxCKPqX7PKbaNRKuk5WhaW1PYb6G2F5cWuHbvDsmDkZ5xPPUh004SfLzcZL')

const Checkout = (props) => {
    const [order, setOrder] = useState(null)
    const { order_id } = useParams()

    useEffect(() => {
        api.getOrderById(order_id, { params: { expand: ['seller', 'product', 'product.game'] }}).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [order_id])

    return (
        <Elements stripe={stripePromise}>
            <CheckoutInterface order={order} order_id={order_id}/>
        </Elements>
    )
}

export default Checkout