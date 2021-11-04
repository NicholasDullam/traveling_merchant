import React, { useEffect, useState } from 'react'
import api from '../api'
import { Pagination } from '../components'
import { FaTrashAlt } from 'react-icons/fa'

const AdminFilters = (props) => {
    const [filters, setFilters] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)
    const [word, setWord] = useState('')

    const getResults = () => {
        return api.getFilters({ params: { limit, skip: (page - 1) ? (page - 1) * limit : 0 }}).then((response) => {
            setHasMore(response.data.has_more)
            setFilters(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(async () => {
        await getResults()
    }, [page, limit])

    const create = (event) => {
        if (event.key !== 'Enter') return
        api.createFilter({ word }).then((response) => {
            if (filters.length === 5) setHasMore(true)
            setFilters([response.data, ...filters].slice(0, 5))
            setWord('')
        }).catch((error) => {
            console.log(error)
        })
    }

    const deleteFilter = async (filter_id) => {
        api.deleteFilterById(filter_id).then(async (response) => {
            await getResults()
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <h5 style={{ marginBottom: '0px' }}> Filters </h5>
                <input className="form-control" value={word} onKeyPress={create} onChange={(e) => setWord(e.target.value)} placeholder={'Add filter'} style={{ width: '100px', marginLeft: 'auto' }}/>
            </div>

            {
                filters.map((filter, i) => {
                    return ( <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <h6 style={{ margin: '0px 0px 0px 5px' }}> {filter.word} </h6>
                            <div style={{ display: 'flex', marginLeft: 'auto' }}>
                                <FaTrashAlt style={{ marginLeft: '10px', marginRight: '10px'}} onClick={() => deleteFilter(filter._id)}/>
                            </div>
                        </div>
                    </div> )
                })
            }

            <Pagination page={page} limit={limit} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
        </div>
    )
}

export default AdminFilters