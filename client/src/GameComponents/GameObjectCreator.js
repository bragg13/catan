import * as THREE from "three";
import { loadModel } from "../helpers/model_loader";
import { hexCoords, roadCoords } from "../assets/coords";

export class GameObjectCreator {
  constructor() {
    this.loadedModels = {};
  }

  createSun = (x, y, z) => {
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(x, y, z);

    // animations
    sun.tick = (delta) => {
      if (sun.position.x >= 5) sun.position.x = -5;
      sun.position.x += 0.01 * delta;
    };

    return sun;
  };

  createHexagonBoard = async (board) => {
    let model = null;
    let tiles = [];

    // loading models
    for (let m of ["sheep", "wood", "wheat", "clay", "rocks", "bandits"]) {
      model = await loadModel(`/models/${m}.glb`);
      this.loadedModels[m] = model;
    }

    // assigning models
    let currentResource = "";
    model = null;
    board.forEach((el, index) => {
      currentResource = board[index].resource;
      model = this.loadedModels[currentResource].clone();
      model.position.set(hexCoords[el.id].x, 0, hexCoords[el.id].z);
      tiles.push(model);
    });

    return tiles;
  };

  createTown = (x, y, z, options) => {
    let objGeo = new THREE.SphereGeometry(0.1);
    let objMat = new THREE.MeshPhongMaterial(options);
    let sphere = new THREE.Mesh(objGeo, objMat);
    sphere.position.set(x, y, z);

    return sphere
  };

  createRoad = (x, y, z, yangle, options) => {
    let objGeo = new THREE.BoxGeometry(1, 1, 1);
    let objMat = new THREE.MeshPhongMaterial(options);
    let road = new THREE.Mesh(objGeo, objMat);

    road.position.set(x, y, z);
    road.rotation.set(0, yangle, 0);
    road.scale.set(0.12, 0.18, 0.45);
    
    return road
  }
}
