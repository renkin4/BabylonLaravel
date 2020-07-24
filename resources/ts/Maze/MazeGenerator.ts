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

    protected m_CurrentVisitCell : MazeCell;
    protected m_PreviousVisitCell : MazeCell;

    protected m_StackCell : MazeCell[] = [];

    private m_GenerateProperties : {x , y} = {x : 0, y : 0};

    constructor();
    constructor(property ? : MazeGeneratorProperties);
    constructor(property ? : any){
        this.m_Properties = property ?? {width : 10, height : 10, generateDelay : 0} as MazeGeneratorProperties;
        
        this.m_AllCells = new Map<number, MazeCell>();
    }

    public async Generate() : Promise<void> {
        // Finish
        if(this.m_GenerateProperties.x > this.m_Properties.width){
            this.m_GenerateProperties.x = 0;
            this.m_GenerateProperties.y = 0;

            this.NotifyAllNeighbour();
            this.StartCreateMaze();
            return;
        }

        // Recurse
        if(this.m_GenerateProperties.y > this.m_Properties.height){
            this.m_GenerateProperties.x += 1;
            this.m_GenerateProperties.y = 0;

            await setTimeout(this.Generate.bind(this), this.m_Properties.generateDelay);
            return;
        }

        let cellIndex = (this.m_Properties.width * this.m_GenerateProperties.x) + this.m_GenerateProperties.y;

        let newCell = new MazeCell(cellIndex);
        newCell.SetPosition(new Vector3((this.m_GenerateProperties.x * 1), 0, (this.m_GenerateProperties.y * 1)));

        this.m_AllCells.set(cellIndex, newCell);
        
        this.m_GenerateProperties.y += 1;

        await setTimeout(this.Generate.bind(this), this.m_Properties.generateDelay);
    }

    protected NotifyAllNeighbour() : void {
        
        for(let cells of this.m_AllCells.values()){
            // Hack
            if(this.m_AllCells.has(cells.GetIndex - 1)){
                this.m_AllCells.get(cells.GetIndex - 1).NotifyNeighbour(cells.GetIndex, cells);
            }
            if(this.m_AllCells.has(cells.GetIndex + 1)){
                this.m_AllCells.get(cells.GetIndex + 1).NotifyNeighbour(cells.GetIndex, cells);
            }
            if(this.m_AllCells.has(cells.GetIndex + 10)){
                this.m_AllCells.get(cells.GetIndex + 10).NotifyNeighbour(cells.GetIndex, cells);
            }
            if(this.m_AllCells.has(cells.GetIndex - 10)){
                this.m_AllCells.get(cells.GetIndex - 10).NotifyNeighbour(cells.GetIndex, cells);
            }
        }

        // console.log(this.m_AllCells);
    }

    protected async StartCreateMaze() : Promise<void>{
        this.VisitCells();
    }

    private VisitCells() : number {
        let currentIndex = -1;

        if(this.m_CurrentVisitCell == null){
            currentIndex = Math.floor(Math.random() * (this.m_AllCells.size));
            this.m_CurrentVisitCell = this.m_AllCells.get(currentIndex);
            this.m_CurrentVisitCell.Visit();
        }
        else{
            currentIndex = this.m_CurrentVisitCell.GetIndex;
        }

        let bHasNeighbourLeft = false;
        // Check if Current Cell still has any left over unvisited 
        for(let cell of this.m_CurrentVisitCell.GetNeighbour.values()){
            bHasNeighbourLeft = !cell.GetVisited;
            if(bHasNeighbourLeft) break;
        }

        // for now 
        if(!bHasNeighbourLeft) return;

        let currentCell = this.m_CurrentVisitCell;
        let nextCellIndex = Math.floor(Math.random() * this.m_CurrentVisitCell.GetNeighbour.size);
        let nextCell = this.m_CurrentVisitCell.GetRandomNeighbour(nextCellIndex);
        
        if(nextCell.GetVisited){
            return this.VisitCells();
        }
        
        this.m_CurrentVisitCell.RemoveWall(nextCellIndex);

        this.m_PreviousVisitCell = this.m_CurrentVisitCell;
        this.m_CurrentVisitCell = nextCell;

        this.m_CurrentVisitCell.RemoveWall(nextCellIndex + 2 % 4);

        this.m_PreviousVisitCell.UnVisit();
        this.m_CurrentVisitCell.Visit();

        setTimeout(() => {
            this.VisitCells();
        }, 1000);
        return currentIndex;
    }


}