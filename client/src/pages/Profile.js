import React from 'react'
import { Layout } from '../components'
import { useHistory, Switch, Route } from "react-router-dom";
import { AdminUsers, Favorites, Info, Orders, Reviews, Views, Products, Billing, Preferences } from '.';

const Tab = (props) => {
    let active = props.location.pathname === props.path

    return (
        <div style={{ padding: '15px', borderRadius: '40px', backgroundColor: active ? '#68B2A0' : '', color: active ? 'white' : '', display: 'flex', marginBottom: '5px', cursor: 'pointer' }} onClick={() => props.handleRouter(props.path)}>
            <h5 style={{ marginBottom: '0px' }}> {props.name} </h5>
        </div>
    )
}

const Profile = (props) => {
    const history = useHistory()
    const handleRouter = (pathname) => {
        history.push(pathname)
    }

    return (
        <Layout navbar>
            <div style={{ marginBottom: '40px', marginTop: '40px' }}>
                <h1> Profile </h1>
                <div style={{ display: 'flex', marginTop: '30px', }}>
                    <div style={{ position: 'sticky', top: '30px', marginRight: '30px', display: 'flex', flexDirection: 'column' }}>
                        <Tab name='Info' handleRouter={handleRouter} location={props.location} path='/profile/info'/>
                        <Tab name='Favorites' handleRouter={handleRouter} location={props.location} path='/profile/favorites'/>
                        <Tab name='Reviews' handleRouter={handleRouter} location={props.location} path='/profile/reviews'/>
                        <Tab name='Views' handleRouter={handleRouter} location={props.location} path='/profile/views'/>
                        <Tab name='Orders' handleRouter={handleRouter} location={props.location} path='/profile/orders'/>
                        <Tab name='Products' handleRouter={handleRouter} location={props.location} path='/profile/products'/>
                        <Tab name='Billing' handleRouter={handleRouter} location={props.location} path='/profile/billing'/>
                        <Tab name='Preferences' handleRouter={handleRouter} location={props.location} path='/profile/preferences'/>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Switch>
                            <Route path={props.match.url + '/info'} component={Info}/>
                            <Route path={props.match.url + '/favorites'} component={Favorites}/>
                            <Route path={props.match.url + '/reviews'} component={Reviews}/>
                            <Route path={props.match.url + '/views'} component={Views}/>
                            <Route path={props.match.url + '/orders'} component={Orders}/>
                            <Route path={props.match.url + '/products'} component={Products}/>
                            <Route path={props.match.url + '/billing'} component={Billing}/>
                            <Route path={props.match.url + '/billing'} component={Preferences}/>
                        </Switch>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Profile