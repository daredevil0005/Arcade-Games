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
