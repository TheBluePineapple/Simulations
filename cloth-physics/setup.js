/** CANVAS SETUP */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

/** USER INPUT */
var mouse = {
    x:null, 
    y:null,
    pressed: false,
    clicked:false,
    px:null,
    py:null,
};
canvas.onmousedown = function(){
    mouse.pressed = true;
}; 
canvas.onmouseup = function(){
    mouse.clicked = true;
    mouse.pressed = false;
};
var rect = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove',(e)=>{
    mouse.px = mouse.x;
    mouse.py = mouse.y;

    mouse.x=e.clientX-rect.left;
    mouse.y=e.clientY-rect.top;
});

var keys = [];
document.addEventListener("keydown",(e)=>{
    keys[e.key.charCodeAt(0)] = true;
});
document.addEventListener("keyup",(e)=>{
    keys[e.key.charCodeAt(0)] = false;
});
var pressed = function(key){
    //console.log(String.fromCharCode("a".charCodeAt(0)));
    if(keys[key.charCodeAt(0)]){
        return true;
    }
    return false;
}


/**SIMULATION LOOP */
let frameCount = 0;