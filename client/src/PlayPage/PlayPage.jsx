import { useEffect } from "react";
import * as THREE from 'three';
import SceneInit from "./SceneInit";
import { World } from "./World";

export default function PlayPage({ socket }) {
    let world;

    // component initialisation
    useEffect(() => {
        world = new World('three-js-canvas')
    }, [])
    
    useEffect(() => {
        // game initialization
        socket.on('game_init', (data) => {
            console.log(data);
            const server_info = {
                server_board: data.server_board,
                server_bg: data.server_bg,
                server_players: data.server_players
            }
            world.initialize(server_info)
            world.animate()

        });

        // game updates
        socket.on('game_update_from_server', (data) => {
            console.log(data);

        });

    }, [socket]);


    return (
        <div id="container">
            <canvas id="three-js-canvas" />
        </div>
    );
}