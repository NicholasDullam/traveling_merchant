import React, { useContext, useEffect, useState } from 'react'
import { useParams, useHistory, useLocation, Switch, Route, Redirect } from 'react-router-dom'
import api from '../api'
import { TabSelector } from '../components'
import Layout from '../components/Layout/Layout'
import ProductCard from '../components/ProductCard/ProductCard'
import Ratings from '../components/Ratings/Ratings'
import AuthContext from '../context/auth-context'
import MessengerContext from '../context/messenger-context'
import { FiShoppingCart } from 'react-icons/fi'

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

const Followers = (props) => {
    const history = useHistory()

    useEffect(() => {
        if (!props.userId) return
        api.getFollowers({ params: { following: props.userId, expand: ["follower"] }}).then((response) => {
            props.handleChange(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.userId])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {
                props.followers.length ? props.followers.map((follower, i) => {
                    return <div key={i} style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }} onClick={() => history.push(`/users/${follower.follower._id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img alt='follower user profile picture' src={follower.follower.profile_img} style={{ width: '25px', height: '25px', borderRadius: '50%' }}/>
                            <h6 style={{ marginLeft: '10px', marginBottom: '0px' }}> {follower.follower.first} {follower.follower.last} </h6>                  
                        </div>
                    </div>
                }) : <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: '.5' }}>
                    <p> No Followers </p>
                </div>
            }
        </div>
    )
}

const Following = (props) => {
    const history = useHistory()

    useEffect(() => {
        if (!props.userId) return
        api.getFollowers({ params: { follower: props.userId, expand: ["following"] }}).then((response) => {
            props.handleChange(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.userId])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {
                props.following.length ? props.following.map((follower, i) => {
                    return <div key={i} style={{ padding: '15px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }} onClick={() => history.push(`/users/${follower.following._id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img alt='following user profile picture' src={follower.following.profile_img} style={{ width: '25px', height: '25px', borderRadius: '50%' }}/>
                            <h6 style={{ marginLeft: '10px', marginBottom: '0px' }}> {follower.following.first} {follower.following.last} </h6>                  
                        </div>
                    </div>
                }) :  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: '.5' }}>
                    <p> Not Following Anyone </p>
                </div>
            }
        </div>
    )
}

const Products = (props) => {
    useEffect(() => {
        if (!props.userId) return
        api.getProducts({ params: { user: props.userId }}).then((response) => {
            props.handleChange(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.userId])

    return (
        <div>
            {
                props.products.length ? props.products.map((product) => {
                    return (
                        <ProductCard product={product}/>
                    )
                }) :  <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: '.5' }}>
                    <p> No Products </p>
                </div>
            }
        </div>
    )
}

const User = (props) => {
    const history = useHistory()
    const location = useLocation()

    const messenger = useContext(MessengerContext)
    const auth = useContext(AuthContext)

    const [user, setUser] = useState(null)
    const [isFollowing, setIsFollowing] = useState(false)

    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [products, setProducts] = useState([])

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
        if (!user || !auth.user) return
        api.getFollowers({ params: { following: user._id, follower: auth.user._id, expand: ["follower"] }}).then((response) => {
            let follower = response.data.find((follower) => follower.follower._id === auth.user._id)
            if (follower) {
                setFollower(follower)
                setIsFollowing(true)
            }
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

    return (
        <Layout navbar>
            { user ? <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}> 
                        <img alt='user profile picture' src={user.profile_img} style={{ borderRadius: '50%', height: '150px', width: '150px' }}/>
                        <div style={{ backgroundColor: getStatusColor(user), borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', position: 'absolute', bottom: '8px', right: '2px', boxShadow: '0px 0px 0px 4px rgba(255, 255, 255, 1)' }}/>
                    </div>
                    <div style={{ marginLeft: '30px' }}>
                        <h2 style={{ marginBottom: '0px' }}> {user.first} {user.last} </h2>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Ratings user_id={user._id}/>
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto' }} >
                        { user._id != auth.userId && auth.userId ? <div>
                            <button className="btn btn-primary" onClick={() => isFollowing ? handleUnfollow() : handleFollow()}> { isFollowing ? 'Unfollow' : 'Follow' } </button>
                            <button className="btn btn-primary" style={{ marginLeft: '20px' }} onClick={handleMessage}> Message </button>
                        </div> : null }
                    </div>
                </div>

                <TabSelector key={user_id} style={{ marginTop: '20px' }} horizontal selected={location.pathname} handleRouter={(pathname) => history.push(pathname)} tabs={[
                    {
                        pathname: `${props.match.url}/products`,
                        name: 'Products'
                    },
                    {
                        pathname: `${props.match.url}/followers`,
                        name: 'Followers'
                    },
                    {
                        pathname: `${props.match.url}/following`,
                        name: 'Following'
                    }
                ]}/>
                <div style={{ marginTop: '20px' }}>
                    <Switch>
                        <Route path={props.match.url + '/followers'}>
                            <Followers userId={user_id} handleChange={setFollowers} followers={followers}/>
                        </Route>
                        <Route path={props.match.url + '/following'}>
                            <Following userId={user_id} handleChange={setFollowing} following={following}/>
                        </Route>
                        <Route path={props.match.url + '/products'}>
                            <Products userId={user_id} handleChange={setProducts} products={products}/>
                        </Route>
                        <Route path={props.match.url + '/'}>
                            <Redirect to={props.match.url + '/products'}/>
                        </Route>
                    </Switch>
                </div>
            </div> : null }
        </Layout>
    )
}

export default User