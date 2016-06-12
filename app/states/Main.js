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
import _ from 'underscore';
import level from './level';

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

		_.each(level.nests, (nest) => {
			var fairies = nest.fairies;
			var nestFairies = [];

			_.each(fairies, (fairy) => {
				var f = this.game.world.add(new Fairy(
					this.game,
					new Vector().random().times(384),
					nest.lKey,
					nest.rKey,
					notesGenerator(nest.lNotes),
					notesGenerator(nest.rNotes),
					1
				));

				nestFairies.push(f);
			});

			var _nest = this.game.world.add(new FairyNest(
				this.game,
				nest.pos,
				nest.colours,
				nestFairies,
				0
			));

			_.each(nestFairies, (fairy) => {
				fairy.player = player;
				this.game.tickers.sixteen.subscribe(fairy);
				fairy.activate();
			});
		});
	}

	enter() {

	}

	exit() {

	}

	update() {

	}
}

export default Main;
