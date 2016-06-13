import Circle from '../Circle';
import _ from 'underscore';
import Vector from '../Vector';
import Trail from './Trail';
import Maths from '../Maths';
import Audio from '../Audio';
import KeySprite from './KeySprite';

class FairyNest extends Circle {
	constructor(game, position, colours, fairies, zIndex, lKey, rKey) {
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
		this.readyToStart = false;
		this.beatCounter = 0;
		this.shouldGivePlayerVoice = false;
		this.lKey = lKey;
		this.rKey = rKey;

		this.spaceHint = null;
		this.spaceTimeout = null;

		for (var i = 0; i < 10; i++) {
			var trail = this.game.world.add(new Trail(
				this.game,
				this.position, 
				this.radius * 0.5, 
				this.colour, 
				new Vector().random().times(10),
				this.zIndex - 2
			));
			trail.friction = 0;
			trail.shrinkSpeed = 0.5;

			trail.position = trail.position.add(trail.velocity.times(Math.random() * 100));
		}
	}

	onFairyComplete() {
		this.fairyIndex++;
		console.log(this.fairyIndex);
		if (this.fairyIndex >= this.fairies.length) {
			console.log("boom");
			this.shouldGivePlayerVoice = true;
		}

		this.readyToStart = true;
	}

	tick() {
		this.beatCounter++;

		if (this.beatCounter > 16) {
			this.beatCounter = 1;
			// Audio.play('B4');
			this.startIfWaiting();
			if (this.spaceHint != null) {
				this.spaceHint.press();
			}
		}
	}

	startIfWaiting() {
		if (this.readyToStart) {
			// Audio.play('B4');

			if (this.shouldGivePlayerVoice) {
				this.player.canSpeak();

				if (!this.game.shownSpaceHint) {
					this.spaceTimeout = setTimeout(function() {
						this.spaceHint = this.game.world.add(new KeySprite(
							this.game,
							new Vector(0, 128),
							'space',
							4
						));
						this.spaceHint.automatic = false;
					}.bind(this), 10000);
					this.game.shownSpaceHint = true;
				}
				this.shouldGivePlayerVoice = false;
			} else {
				this.player.muteMe();
			}

			for (var i = 0; i < this.fairies.length; i++) {
				if (i <= this.fairyIndex) {
					if (!this.fairies[i].isAwake) {
						this.fairies[i].wake();
					}
				}
			}
			this.readyToStart = false;
		}
	}

	onAttached() {
		this.targetRadius = Math.sqrt(
			Math.pow(this.game.canvas.width / this.game.camera.scale, 2) + 
			Math.pow(this.game.canvas.height / this.game.camera.scale, 2)) * 0.5 * 1.25;
		this.fillingScreen = true;
		this.radiusVelocity = -32;

		this.player = this.game.world.getEntitiesWithTagName('player')[0];
		this.player.giveSounds(this.lKey, this.rKey);
		if (this.shouldGivePlayerVoice) {
			this.player.canSpeak();
		} else {
			this.player.muteMe();
		}
		this.readyToStart = true;
		this.zIndex++;
		this.game.world.depthSort();
	}

	onUnattached(move) {
		this.zIndex--;
		this.game.world.depthSort();
		console.log("uh");
		this.readyToStart = false;
		this.radius = this.targetRadius;
		this.filledScreen = false;
		this.fillingScreen = false;
		this.returning = true;

		_.each(this.fairies, function(fairy) {
			fairy.sleep();
			fairy.position = fairy.position.add(move);
			fairy.hidden = true;
		}.bind(this));

		if (this.spaceTimeout != null) {
			clearTimeout(this.spaceTimeout);
		}

		if (this.spaceHint != null) {
			this.spaceHint.destroy();
		}
	}

	update() {
		if (this.fillingScreen) {
			if (!this.filledScreen) {
				this.radiusVelocity += 8 * this.game.delta;
				this.radius += this.radiusVelocity * this.game.delta;

				if (this.radius > 0.99 * this.targetRadius) {
					this.filledScreen = true;
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
						this.zIndex - 1
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
		} else {
			this.game.ctx.fillStyle = this.colour;
			this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
		}
	}
}

export default FairyNest;