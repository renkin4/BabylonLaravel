import { MazeCell } from "./MazeCell";
import { Vector3 } from "babylonjs";

export interface MazeGeneratorProperties{
    width ? : number;
    height ? : number;
}

export class MazeGenerator{
    protected m_Seed : number;

    protected m_Properties : MazeGeneratorProperties;

    protected m_AllCells : Map<number, MazeCell>;

    constructor();
    constructor(property ? : MazeGeneratorProperties);
    constructor(property ? : any){
        this.m_Properties = property ?? {width : 10, height : 10} as MazeGeneratorProperties;
        
        this.m_AllCells = new Map<number, MazeCell>();
    }

    private async Delay(sec) : Promise<void> {
        return new Promise(res => setTimeout(res, 1000 * sec));
    }

    public async Generate() : Promise<void> {
        const delayTimer = 10;
        for (let x = 0; x < this.m_Properties.width; x++) {
            for (let y = 0; y < this.m_Properties.height; y++) {
                await this.Delay(delayTimer);
                let newCell = new MazeCell();
                newCell.SetPosition(new Vector3((x * 1), 0, (y * 1)));

                this.m_AllCells.set((this.m_Properties.width * x) + y, newCell);
                
            }
        }

        console.log(this.m_AllCells);
    }

}