import Circle from '../Circle';
import Vector from '../Vector';
import Maths from '../Maths';
import Explosion from './Explosion';

class Grenade extends Circle {
	constructor(game, position, target, speed, velocity) {
		super(game, position, 4, '#ff0000');
		this.realRadius = this.radius;
		this.target = target;
		this.altitude = 0;
		this.speed = speed;
		this.direction = this.target.minus(this.position).normalised();
		this.velocity = velocity;
		this.airVelocity = 1;
	}

	update() {
		this.position = this.position.add(this.direction.times(this.speed*this.game.delta)).add(this.velocity.times(this.game.delta));
		this.airVelocity += this.game.gravity * this.game.delta;
		this.altitude += this.airVelocity * this.game.delta;
		if (this.altitude <= 0) {
			this.game.world.add(new Explosion(
				this.game,
				this.position
			));
			this.destroy();
		}

		this.radius = this.realRadius * (this.altitude + 1) / 1;
	}
}

export default Grenade;