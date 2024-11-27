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
        player.powerUps.push(this.data.type);

        const onPowerDown = [];

        switch (this.data.type) {
            case 'speedBoost':
                player.speed *= this.data.value;

                // Reset speed after the duration ends
                onPowerDown.push(() => {
                    player.speed /= this.data.value;
                });
                break;
            case 'loveBoost':
                console.log('<3 <3 <3');
                break;
            default:
                console.warn('Unknown power-up type:', this.data.type);
        }

        setTimeout(() => {
            const index = player.powerUps.indexOf(this.data.type);
            if (index > -1) {
                player.powerUps.splice(index, 1);
            }
            onPowerDown.forEach(fn => fn());
        }, this.data.duration);
    }
}
