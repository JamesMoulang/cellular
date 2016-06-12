import CallResponse from './CallResponse';
import Trail from './Trail';
import Vector from '../Vector';
import Maths from '../Maths';
import Grenade from './Grenade';
import Drum from './Drum';
import Note from './Note';
// potential colours: #BCE7FD, C492B1, AF3B6E, 424651, 21FA90
// from https://coolors.co/app/bce7fd-c492b1-af3b6e-424651-21fa90
class Fairy extends CallResponse {
	constructor(game, position, lKey, rKey, lNotes, rNotes, zIndex) {
		super(game, position, lKey, rKey, lNotes, rNotes, zIndex);
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
    	this.colour = '#C492B1';
		this.player = this.game.world.getEntitiesWithTagName('player')[0];
		//console.log("should be printing");
		console.log(this.player);
	}

	sleep() {
		this.isAwake = false;
	}

	wake() {

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
		}
	}

	friction() {
		var toZero = this.velocity.normalised().times(-this.game.delta * 0.05);
		this.velocity.x = Maths.towardsValue(this.velocity.x, Math.abs(toZero.x) * this.frictionMag, 0);
		this.velocity.y = Maths.towardsValue(this.velocity.y, Math.abs(toZero.y) * this.frictionMag, 0);
	}

	follow(){
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


}

export default Fairy;
