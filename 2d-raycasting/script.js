'user scrict';


/*
In draw rays instead of multiplying by 1000 arbitrarily instead calc rough dist to edge, doesn't matter if it's off afs long as it's fast and isn't UNDER
find better way than checking against all 
individual ray for each point rather than a arbitrarily spaced rays
should boundaries be limited to two and make multiple boundaries for a polygon ORORRRRRR should they contain more and do the same thing in drawRays as in checking ryas against line segments
*/
var createRays = function (numRays) {
    let rays = [];
    let angle = (Math.PI * 2) / numRays;
    for (let i = 0; i < numRays; i++) {
        let v = Vector.fromAngle(angle * i);
        rays.push({ pos: new Vector(200, 200), dir: v });
    }
    return rays;
}
var createBoundaries = function (num) {
    let b = [];
    for (let i = 0; i < num; i++) {
        b.push([new Vector(random(20, width - 20), random(20, height - 20)), new Vector(random(20, width - 20), random(20, height - 20))]);
    }
    return b;
};

var rays = createRays(90);
var boundaries = createBoundaries(3);
boundaries.push([new Vector(350, 100), new Vector(300, 350)], [new Vector(150, 50), new Vector(100, 250)]);
// var boundaries = [[new Vector(350, 100), new Vector(300, 350)], [new Vector(150, 50), new Vector(100, 250)]];//new Vector(350, 300)


var drawBoundaries = function (boundaries) {
    ctx.strokeStyle = "rgb(255,255,255)";
    for (let b of boundaries) {
        ctx.beginPath();
        for (let i = 0; i < b.length; i++) {
            let v = b[i];
            if (i === 0) {
                ctx.moveTo(v.x, v.y);
            } else {
                ctx.lineTo(v.x, v.y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
};



var rayLineSegmentIntersection = function (ray, line) {
    let x1 = line[0].x;
    let y1 = line[0].y;
    let x2 = line[1].x;
    let y2 = line[1].y;

    let x3 = ray.pos.x;
    let y3 = ray.pos.y;
    let x4 = ray.pos.x + ray.dir.x;
    let y4 = ray.pos.y + ray.dir.y;

    let denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) {//the line segment and ray are parallel
        return false;
    }

    let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    let u = ((x1 - x3) * (y1 - y2) - (y1 - y3) * (x1 - x2)) / denom;

    if (t >= 0 && t <= 1 && u >= 0) {
        return new Vector(x1 + (t * (x2 - x1)), y1 + (t * (y2 - y1)));
    }
    return false;
};
var drawRays = function (rays) {
    for (let ray of rays) {
        ctx.beginPath();
        ctx.moveTo(ray.pos.x, ray.pos.y);

        let smallestDist = Infinity;
        let smallPos = false;
        for (let b of boundaries) {
            let inter = rayLineSegmentIntersection(ray, b);
            if (inter) {
                let d = dist(ray.pos.x, ray.pos.y, inter.x, inter.y);
                if (d < smallestDist) {
                    smallestDist = d;
                    smallPos = inter;
                }
            }
        }

        if (smallPos !== false) {
            ctx.lineTo(smallPos.x, smallPos.y);
        } else {
            ctx.lineTo(ray.pos.x + (ray.dir.x * 1000), ray.pos.y + (ray.dir.y * 1000));
        }
        ctx.closePath();
        ctx.stroke();
    }
};
var updateRayPos = function (rays) {
    for (let r of rays) {
        r.pos.x = mouse.x;
        r.pos.y = mouse.y;
    }
};

function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "white";
    drawBoundaries(boundaries);
    updateRayPos(rays);
    drawRays(rays);

    this.clicked = false;
    frameCount++;
    requestAnimationFrame(loop);
}
loop();
// window.addEventListener('load', loop);