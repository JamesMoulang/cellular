import State from '../State';
import Circle from '../Circle';
import Player from '../entities/Player';
import Drum from '../entities/Drum';
import DrumPair from '../entities/DrumPair';
import notesGenerator from '../notesGenerator';
import Vector from '../Vector';
import Enemy from '../entities/Enemy';
import Group from '../Group';
import Note from '../entities/Note';
import PlayerListener from '../entities/PlayerListener';
import BoostListener from '../entities/BoostListener';
import Fairy from '../entities/Fairy';
import Audio from '../Audio';
import FairyNest from '../entities/FairyNest';

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
	}

	create() {
		//var notes = notesGenerator([2, 2, 4, 8, 16, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, -2, 2, 2, 2, -2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4, 2, 2, 4, 4, 8]);
		var metronome = notesGenerator([4, 4, 4, 4]);

		var lnote = [2, -2, -2, 2,2, -2, -2, 2, -16];
		var rnote = [-2, 2, -2, -2,-2, 2, -2, -2, -16];

		// lnote = [2, -2, 2, -2, 2, -2, 2, -2];
		// rnote = [-2, 2, -2, 2, -2, 2, -2, 2];

		var ddrum = this.game.world.add(
			new DrumPair(
					this.game, 
					'Gs3', 
					'Fs4', 
					new Vector(0, 0), 
					notesGenerator(lnote), 
					notesGenerator(rnote)
				)
		);
		// this.game.tickers.sixteen.subscribe(ddrum);

		var metronomeDrum = this.game.world.add(
			new Drum(
				this.game,
				'tick',
				new Vector(0, 0),
				metronome
			)
		);
		metronomeDrum.sound.volume(0.1);
		metronomeDrum.loops = true;
		this.game.tickers.sixteen.subscribe(metronomeDrum);

		var call = this.game.world.add(
			new Fairy(
				this.game,
				new Vector(0, -256),
				'Gs3',
				'Fs4',
				notesGenerator(lnote),
				notesGenerator(rnote),
				1
			)
		);

		this.game.world.add(
			new FairyNest(
				this.game,
				new Vector(0, 0),
				['#5BC0EB', '#FDE74C', '#9BC53D', '#E55934', '#FA7921'],
				[call],
				0
			)
		);

		var player = this.game.world.add(new Player(this.game));
		var boost = new BoostListener(this.game, player);

		call.player = player;
		this.game.tickers.sixteen.subscribe(call);
		call.activate();
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;
