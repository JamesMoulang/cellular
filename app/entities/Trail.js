import Circle from '../Circle';
import Player from './Player';
import Vector from '../Vector';

class Trail extends Circle {
	constructor(game, position, radius, colour, velocity, zIndex) {
		super (game, position, radius, colour, zIndex);
		this.startRadius = radius;
		this.counter = 0;
		this.velocity = velocity;
		this.wiggle = new Vector(Math.random()-0.5, Math.random()-0.5).normalised().times(1);
		this.useCache = false;
	}

	update() {
		var toZero = this.velocity.normalised().times(-this.game.delta);
		this.velocity = this.velocity.add(toZero);
		this.position = this.position.add(this.velocity).add(this.wiggle.times(this.game.delta));
		this.radius -= this.game.delta * 0.5;
		if (this.radius < 0) {
			this.destroy();
		}
	}
}

export default Trail;