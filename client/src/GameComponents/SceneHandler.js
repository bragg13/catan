import * as THREE from "three";
import { loadModel } from "../helpers/model_loader.js";
import { hexCoords, roadCoords, spotCoords } from "../assets/coords.js";
import { mmi } from "./World.js";
import { GameObjectCreator } from "./GameObjectCreator.js";

export const updatables = [];
export class SceneHandler {
  constructor(server_info, cameraRef) {
    // const server_board, server_bg, server_players} =
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("skyblue");

    this.board = server_info["board"].tiles;
    this.players = server_info["players"];
    this.turn = server_info["turn"];

    // stuff to be on screen - create
    this.gameObjectCreator = new GameObjectCreator()
    this.roads = new THREE.Group();
    this.spots = new THREE.Group();
    this.tiles = new THREE.Group();
    this.bandits = null;

    this.sun = this.gameObjectCreator.createSun(-10, 10, 5)
    this.scene.add(this.sun);

    this.cameraRef = cameraRef;
  }

  init = async () => {
    this.tiles.add(...await this.gameObjectCreator.createHexagonBoard(this.board));
    this.scene.add(this.tiles);
    this.scene.getObjectsByProperty("name", "value_text").forEach((el, index) => {
      // bouncing animation for el using position.z
      const bounceKF = new THREE.VectorKeyframeTrack(
        ".position",
        [0, 2, 4],
        [0, 0.4, 0, 0, 0.5, 0, 0, 0.4, 0]
        );
      const clip = new THREE.AnimationClip("Action", 4, [bounceKF]);
      let mixer = new THREE.AnimationMixer(el);
      const clipAction = mixer.clipAction(clip);
      clipAction.setLoop();
      clipAction.play();

      el.tick = (delta) => {
        mixer.update(delta)
      }
    
      updatables.push(el);
    })
  };

  getScene = () => {
    return this.scene;
  };

  spawnTown = (spot_id, playerId) => {
    const player = this.players[playerId]
    let coords = spotCoords[spot_id];
    let town = this.gameObjectCreator.createTown(coords.x, coords.y, coords.z, {color: player.color})
    town.name = `town_${spot_id}_${player.id}`;
    this.scene.add(town);
  };

  spawnRoad = (road_id, playerId) => {
    const player = this.players[playerId]
    let coords = roadCoords[road_id];
    let road = this.gameObjectCreator.createRoad(coords.x, coords.y, coords.z, coords.yangle, {color: player.color})
    road.name = `road_${road_id}_${player.id}`;
    this.scene.add(road);
  };

  spawnPlaceableTown = (spot_id, spot_name, callbackOnSelection) => {
    let coords = spotCoords[spot_id];
    let options = {
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    }

    let town = this.gameObjectCreator.createTown(coords.x, coords.y, coords.z, options)
    town.name = spot_name;
    town.userData.spot_id = spot_id;
    this.scene.add(town);
    
    // add event listener - forse mi basta farlo una volta?
    mmi.addHandler(spot_name, "click", callbackOnSelection);

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
    updatables.push(town)
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
    updatables.push(road)
  };

  showAvailableSpots = (spots, callbackOnSelection) => {
    for (let spot of spots) {
      this.spawnPlaceableTown(spot, 'placeable_town', callbackOnSelection);
    }
  };

  showAvailableRoads = (roads, callbackOnSelection) => {
    for (let road of roads) {
      this.spawnPlaceableRoad(road, callbackOnSelection);
    }
  };

  showAvailableHarvestSpots = (spots, callbackOnSelection) => {
    for (let spot of spots) {
      this.spawnPlaceableTown(spot, 'eg_harvest_spot', callbackOnSelection);
    }
  };

  removeFromSceneByName = (name) => {
    mmi.removeHandler(name, "click");
    this.scene.getObjectsByProperty("name", name).forEach((el, index) => {
      this.scene.remove(el);
    });
  };
}
