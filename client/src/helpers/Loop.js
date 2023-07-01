import { mmi } from "../GameComponents/World";
import { Clock } from "three"
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

            // rendering
            this.renderer.render(this.sceneHandler.getScene(), this.camera)
        })
    }
    
    stop() {
        this.renderer.setAnimationLoop(null)
    }
}