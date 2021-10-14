import React from 'react'
import { Layout } from '../components'

const Tab = (props) => {
    let active = props.location.pathname === props.path

    return (
        <div style={{ padding: '15px', borderRadius: '40px', backgroundColor: active ? '#68B2A0' : '', color: active ? 'white' : '', display: 'flex', marginBottom: '5px' }}>
            <h5 style={{ marginBottom: '0px' }}> {props.name} </h5>
        </div>
    )
}

const Admin = (props) => {
    return (
        <Layout navbar>
            <h1 style={{ marginTop: '40px' }}> Admin </h1>
            <div style={{ display: 'flex' }}>
                <div style={{ position: 'sticky', justifyContent: 'center', top: '30px', marginTop: '30px', display: 'flex', flexDirection: 'column' }}>
                    <Tab name='Users' location={props.location} path='/admin/users'/>
                    <Tab name='Orders' location={props.location} path='/admin/orders'/>
                    <Tab name='Products' location={props.location} path='/admin/products'/>
                    <Tab name='Favorites' location={props.location} path='/admin/favorites'/>

                </div>
            </div>
        </Layout>
    )
}

export default Admin