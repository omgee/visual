window.onload = function() {
    var ctx = new AudioContext();
    var audio = document.getElementById('music');
    var audioSrc = ctx.createMediaElementSource(audio);
    var analyser = ctx.createAnalyser();

    audioSrc.connect(analyser);

    var frequencyData = new Uint8Array(analyser.frequencyBinCount);

    var canvas = document.getElementById('canvas');
    var layout = canvas.getContext('2d');

    function getColor(i) {
        let r = Math.floor(i / 3);
        let g = Math.floor(i / 3);
        let b = Math.floor(i / 3);
        return `#ff${g}${b}`;
    }

    layout.fillStyle = `rgba(0, 0, 0, .1)`;

    function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(frequencyData);
        layout.fillRect(0, 0, 2048, 512);
        let a = 1;
        let r = 0;
        let g = 0;
        let b = 0;
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