import Circle from '../Circle';
import Player from './Player';
import Vector from '../Vector';

class MuzzleFlash extends Circle {
	constructor(player, position) {
		super (player.game, position, 12, '#ffffff');
		this.player = player;
		this.counter = 0;
		this.direction = new Vector(Math.random() - 0.5, Math.random() - 0.5);
	}

	update() {
		this.position = this.position.add(this.direction);
		this.radius -= this.game.delta * 0.5;
		if (this.radius < 0) {
			this.destroy();
		}
	}
}

export default MuzzleFlash;