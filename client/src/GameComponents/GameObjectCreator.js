import * as THREE from "three";
import { loadModel } from "../helpers/model_loader";
import { hexCoords } from "../assets/coords";
import { gsap } from "gsap";

export class GameObjectCreator {
  constructor() {
    this.loadedModels = {};
  }

  createSun = (x, y, z) => {
    const sun = new THREE.DirectionalLight(0xffffff, 2);
    sun.position.set(x, y, z);

    // animation

    return sun;
  };

  createHexagonBoard = async (board) => {
    let model = null;
    let tiles = [];
    let coords = {};

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

    let index = 0;
    for (let el of board) {
      coords.x = hexCoords[el.id].x;
      coords.z = hexCoords[el.id].z;

      // tile
      currentResource = board[index].resource;
      let model = this.loadedModels[currentResource].clone();
      model.position.set(coords.x, 0, coords.z);
      model.receiveShadow = true;
      model.name = `tile_${el.id}`;

      // add tile animation on turn pass, like every hexagon tile rotates 90 degrees tbi

      // add tile harvest animation
      model.harvestAnim = () => {
        gsap.to(model.position, {
          duration: 0.5,
          y: "+=1",
          onComplete: () => {
            gsap.to(model.position, {
              duration: 0.5,
              y: "-=1",
            });
          },
        });

        // scale animation
        gsap.to(model.scale, {
          duration: 0.5,
          x: "+=0.2",
          y: "+=0.2",
          z: "+=0.2",
          onComplete: () => {
            gsap.to(model.scale, {
              duration: 0.5,
              x: "-=0.2",
              y: "-=0.2",
              z: "-=0.2",
            });
          },
        });
      };

      // value text
      currentValue = `num_${board[index].value}`;
      if (currentValue !== "num_7") {
        let text = this.loadedModels[currentValue].clone();

        text.name = "value_text";
        text.scale.set(0.3, 0.3, 0.3);
        text.material = new THREE.MeshPhongMaterial({
          color:
            currentValue === "num_8" || currentValue === "num_6"
              ? 0xff0000
              : 0xdddddd,
        });
        text.castShadow = true;
        text.receiveShadow = true;

        // text bouncing animation
        text.bounceAnim = () => {
          gsap.to(text.position, {
            duration: 4,
            y: "+=0.1",
            yoyo: true,
            repeat: -1,
          });
        };

        // make the text always rotate on its y axis
        text.position.set(0, 0.4, 0);
        model.add(text);
      }

      tiles.push(model);
      index++;
    }

    return tiles;
  };

  createTown = (x, y, z, options, placeable = false) => {
    let objGeo = new THREE.SphereGeometry(0.1);
    let objMat = new THREE.MeshPhongMaterial(options);
    let sphere = new THREE.Mesh(objGeo, objMat);
    const placeableOffset = (placeable ? 0 : 1)
    sphere.position.set(x, y + placeableOffset, z);

    // placeable animation
    if (placeable) {
      gsap.to(sphere.scale, {
        duration: 2,
        x: 1.1,
        y: 1.1,
        z: 1.1,
        yoyo: true,
        repeat: -1,
      });

      gsap.to(sphere.material, {
        duration: 2,
        opacity: "+=0.3",
        yoyo: true,
        repeat: -1,
      });
    } else {
      // drop down animation
      gsap.to(sphere.position, {
        duration: 0.5,
        y: `-=${placeableOffset}`,
      });
    }

    return sphere;
  };

  createRoad = (x, y, z, yangle, options, placeable = false) => {
    let objGeo = new THREE.BoxGeometry(1, 1, 1);
    let objMat = new THREE.MeshPhongMaterial(options);
    let road = new THREE.Mesh(objGeo, objMat);

    const placeableOffset = (placeable ? 0 : 1)
    road.position.set(x, y+placeableOffset, z);
    road.rotation.set(0, yangle, 0);
    road.scale.set(0.12, 0.18, 0.45);

    if (placeable) {
      gsap.to(road.material, {
        duration: 1,
        opacity: "+=0.5",
        yoyo: true,
        repeat: -1,
      });
    } else {
      // drop down animation
      gsap.to(road.position, {
        duration: 0.5,
        y: `-=${placeableOffset}`,
      });
    }

    return road;
  };
}
