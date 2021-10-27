import React, { useContext, useEffect, useState } from 'react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useLocation } from 'react-router'
import AuthContext from '../../context/auth-context'
import MessengerContext from '../../context/messenger-context'
import { socket, connect } from '../../socket'

const Thread = (props) => {
    return (
        <div style={{ padding: '5px 5px 10px 5px' }}>
            <img src={props.src} style={{ height: '50px', width: '50px', borderRadius: '50%', boxShadow: props.active ? '0px 0px 0px 4px #68B2A0' : null, transition: 'box-shadow 300ms ease', cursor: 'pointer' }} onClick={() => props.onClick(props.user_id)}/>
        </div>
    )
}

const Messenger = (props) => {
    const [rendered, setRendered] = useState(false)
    const [backdrop, setBackdrop] = useState(false)
    const [currentThread, setCurrentThread] = useState('')

    const messenger = useContext(MessengerContext)
    const auth = useContext(AuthContext)

    const location = useLocation()

    useEffect(() => {
        socket.on('success', (res) => {
            messenger.connect()
        })

        socket.on('error', (res) => {
            console.log(res)
        })

        connect(auth.token)
    }, [])

    useEffect(() => {
        if (messenger.isOpen) {
            setRendered(true)
            setTimeout(() => {
                setBackdrop(true)
            }, 20)
        }

        if (!messenger.isOpen) {
            setBackdrop(false)
            setTimeout(() => {
                setRendered(false)
            }, 400)
        }
    }, [messenger.isOpen])

    useEffect(() => {
        messenger.close()
    }, [location])

    useEffect(() => {
        if (messenger.isOpen) document.body.style.overflow = 'hidden'
        if (!messenger.isOpen) document.body.style.overflow = ''
    }, [messenger.isOpen])

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
                            <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(rgba(0,0,0,1), rgba(0,0,0,0))', top: '-1px', left: 'auto', height: '15px', width: '100%'}}/>
                            <div style={{ position: 'absolute', backgroundImage: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))', bottom: '-1px', left: 'auto', height: '15px', width: '100%'}}/>
                            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'scroll', padding: '5px 20px 5px 5px', height: '100%', scrollbarColor: 'black' }}>
                                <Thread user_id={'test'} active={currentThread === 'test'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/>
                                <Thread user_id={'testing'} status={'online'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                                <Thread user_id={'testing'} active={currentThread === 'testing'} onClick={setCurrentThread} src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'}/> 
                            </div>
                        </div>
                        <div style={{ height: '100%', width: '100%', borderLeft: '1px solid rgba(255,255,255,.3)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, .3)', padding: '15px 10px 10px 10px', height: 'auto' }}>
                                <img src={'https://static01.nyt.com/images/2021/07/08/science/08TB-OTTERS1/08TB-OTTERS1-mobileMasterAt3x.jpg'} style={{ height: '40px', width: '40px', borderRadius: '50%' }} />
                                <div style={{ marginLeft: '10px' }}>
                                    <h5 style={{ color: 'white', marginBottom: '0px' }}> Nicholas Dullam </h5>
                                    <h6 style={{ color: 'white', opacity: '.7', marginBottom: '0px' }}> Active</h6>
                                </div>
                            </div>
                            <div style={{ height: '100%', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', padding: '20px 20px 0px 20px' }}>
                                    <div style={{ marginBottom: '20px',  overflowY: 'scroll' }}>
                                        <div style={{ display: 'flex' }}>
                                            <p style={{ maxWidth: '200px', backgroundColor: 'grey', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 25px 5px' }}> Testing</p>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <div>
                                                <p style={{ maxWidth: '200px', backgroundColor: '#68B2A0', color: 'white', marginBottom: '0px', padding: '8px 12px 8px 12px', borderRadius: '25px 25px 5px 25px' }}> Testing</p>
                                                <p style={{ maxWidth: '200px', color: 'white', margin: '3px', fontSize: '12px', borderRadius: '25px 25px 5px 25px', textAlign: 'end' }}> Read </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <div style={{ borderRadius: '50%', minWidth: '36px', minHeight: '36px', backgroundColor: 'white', marginRight: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                                            <AiOutlinePlus/>
                                        </div>
                                        <input className="form-control" placeholder={'Send Message'} style={{ border: 'none' }}/>
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