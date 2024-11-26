// view.js

export class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.font = '12px Arial';
        this.backgroundImage = new Image();
        this.backgroundImage.src = './img/bg1.jpg';
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        if (this.backgroundImage.complete) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.backgroundImage.onload = () => {
                this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            };
        }
    }

    drawPlayer(player, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    drawOrbitingDot(player) {
        const orbitX = player.x + player.size / 2 + 40 * Math.cos(player.orbitAngle);
        const orbitY = player.y + player.size / 2 + 40 * Math.sin(player.orbitAngle);
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(orbitX, orbitY, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawObject(obj) {
        this.ctx.fillStyle = obj.label === 'PowerUp' ? 'white' : 'red';
        switch (obj.shape) {
            case 'circle':
                this.ctx.beginPath();
                this.ctx.arc(obj.x + obj.size / 2, obj.y + obj.size / 2, obj.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'triangle':
                this.ctx.beginPath();
                this.ctx.moveTo(obj.x + obj.size / 2, obj.y);
                this.ctx.lineTo(obj.x, obj.y + obj.size);
                this.ctx.lineTo(obj.x + obj.size, obj.y + obj.size);
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'hexagon':
                const hexSize = obj.size / 2;
                this.ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    this.ctx.lineTo(
                        obj.x + hexSize + hexSize * Math.cos((i * Math.PI) / 3),
                        obj.y + hexSize + hexSize * Math.sin((i * Math.PI) / 3)
                    );
                }
                this.ctx.closePath();
                this.ctx.fill();
                break;
            case 'dot':
                this.ctx.beginPath();
                this.ctx.arc(obj.x, obj.y, obj.size, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 'heart':
                this.ctx.fillStyle = 'pink';
                this.ctx.beginPath();
                const topCurveHeight = obj.size * 0.3;
                this.ctx.moveTo(obj.x, obj.y + topCurveHeight);
                this.ctx.bezierCurveTo(
                    obj.x, obj.y,
                    obj.x - obj.size / 2, obj.y,
                    obj.x - obj.size / 2, obj.y + topCurveHeight
                );
                this.ctx.bezierCurveTo(
                    obj.x - obj.size / 2, obj.y + (obj.size + topCurveHeight) / 2,
                    obj.x, obj.y + (obj.size + topCurveHeight) / 1.5,
                    obj.x, obj.y + obj.size
                );
                this.ctx.bezierCurveTo(
                    obj.x, obj.y + (obj.size + topCurveHeight) / 1.5,
                    obj.x + obj.size / 2, obj.y + (obj.size + topCurveHeight) / 2,
                    obj.x + obj.size / 2, obj.y + topCurveHeight
                );
                this.ctx.bezierCurveTo(
                    obj.x + obj.size / 2, obj.y,
                    obj.x, obj.y,
                    obj.x, obj.y + topCurveHeight
                );
                this.ctx.closePath();
                this.ctx.fill();
                break;
            default:
                this.ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
                break;
        }
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(obj.label, obj.x + 10, obj.y + obj.size + 15);
    }

    drawCollisionDialogue() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '12px Arial';
        this.ctx.fillText('Press "X" or Tap Screen', this.canvas.width / 2 - 120, this.canvas.height / 2);
    }

    drawDebugDialogue(model, view, controller) {
        this.ctx.fillStyle = 'cyan';
        this.ctx.font = '8px Courier';

        const debugX = 0;
        const debugY = 10;
        let lineCount = 0;
        const appendOutput = output => {
            output.split('\n').forEach(outputLine => {
                lineCount += 1;
                this.ctx.fillText(outputLine, debugX, debugY*lineCount);
            });
        };
        appendOutput(`Player: ${JSON.stringify(model.player, null, 2)}`);
        appendOutput(`InputHandler: ${JSON.stringify(controller.inputHandler, null, 2)}`)
    }

    drawWinScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw a cool pattern
        for (let i = 0; i < 200; i++) {
            this.ctx.beginPath();
            this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, Math.random() * 50, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            this.ctx.fill();
        }

        // Display the win message
        this.ctx.fillStyle = 'white';
        this.ctx.font = '50px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2);
    }
}
