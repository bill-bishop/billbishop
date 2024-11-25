// event_listener_api.js

export function initKeyListeners(controller) {
    window.addEventListener('keydown', (e) => controller.keys[e.key] = true);
    window.addEventListener('keyup', (e) => controller.keys[e.key] = false);
    window.addEventListener('keydown', (e) => {
        if (controller.collisionDetected && e.key === 'x') {
            controller.navigateToPage(controller.collisionLabel);
        }
    });
}

export function initTouchListeners(controller) {
    window.addEventListener('touchstart', (e) => {
        if (controller.collisionDetected) {
            controller.navigateToPage(controller.collisionLabel);
        }
    });
    
    controller.view.canvas.addEventListener('touchstart', (e) => {
        controller.mouseHeld = true;
        const touch = e.touches[0];
        const rect = controller.view.canvas.getBoundingClientRect();
        controller.targetX = touch.clientX - rect.left;
        controller.targetY = touch.clientY - rect.top;
        if (controller.collisionDetected) {
            controller.navigateToPage(controller.collisionLabel);
        }
    });

    controller.view.canvas.addEventListener('touchend', () => {
        controller.mouseHeld = false;
    });

    controller.view.canvas.addEventListener('touchmove', (e) => {
        if (controller.mouseHeld) {
            const touch = e.touches[0];
            const rect = controller.view.canvas.getBoundingClientRect();
            controller.targetX = touch.clientX - rect.left;
            controller.targetY = touch.clientY - rect.top;
        }
    });
}

export function initMouseListeners(controller) {
    controller.view.canvas.addEventListener('mousedown', (e) => {
        controller.mouseHeld = true;
        controller.targetX = e.offsetX;
        controller.targetY = e.offsetY;
        if (controller.collisionDetected) {
            controller.navigateToPage(controller.collisionLabel);
        }
    });

    controller.view.canvas.addEventListener('mouseup', () => {
        controller.mouseHeld = false;
    });

    controller.view.canvas.addEventListener('mousemove', (e) => {
        if (controller.mouseHeld) {
            controller.targetX = e.offsetX;
            controller.targetY = e.offsetY;
        }
    });
}
