import React from 'react'
import {Link} from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import ProductCard from '../components/ProductCard/ProductCard'
import Ratings from '../components/Ratings/Ratings'
import ProfileIcon from '../images/profile_icon.png'

const Profile = (props) => {
    return (

        <Layout navbar>
        <h1>Seller Profile</h1>
        <div class="row">
            <div class="col">
        <img src={ProfileIcon}></img>
        </div> 
        <div class="col">
            <p> Gamer du 92</p>
            <p> 75.6%</p>
            <Ratings count={3}></Ratings>
            </div>
        <Link to="/messages"> Message seller</Link>
        </div>

        <div class="row">
            <ProductCard/>
        </div>
        </Layout>
    )
}

export default Profile