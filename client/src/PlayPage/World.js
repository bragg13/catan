import * as THREE from 'three'
import { SceneHandler } from './SceneHandler.js';
import MouseMeshInteraction from '../helpers/MouseMeshInteraction.js'
import { ServerHandler } from './ServerHandler.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Loop } from '../helpers/Loop.js';

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
        this.renderer.setPixelRatio(window.devicePixelRatio);

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
        
        // animation loop
        this.loop = new Loop(this.camera, this.sceneHandler, this.renderer)

        // interactions listener
        // document.addEventListener('keydown', this.handleKeyboard)
        mmi = new MouseMeshInteraction(this.sceneHandler.getScene(), this.camera);
        document.body.appendChild(this.renderer.domElement);
        
        this.loop.start()

        // check in with the server
        serverHandler.updateServer({msg: 'clientReady'})
    }

    earlyGame = (player, availableSpots, availableRoads) => {
        if (availableSpots!== null) {
            console.log('seleziona un posto dove costruire una TOWN')
            
            // mostro spot available per una town
            this.sceneHandler.showAvailableSpots(availableSpots, (mesh) => {
                const selectedSpotId = mesh.userData.spot_id
                console.log('selezionato', selectedSpotId)

                // update scene
                this.sceneHandler.removeFromSceneByName('placeable_town')
                this.sceneHandler.spawnTown(selectedSpotId, player)
                    
                // update server
                serverHandler.updateServer({msg: 'selectedTown', selectedSpotId})
            })

            
            
        } else if (availableRoads !== null) {
            console.log('seleziona un posto dove costruire una ROAD')

            // mostro spot available per una road
            this.sceneHandler.showAvailableRoads(availableSpots, (mesh) => {
                const selectedRoadId = mesh.userData.road_id
                console.log('selezionato', selectedRoadId)

                // update scene
                this.sceneHandler.removeFromSceneByName('placeable_road')
                this.sceneHandler.spawnRoad(selectedRoadId, player)
                    
                // update server
                serverHandler.updateServer({msg: 'selectedRoad', selectedRoadId})
            })
            
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

    // handleKeyboard = (e) => {
    //     switch (e.keyCode) {
    //         case 37:
    //             console.log('left');
    //             serverHandler.updateServer({
    //                 msg: 'spawnCity'
    //             })
    //             // this.spawnRandomRoad({ id: 'player_4', color: 0xff0000 })
    //             break;
    //         case 38:
    //             console.log('up');
    //             this.sceneHandler.spawnPlaceableTown(25)
    //             break;
    //         case 39:
    //             console.log('right');
    //             this.spawnRandomTown({ id: 'player_4', color: 0xff0000 })
    //             break;
    //         case 40:
    //             console.log('down');
    //             this.spawnRandomTown({ id: 'player_0', color: 0x00ff00 })
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // animate = () => {
    //     requestAnimationFrame(this.animate);
        
    //     this.renderer.render(this.sceneHandler.getScene(), this.camera);
    // }

}

export { mmi, serverHandler }