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

export class GameModel {
    constructor() {
        this.player = new Player();
        this.objects = [
            new GameObject(203, 933, 9, 'GitHub', 'dot', 0, new Interaction('navigate', { url: 'https://github.com/bill-bishop/billbishop' })),
            new GameObject(509, 968, 9, 'Bio', 'dot', 0, new Interaction('navigate', { url: '/bio.html' })),
            new GameObject(791, 939, 9, 'Mystery', 'dot', 2, new Interaction('win', { message: 'You have won the game!' })),
            new GameObject(482, 791, 6, 'PowerUp', 'dot', 0, new Interaction('powerup', { type: 'speedBoost', duration: 5000, value: 4 }), true, true), // Power-up GameObject
            new GameObject(979, 225, 30, 'Heart', 'heart', 0, new Interaction('navigate', { url: 'enhanced_ripple_message_with_assistant.html' })) // Heart GameObject
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
