import Vector from './Vector';
import Destroyable from './Destroyable';

class Circle extends Destroyable {
	constructor(game, position = new Vector(0, 0), radius = 32, colour = '#ffffff') {
		super();
		this.game = game;
		this.position = position;
		this.radius = radius;
		this.colour = colour;
		this.alpha = 1;
	}

	update() {

	}

	render() {
		if (this.alive) {
			var midPoint = this.game.camera.getMidPoint();
			var x = midPoint.x + (this.position.x - this.game.camera.position.x) * this.game.camera.scale;
			var y = midPoint.y + (this.position.y - this.game.camera.position.y) * this.game.camera.scale;
			var radius = this.radius * this.game.camera.scale;

			var ctx = this.game.ctx;
			ctx.fillStyle = this.colour;
			ctx.globalAlpha = this.alpha;
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
}

export default Circle;