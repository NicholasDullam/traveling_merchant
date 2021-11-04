import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'
import Layout from '../components/Layout/Layout'
import ProductCard from '../components/ProductCard/ProductCard'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import MessengerContext from '../context/messenger-context'
import Badge from './../components/Badge/Badge';


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
const [btnText, setBtnText] = useState("Follow")

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
    const auth = useContext(AuthContext);

    const handleFollow = () => {
        const toFollow = user._id
            api.createFollower(toFollow) //follower is following user w user_id
            .then((response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
            })
            if(btnText == "follow") {
                setBtnText("following")

            }
else {
setBtnText("follow")

}
        }

   var followButton =  <button className="btn btn-primary" onClick={handleFollow}> {btnText} </button>

    // const displayFollowButton = () => {
    //     console.log("displayFollowButton() !!!!!!!!!")
    //     console.log("user._id" +user._id);
    //     console.log("auth.userId" +auth.userId);

    //     if() {
    //         return null;
    //     }
    //     else {
    //     }

    // }
        
    //TODO: deactivate follow button if it's my profile
        const css=
        `   .nav-tabs .nav-link{
         color:black;           
        }`
 
    return (
        <Layout navbar>
            <style>
             {css}
                </style>
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
                       {user._id != auth.userId? 
   followButton: null}
<button className="btn btn-primary" style={{ marginLeft: '20px' }} onClick={handleMessage}> Message </button>
                        </div>
                    </div>
                
                    <ul class="nav nav-tabs" id="myTab" role="tablist" style={{ marginTop: '20px' }}>
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Products</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Following</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Followers</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                    <h4 style={{ borderBottom: '1px solid rgba(0,0,0,.1)', paddingBottom: '10px', marginTop: '20px', marginBottom: '10px' }}> Products </h4>
                
                    {
                        products.map((product) => {
                            return (
                                <ProductCard product={product}/>
                            )
                        })
                    }</div>
  <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
  <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                    <Badge count = {5}></Badge>


  </div>
</div>
                </div> : null }
            </div>
        </Layout>
    )
}

export default User