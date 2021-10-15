import React, { useState } from 'react'
import GameCard from '../components/GameCard/GameCard'
import GameGallery from '../components/GameGallery/GameGallery'
import Layout from '../components/Layout/Layout'
import { ViewGallery } from '../components'

const Home = (props) => {
    return (
        <Layout navbar>
            <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ marginBottom: '0px' }}> Games </h1>
                    <h6 style={{ marginBottom: '15px' }}> Browse All </h6>
                    <GameGallery/>
                </div>
                <div style={{ marginTop: '20px' }}>
                    <h1 style={{ marginBottom: '0px' }}> View History </h1>
                    <h6 style={{ marginBottom: '15px' }}> View All </h6>
                    <ViewGallery/>
                </div>
            </div>
        </Layout>
    )
}

export default Home;
