import React from 'react'
import { Layout } from '../components'
import { useHistory, Switch, Route, useLocation } from "react-router-dom";
import { AdminUsers, AdminReviews, AdminOrders, AdminFilters } from '.';
import { TabSelector } from '../components';

const Admin = (props) => {
    const history = useHistory()
    const location = useLocation()

    return (
        <Layout navbar>
            <h1> Admin </h1>
            <div style={{ display: 'flex', flexGrow: '1', position: 'relative', marginTop: '10px' }}>
                <TabSelector style={{ marginRight: '50px' }} selected={location.pathname} handleRouter={(pathname) => history.push(pathname)} tabs={[
                    {
                        name: 'Users',
                        pathname: '/admin/users'
                    },
                    {
                        name: 'Reviews',
                        pathname: '/admin/reviews'
                    },
                    {
                        name: 'Orders',
                        pathname: '/admin/orders'
                    },
                    {
                        name: 'Filters',
                        pathname: '/admin/filters'
                    }
                ]}/>
                <div style={{ width: '100%' }}>
                    <Switch>
                        <Route path={props.match.url + '/users'} component={AdminUsers}/>
                        <Route path={props.match.url + '/reviews'} component={AdminReviews}/>
                        <Route path={props.match.url + '/orders'} component={AdminOrders}/>
                        <Route path={props.match.url + '/filters'} component={AdminFilters}/>
                    </Switch>
                </div>
            </div>
        </Layout>
    )
}

export default Admin