import { Engine, Scene, ArcRotateCamera, Vector3, Color4 } from "babylonjs";
import { MazeGenerator } from "./Maze/MazeGenerator";
import * as dat from 'dat.gui/build/dat.gui.js'

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
        // this.m_Scene.debugLayer.show();

        this.m_Camera = new ArcRotateCamera("Camera", -0.2, 0.66, 35, new Vector3(0,0,0), this.m_Scene);
        this.m_Camera.attachControl(this.m_Canvas, true);
        // let light = new HemisphericLight("light", new Vector3(0,1,0), this.m_Scene);


        let MazeGeneratorProps = { 
            Generate: () => {
                self.m_MazeGenerator.Generate();
            },
            width : 5,
            height : 5,
            delay : 50,
        };

        this.m_MazeGenerator = new MazeGenerator({width : MazeGeneratorProps.width, height : MazeGeneratorProps.height, generateDelay : MazeGeneratorProps.delay}); 

        let gui = new dat.GUI();
        gui.domElement.style.marginTop = "100px";
        gui.domElement.id = "datGUI";
        
        var self =this;


        gui.add(MazeGeneratorProps,'width', 2, 100);
        gui.add(MazeGeneratorProps,'height', 2, 100);
        gui.add(MazeGeneratorProps,'delay', 0, 1000);
        gui.add(MazeGeneratorProps,'Generate');
        
        // the canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.m_Engine.resize();
        });
        this.m_Engine.runRenderLoop(this.Update.bind(this));
    }

    protected Update () : void{
        // console.log(`Radius : ${this.m_Camera.radius}`);
        // console.log(`Alpha : ${this.m_Camera.alpha}`);
        // console.log(`Alpha : ${this.m_Camera.beta}`);

        this.m_Scene.clearColor = new Color4(0,0,0,1);
        this.m_Scene.render();
    }
}