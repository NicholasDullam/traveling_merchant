import React, { useState, useEffect } from 'react'
import api from '../api'
import { GameGallery, Layout, GameCard } from '../components'

const Games = (props) => {
    const [games, setGames] = useState([])

    useEffect(() => {
        let q = new URLSearchParams(props.location.search).get("q")
        console.log(q)
        api.getGames({ params: { q }}).then((response) => {
            setGames(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [props.location.search])

    const getQuery = () => {
        return new URLSearchParams(props.location.search).get("q")
    }

    return (
        <Layout navbar>
            <div>
                <h1 style={{ marginBottom: '20px' }}> {!getQuery() ? 'Browse Games' : 'Results'} </h1>
                {
                    getQuery() ? <div>
                        { 
                            games.map((game) => {
                                return (
                                    <div style={{ display: 'flex' }}>
                                        <div class="col-md-2 col-sm-12">
                                            <GameCard name={game.name} img={game.img} game_id={game._id}/>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div> : <GameGallery/>
                }
            </div>
        </Layout>
    )
}

export default Games