import Circle from '../Circle';
import Vector from '../Vector';
import Maths from '../Maths';

class Explosion extends Circle {
	constructor(game, position) {
		super(game, position, 64, '#ffffff');
		this.counter = 0;
		this.waitTime = 1.5;
	}

	update() {
		this.counter += this.game.delta;
		if (this.colour == '#ffffff' && this.counter > this.waitTime) {
			this.colour = '#000000';
			this.counter = 0;
		}

		if (this.colour == '#000000' && this.counter > this.waitTime) {
			this.game.world.add(new Flame(
				this.game,
				this.position,
				this.radius * 0.75,
				4,
				false
			));
			this.destroy();
		}
	}
}

class Flame extends Circle {
	constructor(game, position, targetRadius, children, moving) {
		super(game, position, 0, '#ffa500');
		this.targetRadius = targetRadius;
		this.radius = this.targetRadius * 0.25;
		this.COLOURS = {
			FIRE: '#ffa500',
			SMOKE: '#000000'
		};
		this.onFire = true;
		if (children * 0.25 >= 1) {
			for (var i = 0; i < children; i++) {
				var wiggle = new Vector(
					targetRadius * (Math.random() - 0.5),
					targetRadius * (Math.random() - 0.5)
				);

				this.game.world.add(new Flame(
					this.game,
					this.position.add(wiggle),
					this.targetRadius * 0.75,
					children * 0.25,
					true
				));
			}
		}

		this.direction = new Vector(
			Math.random() - 0.5,
			Math.random() - 0.5
		).normalised();
	}

	update() {
		if (this.onFire) {
			this.position = this.position.add(this.direction.times(this.game.delta * 4));
			this.radius = Maths.lerp(this.radius, 0.2, this.targetRadius);
			if (this.radius > this.targetRadius * 0.9) {
				this.colour = this.COLOURS.SMOKE;
				this.onFire = false;
				this.direction = this.direction.times(0.5).add(this.game.windDirection).normalised();
			}
		} else {
			this.radius -= this.game.delta * 0.5;
			this.alpha = Maths.towardsValue(this.alpha, this.game.delta * 0.01, 0);
			this.position = this.position.add(this.direction.times(this.game.delta * 2));
			if (this.radius < 0) {
				this.destroy();
			}
		}
	}
}

class Scorch extends Circle {
	
}

export default Explosion;