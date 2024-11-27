// controller.js
import { updatePlayerPosition, updatePlayerMovementTowardsTarget, updateMysteryObject, updatePlayerColor, updateOrbitingDot, wrapObjectsAroundScreen, checkCanvasBoundaries } from './update_api.js';
import { InputHandler } from './input_handler.js';

export const updateGame = (model, inputHandler, view) => {
    updatePlayerPosition(model, inputHandler.keys, view);
    updatePlayerMovementTowardsTarget(model, inputHandler.mouseHeld, inputHandler.targetX, inputHandler.targetY);
    updateMysteryObject(model);
    updateOrbitingDot(model);
    // wrapObjectsAroundScreen(model, view);
    // checkCanvasBoundaries(model, view);
};

export const drawGame = (model, view, collisionDetected, collisionObject) => {
    view.clear();
    const player = model.player;
    const colors = model.colors;

    if (model.state === 'PlayerWin') {
        view.drawWinScreen();
        return;
    }

    // Draw bg
    view.drawBackground();

    // Draw player with their color
    view.drawPlayer(player, view.colors.getLabelColor('Player'));

    // Draw orbiting dot if the player has the power-up
    if (player.powerUps.includes('speedBoost')) {
        view.drawOrbitingDot(player);
    }

    // Draw objects
    model.objects.forEach(obj => view.drawObject(obj));

    // Draw collision dialogue
    if (collisionDetected && collisionObject && !collisionObject.autoInteract) {
        view.drawCollisionDialogue();
    }

    // Draw debug dialogue
    // view.drawDebugDialogue(model, view, collisionDetected);
};

export const checkCollisions = (model, inputHandler) => {
    const player = model.player;
    let collisionDetected = false;
    let collisionObject = null;

    model.objects.forEach((obj, index) => {
        if (
            player.x < obj.x + obj.size &&
            player.x + player.size > obj.x &&
            player.y < obj.y + obj.size &&
            player.y + player.size > obj.y
        ) {
            collisionDetected = true;
            collisionObject = obj;
            if (obj.autoInteract && obj.interaction) {
                interact(model, obj);
            } else if (inputHandler.keys['x'] || inputHandler.mouseHeld) {
                interact(model, obj);
            }

            // Remove object if it should be picked up on interact
            if (obj.pickUpOnInteract) {
                model.objects.splice(index, 1);
                setTimeout(() => {
                    model.respawnPowerUp(obj);
                }, obj.interaction.data.duration);
            }
        }
    });

    return { collisionDetected, collisionObject };
};

export const interact = (model, obj) => {
    if (obj && obj.interaction) {
        obj.interaction.execute(model.player, obj, model);
    }
};

export const gameLoop = (model, view, inputHandler) => {
    updateGame(model, inputHandler, view);
    const { collisionDetected, collisionObject } = checkCollisions(model, inputHandler);
    drawGame(model, view, collisionDetected, collisionObject);

    const gameOver = model.state === 'PlayerWin';

    if (!gameOver) {
        requestAnimationFrame(() => gameLoop(model, view, inputHandler));
    } else {
        view.drawWinScreen();
    }
};
