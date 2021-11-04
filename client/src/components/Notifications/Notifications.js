import React, { useContext, useState, useEffect } from 'react'
import api from '../../api'
import NotificationContext from '../../context/notification-context'
import { FiPackage } from 'react-icons/fi'

const Notifications = (props) => {
    const [rendered, setRendered] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const notifications = useContext(NotificationContext)

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
        api.getNotifications({}).then((response) => {
            notifications.setNotifications(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    const renderNotification = (notification) => {
        switch(notification.type) {
            case ('order') : {
                return ( <div style={{ height: '60px', padding: '20px', backgroundColor: 'rgba(255,255,255,.05)', borderRadius: '15px', width: '100%', margin: '0px 0px 20px 0px', display: 'flex', alignItems: 'center' }}>
                    <FiPackage style={{ fontSize: '20px', color: 'white', marginRight: '10px' }} />
                    <p style={{ marginBottom: '0px', color: 'white' }}> { notification.content } </p>
                </div> )           
            }
        }
    }

    return (
        <div>
            { rendered ? <div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: 'black', opacity: backdrop ? '.7' : '0', zIndex: '1', transition: 'opacity 400ms ease-out' }} onClick={notifications.close}/> : null }
            <div style={{ position: 'fixed', height: '100%', width: (window.innerWidth < 600 ? 'calc(100%)' : 'calc(30%)'), right: notifications.isOpen && rendered ? '0' : (window.innerWidth < 600 ? 'calc(-100%)' : 'calc(-30%)'), backgroundColor: 'black', transition: 'right 400ms ease', zIndex: '1' }}>
                <div style={{ padding: '105px 40px 40px 40px', height: '100%', position: 'relative' }}>
                    <h1 style={{ color: 'white', marginBottom: '20px' }}> Notifications </h1>
                    <div style={{ height: 'calc(100% - 92px)', position: 'relative', overflowY: 'scroll' }}>
                        <div>
                            <h5 style={{ color: 'white', position: 'sticky', padding: '10px 0px 20px 0px', top: '0px', backgroundColor: 'black' }}> Unread </h5>
                            { 
                                notifications.notifications.filter((notification) => !notification.seen ).map((notification) => {
                                    return renderNotification(notification)
                                }) 
                            } 
                        </div>
                        <div>
                            <h5 style={{ color: 'white' }}> Read </h5>
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