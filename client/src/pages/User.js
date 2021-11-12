import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
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
    const history = useHistory()

    const messenger = useContext(MessengerContext)
    const auth = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([]) 
    const [products, setProducts] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [follower, setFollower] = useState(null)
    const { user_id } = useParams()

    useEffect(() => {
        api.getUserById(user_id).then((response) => {
            setUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user_id])

    useEffect(() => {
        if (!user) return
        api.getProducts({ params: { user: user_id }}).then((response) => {
            setProducts(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    useEffect(() => {
        if (!user) return
        api.getFollowers({ params: { following: user._id, expand: ["follower"] }}).then((response) => {
            setFollowers(response.data)
            let follower = response.data.find((follower) => follower.follower._id === auth.user._id)
            if (follower) {
                setFollower(follower)
                setIsFollowing(true)
            }
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    useEffect(() => {
        if (!user) return
        api.getFollowers({ params: { follower: user._id, expand: ["following"] }}).then((response) => {
            setFollowing(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [user])

    const handleMessage = () => {
        messenger.open(user_id)
    }

    const handleUnfollow = () => {
        api.deleteFollowerById(follower._id).then((response) => {
            setFollower(null)
            setIsFollowing(false)
            setFollowers(followers.filter((follower) => response.data._id !== follower._id))
        }).catch((error) => {
            console.log(error)
        })
    }

    const handleFollow = () => {
        api.createFollower({ following: user._id }).then((response) => {
            setIsFollowing(true)
            setFollower(response.data)
            setFollowers([{ ...response.data, follower: auth.user }, ...followers])
        }).catch((error) => {
            console.log(error)
        })
    }
        
    //TODO: deactivate follow button if it's my profile
        const css=
        `   .nav-tabs .nav-link{
         color:black;           
        }`
 
    return (
        <Layout navbar>
            <style>
                { css }
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
                            { user._id != auth.userId ? <div>
                                <button className="btn btn-primary" onClick={() => isFollowing ? handleUnfollow() : handleFollow()}> { isFollowing ? 'Unfollow' : 'Follow' } </button>
                                <button className="btn btn-primary" style={{ marginLeft: '20px' }} onClick={handleMessage}> Message </button>
                            </div> : null }
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
                            <div style={{ marginTop: '20px' }}>
                                {
                                    products.map((product) => {
                                        return (
                                            <ProductCard product={product}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div style={{ marginTop: '20px' }}>
                                {
                                    following.map((follower, i) => {
                                        return <div key={i} style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }} onClick={() => history.push(`/users/${follower.following._id}`)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={follower.following.profile_img} style={{ width: '25px', height: '25px', borderRadius: '50%' }}/>
                                                <h6 style={{ marginLeft: '10px', marginBottom: '0px' }}> {follower.following.first} {follower.following.last} </h6>                  
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            <div style={{ marginTop: '20px' }}>
                                {
                                    followers.map((follower, i) => {
                                        return <div key={i} style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }} onClick={() => history.push(`/users/${follower.follower._id}`)}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={follower.follower.profile_img} style={{ width: '25px', height: '25px', borderRadius: '50%' }}/>
                                                <h6 style={{ marginLeft: '10px', marginBottom: '0px' }}> {follower.follower.first} {follower.follower.last} </h6>                  
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div> : null }
            </div>
        </Layout>
    )
}

export default User