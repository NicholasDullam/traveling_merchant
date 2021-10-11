import React from "react";

import '../GameCard/GameCard.css'

const GameCard = (props) => {

return (
    <div class="game-card container">
        <h3>{props.gameName}</h3>
        <p> {props.description}</p>

        <button> Discover more <span>TODO: import arrow</span></button>
    </div>
)

}
export default GameCard