var init = function(){
    
    loop();
};

const accuracy = 4;
const size = 13;
for(let i = 0; i<size; i++){//width
    for(let j = 0; j<size; j++){//height
        let point = new Point({
            x:50+i*20,
            y:50+j*20, 
            // oldX:99+i*20,
            // oldY:99+j*20,
            locked:(i===0||i===size-1)&&(j===0/*||j===size-1*/)?true:false,
            // show:false,
        });
        points.push(point);
    }
}
for(var i = 0; i<points.length; i++){
    if(i>0&&i<size*size&&i%size!==0/*&&j>0&&j<9*/){
        points[i].connect(points[i-1]);//gets previous point, unless it is the tenth(last) in its row
    }
    if(i<size*size-size){//number in array - number in column
        points[i].connect(points[i+size]);//place in colum plus number in column gets point to right
    }
}

canvas.addEventListener('mousemove',(e)=>{
    if(mouse.pressed){
        // console.log("dragging");
        for(let i = sticks.length-1; i>=0; i--){
            let s = sticks[i];
            if(lineLine(mouse.px,mouse.py,mouse.x,mouse.y,s.p.x,s.p.y,s.p2.x,s.p2.y)){
                sticks.splice(i,1);
            }
        } 
    }
});

init();
function loop(){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "rgb(220,220,220)";
    ctx.fillRect(0,0,width,height);

    //update points     loop(acc){updateSticks, ?consrain points} renderPoints renderSticks
    points.forEach(p=>{
        p.update();
    });
     for(let i = 0; i<accuracy; i++){
        sticks.forEach(s=>{
            s.update();
        });
        points.forEach(p=>{
            p.constrain();
        });
     }
    points.forEach(p=>{
        p.render();
    });
    sticks.forEach(s=>{
        s.render();
    });

    // for(let i = points.length-1; i>=0; i--){
    //     // console.log(points[i]);
    //     points[i].update();
    //     points[i].constrain();
    //     points[i].render();
    // }

    
    // ctx.fillStyle = mouse.pressed?"blue":"purple";
    // ctx.fillRect(mouse.x,mouse.y,20,20);
    
    // ctx.font = '12px serif';
    // ctx.fillStyle = "black"
    // ctx.fillText(`A pressed: ${pressed("a")}`, mouse.x-20, mouse.y);
    
    this.clicked = false;
    frameCount++;
    requestAnimationFrame(loop);    
}