const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

var mouse = {
    x:null,
    y:null,
    pressed: false,
    clicked:false,
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
function map(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
}
var PVector = PVector = (function() {
    function PVector(x, y, z) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
    }

    PVector.fromAngle = function(angle, v) {
      if (v === undef || v === null) {
        v = new PVector();
      }
      // XXX(jeresig)
      v.x = p.cos(angle);
      v.y = p.sin(angle);
      return v;
    };

    PVector.random2D = function(v) {
      return PVector.fromAngle(Math.random() * 360, v);
    };

    PVector.random3D = function(v) {
      var angle = Math.random() * 360;
      var vz = Math.random() * 2 - 1;
      var mult = Math.sqrt(1 - vz * vz);
      // XXX(jeresig)
      var vx = mult * p.cos(angle);
      var vy = mult * p.sin(angle);
      if (v === undef || v === null) {
        v = new PVector(vx, vy, vz);
      } else {
        v.set(vx, vy, vz);
      }
      return v;
    };

    PVector.dist = function(v1, v2) {
      return v1.dist(v2);
    };

    PVector.dot = function(v1, v2) {
      return v1.dot(v2);
    };

    PVector.cross = function(v1, v2) {
      return v1.cross(v2);
    };

    PVector.sub = function(v1, v2) {
      return new PVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    };

    PVector.angleBetween = function(v1, v2) {
      // XXX(jeresig)
      return p.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    };

    PVector.lerp = function(v1, v2, amt) {
      // non-static lerp mutates object, but this version returns a new vector
      var retval = new PVector(v1.x, v1.y, v1.z);
      retval.lerp(v2, amt);
      return retval;
    };

    // Common vector operations for PVector
    PVector.prototype = {
      set: function(v, y, z) {
        if (arguments.length === 1) {
          this.set(v.x || v[0] || 0,
                   v.y || v[1] || 0,
                   v.z || v[2] || 0);
        } else {
          this.x = v || 0;
          this.y = y || 0;
          this.z = z || 0;
        }
      },
      get: function() {
        return new PVector(this.x, this.y, this.z);
      },
      mag: function() {
        var x = this.x,
            y = this.y,
            z = this.z;
        return Math.sqrt(x * x + y * y + z * z);
      },
      magSq: function() {
        var x = this.x,
            y = this.y,
            z = this.z;
        return (x * x + y * y + z * z);
      },
      setMag: function(v_or_len, len) {
        if (len === undef) {
          len = v_or_len;
          this.normalize();
          this.mult(len);
        } else {
          var v = v_or_len;
          v.normalize();
          v.mult(len);
          return v;
        }
      },
      add: function(v, y, z) {
        if (arguments.length === 1) {
          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
        } else {
          this.x += v;
          this.y += y;
          this.z += z;
        }
      },
      sub: function(v, y, z) {
        if (arguments.length === 1) {
          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
        } else {
          this.x -= v;
          this.y -= y;
          this.z -= z;
        }
      },
      mult: function(v) {
        if (typeof v === 'number') {
          this.x *= v;
          this.y *= v;
          this.z *= v;
        } else {
          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
        }
      },
      div: function(v) {
        if (typeof v === 'number') {
          this.x /= v;
          this.y /= v;
          this.z /= v;
        } else {
          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
        }
      },
      rotate: function(angle) {
        var prev_x = this.x;
        var c = p.cos(angle);
        var s = p.sin(angle);
        this.x = c * this.x - s * this.y;
        this.y = s * prev_x + c * this.y;
      },
      dist: function(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
      },
      dot: function(v, y, z) {
        if (arguments.length === 1) {
          return (this.x * v.x + this.y * v.y + this.z * v.z);
        }
        return (this.x * v + this.y * y + this.z * z);
      },
      cross: function(v) {
        var x = this.x,
            y = this.y,
            z = this.z;
        return new PVector(y * v.z - v.y * z,
                           z * v.x - v.z * x,
                           x * v.y - v.x * y);
      },
      lerp: function(v_or_x, amt_or_y, z, amt) {
        var lerp_val = function(start, stop, amt) {
          return start + (stop - start) * amt;
        };
        var x, y;
        if (arguments.length === 2) {
          // given vector and amt
          amt = amt_or_y;
          x = v_or_x.x;
          y = v_or_x.y;
          z = v_or_x.z;
        } else {
          // given x, y, z and amt
          x = v_or_x;
          y = amt_or_y;
        }
        this.x = lerp_val(this.x, x, amt);
        this.y = lerp_val(this.y, y, amt);
        this.z = lerp_val(this.z, z, amt);
      },
      normalize: function() {
        var m = this.mag();
        if (m > 0) {
          this.div(m);
        }
      },
      limit: function(high) {
        if (this.mag() > high) {
          this.normalize();
          this.mult(high);
        }
      },
      heading: function() {
        // XXX(jeresig)
        return -p.atan2(-this.y, this.x);
      },
      heading2D: function() {
        return this.heading();
      },
      toString: function() {
        return "[" + this.x + ", " + this.y + ", " + this.z + "]";
      },
      array: function() {
        return [this.x, this.y, this.z];
      }
    };

    function createPVectorMethod(method) {
      return function(v1, v2) {
        var v = v1.get();
        v[method](v2);
        return v;
      };
    }

    // Create the static methods of PVector automatically
    // We don't do toString because it causes a TypeError
    //  when attempting to stringify PVector
    for (var method in PVector.prototype) {
      if (PVector.prototype.hasOwnProperty(method) && !PVector.hasOwnProperty(method) &&
            method !== "toString") {
        PVector[method] = createPVectorMethod(method);
      }
    }

    return PVector;
  }());



