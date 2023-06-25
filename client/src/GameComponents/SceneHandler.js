import * as THREE from "three";
import { loadModel } from "../helpers/model_loader.js";
import { hexCoords, roadCoords, spotCoords } from "../assets/coords.js";
import { Board } from "./Board.js";
import { mmi } from "./World.js";
import { GameObjectCreator } from "./GameObjectCreator.js";

export class SceneHandler {
  constructor(server_info) {
    // const server_board, server_bg, server_players} =
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("skyblue");

    this.board = server_info["server_board"].tiles;
    this.players = server_info["server_board"].players;
    this.turn = server_info["server_turn"];

    // stuff to be on screen - create
    this.gameObjectCreator = new GameObjectCreator()
    this.roads = new THREE.Group();
    this.spots = new THREE.Group();
    this.tiles = new THREE.Group();
    this.bandits = null;

    this.sun = this.gameObjectCreator.createSun(-5, 10, 0, )
    this.scene.add(this.sun);

    this.updatables = []
  }

  init = async () => {
    this.tiles.add(...await this.gameObjectCreator.createHexagonBoard(this.board));
    this.scene.add(this.tiles);
  };

  getScene = () => {
    return this.scene;
  };

  spawnTown = (spot_id, player) => {
    let coords = spotCoords[spot_id];
    let town = this.gameObjectCreator.createTown(coords.x, coords.y, coords.z, {color: player.color})
    town.name = `town_${spot_id}_${player.id}`;
    this.scene.add(town);
  };

  spawnRoad = (road_id, player) => {
    let coords = roadCoords[road_id];
    let road = this.gameObjectCreator.createRoad(coords.x, coords.y, coords.z, coords.yangle, {color: player.color})
    road.name = `road_${road_id}_${player.id}`;
    this.scene.add(road);
  };

  spawnPlaceableTown = (spot_id, callbackOnSelection) => {
    let coords = spotCoords[spot_id];
    let options = {
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    }

    let town = this.gameObjectCreator.createTown(coords.x, coords.y, coords.z, options)
    town.name = "placeable_town";
    town.userData.spot_id = spot_id;
    this.scene.add(town);
    
    // add event listener - forse mi basta farlo una volta?
    mmi.addHandler("placeable_town", "click", callbackOnSelection);

    // add animations
    const scaleKF = new THREE.VectorKeyframeTrack(
      ".scale",
      [0, 1, 2],
      [1, 1, 1, 1.1, 1.1, 1.1, 1, 1, 1]
      );
      const opacityKF = new THREE.VectorKeyframeTrack(
        ".material.opacity",
      [0, 1, 2],
      [0.5, 0.8, 0.5]
    );
    
    const clip = new THREE.AnimationClip("Action", 2, [scaleKF, opacityKF]);
    let mixer = new THREE.AnimationMixer(town);
    const clipAction = mixer.clipAction(clip);
    clipAction.setLoop();
    clipAction.play();
    
     // TODO: remove from updatables - miht use a temp upadatable arr only for temp animations (to clear danach)
    town.tick = (delta) => {
      mixer.update(delta)
    }
    this.updatables.push(town)
  };


  spawnPlaceableRoad = (roadData, callbackOnSelection) => {
    let coords = roadCoords[roadData.id];
    let options = {
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    };

    let road = this.gameObjectCreator.createRoad(coords.x, coords.y, coords.z, coords.yangle, options)
    road.name = "placeable_road";
    road.userData.roadData = roadData;
    this.scene.add(road);

    // add event listener
    mmi.addHandler("placeable_road", "click", callbackOnSelection);

    // add animations
    const opacityKF = new THREE.VectorKeyframeTrack(
      ".material.opacity",
      [0, 1, 2],
      [0.5, 0.8, 0.5]
    );

    const clip = new THREE.AnimationClip("Action", 2, [opacityKF]);
    let mixer = new THREE.AnimationMixer(road);
    const clipAction = mixer.clipAction(clip);
    clipAction.setLoop();
    clipAction.play();

    // TODO: remove from updatables - miht use a temp upadatable arr only for temp animations (to clear danach)
    road.tick = (delta) => {
      mixer.update(delta)
    }
    this.updatables.push(road)
  };

  showAvailableSpots = (spots, callbackOnSelection) => {
    for (let spot of spots) {
      this.spawnPlaceableTown(spot, callbackOnSelection);
    }
  };

  showAvailableRoads = (roads, callbackOnSelection) => {
    for (let road of roads) {
      this.spawnPlaceableRoad(road, callbackOnSelection);
    }
  };

  removeFromSceneByName = (name) => {
    this.scene.getObjectsByProperty("name", name).forEach((el, index) => {
      this.scene.remove(el);
    });
  };
}
