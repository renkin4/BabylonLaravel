import { Engine, Scene, ArcRotateCamera, Vector3, Color4, HemisphericLight } from "babylonjs";
import { MazeGenerator } from "./Maze/MazeGenerator";
import { MazeCell } from "./Maze/MazeCell";


export class BLApplication {
    protected m_Canvas : HTMLCanvasElement;

    protected m_Engine : Engine;
    protected m_Scene : Scene;
    public get GetScene() : Scene {
        return this.m_Scene;
    }

    protected m_Camera : ArcRotateCamera;

    protected m_MazeGenerator : MazeGenerator;

    private static s_Instance : BLApplication;
    public static get Get() : BLApplication { 
        return BLApplication.s_Instance;
    }

    constructor(canvas : HTMLCanvasElement){
        BLApplication.s_Instance = this;

        this.m_Canvas = canvas;

        this.m_Engine = new Engine(this.m_Canvas, true);

        this.m_Scene = new Scene(this.m_Engine);
        this.m_Camera = new ArcRotateCamera("Camera", 0, Math.PI/ 2, 5, new Vector3(0,0,0), this.m_Scene);

        let light = new HemisphericLight("light", new Vector3(0,1,0), this.m_Scene);

        this.m_Camera.attachControl(this.m_Canvas, true);

        this.m_MazeGenerator = new MazeGenerator();

        let testCell = new MazeCell();

        this.m_Scene.debugLayer.show();
        
        this.m_Engine.runRenderLoop(this.Update.bind(this));
    }

    protected Update () : void{
        this.m_Scene.clearColor = new Color4(0,0,0,1);
        this.m_Scene.render();
    }
}