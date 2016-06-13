import Destroyable from '../Destroyable';
import Images from '../Images';
import Vector from '../Vector';

class Sprite extends Destroyable {
	constructor(game, position, key, zIndex) {
		super(zIndex);
		this.game = game;
		this.key = key;
		if (!Images.cache[key]) {
			console.warn('no image with this key.');
		} else {
			this.image = Images.cache[key];
		}
		this.position = position;
		this.anchor = {
			x: 0.5,
			y: 0.5
		};
		this.width = this.image.width;
		this.height = this.image.height;
	}

	setAnchor(x, y) {
		this.anchor.x = x;
		this.anchor.y = y;
	}

	loadTexture(key) {
		if (!Images.cache[key]) {
			console.warn('no image with this key.');
		} else {
			this.image = Images.cache[key];
			this.width = this.image.width;
			this.height = this.image.height;
		}
	}

	update() {

	}

	render(canvas, ctx) {
		if (this.alive) {
			var midPoint = this.game.camera.getMidPoint();
			var x = midPoint.x + (this.position.x - this.game.camera.position.x - this.width * this.anchor.x) * this.game.camera.scale;
			var y = midPoint.y + (this.position.y - this.game.camera.position.y + this.height * this.anchor.y) * this.game.camera.scale;
			ctx.drawImage(
				this.image,
				x, 
				y, 
				this.width * this.game.camera.scale, 
				this.height * this.game.camera.scale
			);
		}
	}
}

export default Sprite;