let eq = 0;
class Particle {
    constructor(pos,r,h){
        this.pos = pos;
        this.r = r+1;
        this.h = `hsl(${h},100%,50%)`;
        //when go off screen move back to og position
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.h;
        ctx.arc(this.pos.x, this.pos.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        // ctx.strokeStyle="rgb(0,0,0)";
        // let mapX = map(this.pos.x,0,width,-width/2,width/2)
        // let mapY = map(this.pos.y,0,height,-height/2,height/2);
        // ctx.moveTo(this.pos.x,this.pos.y);
        // // let m = PVector.add(this.pos,this.pos.x,this.pos.y);
        // // console.log(m)
        // // ctx.lineTo(this.pos.x+mapY,this.pos.y+mapX);
        // ctx.lineTo(this.pos.x+mapY,this.pos.y+mapX);
        // ctx.stroke();
    }
    update(){
        let mapX = map(this.pos.x,0,width,-width/2,width/2)/50;
        let mapY = map(this.pos.y,0,height,-height/2,height/2)/50;
        switch (eq){
          case 0:
            this.pos.x+=1/mapY;
            this.pos.y+=mapX;
          break;
          case 1:
            this.pos.x+=1/mapY;
            this.pos.y+=1/mapX;
          break;
          case 2: 
            this.pos.x+=mapY+mapX;
            this.pos.y+=mapX*mapX;
          break;
          case 3: 
            this.pos.x+=mapX;
            this.pos.y+=mapY*(mapX*mapX);
          break;
          case 4: 
            this.pos.x+=1/mapX;
            this.pos.y+=(mapX*mapX)/mapY;
          break;
          case 5: 
            this.pos.x+=mapY*mapY;
            this.pos.y+=Math.sqrt(mapX);
          break;
          case 6: 
            this.pos.x+=mapY/mapX;
            this.pos.y+=mapX;
          break;
          case 7:
            this.pos.x+=1/(mapY*mapY);
            this.pos.y+=1/(mapX*mapX);
          break;
          default:
            this.pos.x+=mapY;
            this.pos.y+=mapX*mapY;
          break;
        }
        
    }
}
let blend = false;
let density = 60;
let particles = [];
for(let i = 0; i<density; i++){
    for(let j = 0; j<density; j++){
        particles.push(new Particle(new PVector(i*(width/density)+width/density/2,j*(height/density)+height/density/2),width/density/2,map(i+j+5*Math.random(),0,density+density-10,0,255)))
    }
}

function loop(){
  if(pressed(" ")){
    blend=false;
  }else {
    blend=true;
  }
  if(blend===false){
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle = "rgb(220,220,220)";
    ctx.fillRect(0,0,width,height);
  }
    for(let i = 0; i<particles.length; i++){
        particles[i].draw();
        particles[i].update();
    }
    if(mouse.clicked){
      ctx.clearRect(0,0,width,height);
      ctx.fillStyle = "rgb(220,220,220)";
      ctx.fillRect(0,0,width,height);
      eq++;
      particles = [];
      for(let i = 0; i<density; i++){
        for(let j = 0; j<density; j++){
          particles.push(new Particle(new PVector(i*(width/density)+width/density/2,j*(height/density)+height/density/2),width/density/2,map(i+j+5*Math.random(),0,density+density-10,0,255)))
        }
      }
    }
    // ctx.fillStyle = mouse.pressed?"blue":"purple";
    // ctx.fillRect(mouse.x,mouse.y,20,20);    
    // ctx.font = '12px serif';
    // ctx.fillStyle = "black"
    // ctx.fillText(`A pressed: ${pressed("a")}`, mouse.x-20, mouse.y);
    
    mouse.clicked = false;
    frameCount++;
    requestAnimationFrame(loop);    
}

let frameCount = 0;
var init = function(){
    ctx.fillStyle = "rgb(220,220,220)";
    ctx.fillRect(0,0,width,height);
    loop();
};
init();
