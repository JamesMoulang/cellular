import Maths from '../Maths';
import Vector from '../Vector';
import Note from './Note';
import Audio from '../Audio';
import Destroyable from '../Destroyable';
import _ from 'underscore';

class BeatThing extends Destroyable {
	constructor(game, notes) {
		super();
		this.game = game;
		this.tag = 'BeatThing';
		this.notes = notes;
		this.ticks = [];
		this.setTicks(this.notes);
		this.ticker = 0;
		this.playing = true;
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

	pause() {
		this.playing = false;
	}

	start() {
		this.playing = true;
	}

	rewind() {
		this.ticker = 0;
	}

	tick() {
		if (this.playing) {
			var shouldplay = true;
			if (this.ticker == -1) {
				this.ticker = 0;
				this.onLoop();
				shouldplay = false;
			}

			if (shouldplay || this.loops) {
				if (this.ticks[this.ticker]) {
					this.play();
				}
			}

			this.ticker++;
			if (this.ticker == this.ticks.length) {
				this.ticker = -1;
				this.onFinish();
			}
		}
	}

	onFinish() {

	}

	onLoop() {
		
	}

	playCallback() {
		
	}

	play() {
		this.playCallback();
	}

	update() {

	}

	render() {

	}
}

export default BeatThing;