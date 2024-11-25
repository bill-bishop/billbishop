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
            new GameObject(250, 200, 50, 'Bio', 'circle', 0, new Interaction('navigate', { url: 'bio.html' })),
            new GameObject(450, 300, 50, 'GitHub', 'triangle', 0, new Interaction('navigate', { url: 'https://github.com/bill-bishop' })),
            new GameObject(650, 400, 50, 'Mystery', 'hexagon', 3, new Interaction('win', { message: 'You have won the game!' })),
            new GameObject(350, 250, 10, 'PowerUp', 'dot', 0, new Interaction('powerup', { type: 'speedBoost', duration: 5000, value: 4 }), true, true) // Power-up GameObject
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
