import React, { useContext, useEffect, useState } from 'react'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
import { ProductCard, ViewGallery } from '../components'
import { useHistory } from 'react-router'
import AuthContext from '../context/auth-context'
import api from '../api'

const Home = (props) => {
    const [recommended, setRecommended] = useState([])

    const auth = useContext(AuthContext)
    const history = useHistory()

    useEffect(() => {
        if (!auth.isLoggedIn) return
        api.getRecommendedProducts({ params: { limit: 3 }}).then((response) => {
            setRecommended([ ...response.data ])
        }).catch((error) => {
            console.log(error)
        })
    }, [auth.isLoggedIn])

    return (
        <Layout navbar>
            <div>
                <div>
                    <h1 style={{ marginBottom: '0px' }}> Dashboard </h1>
                    <h4 style={{ paddingBottom: '5px', marginTop: '10px' }} onClick={() => history.push('/games')}> Games </h4>
                    <GameGallery/>
                </div>
                { 
                    auth.isLoggedIn ? <div style={{ marginTop: '20px', marginBottom: '30px' }}>
                        <h4 style={{ paddingBottom: '5px', marginTop: '10px' }} onClick={() => history.push('/games')}> Recommended </h4>
                        {
                            recommended.map((product, i) => {
                                return <ProductCard key={i} product={product} />
                            })
                        }
                    </div> : null 
                }
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ paddingBottom: '5px', marginTop: '10px', marginBottom: '10px' }} onClick={() => history.push('/profile/views')}> Views </h4>
                    <ViewGallery/>
                </div>
            </div>
        </Layout>
    )
}

export default Home;
