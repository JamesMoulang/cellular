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

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
	}

	create() {
		//var notes = notesGenerator([2, 2, 4, 8, 16, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, -2, 2, 2, 2, -2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4, 2, 2, 4, 4, 8]);
		var metronome = notesGenerator([4, 4, 4, 4]);
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

		var player = this.game.world.add(new Player(this.game));
		var boost = new BoostListener(this.game, player);
		var blank = [-32];
		var lnote = [2, -2, -2, 2,2, -2, -2, 2, -16];
		var rnote = [-2, 2, -2, -2,-2, 2, -2, -2, -16];

		var lnote2 = [3,3,3,3,3,-5,-12];
		var rnote2 = [2,-2,2,-2,2,-2,2,-2, -16];

		var lnote3 = [2,2,-2,2,2,2,-2,2,2,-14]

		var call2 = this.game.world.add(
			new Fairy(
				this.game,
				new Vector(0, -200),
				'Cs4',
				'Ds4',
				notesGenerator(lnote2),
				notesGenerator(rnote2)
			)
		);
		var tomFairy =new Fairy(
			this.game,
			new Vector(0, -200),
			'tom1',
			'tom1',
			notesGenerator(lnote3),
			notesGenerator(blank)
		);
		tomFairy.setLeftVolume(0.1);
		tomFairy.setRightVolume(0.1);
		var call3 = this.game.world.add(tomFairy);
		var call = this.game.world.add(
			new Fairy(
				this.game,
				new Vector(0, -256),
				'Gs3',
				'Fs4',
				notesGenerator(lnote),
				notesGenerator(rnote)
			)
		);



		//call.player = player;
		//call2.player = player;
		this.game.tickers.sixteen.subscribe(call);
		this.game.tickers.sixteen.subscribe(call2);
		this.game.tickers.sixteen.subscribe(call3);
		call.activate();
		call2.activate();
		call3.activate();
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;
