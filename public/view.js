// view.js

export class GameColors {
    constructor() {
        // Rainbow color cycle counter
        this.rainbowCycle = 0;
        this.rainbowIndex = 0;
        this.rainbowFrameInterval = 10;

        this.colors = [
            'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
        ];

        // Cute color mapping for GameObject labels
        this.labelColors = {
            'Player': 'white',
            'Bio': 'rgba(0, 0, 0, 0)', // DarkGreen
            'GitHub': 'rgba(0, 0, 0, 0)', // DarkBlue
            'Mystery': '', // Indigo
            'PowerUp': '', // rainbow
            'Heart': '#8B0000' // DarkRed
        };
    }

    getRainbowColor() {
        this.rainbowCycle++;
        if (this.rainbowCycle % this.rainbowFrameInterval === 0) {
            this.rainbowIndex++;
        }
        return this.colors[this.rainbowIndex % this.colors.length];
    }

    getLabelColor(label) {
        return this.labelColors[label] || this.getRainbowColor();
    }
}

export class Fireworks {
    constructor(canvas, message, color, fontStyle) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fireworks = [];
        this.gravity = 0.02; // Reduce gravity for slower effect
        this.sparkLife = 100; // Increase spark life for longer duration

        this.message = message;
        this.color = color;
        this.fontStyle = fontStyle;
    }

    createFirework(x, y) {
        const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
        const sparks = [];
        for (let i = 0; i < 100; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1; // Reduce speed for slower movement
            sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: this.sparkLife
            });
        }
        this.fireworks.push(sparks);
    }

    update() {
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const sparks = this.fireworks[i];
            for (let j = sparks.length - 1; j >= 0; j--) {
                const spark = sparks[j];
                spark.vy += this.gravity;
                spark.x += spark.vx;
                spark.y += spark.vy;
                spark.life--;
                if (spark.life <= 0) {
                    sparks.splice(j, 1);
                }
            }
            if (sparks.length === 0) {
                this.fireworks.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = this.color;
        this.ctx.font = this.fontStyle;
        this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height / 2);

        for (const sparks of this.fireworks) {
            for (const spark of sparks) {
                this.ctx.fillStyle = spark.color;
                this.ctx.beginPath();
                this.ctx.arc(spark.x, spark.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    run() {
        this.update();
        this.draw();
        if (this.fireworks.length > 0) {
            requestAnimationFrame(() => this.run());
        }
    }

    startFireworksDisplay() {
        // Create fireworks at random positions
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createFirework(Math.random() * this.canvas.width, Math.random() * this.canvas.height / 2);
                this.run();
            }, i * 1000); // Increase interval for smoother timing
        }
    }
}

export class ParticleExplosion {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 300;
        this.gravity = 0.05;
    }

    createExplosion(x, y) {
        const colors = ['#FF6347', '#FF4500', '#FFD700', '#32CD32', '#1E90FF', '#8A2BE2'];
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 100 + Math.random() * 100,
                radius: Math.random() * 3 + 1
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.vy += this.gravity;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    run() {
        this.update();
        this.draw();
        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.run());
        }
    }

    startExplosionDisplay() {
        // Create an explosion at the center of the canvas
        this.createExplosion(this.canvas.width / 2, this.canvas.height / 2);
        this.run();
    }
}




export class GameView {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.backgroundImage = new Image();
        this.backgroundImage.src = './img/bg2.jpg';

        // Set the base canvas dimensions (logical size)
        this.logicalWidth = 1024;
        this.logicalHeight = 1024;
        this.canvas.width = this.logicalWidth;
        this.canvas.height = this.logicalHeight;

        // Adjust the canvas scaling to match the screen size
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();

        // add Colors module
        this.colors = new GameColors();

        // add fireworks module
        this.fireworks = new Fireworks(this.canvas, 'You Win!', 'white', '50px Arial');
        
        // this.particles = new ParticleExplosion(this.canvas);
    }

    resizeCanvas() {
        const scale = Math.min(window.innerWidth / this.logicalWidth, window.innerHeight / this.logicalHeight);
        this.canvas.style.width = `${this.logicalWidth * scale}px`;
        this.canvas.style.height = `${this.logicalHeight * scale}px`;
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
        this.ctx.fillStyle = player.powerUps.includes('loveBoost') ? 'pink' : color;
        this.ctx.fillRect(player.x, player.y, player.size, player.size);
    }

    drawOrbitingDot(player) {
        const orbitX = player.x + player.size / 2 + 40 * Math.cos(player.orbitAngle);
        const orbitY = player.y + player.size / 2 + 40 * Math.sin(player.orbitAngle);
        this.ctx.fillStyle = this.colors.getRainbowColor();
        this.ctx.beginPath();
        this.ctx.arc(orbitX, orbitY, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawObject(obj) {
        this.ctx.fillStyle = this.colors.getLabelColor(obj.label);
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
        // this.ctx.fillStyle = 'Red';
        // this.ctx.font = '22px Courier';
        // this.ctx.fillText(obj.label, obj.x + 10, obj.y + obj.size + 15);
    }

    drawCollisionDialogue() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.font = '22px Arial';
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
                this.ctx.fillText(outputLine, debugX, debugY * lineCount);
            });
        };
        appendOutput(`Player: ${JSON.stringify(model.player, null, 2)}`);
        appendOutput(`InputHandler: ${JSON.stringify(controller.inputHandler, null, 2)}`);
    }

    drawWinScreen() {
        // Display fireworks
        this.fireworks.startFireworksDisplay();

        // Display the win message
        // this.ctx.fillStyle = 'white';
        // this.ctx.font = '50px Arial';
        // this.ctx.textAlign = 'center';
        // this.ctx.fillText('You Win!', this.canvas.width / 2, this.canvas.height / 2);
    }
}
