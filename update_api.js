// update_api.js

export function updatePlayerPosition(model, keys, view) {
    const player = model.player;
    if (keys['ArrowUp'] && player.y > 0) player.y -= player.speed;
    if (keys['ArrowDown'] && player.y < view.canvas.height - player.size) player.y += player.speed;
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < view.canvas.width - player.size) player.x += player.speed;
}

export function updatePlayerMovementTowardsTarget(model, mouseHeld, targetX, targetY) {
    const player = model.player;
    if (mouseHeld) {
        const dx = targetX - player.x;
        const dy = targetY - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > 1) {
            player.x += (dx / distance) * player.speed;
            player.y += (dy / distance) * player.speed;
        }
    }
}

export function updateMysteryObject(model) {
    const player = model.player;
    const objects = model.objects;
    const mystery = objects.find(obj => obj.label === 'Mystery');
    if (mystery) {
        const dx = player.x - mystery.x;
        const dy = player.y - mystery.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) { // Drift only if player is within a certain distance
            mystery.x -= (dx / distance) * mystery.driftSpeed;
            mystery.y -= (dy / distance) * mystery.driftSpeed;
        }
    }
}

export function updatePlayerColor(model) {
    const player = model.player;
    player.colorChangeCounter++;
    if (player.colorChangeCounter >= 10) { // Change color every 10 frames
        player.colorIndex = (player.colorIndex + 1) % model.colors.length;
        player.colorChangeCounter = 0;
    }
}

export function updateOrbitingDot(model) {
    const player = model.player;
    player.orbitAngle += 0.05;
}

export function wrapObjectsAroundScreen(model, view) {
    const objects = model.objects;
    objects.forEach(obj => {
        obj.x += 1; // Move objects to the right
        if (obj.x > view.canvas.width) {
            obj.x = -obj.size;
        }
    });
}

export function checkCanvasBoundaries(model, view) {
    const player = model.player;
    if (player.x <= 0 || player.x + player.size >= view.canvas.width || player.y <= 0 || player.y + player.size >= view.canvas.height) {
        view.canvas.width = Math.min(view.canvas.width + 10, 5600); // Increase canvas width up to a max of 5600
        view.canvas.height = Math.min(view.canvas.height + 10, 5200); // Increase canvas height up to a max of 5200

        if (player.x === 0) { player.x = 1; }
        if (player.y === 0) { player.y = 1; }
    }
}
