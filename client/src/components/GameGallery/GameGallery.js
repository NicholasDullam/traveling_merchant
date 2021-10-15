import React, { useState } from 'react'
import GameCard from '../GameCard/GameCard';

const GameGallery = (props) => {
    const [games, setGames] = useState([])

   /* const gameCards =   dummyData.map((data) => 
  <div class="col-md-4 col-sm-12 ">
        <GameCard 
        gameName={data.gameName}
        description={data.description}
       
        />
        </div>
)*/

    return (
        <div class="row ">
            {/*gameCards*/}
        </div>
    )

}

export default GameGallery;