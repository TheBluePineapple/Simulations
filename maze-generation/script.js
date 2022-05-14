//speedup using 
//clamped array: if value is outside range, does endpoints(max/min, whichever closer)
//Unclamped array: takes as many bits as possible and ignores the rest
//unsigned meaning no sign, one lest bit
var canvas = document.getElementById('canvas1');
var ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

var mouse = {
    x:0,
    y:0,
    clicked:false
};
canvas.addEventListener('mousemove',e =>{
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
canvas.onmousedown = function(){
    mouse.clicked = true;
};
var res = canvas.width/40;
var cols = canvas.width/res;
var rows = canvas.height/res;

var rectPoint = function(objx,objy,objw,objh,px,py){
    return px<objx+objw&&px>objx&&py<objy+objh&&py>objy;
}
var deepCopyArray = function(arr) {
    var tempArray = [];
    for (var i = 0; i < arr.length; i++) {
        tempArray.push([].concat(arr[i]));
    }
    return tempArray;
}
var createGrid = function(width, height, filler){
    var result = [];
    for (var i = 0 ; i < width; i++) {
        result[i] = [];
        for (var j = 0; j < height; j++) {
            // result[i][j] = (~~(Math.random()*2));
            result[i][j] = filler;

        }
    }
    return result;
}
var grid = createGrid(rows, cols, 1);
var nums = createGrid(rows, cols, '');

var render = function(grid){
    for(var col = 0; col<grid.length; col++){
        for(var row = 0; row<grid[col].length; row++){
            switch(grid[row][col]){
                case "start":
                    ctx.fillStyle = "green";
                break;
                case "end":
                    ctx.fillStyle = "red";
                break;
                case "stop":
                    ctx.fillStyle = "grey";
                break;
                default: ctx.fillStyle = grid[row][col]?"black":"white";

            }
            // ctx.strokeStyle = "black";
            ctx.fillRect(col*res,row*res,res,res);
        }
    }
};

    /**
     * TODO:
     * implement grey colored dead ends
     * implement final dead end as goal 
     * 
     * POINT at current position, point at last position, point in between to 0, (corners? if old piont is not 0 set to 0)
     * 
     * 1. find all legal directions(!visited, on map)
     * 2.choose direction randomly move two spaces(put number on space go back to 1)
     * 3.if no legal directions, search in each direction fo square with 1 less than the number of the current space, move there go back to 1
     * 4. if no spaces next to you with a number that is one less than yours, then maze is complete
     * 
     * nums[pos.y][pos.x]-1===nums[pos.y-2][pos.x]
     * 
     * Notes:
     * Keep track of most recent dead end, final dead end is the goal 
     * 
     * Architecture
     * 
     * **/
    var pos = {
        x:1, 
        y:0
    };//the position(purple block)
    var old = {};//initialize old outside nextGen scope so it's available in draw
    var iters = 0;
    var nextGeneration = function(grid){
        var next = deepCopyArray(grid);
        let legal = [];//list of legal moves
        //last position(blue block)
        old = {
            x:pos.x,
            y:pos.y,
        };

        //find all legal moves
        for(var x = -2; x<=2; x+=4){
            //if the next position is(greater than 0, less than max, pos exists, and it equals one)
            if(x+pos.x>=0&&x+pos.x<cols&&next?.[pos.y][x+pos.x]&&next[pos.y][pos.x+x]===1){
                legal.push([pos.x+x,pos.y]);//push that position into the array
            }
        }
        for(var y = -2; y<=2; y+=4){
            if(y+pos.y>=0&&y+pos.y<rows&&next?.[y+pos.y][pos.x]&&next[pos.y+y][pos.x]===1){
                legal.push([pos.x,pos.y+y]);
            }
        }

        
        if(legal.length>0){
             //choose a random legal move
            let r = ~~(Math.random()*legal.length);
            pos.x=legal[r][0];
            pos.y=legal[r][1];
            
            // nums[pos.y][pos.x]=1;
            if(nums[pos.y][pos.x]===''){
                nums[pos.y][pos.x]=iters;
                iters++;//only increase if already doesn't have number
            }
        }else{
            var done = false;
            //mark space as dead end(grey), go to ajacent cell with number one less, leave old{} at dead end, if maze is completed, old becomes goal(red)
            //if no spaces near have a number one less than you, maze is complete
            for(var x = -2; x<=2; x+=4){
                //if the next position is(greater than 0, less than max, pos exists, and it equals one)
                if(x+pos.x>=0&&x+pos.x<cols&&nums?.[pos.y][x+pos.x]/*&&nums[pos.y][pos.x]>nums[pos.y][pos.x+x]*/&&nums[pos.y][pos.x]-1===nums[pos.y][pos.x+x]){
                    pos.x += x;
                    done=true;
                    // console.log(grid);
                }
            }
            if(!done){
                for(var y = -2; y<=2; y+=4){
                    if(y+pos.y>=0&&y+pos.y<rows&&nums?.[y+pos.y][pos.x]/*&&nums[pos.y][pos.x]>nums[pos.y+y][pos.x]*/&&nums[pos.y][pos.x]-1===nums[pos.y+y][pos.x]){
                        pos.y += y;
                    }
                }
            }
            iters = nums[pos.y][pos.x]+1;//double number
        }
        
        grid[(old.y+pos.y)/2][(old.x+pos.x)/2]=0;//set space between current and last position to zero
        grid[old.y][old.x]=0; //set last position to zero(for corners)
        
        grid = next;

};


var init = function(){
    ctx.font = '12px serif';
    draw();
};
init();

var frameCount = 0;
function draw(){
    if(frameCount%1===0){
        nextGeneration(grid);
    }
    if(mouse.clicked){
        console.log(grid);
    }
    grid[0][0]="start";
    // grid[rows-1][cols-1]="end";
    render(grid);
    
    ctx.fillStyle = "blue";
    ctx.fillRect(old.x*res,old.y*res,res,res);

    ctx.fillStyle="purple";
    ctx.fillRect(pos.x*res,pos.y*res,res,res)
    
    for(var col = 0; col<nums.length; col++){
        for(var row = 0; row<nums[col].length; row++){
            ctx.fillStyle = "black";
            ctx.fillText(nums[row][col],col*res+res/2,row*res+res/2);
        }
    }
    
    mouse.clicked=false;
    frameCount++;
    window.requestAnimationFrame(draw);
};
