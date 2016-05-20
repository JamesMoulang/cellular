import Circle from '../Circle';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';

class Player extends Circle {
	constructor(game, position) {
		super(game, position, 16, '#ffa500');
		this.rotation = 0;
		this.counter = 0;
		this.velocity = new Vector(0, 0);
		this.maxSpeed = 10;
		this.trailRate = 0.5;
	}

	update() {
		this.counter += this.game.delta;

		var inputVector = new Vector(
			this.game.input.horizontal,
			this.game.input.vertical
		);

		this.rotation = -this.position.angleTo(this.game.input.pointer.world) - Math.PI * 0.5;
		this.velocity = this.velocity.add(inputVector.normalised().times(this.game.delta * 0.5));
		this.friction();
		if (this.velocity.magnitude() > this.maxSpeed) {
			this.colour = '#08ee80';
			this.velocity = this.velocity.normalised().times(this.maxSpeed);
			this.trailRate = 0;
		} else {
			this.colour = '#ffa500';
			this.trailRate = 1.5;
		}
		this.position = this.position.add(this.velocity);

		if (this.game.input.pointer.clicked) {
			this.fire();
		}

		if (this.counter > this.trailRate) {
			this.game.world.add(new Trail(
				this.game, 
				this.position, 
				this.radius, 
				this.colour, 
				this.velocity.times(0.5)
			));

			this.counter = 0;
		}
		
		//TODO: camera dead zone.
		this.game.camera.lerp(this.position, 0.05);
	}

	fire() {
		this.game.world.add(new Grenade(
			this.game,
			this.position,
			this.game.input.pointer.world,
			25,
			this.velocity
		));
	}

	friction() {
		var toZero = this.velocity.normalised().times(-this.game.delta * 0.125);
		this.velocity.x = Maths.towardsValue(this.velocity.x, Math.abs(toZero.x), 0);
		this.velocity.y = Maths.towardsValue(this.velocity.y, Math.abs(toZero.y), 0);
	}
}

export default Player;