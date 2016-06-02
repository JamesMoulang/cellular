import Circle from '../Circle';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';
import Drum from './Drum';
import Note from './Note';

class Player extends Drum {
	constructor(game, position) {
		super(game, 'tom2', position, 16, '#ffa500', [
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 4),
			new Note(false, 8),
			new Note(false, 16),
			new Note(false, 4),
			new Note(false, 4),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 4),
			new Note(false, 4),
			new Note(true, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(true, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 4),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 2),
			new Note(false, 4),
			new Note (false, 4),
			new Note (false, 2),
			new Note (false, 2),
			new Note (false, 4),
			new Note (false, 2),
			new Note (false, 2),
			new Note (false, 4),
			new Note (false, 4),
			new Note (false, 8)
		]);
		this.tag = 'player';
		this.rotation = 0;
		this.counter = 0;
		this.velocity = new Vector(0, 0);
		this.maxSpeed = 10;
		this.trailRate = 0.5;
		this.useCache = false;
		this.state = null;

		this.speedMod = 1;
		this.tickCount = 0;
		this.game.tickers.sixteen.subscribe(this);
	}

	play() {
		super.play();
		this.radius = 64;
		this.speedMod = 2.5;
	}

	update() {
		this.counter += this.game.delta;

		this.radius = Maths.towardsValue(this.radius, this.game.delta * 8, 16);
		this.speedMod = Maths.towardsValue(this.speedMod, this.game.delta * 0.1, 1);

		var inputVector = new Vector(
			this.game.input.horizontal,
			this.game.input.vertical
		);

		this.rotation = -this.position.angleTo(this.game.input.pointer.world) - Math.PI * 0.5;
		this.velocity = this.velocity.add(inputVector.normalised().times(this.game.delta * 0.5 * Math.pow(this.speedMod, 3)));
		this.friction();
		if (this.velocity.magnitude() > this.maxSpeed * Math.pow(this.speedMod, 2)) {
			this.colour = '#08ee80';
			this.velocity = this.velocity.normalised().times(this.maxSpeed * Math.pow(this.speedMod, 2));
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