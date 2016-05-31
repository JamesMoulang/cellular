import Circle from '../Circle';
import Maths from '../Maths';
import Vector from '../Vector';
import Note from './Note';

class Drum extends Circle {
	constructor(game, key, position, notes) {
		super(game, position, 32, '#87ceeb');
		this.tag = 'Drum';
		this.active = false;
		this.notes = notes;
		this.key = key;
		for (var i = 0; i < this.notes.length; i++) {
			this.notes[i].key = this.key;
		}
	}

	tick() {

	}

	play() {
		
	}

	activate() {
		this.active = !this.active;
	}

	update() {
		if (this.active) {
			this.radius = Maths.lerp(this.radius, 0.1, this.game.width);
		} else {
			this.radius = Maths.lerp(this.radius, 0.25, 32);
		}
	}
}

export default Drum;