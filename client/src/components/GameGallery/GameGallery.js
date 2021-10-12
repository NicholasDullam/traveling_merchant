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
        {
            gameName:"Fallout 76",
            description:"Weapons, Armor, Ammo, Consumables, and more."
        },
        

    ]



    const gameCards = dummyData.map((data, index) => 
    <div class="col-md-4">
        <GameCard 
        gameName={data.gameName}
        description={data.description}
        key={index}
        />
        </div>
    )


    return (
        <div class="row">
            {gameCards}
        </div>
    )

}

export default GameGallery;