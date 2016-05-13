import Vector from './Vector';

class Triangle {
	constructor(game, x, y, base, length, angle, colour) {
		this.game = game;
		this.position = new Vector(x, y);
		this.base = base;
		this.length = length;
		this.angle = angle;
		this.alpha = 1;
		this.colour = colour;

		this.vertices = [
			new Vector(-0.5 * this.base, 0.5 * this.length),
			new Vector(0.5 * this.base, 0.5 * this.length),
			new Vector(0, -0.5 * this.length)
		];

		this.rotatedVertices = [new Vector(), new Vector(), new Vector()];
		this.setRotation(0);
	}

	update() {

	}

	setRotation(rad) {
		var cos = Math.cos(rad);
		var sin = Math.sin(rad);

		for (var i = 0; i < this.vertices.length; i++) {
			var v = this.vertices[i];
			var c = new Vector();

			var x = (cos * (v.x - c.x)) + (sin * (v.y - c.y)) + c.x;
			var y = (cos * (v.y - c.y)) - (sin * (v.x - c.x)) + c.y;

			this.rotatedVertices[i].x = x;
			this.rotatedVertices[i].y = y;
		}
	}

	render() {
		var midPoint = this.game.camera.getMidPoint();
		var x = midPoint.x + (this.position.x - this.game.camera.x);
		var y = midPoint.y + (this.position.y - this.game.camera.y);

		var ctx = this.game.ctx;
		ctx.fillStyle = this.colour;
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.moveTo(x + this.rotatedVertices[0].x, y + this.rotatedVertices[0].y);
		for (var i = 1; i < this.rotatedVertices.length; i++) {
			ctx.lineTo(x + this.rotatedVertices[i].x, y + this.rotatedVertices[i].y);
		}
		ctx.closePath();
		ctx.fill();
	}
}

export default Triangle;