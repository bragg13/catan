import { mmi } from "../GameComponents/World";
import { Clock } from "three"
import { updatables } from "../GameComponents/SceneHandler";
const clock = new Clock();

export class Loop {
    constructor(camera, sceneHandler, renderer) {
        this.camera = camera 
        this.sceneHandler = sceneHandler 
        this.renderer = renderer   
    }

    start() {
        this.renderer.setAnimationLoop(()=>{
            // mouse interactions
            if (mmi) mmi.update()

            // animations
            this.tick()

            // rendering
            this.renderer.render(this.sceneHandler.getScene(), this.camera)
        })
    }
    
    tick() {
        const delta = clock.getDelta()

        for (const obj of updatables) {
            obj.tick(delta)
        }
    }

    stop() {
        this.renderer.setAnimationLoop(null)
    }
}