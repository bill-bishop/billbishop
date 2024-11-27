// input_handler.js
export class InputHandler {
    constructor(canvas) {
        this._keys = {};
        this._mouseHeld = false;
        this._targetX = 0;
        this._targetY = 0;
        this._canvas = canvas;
        this._initEventListeners();
    }

    _initEventListeners() {
        // Key listeners
        window.addEventListener('keydown', (e) => this._keys[e.key] = true);
        window.addEventListener('keyup', (e) => this._keys[e.key] = false);

        // Mouse listeners
        this._canvas.addEventListener('mousedown', (e) => {
            this._mouseHeld = true;
            this._setTargetPosition(e.offsetX, e.offsetY);
        });

        this._canvas.addEventListener('mouseup', () => {
            this._mouseHeld = false;
        });

        this._canvas.addEventListener('mousemove', (e) => {
            if (this._mouseHeld) {
                this._setTargetPosition(e.offsetX, e.offsetY);
            }
        });

        // Touch listeners
        this._canvas.addEventListener('touchstart', (e) => {
            this._mouseHeld = true;
            const touch = e.touches[0];
            this._setTouchPosition(touch);
        });

        this._canvas.addEventListener('touchend', () => {
            this._mouseHeld = false;
        });

        this._canvas.addEventListener('touchmove', (e) => {
            if (this._mouseHeld) {
                const touch = e.touches[0];
                this._setTouchPosition(touch);
            }
        });
    }

    _setTargetPosition(x, y) {
        const rect = this._canvas.getBoundingClientRect();
        const scaleX = this._canvas.width / rect.width;
        const scaleY = this._canvas.height / rect.height;

        this._targetX = x * scaleX;
        this._targetY = y * scaleY;
    }

    _setTouchPosition(touch) {
        const rect = this._canvas.getBoundingClientRect();
        const scaleX = this._canvas.width / rect.width;
        const scaleY = this._canvas.height / rect.height;

        this._targetX = (touch.clientX - rect.left) * scaleX;
        this._targetY = (touch.clientY - rect.top) * scaleY;
    }

    get keys() {
        return { ...this._keys }; // Return a copy to prevent modification
    }

    get mouseHeld() {
        return this._mouseHeld;
    }

    get targetX() {
        return this._targetX;
    }

    get targetY() {
        return this._targetY;
    }
}

// The InputHandler is designed to prevent direct modification of its internal state from outside the class, ensuring a read-only interface.
