// interaction.js

export class Interaction {
    constructor(type, data, fn) {
        this.type = type;
        this.data = data;
        this.fn = fn;
    }

    execute(model, collisionObject) {
        return this.fn(model, this.data, collisionObject);
    }
}

// Note: The 'powerup' type interaction is now processed externally in controller.js
// to ensure consistency in modifying the player model and applying power-up effects.
