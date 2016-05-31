import Circle from '../Circle';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';

class Player extends Circle {
	constructor(game, position) {
		super(game, position, 16, '#ffa500');
		this.tag = 'player';
		this.rotation = 0;
		this.counter = 0;
		this.velocity = new Vector(0, 0);
		this.maxSpeed = 10;
		this.trailRate = 0.5;
		this.useCache = false;
		this.state = null;
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

		// if (this.game.input.pointer.clicked) {
		// 	this.fire();
		// }

		if (this.game.input.space.clicked) {
			for (var i = 0; i < this.state.drums.length; i++) {
				if (this.position.distance(this.state.drums[i].position) <= this.radius + this.state.drums[i].radius) {
					console.log(this.state.drums[i]);
					this.state.drums[i].activate();
				}
			}
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
		this.game.camera.followPlayer(this.position);
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