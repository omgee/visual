let audio = document.getElementById('music');
let playback = document.querySelector('#playback');

var ctx = new AudioContext();
let MEDIA_NODE = new WeakMap();

let audioFileArray = [];
let imageFileArray = [];
let currentAudio = 0;
let currentImage = 0;

function init() {
    
    let audioSrc;

    if (MEDIA_NODE.has(audio)) {
        audioSrc = MEDIA_NODE.get(audio);
    }
    else {
        audioSrc = ctx.createMediaElementSource(audio);
        MEDIA_NODE.set(audio, audioSrc);
    }

    var analyser = ctx.createAnalyser();

    let content = audio.src;

    audioSrc.connect(analyser);

    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    var canvas = document.getElementById('canvas');
    var layout = canvas.getContext('2d');

    layout.fillStyle = `rgba(0, 0, 0, .1)`;

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        if (audio.src != content) return;
        analyser.getByteFrequencyData(frequencyData);
        layout.fillRect(0, 0, 2048, 512);
        for (var i = 0; i < 1024; i++) {
            if (i % 2 != 0) continue;
            layout.clearRect(i + 1024, 256, 1, frequencyData[i]);
            layout.clearRect(i + 1024, 256, 1, -frequencyData[i]);
            layout.clearRect(1024 - i, 256, 1, frequencyData[i]);
            layout.clearRect(1024 - i, 256, 1, -frequencyData[i]);
        }
    }
    audio.play();
    renderFrame();
}

audio.onended = () => {
    right();
}

let drop = document.querySelector(`#drop`);

drop.addEventListener(`drop`, (e) => {
    e.preventDefault();
    let dt = e.dataTransfer.files;
    if (dt) {
        for (let item of dt) {
            console.log(item)
            if (item.type.indexOf(`audio`) != -1) {
                audioFileArray.push(item);
                let id = audioFileArray.length - dt.length - 1 >= 0 ? audioFileArray.length - dt.length : 0;
                document.querySelector(`.wrap`).innerHTML += `<div class="track">${item.name.slice(0, -4)}</div>`;
                setAudioById(id);
            }
            if (item.type.indexOf(`image`) != -1) {
                imageFileArray.push(item);
                setImageById(imageFileArray.length - 1);
            }
        }
    }
});

drop.addEventListener(`dragover`, (e) => {
    e.preventDefault();
});

drop.onmousemove = (e) => {
    if (e.clientX < drop.clientWidth - 11 && e.clientX > 11 && e.clientY < drop.clientHeight - 11 && e.clientY > 11) {
        drop.classList.add(`visible`);
    } else {
        drop.classList.remove(`visible`);
    }
}

drop.onmouseleave = () => {
    drop.classList.remove(`visible`);
}

let track_name = document.querySelector(`#track-name`);

function setAudioById(id) {
    currentAudio = id;
    document.querySelector(`.wrap`).style.transform = `translateX(-${(100 * id) / audioFileArray.length}%)`;
    let url = URL.createObjectURL(audioFileArray[id]);
    audio.src = url;
    playback.src = url;
    pause = false;
    document.querySelector(`.pause`).style.background = `url(pause.svg) 50% no-repeat`;
    document.querySelector(`.pause`).style.backgroundSize = `25%`;
    init();
}

function setImageById(id) {
    let url = URL.createObjectURL(imageFileArray[id]);
    document.body.style.background = `url(${url}) 50% no-repeat`;
}

function left() {
    if (currentAudio == 0) currentAudio = audioFileArray.length - 1;
    else currentAudio--;
    setAudioById(currentAudio);
}

function right() {
    if (currentAudio == audioFileArray.length - 1) currentAudio = 0;
    else currentAudio++;
    setAudioById(currentAudio);
}

let pause = false;

function togglePause() {
    if (!pause) {
        audio.pause();
        playback.pause();
        document.querySelector(`.pause`).style.background = `url(play.svg) 50% no-repeat`;
        document.querySelector(`.pause`).style.backgroundSize = `25%`;
    }
    else {
        audio.play();
        playback.play();
        document.querySelector(`.pause`).style.background = `url(pause.svg) 50% no-repeat`;
        document.querySelector(`.pause`).style.backgroundSize = `25%`;
    }
    pause = !pause;
}

document.querySelector(`.pause`).addEventListener(`click`, togglePause);
document.querySelector(`.left`).addEventListener(`click`, left);
document.querySelector(`.right`).addEventListener(`click`, right);

init();