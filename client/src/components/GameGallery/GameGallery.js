import React, { useEffect, useState } from 'react'
import api from '../../api';
import GameCard from '../GameCard/GameCard';

const GameGallery = (props) => {
    const [games, setGames] = useState([])

    useEffect(() => {
        api.getGames({ limit: 5 }).then((response) => {
            setGames(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }, [])

    return (
        <div className="row">
            {
                games.map((game, i) => {
                    return (
                        <div key={i} className="col-lg-2 col-md-3 col-sm-12">
                            <GameCard name={game.name} img={game.img} game_id={game._id}/>
                        </div>
                    )
                })
            }
        </div>
    )

}

export default GameGallery;