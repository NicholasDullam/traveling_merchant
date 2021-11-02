import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import ProductCard from '../components/ProductCard/ProductCard'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import MessengerContext from '../context/messenger-context'

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

const User = (props) => {
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])
    const messenger = useContext(MessengerContext)
    const { user_id } = useParams()

    useEffect(() => {
        api.getUserById(user_id).then((response) => {
            setUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (!user) return
        api.getProducts({ params: { user_id }}).then((response) => {
            setProducts(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    const handleMessage = () => {
        messenger.open(user_id)
    }

    return (
        <Layout navbar>
            <div>
                { user ? <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}> 
                            <img src={user.profile_img} style={{ borderRadius: '50%', height: '150px', width: '150px' }}/>
                            <div style={{ backgroundColor: getStatusColor(user), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', position: 'absolute', bottom: '8px', right: '2px', boxShadow: '0px 0px 0px 4px rgba(255, 255, 255, 1)' }}/>
                        </div>
                        <div style={{ marginLeft: '30px' }}>
                            <h2 style={{ marginBottom: '0px' }}> {user.first} {user.last} </h2>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Ratings user_id={user._id}/>
                            </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }} >
                            <button className="btn btn-primary" onClick={handleMessage}> Follow </button>
                            <button className="btn btn-primary" style={{ marginLeft: '20px' }} onClick={handleMessage}> Message </button>
                        </div>
                    </div>
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '20px', marginBottom: '10px' }}> Products </h4>
                    {
                        products.map((product) => {
                            return (
                                <ProductCard product={product}/>
                            )
                        })
                    }
                </div> : null }
            </div>
        </Layout>
    )
}

export default User