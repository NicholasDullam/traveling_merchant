import React from 'react'

const UserCard = (props) => {
    const [followers, setFollowers] = useState(null)
//get all followers 

    useEffect(() => {
        api.getFollowersById.then((response) => {
            setUser(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
    return (
        
    )
}