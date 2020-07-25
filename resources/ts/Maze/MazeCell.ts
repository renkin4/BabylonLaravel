import { Mesh, MeshBuilder, StandardMaterial, Color3, Vector3 } from "babylonjs";
import { BLApplication } from "../Application";
import { blackAndWhitePixelShader } from "babylonjs/Shaders/blackAndWhite.fragment";

export class MazeCell {
    public name:string;

    public x : number;
    public y : number;

    protected bVisited: boolean;
    public get GetVisited() : boolean {
        return this.bVisited;
    }

    /**
     * 0 = south 
     * 1 = west 
     * 2 = north
     * 3 = east
     */
    protected m_Neighbour : Map<number, MazeCell> = new Map<number, MazeCell>();
    public get GetNeighbour() : Map<number, MazeCell>{
        return this.m_Neighbour;
    }

    protected m_Root: Mesh;
    protected m_Floor: Mesh;

    /**
     * 0 = south 
     * 1 = west 
     * 2 = north
     * 3 = east
     */
    protected m_WallRoots: Mesh[] = [];

    private m_Index: number = -1;
    public get GetIndex() :number {
        return this.m_Index;
    }

    constructor(index : number) {
        this.m_Index = index;
        this.name = `Cell_${this.m_Index}`;
        this.Build();
    }

    public SetPosition(newPos : Vector3){
        this.m_Root.position = newPos;
    }

    public Build(): void {
        this.m_Root = new Mesh(`Root_${this.m_Index}`, BLApplication.Get.GetScene);

        let floorMaterial = new StandardMaterial(`FloorMat_${this.m_Index}`, BLApplication.Get.GetScene);
        floorMaterial.emissiveColor = Color3.White();

        this.m_Floor = MeshBuilder.CreatePlane(`Floor_${this.m_Index}`, { size: 1 }, BLApplication.Get.GetScene);
        this.m_Floor.rotation.x = Math.PI / 2;
        this.m_Floor.parent = this.m_Root;
        this.m_Floor.material = floorMaterial;

        let ChooseColor  = (index: number) => {
            let color :Color3;
            color = Color3.Gray();
            return color;
            switch (index) {
                case 0:
                    color = Color3.Red();
                    break; 
                case 1:
                    color = Color3.Green();
                    break;
                case 2:
                    color = Color3.Blue();
                    break;
                case 3:
                    color = Color3.Yellow();
                    break;
                default:
                    color = Color3.Purple();
                    break;
            }

            return color;
        }

        for (let it = 0; it < 4; it++) {
            let wallRoot = new Mesh(`Wall_Root_${this.m_Index}_${it}`, BLApplication.Get.GetScene);
            wallRoot.parent = this.m_Root;

            let newWall = MeshBuilder.CreateBox(`Wall_${this.m_Index}_${it}`, { height: 1, width: 1, depth: 0.1 }, BLApplication.Get.GetScene);
            let wallMaterial = new StandardMaterial(`WallMat_${this.m_Index}_${it}`, BLApplication.Get.GetScene);

            newWall.position.y = newWall.position.x + 0.5;
            newWall.position.z = newWall.position.x + 0.5;
            newWall.parent = wallRoot;

            wallMaterial.emissiveColor = ChooseColor(it);
            newWall.material = wallMaterial;

            wallRoot.rotation.y = (Math.PI / 2) * (it + 1);

            this.m_WallRoots.push(wallRoot);
        }
    }

    public AddNeighbour(direction, newNeighbour) : void{
        // if(newNeighbour.GetIndex == 4) console.log(`This Cell Index : ${this.m_Index}, Direction ${direction}`);
        this.m_Neighbour.set(direction, newNeighbour);
    }

    public NotifyNeighbour(neighbourIndex, neighbourCell) : void{
        // Yep hacking this
        if(neighbourIndex === this.m_Index - 1){
            this.AddNeighbour(1, neighbourCell);
        }
        else if (neighbourIndex === this.m_Index + 1){
            this.AddNeighbour(3, neighbourCell);
        }
        else if (neighbourIndex === this.m_Index - 10){
            this.AddNeighbour(2, neighbourCell);
        }
        else if (neighbourIndex === this.m_Index + 10){
            this.AddNeighbour(0, neighbourCell);
        }
    }

    public Visit(): void{
        let material : StandardMaterial= <StandardMaterial>this.m_Floor.material;
        material.emissiveColor = Color3.Teal();

        this.bVisited = true;
    }

    public UnVisit(): void{
        let material : StandardMaterial= <StandardMaterial>this.m_Floor.material;
        material.emissiveColor = Color3.Magenta();
    }

     /**
      * 0 = south 
      * 1 = west 
      * 2 = north
      * 3 = east
      */
    public RemoveWall(direction : number){
        if(!this.m_WallRoots[direction]){
            console.error(`ERROR Trying to remove wall that doesn't exist : ${direction}`);
            return;
        }

        // console.log(this.m_WallRoots);
        // console.log(`Name : ${this.m_WallRoots[direction].name}`);
        // console.log(`Index : ${this.m_Index}`);
        // console.log(`Direction ${direction}`);

        this.m_WallRoots[direction].dispose();
    }

    public GetRandomNeighbour(randomCellIndex : number){
        let allNeighbourDir = [];

        for(let direction of this.m_Neighbour.keys()){
            allNeighbourDir.push(direction);
        }

        let choosenCellIndex = allNeighbourDir[randomCellIndex];
        let choosenCell = this.GetNeighbourCell(choosenCellIndex);
        return {cell: choosenCell, direction : choosenCellIndex};
    }

    public GetNeighbourCell(index : number) : MazeCell{
        if(!this.m_Neighbour.has(index)){
            console.error(`Cell Doesn't have naighbour index ${index}`);
            return null;
        }

        return this.m_Neighbour.get(index);
    }

    public toString() :string{
        return this.m_Root.name;
    }
}