import Triangle from '../Triangle';
import MuzzleFlash from './MuzzleFlash';

class Player extends Triangle {
	constructor(game, x, y) {
		super(game, x, y, 40, 40*2.5, 0, '#ffa500');
		this.rotation = 0;
		this.counter = 0;
	}

	update() {
		this.position.x += this.game.input.horizontal * this.game.delta * 10;
		this.position.y += this.game.input.vertical * this.game.delta * 10;

		this.rotation = -this.position.angleTo(this.game.input.pointer.world) - Math.PI * 0.5;
		this.setRotation(this.rotation);

		if (this.game.input.pointer.down) {
			this.counter++;
			this.game.world.add(new MuzzleFlash(this, this.position.add(this.rotatedVertices[2])));
		}

		this.game.camera.x = this.position.x;
		this.game.camera.y = this.position.y;
	}
}

export default Player;