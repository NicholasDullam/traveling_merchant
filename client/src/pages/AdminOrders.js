import React, { useEffect, useState } from 'react'
import api from '../api'
import { Pagination } from '../components'
import { FaTrashAlt } from 'react-icons/fa'

const AdminOrders = (props) => {
    const [orders, setOrders] = useState([])
    const [status, setStatus] = useState('')
    const [hasMore, setHasMore] = useState(false)
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        let params = { limit, skip: (page - 1) ? (page - 1) * limit : 0, sort: '-created_at' }
        if (status.length) params.status = status
        console.log(params)

        api.getOrders({ params }).then((response) => {
            setHasMore(response.data.has_more)
            setOrders(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [page, limit, status])

    const cancelOrder = (order_id) => {
        api.cancelOrder(order_id).then((response) => {
            let newOrders = [...orders], newOrder = newOrders.findIndex((order) => order._id === order_id)
            newOrders[newOrder] = response.data
            setOrders(newOrders)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ marginBottom: '0px' }}> Orders </h5>
                <select className="form-control" type='select' value={status} placeholder={'Filter Status'} onChange={(e) => setStatus(e.target.value)} style={{ width: '120px', marginLeft: 'auto' }}>
                    <option value={''}> Select Status </option>
                    <option value={'delivery_pending'}> delivery_pending </option>
                    <option value={'confirmation_pending'}> confirmation_pending </option>
                    <option value={'confirmed'}> confirmed </option>
                </select>
            </div>
            {
                orders.map((order, i) => {
                    return ( <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <p style={{ marginBottom: '0px', width: '70px', textOverflow: 'ellipsis', overflow: 'hidden' }}> {order._id} </p>
                            <p style={{ marginBottom: '0px', marginLeft: '20px' }}> {order.status} </p>
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                <p style={{ marginBottom: '0px', marginLeft: 'auto' }}> {(new Date(order.created_at)).getMonth() + 1}/{(new Date(order.created_at)).getDate()} </p>                            <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                <FaTrashAlt style={{ marginLeft: '10px', marginRight: '10px'}} onClick={() => cancelOrder(order._id)}/>
                            </div>
                        </div>
                    </div>
                </div> )
                })
            }

            <Pagination page={page} limit={limit} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
        </div>
    )
}

export default AdminOrders