var canvas = document.getElementById("canvas1");
var ctx = canvas.getContext('2d');
var video;
ctx.imageSmoothingEnabled = false;

var width = canvas.width;
var height = canvas.height;

var scaler = 0.8;
let imgSize = { x: 0, y: 0, width: 0, height: 0 };
// var init = function () {
let promise = navigator.mediaDevices.getUserMedia({
    video: {
        // width: { ideal: 32 },
        // height: { ideal: 32 },

    }
});
promise.then((signal) => {
    video = document.createElement("video");
    video.srcObject = signal;
    video.play();
    video.onloadeddata = () => {
        window.addEventListener('resize', resizeVideo);
        resizeVideo();
        draw();
    }
})
    .catch((err) => {
        prompt("Camera Error: " + err);
    });
// };
var resizeVideo = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;

    let resizer = scaler * Math.min(window.innerHeight / video.videoHeight, window.innerWidth / video.videoWidth);
    imgSize.width = resizer * video.videoWidth;
    imgSize.height = resizer * video.videoHeight;
    imgSize.x = window.innerWidth / 2 - imgSize.width / 2;
    imgSize.y = window.innerHeight / 2 - imgSize.height / 2;
}
function map(value, a, b, c, d) {
    // first map value from (a..b) to (0..1)
    value = (value - a) / (b - a);
    // then map it from (0..1) to (c..d) and return it
    return c + value * (d - c);
}
/*
Fix image size, order of for loops
Fix oposite 0,len len,0

*/

var asciiDiv = document.getElementById('ascii');
const density = "Ñ@#W$910?!abc;:+=-,..__                     ";
// const density = "████████▓▒░─        ";
var copyAscii = function () {
    let text = asciiDiv.innerText;
    // text.replaceAll("&nbsp;", " ");
    // text.replaceAll("<br/>", "/n");
    // console.log(text); //LINE BREAKING NOT WORKING
    navigator.clipboard.writeText(text).then(function () {
        console.log("Ascii Image Copied to Clipboard");
    }, function (err) {
        prompt("Error: " + err);

    });
};
var imageToAscii = function (pixels) {
    var asciiImage = "<br/><br/>";
    for (let j = 0; j < pixels.height; j++) {
        for (let i = 0; i < pixels.width; i++) {
            let pixel = (i + j * pixels.width) * 4;
            let r = pixels.data[pixel + 0];
            let g = pixels.data[pixel + 1];
            let b = pixels.data[pixel + 2];
            let avg = (r + g + b) / 3;
            let char = density.charAt(Math.floor(map(avg, 0, 255, 0, density.length)));
            if (char == "" || char == " ") {
                asciiImage += "&nbsp;";
            } else {
                asciiImage += char;
            }
        }
        asciiImage += "<br/>"
    }
    return asciiImage;
}

var asciiFromFile = function (reader, fileInput) {
    var image = new Image();


    reader.addEventListener("load", () => {
        image.src = reader.result;
        console.log(reader.result);
    });
    reader.readAsDataURL(fileInput.files[0]);
    image.onload = () => {
        ctx.drawImage(image, 0, 0);
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        let asciiImage = imageToAscii(imageData);
        var container = document.getElementById("upload-container");
        var imageDiv = document.createElement("div");
        imageDiv.className = "uploaded";
        imageDiv.innerHTML = asciiImage;
        container.appendChild(imageDiv);
    };
};

const fileInput = document.getElementById('inputImage');
fileInput.onchange = () => {

    const selectedFile = fileInput.files[0];
    const reader = new FileReader();

    if (selectedFile.type.split("/")[0] == "image") {
        asciiFromFile(reader, fileInput);

    } else {

    }


    // const selectedFile = fileInput.files[0];
    // var reader = new FileReader();
    // var image = new Image();

    // console.log(selectedFile);

    // reader.addEventListener("load", () => {
    //     image.src = reader.result;
    // }, false);

    // if (selectedFile) {
    //     image.onload = () => {
    //         image.src = reader.readAsDataURL(selectedFile);
    //         ctx.drawImage(image, 0, 0);
    //         let imageData = ctx.getImageData(0, 0, image.width, image.height);
    //         let asciiImage = imageToAscii(imageData);
    //         var imageDiv = document.createElement("div");
    //         imageDiv.innerHTML = asciiImage;
    //         document.body.appendChild(imageDiv);
    //     }


    // }

}


var resolution = document.getElementById("resolution");

var updateFontSize = function () {
    var asciiImage = document.getElementById("ascii");
    if (asciiImage) {
        let w = (9 / (resolution.value * 10));
        let h = (9 / (resolution.value * 15));
        asciiImage.style.fontSize = w + "px";
        asciiImage.style.lineHeight = h + "px";
    }
};
updateFontSize();
resolution.onchange = updateFontSize;




var toggleCamera = document.getElementById("toggleCamera");
var draw = function () {
    ctx.clearRect(0, 0, width, height);
    // ctx.drawImage(video, imgSize.x, imgSize.y, imgSize.width, imgSize.height);
    // ctx.drawImage(video, imgSize.x, imgSize.y, imgSize.width, imgSize.height);
    if (toggleCamera.checked) {
        ctx.drawImage(video, 0, 0, imgSize.width * resolution.value, imgSize.height * resolution.value);
        let pixels = ctx.getImageData(0, 0, imgSize.width * resolution.value, imgSize.height * resolution.value);
        console.log(imgSize.width)
        var asciiImage = imageToAscii(pixels);
        asciiDiv.innerHTML = asciiImage;

    }




    // for (let i = 0; i < pixels.data.length; i += 4) {
    //     let pixel = (i * pixels.width * (i - i % pixels.width / pixels.height)) + i % pixels.width;
    //     let r = pixels.data[pixel + 0];
    //     let g = pixels.data[pixel + 1];
    //     let b = pixels.data[pixel + 2];
    //     let avg = (r + g + b) / 3;

    // }

    // let pixels = ctx.getImageData(0, 0, width, height);//put image data
    // let pixels = new Image();
    // pixels.src = canvas.toDataURL("image/png", 1);


    // pixels.onload = function () {
    // ctx.drawImage(pixels, imgSize.x, imgSize.y, imgSize.width, imgSize.height);
    // };
    window.requestAnimationFrame(draw);
};
