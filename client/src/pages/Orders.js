import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../api";
import AuthContext from "../context/auth-context";


const Orders = (props) => {
    const auth = useContext(AuthContext)
    const history = useHistory()
    const [buyOrders, setBuyOrders] = useState([])
    const [sellOrders, setSellOrders] = useState([])
    const [hasMore, setHasMore] = useState(false)

    useEffect(() => {
        api.getOrders({ params: { buyer: auth.user._id, sort: '-created_at', limit: 5 }}).then((response) => {
            setBuyOrders(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        api.getOrders({ params: { seller: auth.user._id, sort: '-created_at', limit: 5 }}).then((response) => {
            setSellOrders(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div>
            <h5> Buy Orders </h5>
            <div style={{ marginTop: '20px' }}>
                {
                    buyOrders.map((order, i) => {
                        return (
                            <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }} onClick={() => history.push(`/orders/${order._id}`)}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {order._id} </p>
                                    <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.status} </p>
                                    <p style={{ marginBottom: '0px', marginLeft: 'auto' }}> {(new Date(order.created_at)).getMonth() + 1}/{(new Date(order.created_at)).getDate()} </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            
            <h5 style={{ marginTop: '40px' }}> Sell Orders </h5>
            <div style={{ marginTop: '20px' }}>
                {
                    sellOrders.map((order, i) => {
                        return (
                            <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px', cursor: 'pointer' }} onClick={() => history.push(`/orders/${order._id}`)}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {order._id} </p>
                                    <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.status} </p>
                                    <p style={{ marginBottom: '0px', marginLeft: 'auto' }}> {(new Date(order.created_at)).getMonth() + 1}/{(new Date(order.created_at)).getDate()} </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Orders