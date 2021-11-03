import React, { useEffect, useState } from 'react'
import api from '../api'
import { Pagination } from '../components'
import { FaTrashAlt } from 'react-icons/fa'

const AdminOrders = (props) => {
    const [orders, setOrders] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        api.getOrders({ params: { limit, skip: (page - 1) ? (page - 1) * limit : 0 }}).then((response) => {
            setHasMore(response.data.has_more)
            setOrders(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [page, limit])

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Orders </h5>

            {
                orders.map((order, i) => {
                    return ( <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h6 style={{ marginBottom: '-3px' , marginLeft: '10px'}}> {order.content} </h6>
                            <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                <FaTrashAlt style={{ marginLeft: '10px', marginRight: '10px'}}/>
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