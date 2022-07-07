'user scrict';
ctx.imageSmoothingEnabled = false;

/*
draw player
keypressed, move player
map width,height,z
create map array
draw map
*/
var DEG = (Math.PI / 180);
var mapX = 8, mapY = 8, mapZ = 64;
var map = [
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 1, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 2, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
];
var p = {
    x: 256,
    y: 256,
    z: 10,
    a: 0,
};
var roundTo = function (num, roundTo) {
    return Math.floor(num / roundTo) * roundTo;
}
var drawPlayer = function () {
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.translate(p.x, p.y);
    ctx.rotate(p.a);
    // ctx.fillRect(-p.z / 2, -p.z / 2, p.z, p.z);
    ctx.beginPath();
    ctx.rect(-p.z / 2, -p.z / 2, p.z, p.z);
    ctx.moveTo(p.z / 2, 0);
    ctx.lineTo(p.z * 1.75, 0);
    ctx.closePath();
    // ctx.fill();
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // ctx.fillRect(p.x + (p.z / 2) + (Math.cos(p.a) * 1.75), p.y + (p.z / 2) + (Math.sin(p.a)), 10, 10);
};
var updatePlayer = function () {
    if (pressed("w")) {
        p.x += Math.cos(p.a) * 2;//magic number *2 for speed
        p.y += Math.sin(p.a) * 2;
    } else if (pressed("s")) {
        p.x -= Math.cos(p.a) * 2;
        p.y -= Math.sin(p.a) * 2;
    }
    if (pressed("a")) {
        p.a -= 0.075; // magic number for speed of rotation
        if (p.a < 0) {
            p.a += 2 * Math.PI;
        }
    } else if (pressed("d")) {
        p.a += 0.075;
        if (p.a > Math.PI * 2) {
            p.a = 0;
        }
    }
};
var drawMap = function () {
    for (let y = 0; y < mapY; y++) {
        for (let x = 0; x < mapX; x++) {
            switch (map[y * mapX + x]) {
                case 1:
                    ctx.fillStyle = "rgb(0,0,0)";
                    break;
                case 2:
                    ctx.fillStyle = "rgb(200,20,0)";
                    break;
                default:
                    ctx.fillStyle = "rgb(255,255,255)";
                    break;
            }
            // if (map[y * mapX + x] === 1) {
            //     ctx.fillStyle = "rgb(0,0,0)";
            // } else if (map[y * mapX + x] === 2) {
            //     ctx.fillStyle = "rgb(200,20,0)";
            // } else {
            //     ctx.fillStyle = "rgb(255,255,255)";
            // }
            ctx.strokeRect(x * mapZ, y * mapZ, mapZ, mapZ);
            ctx.fillRect(x * mapZ, y * mapZ, mapZ, mapZ);
        }
    }
};

