import State from '../State';
import Circle from '../Circle';
import Player from '../entities/Player';
import Drum from '../entities/Drum';
import notesGenerator from '../notesGenerator';
import Vector from '../Vector';
import Enemy from '../entities/Enemy';
import Group from '../Group';
import Note from '../entities/Note';

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
		this.enemies = null;
		this.drums = [];
	}

	create() {
		var test = [
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 4),
				new Note(false, 8),
				new Note(false, 16),
				new Note(false, 4),
				new Note(false, 4),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 4),
				new Note(false, 4),
				new Note(true, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(true, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 4),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 2),
				new Note(false, 4),
				new Note (false, 4),
				new Note (false, 2),
				new Note (false, 2),
				new Note (false, 4),
				new Note (false, 2),
				new Note (false, 2),
				new Note (false, 4),
				new Note (false, 4),
				new Note (false, 8)
			];

		var notes = notesGenerator([2, 2, 4, 8, 16, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, -2, 2, 2, 2]);
		// var drum = this.game.world.add(new Drum(this.game, 'tom1', new Vector(0, 0), notes));
		// this.game.tickers.sixteen.subscribe(drum);
		// this.drums.push(drum);
		var player = this.game.world.add(new Player(this.game));
		this.game.enemyCount = 0;
		player.state = this;

		this.enemyCanvas = this.game.createCanvas('enemyCanvas');
		this.enemies = this.game.world.add(new Group(this.game, this.enemyCanvas, true, '#ff0000'));

		// var enemy = this.enemies.add(new Enemy(this, new Vector(), null, 512));
		// console.log(this.enemies);
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;