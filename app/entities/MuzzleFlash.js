import Circle from '../Circle';
import Player from './Player';

class MuzzleFlash extends Circle {
	constructor(player, position) {
		super (player.game, position, 12, '#ffffff');
		this.player = player;
		this.counter = 0;
	}

	update() {
		console.log(this.alive);
		if (this.counter < 1) {
			this.counter += this.game.delta;
		} else {
			this.destroy();
		}
	}
}

export default MuzzleFlash;