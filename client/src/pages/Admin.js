import React from 'react'
import { Layout } from '../components'
import { useHistory, Switch, Route } from "react-router-dom";
import { AdminUsers } from '.';

const Tab = (props) => {
    let active = props.location.pathname === props.path

    return (
        <div style={{ padding: '15px', borderRadius: '40px', backgroundColor: active ? '#68B2A0' : '', color: active ? 'white' : '', display: 'flex', marginBottom: '5px', cursor: 'pointer' }} onClick={() => props.handleRouter(props.path)}>
            <h5 style={{ marginBottom: '0px' }}> {props.name} </h5>
        </div>
    )
}

const Admin = (props) => {
    const history = useHistory()
    const handleRouter = (pathname) => {
        history.push(pathname)
    }

    return (
        <Layout navbar>
            <div>
                <h1> Admin </h1>
                <div style={{ display: 'flex', marginTop: '30px', }}>
                    <div style={{ position: 'sticky', top: '30px', marginRight: '30px', display: 'flex', flexDirection: 'column' }}>
                        <Tab name='Users' handleRouter={handleRouter} location={props.location} path='/admin/users'/>
                        <Tab name='Orders' handleRouter={handleRouter} location={props.location} path='/admin/orders'/>
                        <Tab name='Products' handleRouter={handleRouter} location={props.location} path='/admin/products'/>
                        <Tab name='Favorites' handleRouter={handleRouter} location={props.location} path='/admin/favorites'/>
                    </div>
                    <div style={{ width: '100%' }}>
                        <Switch>
                            <Route path={props.match.url + '/users'} component={AdminUsers}/>
                            <Route path={props.match.url + '/users'} component={AdminUsers}/>
                            <Route path={props.match.url + '/users'} component={AdminUsers}/>
                            <Route path={props.match.url + '/users'} component={AdminUsers}/>
                            <Route path={props.match.url + '/users'} component={AdminUsers}/>
                        </Switch>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Admin