import React, { useState } from 'react'
import Layout from '../components/Layout/Layout'
const Home = (props) => {
    const [count, setCount] = useState(0)
    const [search, setSearch] = useState('')

    const handler = () => {
        setCount(count + 1)
    }

    return (
        <Layout navbar>
            <h1 onClick={() => setCount(count + 1)}> Home page! {count} </h1>
            <input value={search} onChange={(event) => {
                console.log(event.target)
                setSearch(event.target.value)
            }}/> {/* controlled */}
            <input onKeyPress={(event) => event.key === 'Enter' ? console.log(event.target.value) : console.log('sadge')}/> {/* uncontrolled */}
            <h1 onClick={(event) => {
                console.log(event)
                setCount(count + 1)
            }}> Home page! {count} </h1>
            <p>Whatever I want!</p>
            <p>Another thing!</p>
        </Layout>
    )
}

export default Home;
