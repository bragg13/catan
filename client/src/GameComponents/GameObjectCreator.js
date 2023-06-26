import * as THREE from "three";
import { loadModel } from "../helpers/model_loader";
import { hexCoords, roadCoords } from "../assets/coords";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { updatables } from "./SceneHandler";

export class GameObjectCreator {
  constructor() {
    this.loadedModels = {};
  }

  createSun = (x, y, z) => {
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(x, y, z);

    // animations
    // sun.tick = (delta) => {
    //   if (sun.position.x >= 5) sun.position.x = -5;
    //   sun.position.x += 0.01 * delta;
    // };

    // updatables.push(sun);

    return sun;
  };

  createHexagonBoard = async (board) => {
    let model = null;
    let tiles = [];
    let coords = {};
    let text = null;

    // loading models - hex resources
    for (let m of ["sheep", "wood", "wheat", "clay", "rocks", "bandits"]) {
      model = await loadModel(`/models/${m}.glb`);
      this.loadedModels[m] = model;
    }

    // loading models - values
    for (let m of ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12"]) {
      model = await loadModel(`/models/numbers/num_${m}.glb`);
      this.loadedModels[`num_${m}`] = model;
    }

    // assigning models
    let currentResource = "";
    let currentValue = "";
    
    model = null;
    let index = 0;
    for (let el of board) {
      coords.x = hexCoords[el.id].x
      coords.z = hexCoords[el.id].z

      // tile
      currentResource = board[index].resource;
      model = this.loadedModels[currentResource].clone();
      model.position.set(coords.x, 0, coords.z);
      model.receiveShadow = true;

      // value text
      currentValue = `num_${board[index].value}`;
      if (currentValue !== "num_7") {
        text = this.loadedModels[currentValue].clone();

        text.name = "value_text";        
        text.scale.set(0.3, 0.3, 0.3);
        text.material = new THREE.MeshPhongMaterial({ color: (currentValue==='num_8' || currentValue==='num_6') ? 0xff0000 : 0xdddddd })
        text.castShadow = true;
        text.receiveShadow = true;

        // make the text always rotate on its y axis
        text.position.set(0, 0.4, 0);
        model.add(text);
        
      }

      tiles.push(model);
      index++;
    };

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
    
    // create opacity animation for road (fade in)
    road.tick = (delta) => {
      if (road.material.opacity < 1) {
        road.material.opacity += 0.01 * delta; 
      }
    };


    return road
  }


  // async createText(x, y, z, text, color) {
  //   const fontLoader = new FontLoader();

  //   try {
  //       let font = fontLoader.load('/fonts/Ysabeau.json', font => {
  //         console.log('font loaded')
          
  //         const textGeometry = new TextGeometry(text, {
  //           font: font,
  //           size: 1,
  //           height: 1,
  //         });

  //         const textMaterial = new THREE.MeshPhongMaterial({ color: color });
  //         const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  //         textMesh.position.set(x, y, z);
  //         textMesh.castShadow = true;
  //         textMesh.receiveShadow = true;
  //         return textMesh;
  //       })
  //   } catch (error) {
  //     console.error('Error loading font or creating text:', error);
  //     throw error;
  //   }
  // }
  
  async createText(x, y, z, text, color) {
    const fontLoader = new FontLoader();
  
    try {
      let fontPromise = new Promise((resolve, reject) => {
        fontLoader.load('/fonts/Ysabeau.json', font => {
          console.log('font loaded')
  
          const textGeometry = new TextGeometry(text, {
            font: font,
            size: 1,
            height: 1,
          });
  
          const textMaterial = new THREE.MeshPhongMaterial({ color: color });
          const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  
          textMesh.position.set(x, y, z);
          textMesh.castShadow = true;
          textMesh.receiveShadow = true;
          console.log('returning tm', textMesh)
          resolve(textMesh);
        }, undefined, (error) => {
          reject(error);
        });
      });
  
      return await fontPromise;
    } catch (error) {
      console.error('Error loading font or creating text:', error);
      throw error;
    }
  }
  

}
