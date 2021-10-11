import React from 'react'
import GameCard from '../GameCard/GameCard';

const GameGallery = (props)=> {
    const dummyData = [
        {
            gameName:"Path of exile",
            description:"Currency, Weapon, Armor, Jewelery, Maps, and more."
        },
        {
            gameName:"Fallout 76",
            description:"Weapons, Armor, Ammo, Consumables, and more."
        },
        

    ]



    const gameCards = dummyData.map((data, index) => 
        <GameCard 
        gameName={data.gameName}
        description={data.description}
        key={index}
        />
    )

    console.log(gameCards)

    return (
        <div>
            {gameCards}
        </div>
    )

}

export default GameGallery;