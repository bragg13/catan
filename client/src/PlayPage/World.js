import * as THREE from 'three'
import { SceneHandler } from './SceneHandler.js';
import MouseMeshInteraction from '../helpers/MouseMeshInteraction.js'

let mmi;
export class World {
    constructor(canvasId) {
        // camera and renderer
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.canvas = document.getElementById(canvasId)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // orientate the camera
        this.camera.position.set(0, 3, 2)
        this.camera.lookAt(0, 0, 0)

    }
    
    initialize = async (server_info) => {
        this.sceneHandler = new SceneHandler(server_info)
        await this.sceneHandler.init()
        
        // keyboard listener
        document.addEventListener('keydown', this.handleKeyboard)
        mmi = new MouseMeshInteraction(this.sceneHandler.getScene(), this.camera);
        document.body.appendChild(this.renderer.domElement);
    }


    // spawnRandomTown = (player) => {
    //     let spot_id = Math.floor(Math.random() * 53)
    //     this.sceneHandler.spawnTown(spot_id, player)
    // }
    // spawnRandomRoad = (player) => {
    //     this.sceneHandler.spawnRoad(36, 31, player)
    // }

    handleKeyboard = (e) => {
        switch (e.keyCode) {
            case 37:
                console.log('left');
                this.spawnRandomRoad({ id: 'player_4', color: 0xff0000 })
                break;
            case 38:
                console.log('up');
                this.sceneHandler.spawnPlaceableTown(25)
                break;
            case 39:
                console.log('right');
                this.spawnRandomTown({ id: 'player_4', color: 0xff0000 })
                break;
            case 40:
                console.log('down');
                this.spawnRandomTown({ id: 'player_0', color: 0x00ff00 })
                break;
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (mmi) mmi.update()
        this.sceneHandler.update()
        this.renderer.render(this.sceneHandler.getScene(), this.camera);
        console.log(this.sceneHandler.getScene())
    }
}

export { mmi }