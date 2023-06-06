import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function loadModel(model_uri) {
    const loader = new GLTFLoader();
    const data = await loader.loadAsync(model_uri)
    const model = setupModel(data)
    console.log('Model loaded')

    return model
}

function setupModel(data) {
    const model = data.scene.children[0]
    return model
}