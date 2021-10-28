import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useLocation } from 'react-router'
import api from '../../api'
import AuthContext from '../../context/auth-context'
import MessengerContext from '../../context/messenger-context'
import Socket from "../../socket";

const Thread = (props) => {
    return (
        <div style={{ padding: '5px 5px 10px 5px', position: 'relative' }}>
            { props.thread.unread ? <div style={{  backgroundColor: 'red', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', position: 'absolute', top: '0px', right: '-10px', zIndex: '2' }}>
                <p style={{ marginBottom: '0px', fontSize: '14px', color: 'white' }}>{props.thread.unread}</p>
            </div> : null }
            <img src={props.thread.user.profile_img} style={{ height: '50px', width: '50px', borderRadius: '50%', boxShadow: props.active ? '0px 0px 0px 4px #68B2A0' : null, transition: 'box-shadow 300ms ease', cursor: 'pointer' }} onClick={() => props.onClick(props.thread)}/>
        </div>
    )
}

const Messenger = (props) => {
    const [socket, setSocket] = useState(null)
    const [rendered, setRendered] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const [content, setContent] = useState('')

    const messenger = useContext(MessengerContext)
    const messengerRef = useRef(messenger)
    const auth = useContext(AuthContext)

    const location = useLocation()

    // handler for message_sent event
    const messageSentHandler = (message) => {
        messenger.setMessages((messages) => {
            let updated = messages[message.to] ? [...messages[message.to], message] : [message]
            return { ...messages, [message.to]: updated }
        })  
    }

    const messageReceivedHandler = (message) => {
        messenger.setMessages((messages) => {
            let updated = messages[message.from] ? [...messages[message.from], message] : [message]
            return { ...messages, [message.from]: updated }
        })  
    }

    // socket initialization
    useEffect(() => {
        let io = new Socket(auth.token)
        
        io.connect()
        io.on('success', messenger.connect)
        io.on('message_sent', messageSentHandler)
        io.on('message_received', messageReceivedHandler)
        io.on('error', (response) => {})

        setSocket(io)    
        
        api.getMessageThreads().then((response) => {
            // remove threads without a user & not themselves
            let threads = response.data.filter((thread) => thread.user && thread.user._id !== auth.userId)
            messenger.setThreads(threads)
            if (threads.length) messenger.setActiveThread(threads[0])
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    // updates ref to messenger
    useEffect(() => {
        messengerRef.current = messenger
    }, [messenger])

    // updates messenger state on location change
    useEffect(() => {
        messenger.close()
    }, [location])

    // messenger unrender and re-render
    useEffect(() => {
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
    }, [messenger.isOpen])

    // actions
    const message = () => {
        console.log(messenger)
        if (content !== '') socket.message(messenger.activeThreadId, auth.userId, 'test', content)
    }

    return (
        <div>
            { rendered ? <div style={{ position: 'fixed', height: '100%', width: '100%', backgroundColor: 'black', opacity: backdrop ? '.7' : '0', zIndex: '1', transition: 'opacity 400ms ease-out' }} onClick={() => messenger.close()}/> : null }
            <div style={{ position: 'fixed', height: '100%', width: (window.innerWidth < 600 ? 'calc(100%)' : 'calc(50%)'), right: messenger.isOpen && rendered ? '0' : (window.innerWidth < 600 ? 'calc(-100%)' : 'calc(-50%)'), backgroundColor: 'black', transition: 'right 400ms ease', zIndex: '1' }}>
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
                                <div style={{ padding: '1px 1px 6px 3px' }}>
                                    <div style={{ minHeight: '54px', minWidth: '54px', borderRadius: '50%', backgroundColor: 'white', transition: 'box-shadow 300ms ease', cursor: 'pointer', color: 'black', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <AiOutlinePlus/>
                                    </div>
                                </div>
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
                                { messenger.activeThread ? <div style={{ display: 'flex', alignItems: 'center', padding: '15px 10px 10px 10px', marginBottom: '10px' }}>
                                    <img src={messenger.activeThread.user.profile_img} style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                                    <div style={{ marginLeft: '10px' }}>
                                        <h5 style={{ color: 'white', marginBottom: '0px' }}> {messenger.activeThread.user.first} {messenger.activeThread.user.last} </h5>
                                        <h6 style={{ color: 'white', opacity: '.7', marginBottom: '0px' }}> Active </h6>
                                    </div>
                                </div> : null }
                            </div>
                            <div style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
                                <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))', top: '0px', left: 'auto', height: '15px', width: '100%'}}/>
                                <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', bottom: '56px', left: 'auto', height: '15px', width: '100%'}}/>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '0px 0px 0px 20px' }}>
                                    <div style={{ marginBottom: '30px',  overflowY: 'scroll' }}>
                                        <div style={{ marginTop: '15px' }}>
                                            {
                                                messenger.messages[messenger.activeThreadId] ? messenger.messages[messenger.activeThreadId].map((message, i) => {
                                                    if (message.from === auth.userId) {
                                                        return (
                                                            <div key={i} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                                                                <div>
                                                                    <p style={{ maxWidth: '200px', backgroundColor: '#68B2A0', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 5px 25px', wordWrap: 'break-word' }}> {message.content} </p>
                                                                    { i === messenger.messages[messenger.activeThreadId].length - 1 && message.read ? <p style={{ maxWidth: '200px', color: 'white', margin: '3px', fontSize: '12px', borderRadius: '25px 25px 5px 25px', textAlign: 'end' }}> Read </p> : null}
                                                                </div>
                                                            </div>
                                                        ) 
                                                    } else { 
                                                        return (
                                                            <div key={i} style={{ display: 'flex', marginBottom: '5px' }}>
                                                                <p style={{ maxWidth: '200px', backgroundColor: 'grey', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 25px 5px', wordWrap: 'break-word' }}> {message.content} </p>
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