var raycasting = function () {//check if map index is greater than zero? I did >-1
    var fov = 60;
    let rayAngle = p.a - (DEG * (fov / 2));//move ray back 30 degrees
    //set limits
    // if (rayAngle < 0) {
    //     rayAngle += 2 * Math.PI;
    // }
    // if (rayAngle > Math.PI * 2) {
    //     rayAngle = 0;
    // }
    if (rayAngle < 0) {
        rayAngle += 2 * Math.PI;
    }
    if (rayAngle > Math.PI * 2) {
        rayAngle -= Math.PI * 2;
    }
    for (let ray = 0; ray < fov; ray++) {
        var blockType, totalDist, dof = 0, aTan = -1 / Math.tan(rayAngle), nTan = -Math.tan(rayAngle), rx, ry, xOffset = 0, yOffset = 0;

        //HORIZONTAL
        var horX = p.x, horY = p.y, horDist = Infinity, horType;
        if (rayAngle > Math.PI) {//looking up
            ry = roundTo(p.y, mapZ); //find the next largest divisible by mapZ
            // ry = ~~(((p.y >> 6) << 6) - 0.0001);

            // rx = (ry-p.y) * Math.tan(rayAngle) + p.x;
            // rx = p.x + Math.atan2(ry, p.a)
            // rx = (p.y - ry) * aTan + p.x; //I DON'T UNDERSTAND WHY THIS WORKS
            rx = (aTan * (p.y - ry)) + p.x; //seems like this should work but it doesnt
            // rx = p.x + Math.atan2(ry, Math.PI / 2 - rayAngle);
            // rx = (p.y - ry) * aTan + p.x;

            yOffset = -64;
            xOffset = -yOffset * aTan;

            // ctx.fillStyle = "black";
            // ctx.fillRect(rx, ry, 10, 10);
        }
        if (rayAngle < Math.PI) {//looking up
            ry = roundTo(p.y, mapZ) + mapZ; //find the next largest divisible by mapZ
            // ry = ~~((p.y >> 6) << 6) + 64;
            rx = (aTan * (p.y - ry)) + p.x; //seems like this should work but it doesnt

            yOffset = 64;
            xOffset = -yOffset * aTan;

            // ctx.fillStyle = "black";
            // ctx.fillRect(rx, ry, 10, 10);
        }
        if (rayAngle === 0 || rayAngle === Math.PI * 2) {//looking directly left or righta
            rx = p.x;
            ry = p.y;
            dof = 8;
        }
        //increment ray length
        while (dof < 8) {
            var mapIndexX = ~~(rx / mapZ); //he truncates with type casting
            var mapIndexY = ~~(ry / mapZ); //gets x position in 2d
            if (rayAngle > Math.PI) {
                mapIndexY--;
            }
            // var mapIndexX = ~~(rx) >> 6;
            // var mapIndexY = ~~(ry) >> 6;
            var mapIndex = mapIndexY * mapX + mapIndexX; //gets index in 1d 

            // console.log(mapIndex)
            // console.log(mapIndex)
            if (mapIndex < mapX * mapY && mapIndex > -1 && map[mapIndex] > 0) {//check if it is a block and in the array
                dof = 8;
                horX = rx;
                horY = ry;
                horDist = dist(horX, horY, p.x, p.y);
                horType = map[mapIndex];
            } else {
                rx += xOffset;
                ry += yOffset;
            }
            dof++;
        }
        //draw
        // ctx.strokeStyle = "green";
        // ctx.lineWidth = 10;
        // ctx.beginPath();
        // ctx.moveTo(p.x, p.y);
        // ctx.lineTo(rx, ry);
        // ctx.closePath();
        // ctx.stroke();

        //VERTICAL
        var vertX = p.x, vertY = p.y, vertDist = Infinity, vertType;
        dof = 0;//reset depth to zero as we havent incremented ray yet
        if (rayAngle > Math.PI / 2 && rayAngle < (Math.PI * 3) / 2) {//looking left
            rx = roundTo(p.x, mapZ); //find the next largest divisible by mapZ
            ry = (nTan * (p.x - rx)) + p.y; //seems like this should work but it doesnt

            xOffset = -64;
            yOffset = -xOffset * nTan;

            // ctx.fillStyle = "black";
            // ctx.fillRect(rx, ry, 10, 10);
        }
        if (rayAngle < Math.PI / 2 || rayAngle > (Math.PI * 3) / 2) {//looking rigth
            rx = roundTo(p.x, mapZ) + mapZ; //find the next largest divisible by mapZ
            ry = (nTan * (p.x - rx)) + p.y; //seems like this should work but it doesnt

            xOffset = 64;
            yOffset = -xOffset * nTan;

            // ctx.fillStyle = "black";
            // ctx.fillRect(rx, ry, 10, 10);
        }
        if (rayAngle === 0 || rayAngle === Math.PI * 2) {//looking up or down
            rx = p.x;
            ry = p.y;
            dof = 8;
        }
        //increment ray length
        while (dof < 8) {
            var mapIndexX = ~~(rx / mapZ); //he truncates with type casting
            var mapIndexY = ~~(ry / mapZ); //gets x position in 2d
            if (rayAngle > Math.PI / 2 && rayAngle < (Math.PI * 3) / 2) {
                mapIndexX--;
            }
            var mapIndex = mapIndexY * mapX + mapIndexX; //gets index in 1d 

            if (mapIndex < mapX * mapY && mapIndex > -1 && map[mapIndex] > 0) {//check if it is a block and in the array
                dof = 8;
                vertX = rx;
                vertY = ry;
                vertDist = dist(vertX, vertY, p.x, p.y);
                vertType = map[mapIndex];
            } else {
                rx += xOffset;
                ry += yOffset;
            }
            dof++;
        }

        //determine which ray was shorter
        if (horDist < vertDist) {
            rx = horX;
            ry = horY;
            blockType = horType;
            totalDist = horDist;
            switch (blockType) {
                case 1:
                    ctx.strokeStyle = "rgb(25,100,150)";
                    break;
                case 2:
                    ctx.strokeStyle = "rgb(200,20,0)";
                    break;
                default:
                    ctx.strokeStyle = "rgb(0,0,0)";
                    break;
            }
        } else {
            rx = vertX;
            ry = vertY;
            blockType = vertType;
            totalDist = vertDist;
            switch (blockType) {
                case 1:
                    ctx.strokeStyle = "rgb(25,150,100)";
                    break;
                case 2:
                    ctx.strokeStyle = "rgb(100,40,0)";
                    break;
                default:
                    ctx.strokeStyle = "rgb(20,20,0)";
                    break;
            }
        }


        //draw rays
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(rx, ry);
        ctx.closePath();
        ctx.stroke();



        //DRAW WALLS window(320x160)
        var correctedDistance = Math.cos(p.a - rayAngle) * totalDist;//SET LIMITS?????
        var lineHeight = (mapZ * height) / correctedDistance;
        lineHeight = min(lineHeight, height);
        var lineWidth = 8;
        var vertOffset = (height - lineHeight) / 2;
        //draw line every eigth pixel, shift to right, offset to center of screen
        ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = "purple";
        ctx.beginPath();
        ctx.moveTo(ray * lineWidth + (mapZ * mapX) + (lineWidth / 2), vertOffset);
        ctx.lineTo(ray * lineWidth + (mapZ * mapX) + (lineWidth / 2), vertOffset + lineHeight);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;




        //move next angle one degree away from this one
        rayAngle += DEG;
        //set limits again
        if (rayAngle < 0) {
            rayAngle += 2 * Math.PI;
        }
        if (rayAngle > Math.PI * 2) {
            rayAngle -= Math.PI * 2;
        }
    }


}

function loop() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(220,220,220)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "black"
    drawMap();
    drawPlayer();
    updatePlayer();
    raycasting();
    // ctx.fillStyle = "black"
    // ctx.beginPath();
    // ctx.rect(frameCount, 10, 10, 10);
    // ctx.closePath();
    // ctx.fill();

    updateLoop();
}
loop();
// window.addEventListener('load', loop);