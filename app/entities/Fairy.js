import CallResponse from './CallResponse';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';
import Drum from './Drum';
import Note from './Note';
import KeySprite from './KeySprite';
// potential colours: #BCE7FD, C492B1, AF3B6E, 424651, 21FA90
// from https://coolors.co/app/bce7fd-c492b1-af3b6e-424651-21fa90
class Fairy extends CallResponse {
	constructor(game, position, lKey, rKey, lNotes, rNotes, zIndex) {
		super(game, position, lKey, rKey, lNotes, rNotes, zIndex);

		this.startPos = position;
		this.tag = 'fairy';
		this.rotation = 0;
		this.following = false;
		this.velocity = new Vector(0, 0);
		this.maxSpeed = 22;
		this.frictionMag = 5;
		this.trailRate = 0.5;
		this.useCache = false;
		this.speedMod = 1;
		this.tickCount = 0;
		this.isAwake = true;
		this.hidden = true;
    	this.colour = '#C492B1';
    	this.nest = null;
    	this.showHint = null;
    	this.hint = null;
    	this.hintShown = false;
		this.player = this.game.world.getEntitiesWithTagName('player')[0];

		this.drumPair.leftdrum.playCallback = function() {
			this.radius = 16;
			this.velocity.x -= this.game.tickers.sixteen.onbeat ? this.maxSpeed : -this.maxSpeed;
		}.bind(this);

		this.listenPair.pListener.checkPreviousCallback = function() {
			console.log('oh');
			if (this.hint != null) {
				this.hint.press();
			}
		}.bind(this);
		this.listenPair.qListener.checkPreviousCallback = function() {
			if (this.hint != null) {
				this.hint.press();
			}
		}.bind(this);

		this.drumPair.rightdrum.playCallback = function() {
			this.radius = 16;
			this.velocity.y += this.game.tickers.sixteen.onbeat ? this.maxSpeed : -this.maxSpeed;
			if (this.hint != null) {
				this.hint.press();
			}
		}.bind(this);
	}

	sleep() {
		this.mute(true);
		this.active = false;
		this.isAwake = false;
		this.drumPair.pause();
		this.drumPair.rewind();
		this.listenPair.rewind();
		this.listenPair.pause();
		this.setColour();
	}

	onComplete() {
		super.onComplete();
		this.completed = true;
		this.alpha = 0.5;
		console.log(this.getVolume());
		this.setVolume(this.getVolume() * 0.25);
		this.setColour();
		this.setLoops(true);
		this.nest.onFairyComplete();
	}

	wake() {
		// this.drumPair.wait();
		this.drumPair.start();
		this.hidden = false;
		this.radius = 0;
		this.mute(false);
		console.log(this);
		this.active = true;
		this.isAwake = true;
		this.playing = true;
		this.listening = false;

		this.setColour();

		if (this.showHint != null && !this.hintShown) {
			var pos = new Vector(0, 128);
			if (this.showHint == 'p') {
				pos = new Vector(384, -384);
			} else if (this.showHint == 'q') {
				pos = new Vector(-384, -384);
			}
			this.hintShown = true;
			this.hint = this.game.world.add(new KeySprite(
				this.game,
				pos,
				this.showHint,
				4
			));
			this.hint.automatic = false;
		}

		console.log(this.nest.position, this.startPos);
		this.position = this.player.position.add(this.startPos);
		console.log(this.position);
	}

	getVolume() {
		return this.drumPair.leftdrum.sound._volume;
	}

	setVolume(volume) {
		this.setLeftVolume(volume);
		this.setRightVolume(volume);
	}

	setLeftVolume(volume) {
		this.drumPair.leftdrum.sound.volume(volume);
	}

	setRightVolume(volume) {
		this.drumPair.rightdrum.sound.volume(volume);
	}

	update() {
		super.update();

		if (this.isAwake) {
			this.follow();
		
			this.friction();
			this.position = this.position.add(this.velocity);
			if (this.velocity.magnitude() > this.maxSpeed * Math.pow(this.speedMod, 2)) {
				this.velocity = this.velocity.normalised().times(this.maxSpeed * Math.pow(this.speedMod, 2));
			}
		} else {
			this.radius = Maths.lerp(this.radius, 0.25, 0);
		}
	}

	friction() {
		var toZero = this.velocity.normalised().times(-this.game.delta * 0.05);
		this.velocity.x = Maths.towardsValue(this.velocity.x, Math.abs(toZero.x) * this.frictionMag, 0);
		this.velocity.y = Maths.towardsValue(this.velocity.y, Math.abs(toZero.y) * this.frictionMag, 0);
	}

	follow() {
		var fvec = new Vector(this.position.x, this.position.y);
		var pvec = new Vector(this.player.position.x, this.player.position.y);
		var vec = pvec.minus(fvec); // vector from fairy to player
		var vecnorm = vec.normalised();
		var distance = Math.abs(vec.magnitude());
		var outer = 768/2;
		if(distance < outer/4){
			// too close for fairy! run away...
			//console.log("too close");
			this.velocity = this.velocity.add(vecnorm.times(this.maxSpeed * 0.5* this.game.delta*-1));
		}
		else if(distance > outer){
			// curious fairy will investigate...
			var limit = outer*2; // any further than this and it runs towards you at full speed
			var scale;
			if(distance > limit){this.scale = 1}
			else{
				distance = distance - outer;
				scale = ((distance/(limit-outer))*0.8)+0.05; // scales from 0.05 to 0.85
			}
			this.velocity = this.velocity.add(vecnorm.times(this.maxSpeed * scale * this.game.delta));
		}
		else {
			//in 'random move' distance
			if(this.velocity.magnitude() < this.maxSpeed*0.05){
				var random = new Vector(Math.random(),Math.random());
				random = random.times(this.maxSpeed*0.5);
				this.velocity = this.velocity.add(random);
			}

		}
	}

	render() {
		if (!this.hidden) {
			super.render(this.game.canvas, this.game.ctx);
		}
	}
}

export default Fairy;
