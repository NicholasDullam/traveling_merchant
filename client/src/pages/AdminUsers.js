import React, { useEffect, useState } from 'react'
import { FaBan, FaTrashAlt } from 'react-icons/fa'
import { AiFillCheckCircle } from 'react-icons/ai'
import api from '../api'
import { Ratings, Pagination } from '../components'

const AdminUsers = (props) => {
    const [users, setUsers] = useState([])
    const [hasMore, setHasMore] = useState(false)
    const [limit, setLimit] = useState(5)
    const [page, setPage] = useState(1)

    const getResults = () => {
        return api.getUsers({ params: { limit, skip: (page - 1) ? (page - 1) * limit : 0 }}).then((response) => {
            setHasMore(response.data.has_more)
            setUsers(response.data.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    useEffect(async () => {
        await getResults()
    }, [page, limit])

    const banUser = (user_id) => {
        api.banUserById(user_id).then((response) => {
            let newUsers = [...users]
            let bannedUser = newUsers.findIndex((user) => user._id === user_id)
            newUsers[bannedUser] = response.data
            setUsers(newUsers)
        }).catch((error) => {
            console.log(error)
        })
    }

    const unbanUser = (user_id) => {
        api.unbanUserById(user_id).then((response) => {
            let newUsers = [...users]
            let unbannedUser = newUsers.findIndex((user) => user._id === user_id)
            newUsers[unbannedUser] = response.data
            setUsers(newUsers)
        }).catch((error) => {
            console.log(error)
        })
    }

    const deleteUser = async (user_id) => {
        api.deleteUserById(user_id).then(async (response) => {
            await getResults()
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div>
            <h5 style={{ marginBottom: '20px' }}> Users </h5>
            {
                users.map((user, i) => {
                    return ( <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '10px', margin: '5px 0px 5px 0px', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={user.profile_img} style={{ width: '25px', height: '25px', borderRadius: '50%' }}/>
                            <h6 style={{ marginLeft: '10px', marginBottom: '0px' }}> {user.first} {user.last} </h6>
                            <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
                                <div style={{ marginRight: '20px', marginTop: '-2px' }}>
                                    <Ratings user_id={user._id}/>
                                </div>
                                { user.banned ? <AiFillCheckCircle onClick={() => unbanUser(user._id)} style={{ cursor: 'pointer'}}/> : <FaBan onClick={() => banUser(user._id)} style={{ cursor: 'pointer' }}/> }
                                <FaTrashAlt style={{ marginLeft: '10px', marginRight: '10px'}} onClick={() => deleteUser(user._id)}/>
                            </div>
                        </div>
                    </div> )
                })
            }
            <Pagination page={page} limit={limit} hasMore={hasMore} handlePageChange={setPage} handleLimitChange={setLimit}/>
        </div>
    )
}

export default AdminUsers