import React, { useState } from 'react'
import GameCard from '../components/GameCard/GameCard'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
const Home = (props) => {
    return (
        <Layout navbar>
            <div style={{ marginTop: '40px' }}>
                <h1> Games </h1>
                <GameGallery/>
            </div>
            <div style={{ marginTop: '40px' }}>
                <h1> View History </h1>
            </div>
        </Layout>
    )
}

export default Home;
