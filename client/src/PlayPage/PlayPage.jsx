import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { World } from "./World";
import { useLocation } from "react-router-dom";
import { MainContainer } from "../GUI";

export default function PlayPage({ socket }) {
    const world = useRef(null);
    const location = useLocation()
    const [loaded, setLoaded] = useState(false)
    const [players, setPlayers] = useState([])

    // component initialisation
    useEffect(() => {
        world.current = new World('three-js-canvas', socket)
        const initialGameState = location.state.initialGameState
        
        const server_info = {
            server_board: initialGameState.server_board,
            server_bg: initialGameState.server_bg,
            server_players: initialGameState.server_players
        }
        world.current.initialize(server_info)
        world.current.animate()

        // GUI handling
        setPlayers(initialGameState.server_players)
        setLoaded(true)
    }, [])
    
    useEffect(() => {
        socket.on('serverUpdate', (updateData) => processServerUpdate(updateData))
    }, [socket]);


    const processServerUpdate = (updateData) => {
        console.log(updateData)
    }

    const handleCrafting = () => {

    }

    const handleDiceRoll = () => {

    }

    const handlePassTurn = () => {
        
    }

    return (
        <MainContainer
            handleCrafting={handleCrafting}
            handleDiceRoll={handleDiceRoll}
            handlePassTurn={handlePassTurn}
            players={players}
        >
            <div id="container">
                <canvas id="three-js-canvas" />
            </div>
        </MainContainer>
    );
}