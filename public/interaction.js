// interaction.js

export class Interaction {
    constructor(type, data) {
        this.type = type;
        this.data = data;
    }

    execute(player, obj, model) {
        switch (this.type) {
            case 'navigate':
                window.location.href = this.data.url;
                break;
            case 'win':
                model.state = 'PlayerWin';
                break;
            case 'powerup':
                this.applyPowerUp(player);
                break;
            default:
                console.warn('Unknown interaction type:', this.type);
        }
    }

    applyPowerUp(player) {
        if (this.data.type === 'speedBoost') {
            player.speed *= this.data.value;
            player.powerUps.push('speedBoost');

            // Reset speed after the duration ends
            setTimeout(() => {
                player.speed /= this.data.value;
                const index = player.powerUps.indexOf('speedBoost');
                if (index > -1) {
                    player.powerUps.splice(index, 1);
                }
            }, this.data.duration);
        } else {
            console.warn('Unknown power-up type:', this.data.type);
        }
    }
}
