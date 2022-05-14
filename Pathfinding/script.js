/**
 * OPTIONS: set the grid to maze from generation program
 *          use while instead of recursion for faster results
 * IMPLEMENT: while inside of mouse moved
 */

//CANVAS SETUP
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// MOUSE EVENTS
var mouse = {
    x:null,
    y:null,
    pressed: false,
    clicked: false,
};
canvas.onmousedown = function(){
    mouse.pressed=true;
}
canvas.onmouseup = function(){
    mouse.pressed=false;
}
canvas.addEventListener('mousemove',(e)=>{
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});
canvas.addEventListener('click',e => {
    mouse.clicked = true;
})

//FUNCTIONS
var rectPoint = function(px,py,x,y,w,h){
    return(px>x&&px<x+w&&py>y&&py<y+h);
};
var dist = function(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
};
var mDist = function(x1,y1,x2,y2){
    return Math.abs(x2-x1)+Math.abs(y2-y1,2);
};
var createGrid = function(cols,rows,filler){
    var arr = Array.apply(null, Array(rows));
    arr.forEach((el,i,a)=>{
        a[i] = Array.apply(null, Array(cols));
        a[i].forEach((el,i,a)=>{
            if(filler==="rand"){
                a[i] = ~~(Math.random()*10)>1?0:1;
            }else{
                a[i]=filler;
            }
        });
    });
    return arr;
}

//CONSTANTS
const RES = 40;
// const RES = width/40;
const cols = width/RES;
const rows = height/RES;

//GRID ARRAYS
var grid = createGrid(rows,cols,"rand");
var costs = grid.map((el)=>{
    return el.map(()=>{
        return 0;
        // if(el===0||el===1){}
    });
});

//RENDER GRID
var render = function(grid){
    for(var row = 0; row<grid.length; row++){
        for(var col = 0; col<grid[row].length; col++){
            let cell = grid[row][col];

            switch(cell){
                case "start":
                    ctx.fillStyle = "blue";
                break;
                case "end":
                    ctx.fillStyle = "purple";
                break;
                case "closed":
                    ctx.fillStyle = "red";
                break;
                case "found":
                    ctx.fillStyle = "green";
                break;
                case "path":
                    ctx.fillStyle="yellow";
                break;
                default:
                    ctx.fillStyle=cell?"black":"white";     
            }
            if(rectPoint(mouse.x,mouse.y,col*RES,row*RES,RES,RES)){
                ctx.fillStyle = "grey";
            }
            ctx.fillRect(col*RES,row*RES,RES,RES);

            ctx.strokeStyle = "black";
            ctx.stroke();
            ctx.strokeRect(col*RES,row*RES,RES,RES);
        }
    }
    ctx.fillStyle = "black";
    
    for(var row = 0; row<costs.length; row++){
        for(var col = 0; col<costs[row].length; col++){
            for(var i = 0; i<2; i++){
                if(costs[col][row]?.hCost!=undefined){
                    ctx.font = '10px serif';
                    ctx.fillText("G:"+costs[col][row].gCost, row*RES, col*RES+RES/2);
                    ctx.fillText("H:"+costs[col][row].hCost, row*RES+RES-20, col*RES+RES/2);
                    ctx.font = '15px serif';
                    ctx.fillText(costs[col][row].gCost+costs[col][row].hCost, row*RES+RES/2-5, col*RES+RES-2);
                }
            }
        }
    }
}

//EXPLANATION
/**
 * 
 * cur = current position
 * goal = position of the goal
 * 
 * mDist = non diagonal distance
 * 
 * gCost = mDist from start
 * hCost = mDist to end
 * fCost = gCost+hCost
 * 
 * 2D ARRAYS
 * grid = filled with walls and walkways(1,0) except start and end nodes(start,end), eventually contains states of blocks(closed and found)
 * costs = contains cost with current path
 * 
 */

/**
 * 1. start node 
 * 2. set adjacent to found, if already found update gCost to shorter path(if applicable) and update parent  
 * 3. set gCost = parent gCost+1 , hCost = manhattan distance to goal fCost = gCost+hcost  
 * 4. loop through cells,find with lowest fCost, if equal fCost then lowest hCost    
 * 5. set lowest cost to closed(step 2), then to current cell
 *  **/

