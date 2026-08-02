// ==========================================================
// Car Dash
// Arcade Games Project
// Refactored from original CodePen version
// ==========================================================

// ----------------------------------------------------------
// Assets
// ----------------------------------------------------------

const ASSETS = {
    COLOR: {
        TAR: ["#959298", "#9c9a9d"],
        RUMBLE: ["#959298", "#f5f2f6"],
        GRASS: ["#eedccd", "#e6d4c5"],
    },

    IMAGE: {

        TREE: {
            src: "img/tree.png",
            width: 132,
            height: 192
        },

        HERO: {
            src: "img/hero.png",
            width: 110,
            height: 56
        },

        CAR: {
            src: "img/car04.png",
            width: 50,
            height: 36
        },

        FINISH: {
            src: "img/finish.png",
            width: 339,
            height: 180,
            offset: -0.5
        },

        SKY: {
            src: "img/cloud.jpg"
        }
    },

    AUDIO: {
        theme: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/theme.mp3",
        engine: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/engine.wav",
        honk: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/honk.wav",
        beep: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/155629/beep.wav",

        // Local background music
        music: "music/car.mp3"
    }
};

// ----------------------------------------------------------
// Game Constants
// ----------------------------------------------------------

const width = 800;
const height = 500;

const halfWidth = width / 2;

const roadW = 4000;
const segL = 200;
const camD = 0.2;
const H = 1500;
const N = 70;

const maxSpeed = 200;
const accel = 38;
const breaking = -80;
const decel = -40;

const maxOffSpeed = 40;
const offDecel = -70;

const enemy_speed = 8;
const hitSpeed = 20;

const mapLength = 15000;

const targetFrameRate = 1000 / 25;

const LANE = {
    A: -2.3,
    B: -0.5,
    C: 1.2
};

// ==========================================================
// Helper Functions
// ==========================================================

// Number helpers
Number.prototype.pad = function (numZeros, char = "0") {
    let n = Math.abs(this);
    let zeros = Math.max(0, numZeros - Math.floor(n).toString().length);

    let zeroString = Math.pow(10, zeros)
        .toString()
        .substr(1)
        .replace(/0/g, char);

    return zeroString + n;
};

Number.prototype.clamp = function (min, max) {
    return Math.max(min, Math.min(this, max));
};

// Time
const timestamp = () => new Date().getTime();

// Physics
const accelerate = (velocity, acceleration, deltaTime) => {
    return velocity + acceleration * deltaTime;
};

// Collision
const isCollide = (x1, w1, x2, w2) => {
    return (x1 - x2) ** 2 <= (w1 + w2) ** 2;
};

// Random integer
function getRand(min, max) {
    return (Math.random() * (max - min) + min) | 0;
}

// Random object property
function randomProperty(object) {
    const keys = Object.keys(object);
    return object[keys[(Math.random() * keys.length) | 0]];
}

// Sleep helper
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==========================================================
// Road Rendering Helper
// ==========================================================

function drawQuad(element, layer, color, x1, y1, w1, x2, y2, w2) {

    element.style.zIndex = layer;
    element.style.background = color;

    element.style.top = y2 + "px";
    element.style.left = (x1 - w1 / 2 - w1) + "px";

    element.style.width = (w1 * 3) + "px";
    element.style.height = (y1 - y2) + "px";

    const leftOffset =
        w1 +
        x2 -
        x1 +
        Math.abs(w2 / 2 - w1 / 2);

    element.style.clipPath =
        `polygon(${leftOffset}px 0,
        ${leftOffset + w2}px 0,
        66.66% 100%,
        33.33% 100%)`;
}

// ==========================================================
// Keyboard Input
// ==========================================================

const KEYS = {};

function updateKey(event) {

    KEYS[event.code] = event.type === "keydown";

    event.preventDefault();
}

window.addEventListener("keydown", updateKey);
window.addEventListener("keyup", updateKey);

// ==========================================================
// Line Class
// ==========================================================

class Line {

    constructor() {

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.X = 0;
        this.Y = 0;
        this.W = 0;

        this.curve = 0;
        this.scale = 0;

        this.elements = [];
        this.special = null;
    }

    project(camX, camY, camZ) {

        this.scale = camD / (this.z - camZ);

        this.X = (1 + this.scale * (this.x - camX)) * halfWidth;

        this.Y = Math.ceil(
            ((1 - this.scale * (this.y - camY)) * height) / 2
        );

        this.W = this.scale * roadW * halfWidth;
    }

