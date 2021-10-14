import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_test_51JgZaNI1DlY4C11AjLqdA60NeGBqOpb4g1lJIfGuxCKPqX7PKbaNRKuk5WhaW1PYb6G2F5cWuHbvDsmDkZ5xPPUh004SfLzcZL')

const Checkout = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <div>

            </div>
        </Elements>
    )
}

export default Checkout