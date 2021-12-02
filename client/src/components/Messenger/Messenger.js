import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useHistory, useLocation } from 'react-router'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import MessengerContext from '../../context/messenger-context'
import NotificationContext from '../../context/notification-context'
import Socket from "../../socket";

const getStatus = (user) => {
    switch(user.status) {
        case ('online'): 
            return 'Online'
        case ('away'):
            return 'Away'
        default:
            return 'Offline'
    }
}

const getStatusColor = (user) => {
    switch(user.status) {
        case ('online'): 
            return 'green'
        case ('away'):
            return 'orange'
        default:
            return 'grey'
    }
}

const Thread = (props) => {
    return (
        <div style={{ padding: '5px 5px 10px 5px', position: 'relative' }}>
            { props.thread.unread ? <div style={{  backgroundColor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', position: 'absolute', top: '0px', right: '-10px', zIndex: '2' }}>
                <p style={{ marginBottom: '0px', fontSize: '14px', color: 'white' }}>{props.thread.unread}</p>
            </div> : null }
            <div style={{ backgroundColor: getStatusColor(props.thread.user), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', position: 'absolute', bottom: '9px', right: '-3px', zIndex: '2', boxShadow: '0px 0px 0px 4px rgba(0, 0, 0, 1)' }}/>
            <img src={props.thread.user.profile_img} style={{ height: '50px', width: '50px', borderRadius: '50%', boxShadow: props.active ? '0px 0px 0px 4px #68B2A0' : null, transition: 'box-shadow 300ms ease', cursor: 'pointer' }} onClick={() => props.onClick(props.thread)}/>
        </div>
    )
}

const Messenger = (props) => {
    const [messengerWasOpen, setMessengerWasOpen] = useState(null)
    const [pathname, setPathname] = useState(null)
    const [socket, setSocket] = useState(null)
    const [rendered, setRendered] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const [loading, setLoading] = useState(false)
    const [scrollPosition, setScrollPosition] = useState(true)
    const [content, setContent] = useState('')

    const notification = useContext(NotificationContext)
    const messenger = useContext(MessengerContext)
    const messengerRef = useRef(messenger)
    const messageList = useRef()
    const auth = useContext(AuthContext)

    const location = useLocation()
    const history = useHistory()

    /* Socket Handlers */

    // handler for message_sent event
    const messageSentHandler = (message) => {
        messenger.setMessages((messages) => {
            let updated = messages[message.to] ? [...messages[message.to], message] : [message]
            return { ...messages, [message.to]: updated }
        })  
    }

    // handler for message_received event
    const messageReceivedHandler = (message, io) => {
        messenger.setMessages((messages) => {
            return { ...messages, [message.from]: messages[message.from] ? [...messages[message.from], message] : [message] }
        })  

        if (messengerRef.current.activeThreadId === message.from && messengerRef.current.isOpen) return io.emit('read', messengerRef.current.activeThreadId)
        let messageThread = messengerRef.current.threads.find((thread) => thread._id === message.from)
        if (messageThread) updateThread(message.from, { ...messageThread, unread: messageThread.unread + 1 })
    }

    // handler for notification event
    const notificationReceivedHandler = (newNotification) => {
        notification.setNotifications((notifications) => {
            return [newNotification, ...notifications]
        })
    }

    // handler for status event
    const statusHandler = (event) => {
        let thread = messengerRef.current.threads.find((thread) => thread._id === event.thread_id )
        if (thread) updateThread(event.thread_id, { ...thread, user: { ...thread.user, status: event.status }})
    }

    /* useEffect hooks */

    // socket initialization
    useEffect(() => {
        let io = new Socket(auth.token)
        
        io.connect()
        io.on('success', messenger.connect)
        io.on('message_sent', messageSentHandler)
        io.on('message_received', (message) => messageReceivedHandler(message, io))
        io.on('notification', notificationReceivedHandler)
        io.on('status', statusHandler)
        io.on('error', (response) => { console.log(response) })
        setSocket(io)    
        
        api.getMessageThreads().then((response) => {
            let threads = response.data.filter((thread) => thread.user && thread.user._id !== auth.userId)
            if (threads.length && !messenger.activeThread) messenger.setActiveThread(threads[0])
            messenger.setThreads(threads)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    // updates ref to messenger
    useEffect(() => {
        messengerRef.current = messenger
    }, [messenger])

    // reset scroll on new message
    useEffect(() => {
        if (scrollPosition) messageList.current.scrollTop = messageList.current.scrollHeight
    }, [messenger.messages])

    // reset scroll on new thread
    useEffect(() => {
        if (scrollPosition) messageList.current.scrollTop = messageList.current.scrollHeight
        if (!messenger.activeThread && messenger.activeThreadId) {
            api.getUserById(messenger.activeThreadId).then((response) => {
                messenger.setActiveThread({ user: response.data, loaded: false, unread: 0 })
            }).catch((error) => {
                console.log(error)
            })
        }
    }, [messenger.activeThreadId])

    // load messages for active thread
    useEffect(() => {
        if (!messenger.activeThread || !messenger.isOpen || messenger.activeThread.loaded || loading) return
        setLoading(true)
        api.getMessagesFromThread(messenger.activeThreadId).then((response) => {
            updateThread(messenger.activeThreadId, { ...messenger.activeThread, loaded: true })
            addMessages(messenger.activeThreadId, response.data)
            setLoading(false)
        }).catch((error) => {
            console.log(error)
        })
    }, [messenger.activeThread, messenger.isOpen, loading])

    // updates messenger state on location change
    useEffect(() => {
        if (pathname && pathname !== location.pathname) handleClose()
        setPathname(location.pathname)
    }, [location.pathname])

    // loads messenger when query string contains messenger thread
    useEffect(() => {
        const search = new URLSearchParams(window.location.search)
        if (search.get('m')) return messenger.open(search.get('m'))
    }, [location.search])

    // messenger unrender and re-render
    useEffect(() => {
        if (messengerWasOpen === null) return setMessengerWasOpen(messenger.isOpen)
        if (messenger.isOpen) {
            document.body.style.overflow = 'hidden'
            setRendered(true)
            setTimeout(() => {
                setBackdrop(true)
            }, 20)
        }

        if (!messenger.isOpen) {
            document.body.style.overflow = ''
            setBackdrop(false)
            setTimeout(() => {
                setRendered(false)
            }, 400)
        }

        setMessengerWasOpen(messenger.isOpen)
    }, [messenger.isOpen])

    // messenger read receipts for changes of activethread and open status of messenger
    useEffect(() => {
        if (!messenger.isOpen || !messenger.activeThread || !messenger.activeThread.unread) return
        socket.emit('read', messenger.activeThreadId)
        updateThread(messenger.activeThreadId, { ...messenger.activeThread, unread: 0, loaded: true })
    }, [messenger.activeThread, messenger.isOpen])

    /* Client Actions */

    const message = () => {
        if (content !== '') socket.message(messenger.activeThreadId, auth.userId, 'test', content)
    }

    const updateThread = (thread_id, new_thread) => {
        let threads = messengerRef.current.threads
        let old_thread_index = threads.findIndex((thread) => thread.user._id === thread_id)
        threads[old_thread_index] = { ...new_thread }
        messengerRef.current.setThreads([...threads])
        if (thread_id === messengerRef.current.activeThreadId) messengerRef.current.setActiveThread(new_thread)
    }

    const addMessages = (thread_id, new_messages) => {
        let messages = { ...messenger.messages }
        let thread_messages = messages[thread_id]
        messages[thread_id] = thread_messages ? [...thread_messages, ...new_messages] : [...new_messages]
        messenger.setMessages(messages)
    }

    const handleClose = () => {
        const search = new URLSearchParams(location.search)
        search.delete('m')
        history.replace({ search: search.toString() })
        messenger.close()
    }

    const parseMessage = (message) => {
        let regex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
        let components = [], urls = [], curr = message
        let index = curr.search(regex), startIndex = 0

        while (index >= 0) {
            if (index > startIndex) {
                components.push(<span> {curr.slice(startIndex, index)} </span>)
                curr = curr.slice(index, curr.length)
            }

            let endIndex = curr.indexOf(' '), url = curr

            if (endIndex === -1) {
                urls.push(url)
                components.push(<a href={url}> {url} </a>)
                curr = ''
                break
            }

            url = curr.slice(0, endIndex)
            urls.push(url)

            components.push(<a href={url}> {url} </a>)
            curr = curr.slice(endIndex, curr.length)
            index = curr.search(regex)
        }

        if (curr.length) components.push(<span> {curr} </span>)
        return { components, urls }
    }

    return (
        <div>
            { rendered ? <div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: 'black', opacity: backdrop ? '.7' : '0', zIndex: '1', transition: 'opacity 400ms ease-out' }} onClick={handleClose}/> : null }
            <div style={{ position: 'fixed', height: '100%', width: (window.innerWidth < 800 ? 'calc(100%)' : 'calc(50%)'), right: messenger.isOpen && rendered ? '0' : (window.innerWidth < 800 ? 'calc(-100%)' : 'calc(-50%)'), backgroundColor: 'black', transition: 'right 400ms ease, width 400ms ease', zIndex: '1' }}>
                <div style={{ padding: '105px 40px 40px 40px', height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', display: 'flex', top: '64px', left: '40px', alignItems: 'center', backgroundColor: 'rgba(255,255,255,.1)', padding: '6px 9px 6px 9px', borderRadius: '25px' }}>
                        <div style={{ backgroundColor: messenger.isConnected ? 'green' : 'orange', height: '10px', width: '10px', borderRadius: '50%' }}/>
                        <p style={{ marginBottom: '0px', color: 'white', marginLeft: '8px', fontSize: '12px' }}> { messenger.isConnected ? 'Connected' : 'Disconnected' } </p>
                    </div>
                    <h1 style={{ color: 'white', marginBottom: '20px' }}> Messages </h1>
                    <div style={{ display: 'flex', height: 'calc(100% - 92px)', position: 'relative' }}>
                        <div style={{ overflow: 'hidden', position: 'relative', height: '100%'}}>
                            <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))', top: '-1px', left: 'auto', height: '5px', width: '100%'}}/>
                            <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', bottom: '-1px', left: 'auto', height: '15px', width: '100%'}}/>
                            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', padding: '5px 20px 5px 5px', height: '100%', scrollbarColor: 'black' }}>
                                {/*<div style={{ padding: '1px 1px 6px 3px' }}>
                                    <div style={{ minHeight: '54px', minWidth: '54px', borderRadius: '50%', backgroundColor: 'white', transition: 'box-shadow 300ms ease', cursor: 'pointer', color: 'black', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AiOutlinePlus/>
                                    </div>
                                </div>*/}
                                {
                                    messenger.threads.map((thread, i) => {
                                        return (
                                            thread.user ? <Thread key={i} thread={thread} active={messenger.activeThreadId === thread.user._id} onClick={messenger.setActiveThread}/> : null 
                                        )
                                    })
                                } 
                            </div>
                        </div>
                        <div style={{ height: '100%', width: '100%', borderLeft: '1px solid rgba(255,255,255,.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ borderBottom: '1px solid rgba(255,255,255,.3)', overflow: 'hidden' }}>
                                { messenger.activeThread ? <div style={{ display: 'flex', alignItems: 'center', padding: '15px 10px 10px 10px', marginBottom: '10px', cursor: 'pointer' }} onClick={() => history.push(`/users/${messenger.activeThread.user._id}`)}>
                                    <img src={messenger.activeThread.user.profile_img} style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                                    <div style={{ marginLeft: '10px' }}>
                                        <h5 style={{ color: 'white', marginBottom: '0px' }}> {messenger.activeThread.user.first} {messenger.activeThread.user.last} </h5>
                                        <h6 style={{ color: 'white', opacity: '.7', marginBottom: '0px' }}> {getStatus(messenger.activeThread.user)} </h6>
                                    </div>
                                </div> : null }
                            </div>
                            <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))', top: '0px', left: 'auto', height: '15px', width: '100%'}}/>
                                <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', bottom: '46px', left: 'auto', height: '15px', width: '100%'}}/>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '0px 0px 0px 20px' }}>
                                    <div onScroll={(event) => setScrollPosition(event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight)} ref={messageList} style={{ marginBottom: '10px',  overflowY: 'scroll' }}>
                                        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                                            {
                                                messenger.messages[messenger.activeThreadId] ? messenger.messages[messenger.activeThreadId].map((message, i) => {
                                                    if (message.from === auth.userId) {
                                                        return (
                                                            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                                                <div>
                                                                    <p style={{ maxWidth: '200px', backgroundColor: '#68B2A0', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 5px 25px', wordWrap: 'break-word' }}> {parseMessage(message.content).components} </p>
                                                                    { i === messenger.messages[messenger.activeThreadId].length - 1 && message.read ? 
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                                        <p style={{ maxWidth: '300px', color: 'white', margin: '3px', fontSize: '12px', borderRadius: '25px 25px 5px 25px', textAlign: 'end' }}> Read </p>
                                                                    </div> : null}
                                                                </div>
                                                            </div>
                                                        ) 
                                                    } else { 
                                                        return (
                                                            <div key={i} style={{ display: 'flex', marginBottom: '5px' }}>
                                                                <p style={{ maxWidth: '300px', backgroundColor: 'grey', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 25px 5px', wordWrap: 'break-word' }}> {parseMessage(message.content).components} </p>
                                                            </div>
                                                        )
                                                    }
                                                }) : null
                                            }
                                        </div>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <div style={{ borderRadius: '50%', minWidth: '36px', minHeight: '36px', backgroundColor: 'white', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <AiOutlinePlus/>
                                        </div>
                                        <input className="form-control" value={content} onChange={(event) => setContent(event.target.value)} placeholder={'Send Message'} style={{ border: 'none' }} onKeyUp={(event) => {
                                            if (event.key === 'Enter') {
                                                message()
                                                setContent('')
                                            }
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger