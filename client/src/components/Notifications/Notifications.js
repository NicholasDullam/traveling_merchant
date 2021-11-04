import React, { useContext, useState, useEffect } from 'react'
import api from '../../api'
import NotificationContext from '../../context/notification-context'
import { FiPackage, FiShoppingCart } from 'react-icons/fi'
import { useHistory, useLocation } from 'react-router'

const Notifications = (props) => {
    const [rendered, setRendered] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const notifications = useContext(NotificationContext)
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        notifications.close()
    }, [location])

    useEffect(() => {
        if (notifications.isOpen) {
            document.body.style.overflow = 'hidden'
            setRendered(true)
            setTimeout(() => {
                setBackdrop(true)
            }, 20)
        }

        if (!notifications.isOpen) {
            document.body.style.overflow = ''
            setBackdrop(false)
            setTimeout(() => {
                setRendered(false)
            }, 400)
        }
    }, [notifications.isOpen])

    useEffect(() => {
        api.getNotifications({ params: { sort: 'created_at'} }).then((response) => {
            notifications.setNotifications(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const renderNotification = (notification) => {
        switch(notification.type) {
            case ('order') : {
                return ( <div style={{ height: '60px', padding: '20px', backgroundColor: 'rgba(255,255,255,.05)', borderRadius: '15px', width: '100%', margin: '0px 0px 20px 0px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => history.push(`/orders/${notification.metadata.order_id}`)}>
                    <FiPackage style={{ fontSize: '20px', color: 'white', marginRight: '10px' }} />
                    <p style={{ marginBottom: '0px', color: 'white' }}> { notification.content } </p>
                    <p style={{ marginLeft: 'auto', color: 'white', opacity: '.7', marginBottom: '0px' }}> { getTime(notification.created_at) } </p>
                </div> )           
            }

            case ('product') : {
                return ( <div style={{ height: '60px', padding: '20px', backgroundColor: 'rgba(255,255,255,.05)', borderRadius: '15px', width: '100%', margin: '0px 0px 20px 0px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => history.push(`/products/${notification.metadata.product_id}`)}>
                    <FiShoppingCart style={{ fontSize: '20px', color: 'white', marginRight: '10px' }} />
                    <p style={{ marginBottom: '0px', color: 'white' }}> { notification.content } </p>
                    <p style={{ marginLeft: 'auto', color: 'white', opacity: '.7', marginBottom: '0px' }}> { getTime(notification.created_at) } </p>
                </div> )  
            }
        }
    }

    const getTime = (time) => {
        let date = new Date(time)
        return `${date.getHours()}:${date.getMinutes()}, ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    }

    return (
        <div>
            { rendered ? <div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: 'black', opacity: backdrop ? '.7' : '0', zIndex: '1', transition: 'opacity 400ms ease-out' }} onClick={notifications.close}/> : null }
            <div style={{ position: 'fixed', height: '100%', width: (window.innerWidth < 600 ? 'calc(100%)' : 'calc(30%)'), right: notifications.isOpen && rendered ? '0' : (window.innerWidth < 600 ? 'calc(-100%)' : 'calc(-30%)'), backgroundColor: 'black', transition: 'right 400ms ease', zIndex: '1' }}>
                <div style={{ padding: '105px 40px 40px 40px', height: '100%', position: 'relative' }}>
                    <h1 style={{ color: 'white', marginBottom: '20px' }}> Notifications </h1>
                    <div style={{ height: 'calc(100% - 92px)', position: 'relative', overflowY: 'scroll' }}>
                        <div>
                            { 
                                notifications.notifications.filter((notification) => !notification.seen ).map((notification) => {
                                    return renderNotification(notification)
                                }) 
                            } 
                        </div>
                        <div>
                            {
                                notifications.notifications.filter((notification) => notification.seen ).map((notification) => {
                                    return renderNotification(notification)
                                }) 
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notifications