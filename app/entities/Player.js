import Circle from '../Circle';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';
import Drum from './Drum';
import Note from './Note';
import _ from 'underscore';

class Player extends Circle {
	constructor(game, position) {
		super(game, position, null, null, 3);
		this.tag = 'player';
		this.rotation = 0;
		this.counter = 0;
		this.velocity = new Vector(0, 0);
		this.maxSpeed = 25;
		this.frictionMag = 5;
		this.trailRate = 0.5;
		this.useCache = false;
		this.speedMod = 1;
		this.tickCount = 0;
		this.attachedTo = null;
	}

	directControl() {
		var inputVector = new Vector(
			this.game.input.horizontal,
			this.game.input.vertical
		);

		this.velocity = this.velocity.add(inputVector.normalised().times(this.game.delta * 0.5 * Math.pow(this.speedMod, 3)));
	}

	drumControl() {
		if (this.game.input.p.clicked) {
			this.game.triggerBeat(true);
		}

		if (this.game.input.q.clicked) {
			this.game.triggerBeat(false);
		}
	}

	update() {
		this.counter += this.game.delta;

		this.radius = Maths.towardsValue(this.radius, this.game.delta * 8, 16);
		this.speedMod = Maths.towardsValue(this.speedMod, this.game.delta * 0.1, 1);
		this.drumControl();
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

		if (this.game.input.space.clicked) {
			var nests = this.game.world.getEntitiesWithTagName('nest');
			
			if (nests.length > 0) {
				var sorted = _.sortBy(nests, (nest) => {
					return nest.position.distance(this.position);
				});

				var nest = sorted[0];
				if (nest.position.distance(this.position) < 768 * 0.5) {
					this.attachTo(nest);
				}
			}
		}



		if (this.counter > this.trailRate) {
			this.game.world.add(new Trail(
				this.game, 
				this.position, 
				this.radius,
				this.colour, 
				this.velocity.times(0.5),
				this.zIndex
			));

			this.counter = 0;
		}
		
		//TODO: camera dead zone.
		this.game.camera.followPlayer(this.position);
	}

	attachTo(nest) {
		this.attachedTo = nest;
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
		this.velocity.x = Maths.towardsValue(this.velocity.x, Math.abs(toZero.x) * this.frictionMag, 0);
		this.velocity.y = Maths.towardsValue(this.velocity.y, Math.abs(toZero.y) * this.frictionMag, 0);
	}
}

export default Player;