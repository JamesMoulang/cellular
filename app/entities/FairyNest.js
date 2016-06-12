import Circle from '../Circle';
import _ from 'underscore';

class FairyNest extends Circle {
	constructor(game, position, colours, fairies, zIndex) {
		super(game, position, 768*0.4, colours[0], zIndex);
		this.colours = colours;
		this.fairies = fairies;
		this.fairyIndex = 0;
		_.each(this.fairies, function(fairy) {
			fairy.sleep();
		});
		this.fairies[this.fairyIndex].wake();
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

	}
}

export default FairyNest;