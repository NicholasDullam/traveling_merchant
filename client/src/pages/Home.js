import React, { useState } from 'react'
import GameCard from '../components/GameCard/GameCard'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
const Home = (props) => {
    return (
        <Layout navbar>
            <GameGallery/>
            <h1> Home page! </h1>
        </Layout>
    )
}

export default Home;
