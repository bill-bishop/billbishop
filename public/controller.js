// controller.js
import { updatePlayerPosition, updatePlayerMovementTowardsTarget, updateMysteryObject, updatePlayerColor, updateOrbitingDot, wrapObjectsAroundScreen, checkCanvasBoundaries } from './update_api.js';
import { InputHandler } from './input_handler.js';


// Collision-Interaction rules
// Rule 1: Automatically interact if the object is set to autoInteract and has an interaction defined
export const RULE_AUTO_INTERACT = (model, inputHandler, collisionObject) => collisionObject.autoInteract && collisionObject.interaction;
// Rule 2: Allow the player to manually interact by pressing 'x' or holding the mouse button
export const RULE_PLAYER_INTERACT = (model, inputHandler, collisionObject) => inputHandler.keys['x'] || inputHandler.mouseHeld;

// Update the game state based on player input and other factors
export const updateGame = (model, inputHandler, view) => {
    updatePlayerPosition(model, inputHandler.keys, view);
    updatePlayerMovementTowardsTarget(model, inputHandler.mouseHeld, inputHandler.targetX, inputHandler.targetY);
    updateMysteryObject(model);
    updateOrbitingDot(model);
    // wrapObjectsAroundScreen(model, view);
    // checkCanvasBoundaries(model, view);
};

// Draw the game components based on the current state
export const drawGame = (model, view, collisionDetected, collisionObject) => {
    view.clear();
    const player = model.player;
    const colors = model.colors;

    // Draw the win screen if the player has won
    if (model.state === 'PlayerWin') {
        view.drawWinScreen();
        return;
    }

    // Draw background
    view.drawBackground();

    // Draw player with their color
    view.drawPlayer(player, view.colors.getLabelColor('Player'));

    // Draw orbiting dot if the player has the power-up
    if (player.powerUps.includes('speedBoost')) {
        view.drawOrbitingDot(player);
    }

    // Draw all game objects
    model.objects.forEach(obj => view.drawObject(obj));

    // Draw collision dialogue if a collision has been detected and the object is not set to autoInteract
    if (collisionDetected && collisionObject && !collisionObject.autoInteract) {
        view.drawCollisionDialogue();
    }

    // Draw debug dialogue if needed
    // view.drawDebugDialogue(model, view, collisionDetected);
};

// Detect collisions between the player and other objects
export const detectCollisions = (model) => {
    const player = model.player;
    let collisionDetected = false;
    let collisionObject = null;

    // Check for collisions with each object in the model
    model.objects.forEach((obj) => {
        if (
            player.x < obj.x + obj.size &&
            player.x + player.size > obj.x &&
            player.y < obj.y + obj.size &&
            player.y + player.size > obj.y
        ) {
            collisionDetected = true;
            collisionObject = obj;
        }
    });

    return { collisionDetected, collisionObject };
};

// Handle collisions based on defined rules
export const handleCollisions = (model, inputHandler, collisionObject, rules = []) => {
    if (collisionObject) {
        rules.forEach(rule => {
            const interactionActive = rule(model, inputHandler, collisionObject);
            if (interactionActive) {
                collisionObject.interaction.execute(model, collisionObject);
            }
        });
    }

};

// Main game loop: update game state, handle collisions, and draw the game
export const gameLoop = (model, view, inputHandler) => {
    // Update the game state
    updateGame(model, inputHandler, view);
    
    // Detect collisions
    const { collisionDetected, collisionObject } = detectCollisions(model);

    // Define collision-interaction rules
    const collisionRules = [
        RULE_AUTO_INTERACT,
        RULE_PLAYER_INTERACT,
    ];

    // Handle collisions based on the defined rules
    handleCollisions(model, inputHandler, collisionObject, collisionRules);
  
    // Draw the updated game state
    drawGame(model, view, collisionDetected, collisionObject);

    // Check if the game is over and handle accordingly
    const gameOver = model.state === 'PlayerWin';

    if (!gameOver) {
        requestAnimationFrame(() => gameLoop(model, view, inputHandler));
    } else {
        view.drawWinScreen();
    }
};
