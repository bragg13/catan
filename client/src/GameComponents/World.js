import * as THREE from "three";
import { SceneHandler } from "./SceneHandler.js";
import MouseMeshInteraction from "../helpers/MouseMeshInteraction.js";
import { ServerHandler } from "./ServerHandler.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Loop } from "../helpers/Loop.js";
export const debug = true;

let mmi;
let serverHandler;

export class World {
  constructor(canvasId, socket) {
    // camera and renderer
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.canvas = document.getElementById(canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // orientate the camera
    this.camera.position.set(0, 3, 2);
    this.camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    // server handler
    serverHandler = new ServerHandler(socket);
  }

  initialize = async (serverData) => {
    this.sceneHandler = new SceneHandler(serverData, this.camera);
    await this.sceneHandler.init();

    // animation loop
    this.loop = new Loop(this.camera, this.sceneHandler, this.renderer);

    // interactions listener
    mmi = new MouseMeshInteraction(this.sceneHandler.getScene(), this.camera);
    document.body.appendChild(this.renderer.domElement);

    this.loop.start();

    // check in with the server
    serverHandler.updateServer("earlyGameClientReady");
  };

  handleEarlyGame = (player, serverData) => {
    console.log('handleEarlyGame', player, serverData)
    const availableSpots = serverData.availableSpots;
    const availableRoads = serverData.availableRoads;
    const availableHarvestSpots = serverData.availableHarvestSpots;

    if (availableSpots !== null) {
      console.log("seleziona un posto dove costruire una TOWN");

      // mostro spot available per una town
      this.sceneHandler.showAvailableSpots(availableSpots, (mesh) => {
        const selectedSpotId = mesh.userData.spot_id;
        console.log('selected', selectedSpotId)

        // update scene
        this.sceneHandler.removeFromSceneByName("placeable_town");
        this.sceneHandler.spawnTown(selectedSpotId, player.id);

        // update server
        serverHandler.updateServer("selectedTown", {
          selectedTown: selectedSpotId,
        });
      });
    } else if (availableRoads !== null) {
      console.log("seleziona un posto dove costruire una ROAD");

      // mostro spot available per una road
      this.sceneHandler.showAvailableRoads(availableRoads, (mesh) => {
        const { from, to, id } = mesh.userData.roadData;

        // update scene
        this.sceneHandler.removeFromSceneByName("placeable_road");
        this.sceneHandler.spawnRoad(id, player.id);

        // update server
        serverHandler.updateServer("selectedRoad", {
          selectedRoad: { from, to, id },
        });
      });
    } else {
      // decide which spot is harvesting for the first time
      console.log("seleziona un posto da cui raccogliere");
      this.sceneHandler.showAvailableHarvestSpots(
        availableHarvestSpots,
        (mesh) => {
          const selectedSpotId = mesh.userData.spot_id;
          
          // update scene
          this.sceneHandler.removeFromSceneByName("eg_harvest_spot");
          this.sceneHandler.harvest(selectedSpotId, player.id)

          // update server
          serverHandler.updateServer("selectedHarvestSpot", {
            selectedHarvestSpot: selectedSpotId,
          });

          serverHandler.updateServer("clientReady"); // might be redundant
        }
      );
    }
  };


  handleGame = (player, serverData) => {
    console.log('handleGame', player, serverData)
  }

  updateScene = (updateData) => {
    console.log(updateData);
    for (let update of updateData) {
      switch (update.msg) {
        case "newTown":
          this.sceneHandler.spawnTown(update.town, update.updatedBy);
          break;

        case "newRoad":
          this.sceneHandler.spawnRoad(update.road.id, update.updatedBy);
          break;

        case "diceRolled":
          this.sceneHandler.diceRolled(update.tileToBeHarvested)
          break;

        default:
          break;
      }
    }
  };

  handleCrafting = () => {};
  handleDiceRoll = (value1, value2) => {
    // send update to server
    serverHandler.updateServer("diceRolled", { dice: {value1, value2} });

  };
  handlePassTurn = () => {};

}

export { mmi, serverHandler };
