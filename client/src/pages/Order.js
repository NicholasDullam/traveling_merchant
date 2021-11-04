import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api'
import { Layout, ProductCard } from '../components'
import { AiOutlineClockCircle } from 'react-icons/ai'
import AuthContext from '../context/auth-context'

const Order = (props) => {
    const [order, setOrder] = useState(null)
    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)
    const [product, setProduct] = useState(null)

    const auth = useContext(AuthContext)

    const { order_id } = useParams()

    const isBuyer = () => {
        return order.buyer === auth.userId
    }

    // get order on mount
    useEffect(() => {
        if (!order_id) return
        api.getOrderById(order_id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        }) 
    }, [])

    // get buyer or seller on order mount
    useEffect(() => {
        if (!order) return
        api.getUserById(isBuyer() ? order.seller : order.buyer).then((response) => {
            if (isBuyer()) return setSeller(response.data)
            setBuyer(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [order])

    useEffect(() => {
        if (!order) return
        api.getProductById(order.product_id).then((response) => {
            setProduct(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [order])

    const confirmOrder = () => {
        console.log('testing')
        api.confirmOrder(order._id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const denyOrder = () => {
        api.denyOrder(order._id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const deliverOrder = () => {
        api.deliverOrder(order._id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    const renderBuyerContext = () => {
        switch(order.status) {
            case ('confirmation_pending') : {
                return (
                    <div style={{ backgroundColor: 'rgba(0,0,0,.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', padding: '20px' }}>
                        <h6 style={{ marginBottom: '0px' }}> Would you like to confirm your order? </h6>
                        <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                            <button className="btn btn-primary" style={{ marginRight: '20px' }} onClick={confirmOrder}> Confirm </button>
                            <button className="btn btn-primary" onClick={denyOrder}> Deny </button>
                        </div>
                    </div>
                )
            }

            default: 
                return null
        }
    }

    const renderSellerContext = () => {
        switch(order.status) {
            case ('delivery_pending') : {
                return (
                    <div style={{ backgroundColor: 'rgba(0,0,0,.05)', borderRadius: '15px', display: 'flex', alignItems: 'center', padding: '20px' }}>
                        <h6 style={{ marginBottom: '0px' }}> Would you like to deliver your order? </h6>
                        <div style={{ marginLeft: 'auto', marginRight: '10px' }}>
                            <button className="btn btn-primary" onClick={deliverOrder}> Deliver </button>
                        </div>
                    </div>
                )
            }

            default: 
                return null
        }
    }

    return (
        <Layout navbar>
            <div>
                <h1> Order </h1>
                <h5 style={{ opacity: '.7', marginBottom: '10px' }}> {order_id} </h5>
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,165,0,.9)', padding: '6px 9px 6px 9px', borderRadius: '25px', color: 'white' }}>
                        <AiOutlineClockCircle/>
                        <p style={{ marginBottom: '0px', marginLeft: '5px', fontSize: '12px' }}> { order ? order.status : null } </p>
                    </div>
                </div>

                {/* context action */}
                { 
                    order ? <div>
                        { isBuyer() ? renderBuyerContext() : renderSellerContext() }
                    </div> : null
                }

                {/* main order content */}
                {
                    order ? <div style={{ marginTop: '40px' }}>
                        <div>
                            <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px' }}> Information </h4>
                        </div>
                        <div>
                            <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px' }}> Product </h4>
                            { product ? <ProductCard product={product}/> : null }
                        </div>
                    </div> : null
                }
            </div>
        </Layout>
    )
}

export default Order