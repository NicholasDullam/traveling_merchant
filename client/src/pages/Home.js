import React, { useState } from 'react'
import GameCard from '../components/GameCard/GameCard'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
import { ViewGallery } from '../components'
import { useHistory } from 'react-router'

const Home = (props) => {
    const history = useHistory()

    return (
        <Layout navbar>
            <div>
                <div>
                    <h1 style={{ marginBottom: '0px' }}> Dashboard </h1>
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '10px' }} onClick={() => history.push('/games')}> Games </h4>
                    <GameGallery/>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '10px', marginBottom: '10px' }} onClick={() => history.push('/profile/views')}> Views </h4>
                    <ViewGallery/>
                </div>
            </div>
        </Layout>
    )
}

export default Home;