var numCells = 0;
class Cell{
    constructor(x,y,g,h,p){
        this.x=x;
        this.y=y;
        this.parent=p;
        this.gCost=g;
        this.hCost=h;
        this.fCost=g+h;
        numCells++;
    }

}

// GOAL AND START
var end = new Cell(rows-1,cols-2);
var start = new Cell(2,1,0,mDist(2,1,end.x,end.y));

costs[start.y][start.x]=start;
grid[start.y][start.x]="start";
grid[end.y][end.x]="end";

// FIND NEXT CELLS
var cur = start;
var finished = false;
var last;
var next = function(grid){
    if(!finished){
        if(costs[cur.y][cur.x].gCost!==0){
            grid[cur.y][cur.x]="closed";
        }
        //loop through adjacent 'cells' in grid
        for(var x = -1; x<2; x++){
            for(var y = -1; y<2; y++){
                if(x===0||y===0&&!(x===0&&y===0)){//change to  x===0||y===0&&x!==y
                    let cell = grid?.[cur.y+y]?.[cur.x+x];
                    // console.log(cell);
                    if(cell===0){//if the cell exists on the grid and is equal to 0 or found
                        grid[cur.y+y][cur.x+x]="found";//PUSH TO OPEN CELLS?
                        costs[cur.y+y][cur.x+x]=new Cell(cur.x+x,cur.y+y,costs[cur.y][cur.x].gCost+1,mDist(end.x,end.y,cur.x+x,cur.y+y),cur);
                        // openCells.push(costs[cur.y+y][cur.x+x]);
                    }else if(cell==="found"&&costs[cur.y+y][cur.x+x].fCost>(costs[cur.y][cur.x].gCost+1+mDist(end.x,end.y,cur.x+x,cur.y+y))){
                        costs[cur.y+y][cur.x+x]=new Cell(cur.x+x,cur.y+y,costs[cur.y][cur.x].gCost+1,mDist(end.x,end.y,cur.x+x,cur.y+y),cur);//BUGGY?
                    }else if(cell==="end"){
                        // console.log(cur.x+x,cur.y+y)
                        // last = new Cell(cur.x,cur.y);
                        last = cur;
                        finished=true;
                    }
                }
            }
        }
        var bestOption = new Cell();
        bestOption.gCost = Number.POSITIVE_INFINITY;
        bestOption.hCost = Number.POSITIVE_INFINITY;
        bestOption.fCost = Number.POSITIVE_INFINITY;
        for(var row = 0; row<grid.length; row++){
            for(var col = 0; col<grid[row].length; col++){

                if(costs[col][row].fCost<=bestOption.fCost&&grid[col][row]==="found"){
                    if(costs[col][row].fCost===bestOption.fCost){
                        if(costs[col][row].hCost<bestOption.hCost){
                            bestOption = costs[col][row];
                        }//else if(bestOption.hCost===Number.POSITIVE_INFINITY){
                        //     console.log("a");
                        //     bestOption = costs[col][row];
                        // }
                    }else{
                        bestOption = costs[col][row];           //shorten get rid of else and replace < with > then an always end with bestOption = then the new best costs option
                    }    
                }
            }
        }
        cur=bestOption;
    }else{
        console.log(last);
        console.log(numCells);
        
        do{
            grid[last.y][last.x]="path";
            last=last.parent;
        }while(last?.parent);


    }
    
};


var init = (function(){
    
    loop();
}());


var frameCount = 0;
function loop(){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "rgb(200,200,200)";
    ctx.fill();
    ctx.fillRect(0,0,width,height);

    render(grid);

    //INSTANT
    /*while(!finished){
        next(grid);
    } 
    if(finished){
        next(grid)
    }*/
    //WATCH
    if(!finished){//mouse.clicked){
        next(grid);
        if(finished){
            next(grid);
        }
    }


    mouse.clicked = false;
    frameCount++;
    window.requestAnimationFrame(loop);    
};
