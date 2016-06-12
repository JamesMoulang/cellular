import Circle from '../Circle';
import _ from 'underscore';
import Vector from '../Vector';
import Trail from './Trail';

class FairyNest extends Circle {
	constructor(game, position, colours, fairies, zIndex) {
		super(game, position, 768*0.6, colours[0], zIndex);
		this.tag = 'nest';
		this.colours = colours;
		this.fairies = fairies;
		this.fairyIndex = 0;
		_.each(this.fairies, function(fairy) {
			fairy.sleep();
		});
		this.fairies[this.fairyIndex].wake();
		this.counter = 0;
		this.trailRate = 5;
		this.fillingScreen = false;
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

	onAttached() {

	}

	update() {
		this.counter += this.game.delta;

		if (this.fillingScreen) {

		} else {
			if (this.counter > this.trailRate) {
				var trail = this.game.world.add(new Trail(
					this.game,
					this.position, 
					this.radius * 0.5, 
					this.colour, 
					new Vector().random().times(10),
					this.zIndex
				));
				trail.friction = 0;
				trail.shrinkSpeed = 0.5;

				this.counter = 0;
			}
		}
	}

	render() {
		
	}
}

export default FairyNest;