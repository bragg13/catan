import { Clock } from "three"
import { mmi } from "../PlayPage/World"

export class Loop {
    constructor(camera, sceneHandler, renderer) {
        this.camera = camera 
        this.sceneHandler = sceneHandler 
        this.renderer = renderer   
        this.clock = new Clock()
    }

    start() {
        this.renderer.setAnimationLoop(()=>{
            this.update()
            this.renderer.render(this.sceneHandler.getScene(), this.camera)
        })
    }

    stop() {
        this.renderer.setAnimationLoop(null)
    }

    update() {
        if (mmi) mmi.update()
        this.sceneHandler.update()
    }
}