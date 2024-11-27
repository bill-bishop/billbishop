// controller.js
import { updatePlayerPosition, updatePlayerMovementTowardsTarget, updateMysteryObject, updatePlayerColor, updateOrbitingDot, wrapObjectsAroundScreen, checkCanvasBoundaries } from './update_api.js';
import { InputHandler } from './input_handler.js';

export class GameController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.inputHandler = new InputHandler(this.view.canvas);
        this.collisionDetected = false;
        this.collisionLabel = '';
        this.collisionObject = null;
    }

    update() {
        updatePlayerPosition(this.model, this.inputHandler.keys, this.view);
        updatePlayerMovementTowardsTarget(this.model, this.inputHandler.mouseHeld, this.inputHandler.targetX, this.inputHandler.targetY);
        updateMysteryObject(this.model);
        // updatePlayerColor(this.model);
        updateOrbitingDot(this.model);
        // wrapObjectsAroundScreen(this.model, this.view);
        // checkCanvasBoundaries(this.model, this.view);
    }

    draw() {
        this.view.clear();
        const player = this.model.player;
        const colors = this.model.colors;

        if (this.model.state === 'PlayerWin') {

            this.view.drawWinScreen();
            return;
        }

        // Draw bg
        this.view.drawBackground();

        // Draw player with their color
        this.view.drawPlayer(player, this.view.colors.getLabelColor('Player'));

        // Draw orbiting dot if the player has the power-up
        if (player.powerUps.includes('speedBoost')) {
            this.view.drawOrbitingDot(player);
        }

        // Draw objects
        this.model.objects.forEach(obj => this.view.drawObject(obj));

        // Draw collision dialogue
        if (this.collisionDetected && this.collisionObject && !this.collisionObject.autoInteract) {
            this.view.drawCollisionDialogue();
        }

        // Draw debug dialogue
        // this.view.drawDebugDialogue(this.model, this.view, this);
    }

    checkCollision() {
        const player = this.model.player;
        this.collisionDetected = false;
        this.collisionObject = null;
        this.model.objects.forEach((obj, index) => {
            if (
                player.x < obj.x + obj.size &&
                player.x + player.size > obj.x &&
                player.y < obj.y + obj.size &&
                player.y + player.size > obj.y
            ) {
                this.collisionDetected = true;
                this.collisionLabel = obj.label;
                this.collisionObject = obj;
                if (obj.autoInteract && obj.interaction) {
                    this.interact(obj);
                } else if (this.inputHandler.keys['x'] || this.inputHandler.mouseHeld) {
                    this.interact(obj);
                }

                // Remove object if it should be picked up on interact
                if (obj.pickUpOnInteract) {
                    this.model.objects.splice(index, 1);
                    setTimeout(() => {
                        this.model.respawnPowerUp(obj);
                    }, obj.interaction.data.duration);
                }
            }
        });
    }

    interact(obj) {
        if (obj && obj.interaction) {
            obj.interaction.execute(this.model.player, obj, this.model);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        this.checkCollision();

        const gameOver = this.model.state === 'PlayerWin';

        if (!gameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
        else {
            this.view.drawWinScreen();
        }
    }
}
