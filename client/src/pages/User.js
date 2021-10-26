import React, { useContext, useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import ProductCard from '../components/ProductCard/ProductCard'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import ProfileIcon from '../images/profile_icon.png'

const User = (props) => {
    const [user, setUser] = useState(null)
    const [products, setProducts] = useState([])
    const auth = useContext(AuthContext)
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
            setProducts(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    return (
        <Layout navbar>
            <div>
                { user ? <div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={user.profile_img} style={{ borderRadius: '50%', height: '150px', width: '150px' }}/>
                        <div style={{ marginLeft: '30px' }}>
                            <h2 style={{ marginBottom: '0px' }}> {user.first} {user.last} </h2>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Ratings user_id={user._id}/>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ marginLeft: 'auto' }}> Message </button>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(0,0,0,.1)', marginTop: '30px', marginBottom: '30px'}}/>
                    <h3> Products </h3>
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