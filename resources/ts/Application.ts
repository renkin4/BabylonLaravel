import { Engine, Scene, ArcRotateCamera, Vector3, Color4, HemisphericLight, MeshBuilder } from "babylonjs";


export class BLApplication {
    protected m_Canvas : HTMLCanvasElement;

    protected m_Engine : Engine;
    protected m_Scene : Scene;

    protected m_Camera : ArcRotateCamera;

    constructor(canvas : HTMLCanvasElement){
        this.m_Canvas = canvas;

        this.m_Engine = new Engine(this.m_Canvas, true);

        this.m_Scene = new Scene(this.m_Engine);
        this.m_Camera = new ArcRotateCamera("Camera", 0, Math.PI/ 2, 5, new Vector3(0,0,0), this.m_Scene);

        this.m_Camera.attachControl(this.m_Canvas, true);

        let light = new HemisphericLight("light", new Vector3(0,1,0), this.m_Scene);

        let sphere = MeshBuilder.CreateSphere("Sphere", {segments :32, diameter:1}, this.m_Scene);

        this.m_Engine.runRenderLoop(this.Update.bind(this));
    }

    protected Update () : void{
        this.m_Scene.clearColor = new Color4(0,0,0,1);
        this.m_Scene.render();
    }
}