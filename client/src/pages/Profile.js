import React from 'react'
import { Layout } from '../components'
import { useHistory, Switch, Route, useLocation } from "react-router-dom";
import { Favorites, Info, Orders, Reviews, Views, Products, Billing, Preferences } from '.';
import { TabSelector } from '../components';


const Profile = (props) => {
    const location = useLocation()
    const history = useHistory()

    return (
        <Layout navbar>
            <div>
                <h1> Profile </h1>
                <div style={{ display: 'flex', marginTop: '20px' }}>
                    <TabSelector style={{ marginRight: '50px' }} selected={location.pathname} handleRouter={(pathname) => history.push(pathname)} tabs={[
                        {
                            name: 'Info',
                            pathname: '/profile/info'
                        },
                        {
                            name: 'Favorites',
                            pathname: '/profile/favorites'
                        },
                        {
                            name: 'Reviews',
                            pathname: '/profile/reviews'
                        },
                        {
                            name: 'Views',
                            pathname: '/profile/views'
                        },
                        {
                            name: 'Orders',
                            pathname: '/profile/orders'
                        },
                        {
                            name: 'Products',
                            pathname: '/profile/products'
                        },
                        {
                            name: 'Billing',
                            pathname: '/profile/billing'
                        },
                        {
                            name: 'Preferences',
                            pathname: '/profile/preferences'
                        }
                    ]}/>
                    <div style={{ width: '100%' }}>
                        <Switch>
                            <Route path={props.match.url + '/info'} component={Info}/>
                            <Route path={props.match.url + '/favorites'} component={Favorites}/>
                            <Route path={props.match.url + '/reviews'} component={Reviews}/>
                            <Route path={props.match.url + '/views'} component={Views}/>
                            <Route path={props.match.url + '/orders'} component={Orders}/>
                            <Route path={props.match.url + '/products'} component={Products}/>
                            <Route path={props.match.url + '/billing'} component={Billing}/>
                            <Route path={props.match.url + '/preferences'} component={Preferences}/>
                        </Switch>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile