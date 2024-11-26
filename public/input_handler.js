// input_handler.js

export class InputHandler {
    constructor(canvas) {
        this.keys = {};
        this.mouseHeld = false;
        this.targetX = 0;
        this.targetY = 0;
        this.canvas = canvas;
        this.initEventListeners();
    }

    initEventListeners() {
        // Key listeners
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);

        // Mouse listeners
        window.addEventListener('mousedown', (e) => {
            this.mouseHeld = true;
            this.setTargetPosition(e.offsetX, e.offsetY);
        });

        window.addEventListener('mouseup', () => {
            this.mouseHeld = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (this.mouseHeld) {
                this.setTargetPosition(e.offsetX, e.offsetY);
            }
        });

        // Touch listeners
        window.addEventListener('touchstart', (e) => {
            this.mouseHeld = true;
            const touch = e.touches[0];
            this.setTouchPosition(touch);
        });

        window.addEventListener('touchend', () => {
            this.mouseHeld = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (this.mouseHeld) {
                const touch = e.touches[0];
                this.setTouchPosition(touch);
            }
        });
    }

    setTargetPosition(x, y) {
        // Get the scale of the canvas based on its logical dimensions and rendered size
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // Adjust target coordinates based on scaling
        this.targetX = x * scaleX;
        this.targetY = y * scaleY;
    }

    setTouchPosition(touch) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        // Adjust target coordinates based on scaling
        this.targetX = (touch.clientX - rect.left) * scaleX;
        this.targetY = (touch.clientY - rect.top) * scaleY;
    }
}
