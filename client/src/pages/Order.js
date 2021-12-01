import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import api from '../api'
import { Layout, ProductCard } from '../components'
import { AiOutlineClockCircle, AiFillCheckCircle } from 'react-icons/ai'
import AuthContext from '../context/auth-context'
import MessengerContext from '../context/messenger-context'

const Order = (props) => {
    const [order, setOrder] = useState(null)
    const [affiliate, setAffiliate] = useState(null)

    const [newExp, setNewExp] = useState(0);
    const [userLevel, setUserLevel] = useState(0);

    const auth = useContext(AuthContext)
    const messenger = useContext(MessengerContext)
    const history = useHistory()

    const { order_id } = useParams()

    const isBuyer = () => {
        return order.buyer._id  === auth.userId
    }

    // get order on mount
    useEffect(() => {
        if (!order_id) return
        api.getOrderById(order_id, { params: { expand: ['buyer', 'seller', 'product'] }}).then((response) => {
            setOrder(response.data)
            if (response.data.buyer._id === auth.userId) return setAffiliate(response.data.buyer)
            setAffiliate(response.data.seller)
        }).catch((error) => {
            console.log(error)
        }) 
    }, [order_id])

    const confirmOrder = () => {
        api.confirmOrder(order._id).then((response) => {
            setOrder(response.data)
        }).catch((error) => {
            console.log(error)
        })

        const increment = order.total_cost * 100;
console.log("increment:" + increment);
        //TODO: increment must not be 1, it must be proportional to price
        api.updateUserById(order.seller, { $inc: {exp:increment}}).then((res)=> {
console.log(res.data);
        }).catch((error)=> {
            console.log(error);
        })
        
//This may be useless if the previous call returns the updated doc instead of the original doc, but oh well
        api.getUserById(order.seller).then((res) => {
            setNewExp(res.data.exp);
        }).catch((error)=> {
            console.log(error);
        })

        console.log(newExp)

       setUserLevel(Math.floor(newExp/1000));

       console.log(userLevel);

       api.updateUserById(order.seller, {lvl: userLevel}).then((res) => {
           console.log(res.data);
       }).catch((error)=> {
        console.log(error);
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

    const renderStatus = () => {
        if (!order) return null
        switch(order.status) {
            case ('delivery_pending') : {
                return ( <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,165,0,.9)', padding: '7px 11px 7px 11px', borderRadius: '25px', color: 'white' }}>
                    <AiOutlineClockCircle style={{ fontSize: '20px' }}/>
                    <p style={{ marginBottom: '0px', marginLeft: '5px', fontSize: '14px' }}> Delivery Pending </p>
                </div> )
            }

            case ('denied_delivery_pending') : {
                return ( <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,165,0,.9)', padding: '7px 11px 7px 11px', borderRadius: '25px', color: 'white' }}>
                    <AiOutlineClockCircle style={{ fontSize: '20px' }}/>
                    <p style={{ marginBottom: '0px', marginLeft: '5px', fontSize: '14px' }}> Denied, Delivery Pending </p>
                </div> )
            }

            case ('confirmation_pending') : {
                return ( <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,165,0,.9)', padding: '7px 11px 7px 11px', borderRadius: '25px', color: 'white' }}>
                    <AiOutlineClockCircle style={{ fontSize: '20px' }}/>
                    <p style={{ marginBottom: '0px', marginLeft: '5px', fontSize: '14px' }}> Confirmation Pending </p>
                </div> )
            }

            case ('confirmed') : {
                return ( <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'green', padding: '7px 11px 7px 11px', borderRadius: '25px', color: 'white' }}>
                    <AiFillCheckCircle style={{ fontSize: '20px' }}/>
                    <p style={{ marginBottom: '0px', marginLeft: '5px', fontSize: '14px' }}> Confirmed </p>
                </div> )
            }
        }
    }

    const getTime = (time) => {
        let date = new Date(time)
        return `${date.getHours()}:${date.getMinutes()}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    return (
        <Layout navbar>
            <div>
                <h1> Order </h1>
                <h5 style={{ opacity: '.7', marginBottom: '10px' }}> #{order_id} </h5>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    { renderStatus() }
                    { order && order.auto_confirm_at ? <p style={{ marginBottom: '0px', fontSize: '14px', marginLeft: '10px', opacity: '.7' }}> Auto-confirms at <span style={{ color: 'blue' }}>{getTime(order.auto_confirm_at)}</span> </p> : null }
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
                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                <div>
                                    <h5> Payment </h5>
                                    { isBuyer() ? <h6 style={{ opacity: '.7' }}> Total Cost: <span style={{ color: 'blue' }}>${order.total_cost / 100}</span> </h6> : <div>
                                        <h6 style={{ opacity: '.7' }}> Earnings: <span style={{ color: 'blue' }}>${(order.total_cost - order.commission_fees) / 100}</span> </h6>
                                        <h6 style={{ opacity: '.7' }}> Commission Fees: <span style={{ color: 'blue' }}>${order.commission_fees / 100}</span> </h6>
                                    </div> } 
                                    <h6 style={{ opacity: '.7' }}> Payment ID: <span style={{ color: 'blue' }}>{order.pi_id }</span> </h6>
                                    <h6 style={{ opacity: '.7' }}> Transfer ID: <span style={{ color: 'blue' }}>{order.tr_id || 'null'}</span> </h6>
                                </div>
                                <div style={{ marginLeft: '30px'}}>
                                    <h5> Delivery </h5>
                                    <h6 style={{ opacity: '.7' }}> Last Delivered At: <span style={{ color: 'blue' }}>{order.last_delivered_at ? getTime(order.last_delivered_at) : 'null'}</span> </h6>
                                    <h6 style={{ opacity: '.7' }}> Confirmed At: <span style={{ color: 'blue' }}>{order.confirmed_at ? getTime(order.confirmed_at) : 'null'}</span> </h6>
                                </div>
                                <div style={{ marginLeft: '30px' }}>
                                    <h5> { isBuyer() ? 'Seller' : 'Buyer' } </h5>
                                    { affiliate ? <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => history.push(`/users/${affiliate._id}`)}>
                                        <img src={affiliate.profile_img} style={{ width: '50px', height: '50px', borderRadius: '50%' }}/>
                                        <div style={{ marginLeft: '10px' }}>
                                            <p style={{ marginBottom: '0px' }}> {affiliate.first} {affiliate.last} </p>
                                            <p style={{ marginBottom: '0px', color: 'blue', fontSize: '14px', marginTop: '0px', cursor: 'pointer' }} onClick={(e) => {
                                                e.stopPropagation()
                                                messenger.open(affiliate._id)
                                            }}> Message </p>
                                        </div>
                                    </div> : null }
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px' }}> Product </h4>
                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h6 style={{ opacity: '.7' }}> Quantity: <span style={{ color: 'blue' }}>{order.quantity}</span> </h6>
                                    <h6 style={{ opacity: '.7' }}> Product ID: <span style={{ color: 'blue' }}> {order.product_id} </span> </h6>
                                </div>
                            </div>
                            { order ? <ProductCard product={order.product}/> : null }
                        </div>
                    </div> : null
                }
            </div>
        </Layout>
    )
}

export default Order