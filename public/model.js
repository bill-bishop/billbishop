// model.js

import { Interaction } from './interaction.js';

export class Player {
    constructor() {
        this.x = 50;
        this.y = 300;
        this.size = 30;
        this.speed = 2; // Updated initial speed
        this.colorIndex = 0;
        this.colorChangeCounter = 0;
        this.orbitAngle = 0;
        this.powerUps = []; // List of power-ups collected by the player
    }

    hasPowerUp(type) {
        return this.powerUps.includes(type);
    }
}

export class GameObject {
    constructor(x, y, size, label, shape, driftSpeed = 0, interaction = null, autoInteract = false, pickUpOnInteract = false) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.label = label;
        this.shape = shape;
        this.driftSpeed = driftSpeed;
        this.interaction = interaction;
        this.autoInteract = autoInteract; // Indicates if the object should interact automatically on collision
        this.pickUpOnInteract = pickUpOnInteract; // Indicates if the object should be removed on interact
    }
}

// Interactions
const navigateInteraction = (model, data) => {
    if (data.url) {
        window.location.href = data.url;
    }
};
const winInteraction = (model, data) => {
    if (model.player.powerUps.includes('loveBoost') && model.player.powerUps.includes('speedBoost')) {
        model.state = 'PlayerWin';
    }
};
// Apply power-up changes to the player
export const powerupInteraction = (model, data, collisionObject) => {
    const player = model.player;

    model.objects = model.objects.filter(o => o !== collisionObject);
    player.powerUps.push(data.type);

    const onPowerDown = [
        () => {
            const index = player.powerUps.indexOf(data.type);
            if (index > -1) {
                player.powerUps.splice(index, 1);
            }
        },
        () => model.respawnPowerUp(collisionObject),
    ];

    switch (data.type) {
        case 'speedBoost':
            player.speed *= data.value;

            // Reset speed after the duration ends
            onPowerDown.push(() => {
                player.speed /= data.value;
            });
            break;
        case 'loveBoost':
            console.log('<3 <3 <3');
            break;
        default:
            console.warn('Unknown power-up type:', data.type);
    }

    setTimeout(() => {
        onPowerDown.forEach(fn => fn());
    }, data.duration);
};

export class GameModel {
    constructor(inputHandler) {
        this.inputHandler = inputHandler;
        this.player = new Player();
        this.objects = [
            new GameObject(203, 933, 9, 'GitHub', 'dot', 0, new Interaction(    'navigate', { url: 'https://github.com/bill-bishop/billbishop' },   navigateInteraction)),
            new GameObject(509, 968, 9, 'Bio', 'dot', 0, new Interaction(       'navigate', { url: '/bio.html' },                                   navigateInteraction)),
            new GameObject(791, 939, 9, 'Mystery', 'dot', 2, new Interaction(   'win',      { message: 'You have won the game!' },                  winInteraction), true, true),
            new GameObject(482, 791, 6, 'PowerUp', 'dot', 0, new Interaction(   'powerup',  { type: 'speedBoost', duration: 5000, value: 4 },       powerupInteraction), true, true), // Power-up GameObject
            new GameObject(979, 225, 30, 'Heart', 'heart', 0, new Interaction(  'powerup',  { type: 'loveBoost', duration: 10000, value: 42 },      powerupInteraction), true, true) // Heart GameObject
        ];
        this.colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
    }

    respawnPowerUp(obj) {
        if (obj) {
            const newX = Math.random() * 800; // Assuming canvas width is 800
            const newY = Math.random() * 600; // Assuming canvas height is 600
            obj.x = newX;
            obj.y = newY;
            this.objects.push(obj);
        }
    }
}
