import React, { useEffect, useState } from 'react'
import { FaBan, FaTrashAlt } from 'react-icons/fa'
import { AiFillCheckCircle } from 'react-icons/ai'
import api from '../api'
import { Ratings } from '../components'

const AdminUsers = (props) => {
    const [users, setUsers] = useState([])

    useEffect(() => {
        api.getUsers({}).then((response) => {
            setUsers(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

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

    const deleteUser = (user_id) => {
        api.deleteUserById(user_id).then((response) => {
            setUsers(users.filter((user) => user._id !== user_id))
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div style={{ width: '100%' }}>
            {
                users.map((user, i) => {
                    return (
                        <div key={i} style={{ padding: '10px', borderBottom: i < users.length - 1 ? '1px solid rgba(0,0,0,.1)' : ''}}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img src={user.profile_img} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }}/>
                                <div>
                                    <p style={{ marginBottom: '0px' }}> {user.first} </p>
                                    <p style={{ marginBottom: '0px' }}> {user.last} </p>
                                </div>
                                <div style={{ display: 'flex', marginLeft: 'auto', alignItems: 'center' }}>
                                    <Ratings user_id={user._id}/>
                                    <FaTrashAlt style={{ cursor: 'pointer', marginRight: '10px', marginLeft: '10px'}} onClick={() => deleteUser(user._id)}/>
                                    { user.banned ? <AiFillCheckCircle onClick={() => unbanUser(user._id)} style={{ cursor: 'pointer'}}/> : <FaBan onClick={() => banUser(user._id)} style={{ cursor: 'pointer' }}/> }
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default AdminUsers