import Maths from '../Maths';
import Vector from '../Vector';
import Note from './Note';
import Audio from '../Audio';
import Destroyable from '../Destroyable';

class Drum extends Destroyable {
	constructor(game, key, position, notes, play) {
		super();
		this.tag = 'Drum';
		this.notes = notes;
		this.ticks = [];
		this.setTicks(this.notes);
		this.key = key;
		this.ticker = 0;
		this.sound = Audio.create(key);

		if (typeof(play) !== 'undefined') {
			this.play = play;
		}
	}

	setNotes(notes) {
		this.notes = notes;
		this.setTicks(this.notes);
		this.ticker = 0;
	}

	setTicks(notes) {
		this.ticks = [];
		for (var i = 0; i < notes.length; i++) {
			var note = notes[i];
			this.ticks.push(!note.rest);
			for (var j = 0; j < note.length - 1; j++) {
				this.ticks.push(false);
			}
		}
	}

	tick() {
		if (this.ticks[this.ticker]) {
			this.play();
		}

		this.ticker++;
		if (this.ticker >= this.ticks.length) {
			this.ticker = 0;
		}
	}

	play() {
		this.sound.play();
	}

	update() {
		this.radius = Maths.towardsValue(this.radius, this.game.delta * 5, 32);
	}
}

export default Drum;