import * as THREE from 'three'
import { loadModel } from '../helpers/model_loader.js'
import { hexCoords, roadCoords, spotCoords } from '../assets/coords.js';
import { Board } from './Board.js';
import { mmi } from './World.js'

export class SceneHandler {
    constructor(server_info) {
        // const server_board, server_bg, server_players} = 
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(server_info['server_bg'])

        this.board = new Board(server_info['server_board'])
        console.log(this.board)
        this.turn = null
        this.round = 0

        // stuff to be on screen - create
        this.roads = new THREE.Group()
        this.spots = new THREE.Group()
        this.tiles = new THREE.Group()
        this.bandits = null

        this.sun = new THREE.DirectionalLight(0xffffff, 2)
        this.sun.position.set(-5, 10, 0)
        this.scene.add(this.sun)

        this.mixer = null
        this.clock = new THREE.Clock()
    }

    init = async () => {
        await this.spawnTiles()
        this.scene.add(this.tiles)

        // this.enterConstructionMode()
        // console.log(`players: `)
        // for (let p of this.board.players) {
        //     console.log(`${p.id} (${p.color})`)
        // }

        // this.turn = this.board.players[(this.round % 2 == 0) ? 0 : 1]
    }

    update = () => {
        const delta = this.clock.getDelta();

        // update sun movement
        this.sun.position.x += 0.01
        if (this.sun.position.x >= 5) this.sun.position.x = -5


        // update animations
        if (this.mixer)
            this.mixer.update(delta)

    }

    nextTurn = () => {
        this.round += 1
    }

    /**
     * Returns the scene object which handles the rendering
     * @returns Scene
     */
    getScene = () => {
        return this.scene
    }

    enterConstructionMode = () => {
        this.mode = 'construction'

    }

    /**
     * Spawn the hexagonal tiles on screen
     */
    spawnTiles = async () => {
        let model = null
        this.board.tiles.forEach(async (el, index) => {
            model = await loadModel(`/models/${this.board.tiles[index].resource}.glb`)
            model.position.set(hexCoords[el.id].x, 0, hexCoords[el.id].z)
            this.tiles.add(model)
        })
    }

    /**
     * Attempts to spawn a new town at spot_id owned by player
     * @param {Number} spot_id 
     * @param {Object} player 
     */
    spawnTown = (spot_id, player) => {
        let objGeo = new THREE.SphereGeometry(0.1)
        let objMat = new THREE.MeshPhongMaterial({ color: player.color })
        let coords = spotCoords[spot_id]
        let sphere = new THREE.Mesh(objGeo, objMat)

        sphere.position.set(coords.x, coords.y, coords.z)
        sphere.name = `town_${spot_id}_${player.id}`

        this.board.spawnTown(spot_id, player.id)
        this.scene.add(sphere)
    }

    /**
     * Attempts to spawn a new road at from_to owned by player
     * @param {Number} from Road starting spot 
     * @param {Number} to Road destination spot
     * @param {Object} player 
     */
    spawnRoad = (from, to, player) => {
        let objGeo = new THREE.BoxGeometry(1, 1, 1)
        let objMat = new THREE.MeshPhongMaterial({ color: player.color })
        let coords = roadCoords[from]
        let road = new THREE.Mesh(objGeo, objMat)

        road.position.set(coords.x, coords.y, coords.z)
        road.rotation.set(0, coords.yangle, 0)
        road.scale.set(0.12, 0.18, 0.65)
        road.name = `road_${from}_${to}_${player.id}`

        this.board.spawnRoad(from, to, player.id)
        this.scene.add(road)
    }


    spawnPlaceableTown = (spot_id) => {
        // create the spheres
        let availableSpots = this.board.showSelectableSpots()
        let objGeo = new THREE.SphereGeometry(0.1)
        let objMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 })
        let coords = spotCoords[spot_id]
        let sphere = new THREE.Mesh(objGeo, objMat)
        sphere.position.set(coords.x, coords.y, coords.z)
        sphere.name = 'placeable_town'
        this.scene.add(sphere)

        // add event listener
        mmi.addHandler('placeable_town', 'click', mesh => {
            console.log('clicke!')
            this.scene.remove(mesh)
        })

        // add animations
        const scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2], [1, 1, 1, 2, 2, 2, 1, 1, 1])
        const opacityKF = new THREE.VectorKeyframeTrack('.material.opacity', [0, 1, 2], [0.4, 0.8, 0.4])

        const clip = new THREE.AnimationClip('Action', 2, [scaleKF, opacityKF]);
        this.mixer = new THREE.AnimationMixer(sphere)

        const clipAction = this.mixer.clipAction(clip);
        clipAction.setLoop(THREE.LoopRepeat, 10)
        clipAction.play();

    }

}