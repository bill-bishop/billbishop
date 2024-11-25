// input_handler.js

export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouseHeld = false;
        this.targetX = 0;
        this.targetY = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        // Key listeners
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Mouse listeners
        window.addEventListener('mousedown', (e) => {
            this.mouseHeld = true;
            this.targetX = e.offsetX;
            this.targetY = e.offsetY;
        });

        window.addEventListener('mouseup', () => {
            this.mouseHeld = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.mouseHeld) {
                this.targetX = e.offsetX;
                this.targetY = e.offsetY;
            }
        });

        // Touch listeners
        window.addEventListener('touchstart', (e) => {
            this.mouseHeld = true;
            const touch = e.touches[0];
            const rect = e.target.getBoundingClientRect();
            this.targetX = touch.clientX - rect.left;
            this.targetY = touch.clientY - rect.top;
        });

        window.addEventListener('touchend', () => {
            this.mouseHeld = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (this.mouseHeld) {
                const touch = e.touches[0];
                const rect = e.target.getBoundingClientRect();
                this.targetX = touch.clientX - rect.left;
                this.targetY = touch.clientY - rect.top;
            }
        });
    }
}
