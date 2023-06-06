import { useEffect } from "react";
import * as THREE from 'three';
import SceneInit from "./SceneInit";

export default function PlayPage({ socket }) {

    // component initialisation
    useEffect(() => {
        const test = new SceneInit('three-js-canvas')
        test.initialize()
        test.animate()

        // PART 1
        // Adding geometries to a three.js scene.
        const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 16);
        const boxMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
        boxMesh.position.x = -1;
        test.scene.add(boxMesh);

        const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 16);
        const cylinderMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        cylinderMesh.position.x = 1;
        test.scene.add(cylinderMesh);

        const torusGeometry = new THREE.TorusGeometry(0.5, 0.25, 20, 20);
        const torusMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
        const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
        test.scene.add(torusMesh);

    }, [])

    useEffect(() => {
        // informations
        socket.on('msg_from_server', (data) => {
            console.log(data);

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