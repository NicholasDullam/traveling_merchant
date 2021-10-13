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
        {
            gameName:"Fallout 76",
            description:"Weapons, Armor, Ammo, Consumables, and more."
        },  {
            gameName:"Fallout 76",
            description:"Weapons, Armor, Ammo, Consumables, and more."
        },
        {
            gameName:"Fallout 76",
            description:"Weapons, Armor, Ammo, Consumables, and more."
        },
        

    ]



    const gameCards =   dummyData.map((data) => 
  <div class="col-md-4 col-sm-12 ">
        <GameCard 
        gameName={data.gameName}
        description={data.description}
       
        />
        </div>
)

console.log(gameCards)


    return (
        <div class="row ">
            {gameCards}
        </div>
    )

}

export default GameGallery;