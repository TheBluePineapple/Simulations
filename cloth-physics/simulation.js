/**SIMULATION FUNCTIONS */
var distance  = (x,y,x2,y2)=>{
    return Math.sqrt(Math.pow(x2-x,2)+Math.pow(y2-y,2));
}
var lineLine = function(x1,y1,x2,y2,x3,y3,x4,y4){
    var a = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    var b = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    return (a<=1&&a>0&&b<=1&&b>=0)?true:false;
};

/**
 * TODO: findout why points were spaced weird, line wasn't straight
 */

/**find distance between two points, how much longer is the stick than the difference, 
 * then divide the difference by half the distance between the points
 *  offset = xdist*lastNum ydist*lastnum   
 * if its not locked subtract first position by offset,
 *  if second point not locked add offset */
var sticks = [];
class Stick{
    constructor(opt){
        this.p = opt.p;
        this.p2 = opt.p2;
        this.len = opt.length;
    }
    update(){
        let distX = this.p2.x-this.p.x;
        let distY = this.p2.y-this.p.y;
        let distance = Math.sqrt(distX*distX+distY*distY);
        let difference = this.len-distance;
        let percent = difference / distance / 2
        let offsetX = distX*percent;
        let offsetY = distY*percent;
// console.log(offsetX)
        if(!this.p.locked){
            this.p.x -= offsetX;
            this.p.y -= offsetY;
        }
        if(!this.p2.locked){
            this.p2.x += offsetX;
            this.p2.y += offsetY;
        }

    }
    render(){
        ctx.beginPath();       // Start a new path
        ctx.moveTo(this.p.x, this.p.y);    // Move the pen to (30, 50)
        ctx.lineTo(this.p2.x, this.p2.y);  // Draw a line to (150, 100)
        ctx.stroke();    
    }

}


/** CONSTANTS */
const collisionFric = 0.9;
const fric = 0.999;
const grav = 0.12;//.12

var points = [];
class Point{
    constructor(opt){
        this.x=opt.x;
        this.y=opt.y;

        this.oldX=opt.oldX??this.x;
        this.oldY=opt.oldY??this.y;

        this.locked = opt.locked||false;
        this.show = opt.show??true;
    }
    update(){
        let vx = (this.x-this.oldX)*fric;
        let vy = (this.y-this.oldY)*fric;
        
        this.oldX = this.x;
        this.oldY = this.y;

        if(!this.locked){
            this.x+=vx;
            this.y+=vy;
            this.y+=grav;
        }
    }
    constrain(){
        let vx = (this.x-this.oldX)*fric;
        let vy = (this.y-this.oldY)*fric;

        if(this.x>width){
            this.x = width;
            this.oldX = this.x+vx*collisionFric;
        }else if(this.x<0){
            this.x = 0;
            this.oldX = this.x+vx*collisionFric;
        }
        
        if(this.y>height){
            this.y = height;
            this.oldY = this.y+vy*collisionFric;
        }else if(this.y<0){
            this.y = 0;
            this.oldY = this.y+vy*collisionFric;
        }
    }
    render(){
        if(this.show){
            ctx.fillStyle=this.locked?"red":"green";
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3.5, 0, 2 * Math.PI);
            // ctx.stroke();
            ctx.fill();
        }
    }
    connect(point){
        sticks.push(new Stick({
            p:this,
            p2:point,
            length: distance(this.x,this.y,point.x,point.y),
        }));
    }

}