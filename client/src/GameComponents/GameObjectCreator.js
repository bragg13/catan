import * as THREE from "three";
import { loadModel } from "../helpers/model_loader";
import { hexCoords, roadCoords } from "../assets/coords";
import SpriteText from 'three-spritetext'

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
    let coords = {};
    let text;
    
    // loading models
    for (let m of ["sheep", "wood", "wheat", "clay", "rocks", "bandits"]) {
      model = await loadModel(`/models/${m}.glb`);
      this.loadedModels[m] = model;
    }

    // assigning models
    let currentResource = "";
    model = null;
    board.forEach((el, index) => {
      coords.x = hexCoords[el.id].x
      coords.z = hexCoords[el.id].z

      // tile
      currentResource = board[index].resource;
      model = this.loadedModels[currentResource].clone();
      model.position.set(coords.x, 0, coords.z);
      
      // value text
      text = this.createText(coords.x, 2, coords.z, el.value, (el.value>=6 && el.value<=8) ? "red" : "white")
      model.add(text)

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

  createText = (x, y, z, text, color) => {
    const myText = new SpriteText(text)
    myText.position.set(0, 0.35, 0)
    myText.fontSize = 40;
    myText.textHeight = 0.2;
    myText.color = color
    return myText
  }
}
