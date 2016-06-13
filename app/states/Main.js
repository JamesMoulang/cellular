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
import KeySprite from '../entities/KeySprite';

class Main extends State {
	constructor(game) {
		super(game);
		this.tag = 'main';
	}

	create() {
		//var notes = notesGenerator([2, 2, 4, 8, 16, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 4, 4, -2, 2, 2, 2, -2, 2, 2, 2, 4, 2, 2, 2, 2, 4, 4, 2, 2, 4, 2, 2, 4, 4, 8]);
		var metronome = notesGenerator([4, 4, 4, 4]);

		var player = this.game.world.add(new Player(this.game));
		var boost = new BoostListener(this.game, player);
		var game = this.game;
		_.each(level.nests, function(nest) {
			var fairies = nest.fairies;
			var nestFairies = [];

			_.each(fairies, function(fairy) {
				var f = this.game.world.add(new Fairy(
					game,
					new Vector().random().times(384),
					nest.lKey,
					nest.rKey,
					notesGenerator(fairy.lNotes),
					notesGenerator(fairy.rNotes),
					1
				));
				if (fairy.hint) {
					f.showHint = fairy.hint;
				}
				nestFairies.push(f);
			}.bind(this));

			var _nest = this.game.world.add(new FairyNest(
				this.game,
				nest.pos,
				nest.colours,
				nestFairies,
				-1,
				nest.lKey,
				nest.rKey
			));
			this.game.tickers.sixteen.subscribe(_nest);

			_.each(nestFairies, function(fairy) {
				fairy.player = player;
				this.game.tickers.sixteen.subscribe(fairy);
				fairy.activate();
			}.bind(this));
		}.bind(this));

		this.space = this.game.world.add(new KeySprite(
			this.game,
			new Vector(0, 128),
			'space',
			4
		));
		this.space.automatic = false;

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
		metronomeDrum.playCallback = function() {
			this.space.press();
		}.bind(this);
		this.game.tickers.sixteen.subscribe(metronomeDrum);

		this.game.tickers.sixteen.sync();
	}

	enter() {

	}

	exit() {

	}

	update() {
		
	}
}

export default Main;
