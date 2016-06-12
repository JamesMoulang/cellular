import Circle from '../Circle';
import _ from 'underscore';
import Vector from '../Vector';
import Trail from './Trail';

class FairyNest extends Circle {
	constructor(game, position, colours, fairies, zIndex) {
		super(game, position, 768*0.4, colours[0], zIndex);
		this.tag = 'nest';
		this.colours = colours;
		this.fairies = fairies;
		this.fairyIndex = 0;
		_.each(this.fairies, function(fairy) {
			fairy.sleep();
		});
		this.fairies[this.fairyIndex].wake();
		this.counter = 0;
		this.trailRate = 25;
	}

	onFairyComplete() {
		this.fairyIndex++;
		if (this.fairyIndex == this.fairies.length) {
			console.log("boom");
		} else {
			this.fairies[this.fairyIndex - 1].addToNest();
			this.fairies[this.fairyIndex].wake();
		}
	}

	update() {
		this.counter += this.game.delta;

		if (this.counter > this.trailRate) {
			var trail = this.game.world.add(new Trail(
				this.game,
				this.position, 
				this.radius * 0.5, 
				this.colour, 
				new Vector().random().times(40),
				this.zIndex
			));

			trail.shrinkSpeed = 0.5;
		}
	}
}

export default FairyNest;