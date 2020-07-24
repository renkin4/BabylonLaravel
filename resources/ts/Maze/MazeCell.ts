import { Mesh, MeshBuilder, StandardMaterial, Color3 } from "babylonjs";
import { BLApplication } from "../Application";
import { blackAndWhitePixelShader } from "babylonjs/Shaders/blackAndWhite.fragment";

export class MazeCell {
    protected m_Root: Mesh;
    protected bVisited: boolean;

    protected m_Floor: Mesh;

    /**
     * 
     */
    protected m_WallRoots: Mesh[] = [];

    private m_Index: number = -1;
    private static s_Index: number = 0;


    constructor() {
        MazeCell.s_Index++;
        this.m_Index = MazeCell.s_Index;

        this.Build();
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


}