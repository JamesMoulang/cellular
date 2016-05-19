import Vector from './Vector';

class Camera {
	constructor(game, x = 0, y = 0, scale = 1) {
		this.position = new Vector(x, y);
		this.game = game;
		this.scale = scale;
	}

	getMidPoint() {
		return new Vector(
			this.game.canvas.width * 0.5,
			this.game.canvas.height * 0.5
		);
	}

	move(v) {
		this.position = this.position.add(v);
		if (!this.game.input.pointer.movedThisFrame) {
			this.game.input.pointer.world = this.game.input.pointer.world.add(v);
		}
	}
}

export default Camera;