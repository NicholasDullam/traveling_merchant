import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import '../GameCard/GameCard.css'
import { useHistory } from "react-router";

const GameCard = (props) => {
    const history = useHistory()

    const handleClick = () => {
        history.push(`/games/${props.game_id}`)
    }

    return (
        <div>
            <div style={{ backgroundImage: `url(${props.img})`, height: '192px', width: '144px', borderRadius: '10px', marginBottom: '5px', cursor: 'pointer' }} onClick={handleClick}>
                {/*<button className="btn  discover-more"> Discover more <span>→</span></button>*/}
            </div>
            <p className="game-name semi-bold">{props.name}</p>
        </div>
    )

}
export default GameCard