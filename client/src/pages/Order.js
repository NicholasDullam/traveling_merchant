import React from 'react'
import { useParams } from 'react-router'
import { Layout } from '../components'

const Order = (props) => {
    const { order_id } = useParams()

    return (
        <Layout navbar>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ marginTop: '40px' }}> Order </h1>
                <h5 style={{ opacity: '.7' }}> {order_id} </h5>
            </div>
        </Layout>
    )
}

export default Order