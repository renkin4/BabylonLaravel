import { MazeCell } from "./MazeCell";
import { Vector3 } from "babylonjs";

export interface MazeGeneratorProperties{
    width ? : number;
    height ? : number;
    generateDelay ? :number;
}

export class MazeGenerator{
    protected m_Seed : number;

    protected m_Properties : MazeGeneratorProperties;

    protected m_AllCells : Map<number, MazeCell>;

    private m_GenerateProperties : {x , y} = {x : 0, y : 0};

    constructor();
    constructor(property ? : MazeGeneratorProperties);
    constructor(property ? : any){
        this.m_Properties = property ?? {width : 10, height : 10, generateDelay : 250} as MazeGeneratorProperties;
        
        this.m_AllCells = new Map<number, MazeCell>();
    }

    public async Generate() : Promise<void> {
        // Finish
        if(this.m_GenerateProperties.x > this.m_Properties.width){
            this.m_GenerateProperties.x = 0;
            this.m_GenerateProperties.y = 0;

            return;
        }

        // Recurse
        if(this.m_GenerateProperties.y > this.m_Properties.height){
            this.m_GenerateProperties.x += 1;
            this.m_GenerateProperties.y = 0;

            await setTimeout(this.Generate.bind(this), this.m_Properties.generateDelay);
            return;
        }

        let newCell = new MazeCell();
        newCell.SetPosition(new Vector3((this.m_GenerateProperties.x * 1), 0, (this.m_GenerateProperties.y * 1)));

        this.m_AllCells.set((this.m_Properties.width * this.m_GenerateProperties.x) + this.m_GenerateProperties.y, newCell);
        
        this.m_GenerateProperties.y += 1;

        await setTimeout(this.Generate.bind(this), this.m_Properties.generateDelay);
        console.log(this.m_GenerateProperties);
    }

}