import * as THREE from 'three'
import { SceneHandler } from './SceneHandler.js';
import MouseMeshInteraction from '../helpers/MouseMeshInteraction.js'
import { ServerHandler } from './ServerHandler.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let mmi;
let serverHandler;

export class World {
    constructor(canvasId, socket) {
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
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // server handler
        serverHandler = new ServerHandler(socket)
    }
    
    initialize = async (serverData) => {
        this.sceneHandler = new SceneHandler(serverData)
        await this.sceneHandler.init()
        serverHandler.updateServer({msg: 'clientReady'})
        
        // keyboard listener
        document.addEventListener('keydown', this.handleKeyboard)
        mmi = new MouseMeshInteraction(this.sceneHandler.getScene(), this.camera);
        document.body.appendChild(this.renderer.domElement);
    }

    earlyGame = (playerId, availableSpots, availableRoads) => {
        if (availableSpots!== null) {
            let selectedTown = null
            console.log('seleziona un posto dove costruire una TOWN')
            
            // mostro spot available per una town
            this.sceneHandler.showAvailableSpots(availableSpots, (selectedSpotId) => {
                console.log('selezionato', selectedSpotId)

                // remove all availableSpawnPoint meshes
                
                // set selected spot
                this.sceneHandler.spawnTown(selectedSpotId, playerId)
                
                // aggiorno il server
                // serverHandler.updateServer({msg: 'selectedTown', selectedTown})
            })
            
            
        } else if (availableRoads !== null) {
            let selectedRoad = null
            console.log('seleziona un posto dove costruire una ROAD')
            // mostro spot available per una road

            // seleziono road
        
            // aggiorno il server
            // serverHandler.updateServer({msg: 'selectedRoad', selectedRoad})
            
        }
    }
    
    updateScene = (serverData) => {
        console.log(serverData)
    }

    handleCrafting = () => {

    }
    
    handleDiceRoll = () => {

    }
    
    handlePassTurn = () => {

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
                serverHandler.updateServer({
                    msg: 'spawnCity'
                })
                // this.spawnRandomRoad({ id: 'player_4', color: 0xff0000 })
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
            default:
                break;
        }
    }

    animate = () => {
        requestAnimationFrame(this.animate);
        if (mmi) mmi.update()
        this.sceneHandler.update()
        this.renderer.render(this.sceneHandler.getScene(), this.camera);
        // console.log(this.sceneHandler.getScene())
    }
}

export { mmi, serverHandler }