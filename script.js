// MOHAK //
let video = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let recDiv = recordBtn.querySelector("div");
let capBtn = document.querySelector("#capture");
let capDiv = capBtn.querySelector("div");
// let body = document.querySelector("body");
let appliedFilter;
let minZoom = 1;
let maxZoom = 3;
let filters = document.querySelectorAll(".filter");
// let recordBtn = document.querySelector("#record");
let mediaRecorder;             // global banane ke liye bs vahan pe bna liya obj 29 line ka 
let isRecording = false;
let chunks = [];
let zoomInBtn = document.querySelector(".zoom-in");
let zoomOutBtn = document.querySelector(".zoom-out");
let currZoom = 1;

let galleryBtn = document.querySelector('#gallery');

galleryBtn.addEventListener("click",function(){
    // localhost:5500/index.html => localhost:5500/gallery.html
    location.assign("gallery.html")
});



zoomInBtn.addEventListener("click",function(){
if(currZoom < maxZoom){
    currZoom = currZoom + 0.1;
}
video.style.transform = `scale(${currZoom})`;
});

zoomOutBtn.addEventListener("click",function(){
    if(currZoom > minZoom){
        currZoom = currZoom - 0.1;
    }
    video.style.transform = `scale(${currZoom})`;
});

for(let i =0; i < filters.length;i++){
    filters[i].addEventListener("click",function(e){
        removeFilter();
        appliedFilter = e.currentTarget.style.backgroundColor;
        console.log(appliedFilter);

        let div = document.createElement("div")
        div.style.backgroundColor = appliedFilter;
        div.classList.add("filter-div");
        body.append(div);
    });
}


// startBtn.addEventListener("click", function () {
//     mediaRecorder.start()        // isse recording start hogi
// });
// stopBtn.addEventListener("click", function () {
//     mediaRecorder.stop()        // isse recording stop hogi
// });

capBtn.addEventListener("click", function () {
    if(isRecording) return;    // iska mtlab agar recording ho rahi hai to capture na kare vahi se fun return hojae

    capDiv.classList.add("capture-animation");
    setTimeout(function () {
        capDiv.classList.remove("capture-animation");
    }, 1000);

    // jo bhi image screen pe dikha rha hai usse save karna hai and usko canvas pe draw karenge
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");

    // origin shift karenge canvas ka
    tool.translate(canvas.width / 2, canvas.height / 2);

    tool.scale(currZoom, currZoom);

    tool.translate(-canvas.width / 2, -canvas.height / 2);

    tool.drawImage(video, 0, 0);

    if(appliedFilter){            // isse capture karne pe filter lag jaega 
        tool.fillStyle = appliedFilter; 
        tool.fillRect(0,0,canvas.width,canvas.height);
    }

    let link = canvas.toDataURL();      // iss data ko canvas ke liye ek url me convert kar dega
    addMedia(link,"image");
    // let a = document.createElement("a");
    // a.href = link;
    // a.download = "img.png";
    // a.click();
    // a.remove();
    // canvas.remove()
});

recordBtn.addEventListener("click", function () {
    if (isRecording) {
        mediaRecorder.stop()
        isRecording = false;
        recDiv.classList.remove("record-animation");
        // e.currentTarget.innerText = "stop";
    } else {
        mediaRecorder.start();
        appliedFilter = "";   // color remove ho jaega
        removeFilter();   // ui se remove ho jaega filter kyuki video recroding me nahi chahea
        currZoom = 1;
        video.style.transform = `scale(${currZoom})`;
        isRecording = true;
        recDiv.classList.add("record-animation");
        // e.currentTarget.innerText = "Recording";      // jab recording start kare to andar likha aae recording
    }
})

navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })      // this is a promise agar isme permissions mil jati hai to aage .then se chalega code varna agar permission deny hogi to usko catch karenge
    .then(function (mediaStream) {

        mediaRecorder = new MediaRecorder(mediaStream);     // ye yahan pe jo hame audio/video mil rahi thi usko mediaRecorder ko pass kar diya

        mediaRecorder.addEventListener("dataavailable", function (e) {      // iske andar vo data milta hai jo record karke aata hai chunks me , sare video ke parts ko jod ke ek video banani pdegi
            chunks.push(e.data);
        });

        mediaRecorder.addEventListener("stop", function (e) {      // sare chunks jo combine karke save karvana hai
            let blob = new Blob(chunks, { type: "video/mp4" });    // blob is a large binary file
            chunks = [];
            addMedia(blob,"video");
            // let a = document.createElement("a");
            // let url = window.URL.createObjectURL(blob);    // predefined function which creates a URL of the blob or video which we have combined
            // a.href = url;
            // a.download = "video.mp4";
            // a.click();
            // a.remove();
        });

        video.srcObject = mediaStream;     // ye  vidoe mein jo bhi source aarahi hai uska access lekar dikha dega video 
    })
    .catch(function (err) {
        console.log(err);
    });

    function removeFilter() {
        let Filter = document.querySelector(".filter-div");
        if (Filter) Filter.remove();
      }