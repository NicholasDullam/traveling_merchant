import React from "react";

import "bootstrap/dist/css/bootstrap.css";


import '../GameCard/GameCard.css'

const GameCard = (props) => {

return (
    <div className="game-card container">
        <h3 className="game-name">{props.gameName}</h3>
        <p> {props.description}</p>

        <button className="btn  discover-more"> Discover more <span>TODO: import arrow</span></button>
    </div>
)

}
export default GameCard