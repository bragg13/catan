import { useEffect, useRef } from "react";
import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { World } from "./World";
import { useLocation } from "react-router-dom";

export default function PlayPage({ socket }) {
    const world = useRef(null);
    const location = useLocation()

    // component initialisation
    useEffect(() => {
        world.current = new World('three-js-canvas')
        const initialGameState = location.state.initialGameState
        
        const server_info = {
            server_board: initialGameState.server_board,
            server_bg: initialGameState.server_bg,
            server_players: initialGameState.server_players
        }

        world.current.initialize(server_info)
        world.current.animate()
    }, [])
    
    // useEffect(() => {
    // }, [socket]);


    return (
        <div id="container">
            <canvas id="three-js-canvas" />
        </div>
    );
}