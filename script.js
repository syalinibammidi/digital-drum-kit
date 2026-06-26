let isRecording = false;
let recordedSequence = [];

const recordBtn = document.getElementById("recordBtn");
const playBtn = document.getElementById("playBtn");
const drums = document.querySelectorAll(".drum");

const names = {
    a: "Clap",
    s: "Kick",
    d: "Snare",
    f: "Tom",
    g: "Hi-Hat",
    h: "Crash",
    j: "Ride"
};

const frequencies = {
    a: 250,
    s: 120,
    d: 180,
    f: 320,
    g: 500,
    h: 700,
    j: 900
};

// Create AudioContext ONCE
const audioContext =
new(window.AudioContext || window.webkitAudioContext)();

function playSound(key) {

    if (!frequencies[key]) return;

    // Resume audio if browser suspended it
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    document.getElementById("nowPlaying").textContent =
        "Now Playing : " + names[key];

    const oscillator =
        audioContext.createOscillator();

    const gainNode =
        audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value =
        frequencies[key];

    oscillator.type = "triangle";

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.25
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.25
    );

    animateButton(key);

    if (isRecording) {

        recordedSequence.push({
            key: key,
            time: Date.now()
        });

    }
}

function animateButton(key) {

    const button =
        document.querySelector(
            `.drum[data-key="${key}"]`
        );

    if (!button) return;

    button.classList.add("active");

    setTimeout(() => {
        button.classList.remove("active");
    }, 150);
}

// Mouse Click Support
drums.forEach(button => {

    button.addEventListener("click", () => {

        playSound(
            button.dataset.key
        );

    });

});

// Keyboard Support
document.addEventListener(
    "keydown",
    (event) => {

        playSound(
            event.key.toLowerCase()
        );

    }
);

// Start / Stop Recording
recordBtn.addEventListener("click", () => {

    if (!isRecording) {

        isRecording = true;
        recordedSequence = [];

        recordBtn.textContent =
            "Stop Recording";

    } else {

        isRecording = false;

        recordBtn.textContent =
            "Start Recording";
    }

});

// Playback Recording
playBtn.addEventListener("click", () => {

    if (recordedSequence.length === 0)
        return;

    const startTime =
        recordedSequence[0].time;

    recordedSequence.forEach(note => {

        setTimeout(() => {

            playSound(note.key);

        }, note.time - startTime);

    });

});