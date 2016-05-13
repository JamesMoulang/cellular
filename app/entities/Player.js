import Triangle from '../Triangle';

class Player extends Triangle {
	constructor(game, x, y) {
		super(game, x, y, 40, 40*1.1, 0, '#ffa500');
		this.rotation = 0;
	}

	update() {
		this.position.x += this.game.input.horizontal * this.game.delta * 10;
		this.position.y += this.game.input.vertical * this.game.delta * 10;

		this.rotation = -this.position.angleTo(this.game.input.pointer.world) - Math.PI * 0.5;
		this.setRotation(this.rotation);

		this.game.camera.x = this.position.x;
		this.game.camera.y = this.position.y;
	}
}

export default Player;