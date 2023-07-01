import * as THREE from "three";
import { loadModel } from "../helpers/model_loader.js";
import {
  hexCoords,
  roadCoords,
  spotCoords,
  townHarvest,
} from "../assets/coords.js";
import { mmi } from "./World.js";
import { GameObjectCreator } from "./GameObjectCreator.js";
import { gsap } from "gsap";

// export const updatables = [];
export class SceneHandler {
  constructor(server_info, cameraRef) {
    // const server_board, server_bg, server_players} =
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("skyblue");

    this.board = server_info["board"].tiles;
    this.players = server_info["players"];
    this.turn = server_info["turn"];

    // stuff to be on screen - create
    this.gameObjectCreator = new GameObjectCreator();
    this.roads = new THREE.Group();
    this.spots = new THREE.Group();
    this.tiles = new THREE.Group();
    this.bandits = null;

    this.sun = this.gameObjectCreator.createSun(-10, 10, 5);
    this.scene.add(this.sun);

    this.cameraRef = cameraRef;
  }

  init = async () => {
    this.tiles.add(
      ...(await this.gameObjectCreator.createHexagonBoard(this.board))
    );    // do i use this?

    this.scene.add(this.tiles);
  }

  getScene = () => {
    return this.scene;
  };

  spawnTown = (spot_id, playerId) => {
    const player = this.players[playerId];
    let coords = spotCoords[spot_id];
    let town = this.gameObjectCreator.createTown(coords.x, coords.y, coords.z, {
      color: player.color,
    });
    town.name = `town_${spot_id}_${player.id}`;
    this.scene.add(town);
  };

  spawnRoad = (road_id, playerId) => {
    const player = this.players[playerId];
    let coords = roadCoords[road_id];
    let road = this.gameObjectCreator.createRoad(
      coords.x,
      coords.y,
      coords.z,
      coords.yangle,
      { color: player.color }
    );
    road.name = `road_${road_id}_${player.id}`;
    this.scene.add(road);
  };

  spawnPlaceableTown = (spot_id, spot_name) => {
    let coords = spotCoords[spot_id];
    let options = {
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    };

    let town = this.gameObjectCreator.createTown(
      coords.x,
      coords.y,
      coords.z,
      options,
      true
    );
    town.name = spot_name;
    town.userData.spot_id = spot_id;
    this.scene.add(town);
  };

  spawnPlaceableRoad = (roadData) => {
    let coords = roadCoords[roadData.id];
    let options = {
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    };

    let road = this.gameObjectCreator.createRoad(
      coords.x,
      coords.y,
      coords.z,
      coords.yangle,
      options,
      true
    );
    road.name = "placeable_road";
    road.userData.roadData = roadData;
    this.scene.add(road);
  };

  // just for animation
  harvest = (spotId) => {
    for (let tileId of townHarvest[spotId]) {
      let tile = this.scene.getObjectByName(`tile_${tileId}`);
      if (tile.userData.resource !== "bandits") {
        tile.harvestAnim();
      }
    }
  };

  showAvailableSpots = (spots, callbackOnSelection) => {
    // add event listener
    mmi.addHandler('placeable_town', "click", callbackOnSelection);

    for (let spot of spots) {
      this.spawnPlaceableTown(spot, "placeable_town", callbackOnSelection);
    }
  };

  showAvailableRoads = (roads, callbackOnSelection) => {
    // add event listener
    mmi.addHandler("placeable_road", "click", callbackOnSelection);

    for (let road of roads) {
      this.spawnPlaceableRoad(road);
    }
  };

  showAvailableHarvestSpots = (spots, callbackOnSelection) => {
    // add event listener
    mmi.addHandler("eg_harvest_spot", "click", callbackOnSelection);

    for (let spot of spots) {
      this.spawnPlaceableTown(spot, "eg_harvest_spot");
    }
  };

  removeFromSceneByName = (name) => {
    mmi.removeHandler(name, "click");
    this.scene.getObjectsByProperty("name", name).forEach((el, index) => {
      this.scene.remove(el);
    });
  };
}
