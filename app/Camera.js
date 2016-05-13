class Camera {
	constructor(game, x = 0, y = 0, scale = 1) {
		this.game = game;
		this.x = x;
		this.y = y;
		this.scale = scale;
	}

	getMidPoint() {
		return {
			x: this.game.canvas.width * 0.5,
			y: this.game.canvas.height * 0.5
		};
	}
}

export default Camera;