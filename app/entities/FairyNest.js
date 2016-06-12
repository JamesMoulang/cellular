import Circle from '../Circle';
import _ from 'underscore';
import Vector from '../Vector';
import Trail from './Trail';
import Maths from '../Maths';

class FairyNest extends Circle {
	constructor(game, position, colours, fairies, zIndex) {
		super(game, position, 768*0.4, colours[0], zIndex);
		this.tag = 'nest';
		this.colours = colours;
		this.fairies = fairies;
		this.fairyIndex = 0;
		_.each(this.fairies, function(fairy) {
			fairy.sleep();
			fairy.position = fairy.position.add(this.position);
			fairy.setColours(colours[1], colours[2], colours[3]);
			fairy.nest = this;
		}.bind(this));
		// this.fairies[this.fairyIndex].wake();
		this.counter = 0;
		this.trailRate = 5;
		this.fillingScreen = false;
		this.filledScreen = false;
		this.targetRadius = 0;
		this.startRadius = this.radius;
		this.radiusVelocity = 0;
		this.returning = false;
	}

	onFairyComplete() {
		this.fairyIndex++;
		console.log(this.fairyIndex);
		if (this.fairyIndex >= this.fairies.length) {
			console.log("boom");
		} else {
			this.fairies[this.fairyIndex].wake();
		}
	}

	onAttached() {
		this.targetRadius = Math.sqrt(
			Math.pow(this.game.canvas.width / this.game.camera.scale, 2) + 
			Math.pow(this.game.canvas.height / this.game.camera.scale, 2)) * 0.5 * 1.25;
		this.fillingScreen = true;
		this.radiusVelocity = -32;

		for (var i = 0; i < this.fairies.length; i++) {
			if (i <= this.fairyIndex) {
				this.fairies[i].wake();
			}
		}
	}

	onUnattached(move) {
		console.log("uh");
		this.radius = this.targetRadius;
		this.filledScreen = false;
		this.fillingScreen = false;
		this.game.backgroundColour = '#ffffff';
		this.returning = true;

		_.each(this.fairies, function(fairy) {
			fairy.sleep();
			fairy.position = fairy.position.add(move);
			fairy.hidden = true;
		}.bind(this));
	}

	update() {
		// console.log(this.fairies[this.fairyIndex].position.minus(this.fairies[this.fairyIndex].player.position));


		if (this.fillingScreen) {
			if (!this.filledScreen) {
				this.radiusVelocity += 8 * this.game.delta;
				this.radius += this.radiusVelocity * this.game.delta;

				if (this.radius > 0.99 * this.targetRadius) {
					this.filledScreen = true;
					this.game.backgroundColour = this.colour;
				}
			}
		} else {
			if (this.returning) {
				this.radius = Maths.lerp(this.radius, 0.2, this.startRadius);
				if (this.radius < this.startRadius + 4) {
					this.radius = this.startRadius;
					this.returning = false;
				}
			} else {
				this.counter += this.game.delta;
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
	}

	render() {
		if (!this.filledScreen) {
			super.render(this.game.canvas, this.game.ctx);
		}
	}
}

export default FairyNest;