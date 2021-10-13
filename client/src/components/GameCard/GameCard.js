import React from "react";

import "bootstrap/dist/css/bootstrap.css";


import '../GameCard/GameCard.css'

const GameCard = (props) => {

return (
    <div className="game-card container">
        <p className="game-name semi-bold">{props.gameName}</p>
        <p> {props.description}</p>

        <button className="btn  discover-more"> Discover more <span>→</span></button>
    </div>
)

}
export default GameCard