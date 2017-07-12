let audio = document.getElementById('music');
let playback = document.querySelector('#playback');

var ctx = new AudioContext();
let MEDIA_NODE = new WeakMap();

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

function changeBackground(e) {
    document.body.style.background = `url(${URL.createObjectURL(document.getElementById('background-input').files[0])}) 50%`;
}

function changeTrack() {
    let url = URL.createObjectURL(document.getElementById(`track-input`).files[0]);
    audio.src = url;
    document.getElementById(`playback`).src = url;
    init();
}

document.getElementById(`background-input`).addEventListener(`change`, changeBackground, false);
document.getElementById(`track-input`).addEventListener(`change`, changeTrack, false);

let pause_toggle = false;

let pause_button = document.querySelector(`.pause`);

document.querySelector(`.pause`).addEventListener(`click`, () => {
    if (pause_toggle) {
        audio.play();
        playback.play();
        pause_button.style.background = `url(pause.png) 50% no-repeat`;
        pause_button.style.backgroundSize = `50%`;
    }
    else {
        audio.pause();
        playback.pause();
        pause_button.style.background = `url(play.png) 50% no-repeat`;
        pause_button.style.backgroundSize = `50%`;
    }
    pause_toggle = !pause_toggle;
});

init();