    clearSprites() {

        for (const element of this.elements) {

            element.style.background = "transparent";

        }

    }

    drawSprite(depth, layer, sprite, offset) {

        let destX = this.X + this.scale * halfWidth * offset;
        let destY = this.Y + 4;

        let destW = (sprite.width * this.W) / 265;
        let destH = (sprite.height * this.W) / 265;

        destX += destW * offset;
        destY -= destH;

        const object =
            layer instanceof Element
                ? layer
                : this.elements[layer + 6];

        object.style.background =
            `url('${sprite.src}') no-repeat`;

        object.style.backgroundSize =
            `${destW}px ${destH}px`;

        object.style.left = destX + "px";
        object.style.top = destY + "px";
        object.style.width = destW + "px";
        object.style.height = destH + "px";
        object.style.zIndex = depth;
    }

}

// ==========================================================
// Car Class
// ==========================================================

class Car {

    constructor(position, sprite, lane) {

        this.pos = position;
        this.type = sprite;
        this.lane = lane;

        this.element = document.createElement("div");

        road.appendChild(this.element);
    }

}

// ==========================================================
// Audio Manager
// ==========================================================

class AudioManager {

    constructor() {

        this.audioCtx = new AudioContext();

        this.destination =
            this.audioCtx.createGain();

        this.destination.connect(
            this.audioCtx.destination
        );

        this.files = {};

        this.destination.gain.value = 1;

        this.load(
            ASSETS.AUDIO.theme,
            "theme",
            (key) => {

                const source =
                    this.audioCtx.createBufferSource();

                source.buffer = this.files[key];

                const gain =
                    this.audioCtx.createGain();

                gain.gain.value = 0.6;

                source.connect(gain);

                gain.connect(this.destination);

                source.loop = true;

                source.start(0);

            }
        );

    }

    get volume() {

        return this.destination.gain.value;

    }

    set volume(value) {

        this.destination.gain.value = value;

    }

    play(key, pitch = 0) {

        if (!this.files[key]) {

            this.load(
                ASSETS.AUDIO[key] || key,
                key,
                () => this.play(key, pitch)
            );

            return;

        }

        const source =
            this.audioCtx.createBufferSource();

        source.buffer = this.files[key];

        if (pitch)
            source.detune.value = pitch;

        source.connect(this.destination);

        source.start(0);

    }

    load(src, key, callback) {

        const request = new XMLHttpRequest();

        request.open("GET", src, true);

        request.responseType = "arraybuffer";

        request.onload = () => {

            this.audioCtx.decodeAudioData(

                request.response,

                (buffer) => {

                    this.files[key] = buffer;

                    if (callback)
                        callback(key);

                }

            );

        };

        request.send();

    }

}

// ==========================================================
// Global Variables
// ==========================================================

// High Scores
const highscores = [];

// Timing
let then = timestamp();

// Audio
let audio;

// Game State
let inGame;
let start;

let playerX;
let speed;
let scoreVal;

let pos;
let cloudOffset;

let sectionProg;
let mapIndex;

let countDown;

// Road
let lines = [];

// Enemy Cars
let cars = [];

// ==========================================================
// Map Generation
// ==========================================================

function getFun(value) {
    return () => value;
}

function genMap() {

    const map = [];

    for (let i = 0; i < mapLength; i += getRand(0, 50)) {

        const section = {
            from: i,
            to: (i = i + getRand(300, 600))
        };

        const randHeight = getRand(-5, 5);
        const randCurve = getRand(5, 30) * (Math.random() >= 0.5 ? 1 : -1);
        const randInterval = getRand(20, 40);

        if (Math.random() > 0.9) {

            Object.assign(section, {

                curve: () => randCurve,
                height: () => randHeight

            });

        }

        else if (Math.random() > 0.8) {

            Object.assign(section, {

                curve: () => 0,

                height: (i) =>
                    Math.sin(i / randInterval) * 1000

            });

        }

        else if (Math.random() > 0.8) {

            Object.assign(section, {

                curve: () => 0,
                height: () => randHeight

            });

        }

        else {

            Object.assign(section, {

                curve: () => randCurve,
                height: () => 0

            });

        }

        map.push(section);

    }

    map.push({

        from: mapLength,

        to: mapLength + N,

        curve: () => 0,

        height: () => 0,

        special: ASSETS.IMAGE.FINISH

    });

    map.push({

        from: Infinity

    });

    return map;

}

const map = genMap();

