import State from '../State';
import Circle from '../Circle';
import Player from '../entities/Player';
import Vector from '../Vector';
import Enemy from '../entities/Enemy';
import Group from '../Group';

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
		this.enemies = null;
	}

	create() {
		var player = this.game.world.add(new Player(this.game));
		this.game.enemyCount = 0;

		this.enemyCanvas = this.game.createCanvas('enemyCanvas');
		this.enemies = this.game.world.add(new Group(this.game, this.enemyCanvas, true, '#ff0000'));

		var enemy = this.enemies.add(new Enemy(this, new Vector(), null, 512));
		console.log(this.enemies);
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;