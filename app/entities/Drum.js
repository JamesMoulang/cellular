import Circle from '../Circle';
import Maths from '../Maths';
import Vector from '../Vector';
import Note from './Note';
import Audio from '../Audio';

class Drum extends Circle {
	constructor(game, key, position, radius, colour, notes) {
		console.trace();
		console.log(game, key, position, radius, colour, notes);
		super(game, position, radius, colour);
		this.tag = 'Drum';
		this.active = false;
		this.notes = notes;
		this.ticks = [];
		this.setTicks(this.notes);
		this.key = key;
		this.ticker = 0;
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
		Audio.play(this.key);
	}

	activate() {
		this.active = !this.active;
	}

	update() {
		
	}
}

export default Drum;