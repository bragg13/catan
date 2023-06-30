import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { updatables } from "../GameComponents/SceneHandler";
import * as THREE from 'three';

export async function loadModel(model_uri) {
    const loader = new GLTFLoader();
    const data = await loader.loadAsync(model_uri)
    const model = setupModel(data)
    return model
}

function setupModel(data) {
    const model = data.scene.children[0]
    // const mixer = new THREE.AnimationMixer(model)
    // let animationAction;
    // model.userData.animationActions = []

    // for (let anim of data.animations) {
    //     console.log(anim)
    //     animationAction = mixer.clipAction(anim)
    //     // model.userData.animationActions.push(anim.name)
    // }

    // model.userData.activeAction = 'Idle'
    // model.tick = (delta) => {
    //     mixer.update(delta)
    // }
    // updatables.push(model)
    return model
}