import Circle from '../Circle';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';
import Drum from './Drum';
import Note from './Note';

class Player extends Circle {
	constructor(game, position) {
		super(game, position);
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

		//Drum inputs.
		this.verticalDrum = {
			active: false,
			timestamp: 0
		};
		this.horizontalDrum = {
			active: false,
			timestamp: 0
		};
		this.lastBeatTimeStamp = 0;

		this.drum = new Drum(
			game, 
			'tick', 
			new Vector(0, 0, 0), 
			[
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2)
			],
			this.play.bind(this)
		);
		this.game.tickers.sixteen.subscribe(this.drum);
		this.onbeat = false;
	}

	play() {
		this.lastBeatTimeStamp = this.game.timestamp();
		this.onbeat = !this.onbeat;
		if (this.onbeat) {
			this.drum.sound.play();
		}
		this.checkBeats(true);

	}

	checkBeats(clear) {
		var timestamp = this.lastBeatTimeStamp;
		var timeslot = this.game.tickers.sixteen.allowableTime;

		if (this.verticalDrum.active && Math.abs(timestamp - this.verticalDrum.timestamp) <= timeslot) {
			this.velocity.y += (this.onbeat ? -1 : 1) * 750;
			this.radius = 64;
		}

		if (this.horizontalDrum.active && Math.abs(timestamp - this.horizontalDrum.timestamp) <= timeslot) {
			this.velocity.x += (this.onbeat ? 1 : -1) * 750;
			this.radius = 64;
		}

		if (clear) {
			this.horizontalDrum.active = false;
			this.verticalDrum.active = false;
		}
	}

	directControl() {
		var inputVector = new Vector(
			this.game.input.horizontal,
			this.game.input.vertical
		);

		this.velocity = this.velocity.add(inputVector.normalised().times(this.game.delta * 0.5 * Math.pow(this.speedMod, 3)));
	}

	drumControl() {
		var timestamp = this.game.timestamp();

		if (this.game.input.p.clicked) {
			console.log("p");
			this.horizontalDrum.active = true;
			this.horizontalDrum.timestamp = timestamp;
			this.checkBeats();
		}

		if (this.game.input.q.clicked) {
			console.log("q");
			this.verticalDrum.active = true;
			this.verticalDrum.timestamp = timestamp;
			this.checkBeats();
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