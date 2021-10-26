import React, { useState } from 'react'
import GameCard from '../components/GameCard/GameCard'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
import { ViewGallery } from '../components'

const Home = (props) => {
    return (
        <Layout navbar>
            <div>
                <div>
                    <h1 style={{ marginBottom: '0px' }}> Games </h1>
                    <a href={'/games'}><h6 style={{ marginBottom: '15px' }}> Browse All </h6></a>
                    <GameGallery/>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h1 style={{ marginBottom: '0px' }}> View History </h1>
                    <a href={'/profile/views'}><h6 style={{ marginBottom: '15px' }}> View All </h6></a>
                    <ViewGallery/>
                </div>
            </div>
        </Layout>
    )
}

export default Home;
