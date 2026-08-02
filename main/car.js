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

