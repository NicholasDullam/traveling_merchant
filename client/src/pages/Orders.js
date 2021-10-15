import React, { useContext, useEffect, useState } from "react";
import api from "../api";
import AuthContext from "../context/auth-context";


const Orders = (props) => {
    const auth = useContext(AuthContext)
    const [buyOrders, setBuyOrders] = useState([])
    const [sellOrders, setSellOrders] = useState([])

    useEffect(() => {
        api.getOrders({ params: { buyer: auth.user._id }}).then((response) => {
            setBuyOrders(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        api.getOrders({ params: { seller: auth.user._id }}).then((response) => {
            setSellOrders(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            <h5> Buy Orders </h5>
            {
                buyOrders.map((order, i) => {
                    return (
                        <div style={{ padding: '10px', borderBottom: i < buyOrders.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px' }}> {order._id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.status} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.product_id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.seller} </p>
                            </div>
                        </div>
                    )
                })
            }
            
            <h5 style={{ marginTop: '20px' }}> Sell Orders </h5>
            {
                sellOrders.map((order, i) => {
                    return (
                        <div style={{ padding: '10px', borderBottom: i < sellOrders.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px' }}> {order._id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.status} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.product_id} </p>
                                <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.buyer} </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Orders