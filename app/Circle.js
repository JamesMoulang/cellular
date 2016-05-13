class Circle {
	constructor(game, x = 0, y = 0, radius = 32, colour = '#ffffff') {
		this.game = game;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.colour = colour;
		this.alpha = 1;
	}

	update() {
		
	}

	render() {
		var midPoint = this.game.camera.getMidPoint();
		var x = midPoint.x + (this.x - this.game.camera.x);
		var y = midPoint.y + (this.y - this.game.camera.y);
		var radius = this.radius * this.game.camera.scale;

		var ctx = this.game.ctx;
		ctx.fillStyle = this.colour;
		ctx.globalAlpha = this.alpha;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.fill();
	}
}

export default Circle;