import State from '../State';
import Circle from '../Circle';
import Player from '../entities/Player';
import Vector from '../Vector';

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
	}

	create() {
		this.game.world.add(new Circle(this.game, new Vector(10, 10), 100, '#ff0000'));
		this.game.world.add(new Player(this.game));
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;