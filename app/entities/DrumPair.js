import Drum from './Drum';
import Destroyable from '../Destroyable';
import _ from 'underscore';

class DrumPair extends Destroyable {
	constructor(game, leftkey, rightkey, position, leftnotes, rightnotes, play) {
		super();
		this.position = position;

		var lSum = _.reduce(leftnotes, function(memo, note){ return memo + Math.abs(note.length); }, 0);
		var rSum = _.reduce(rightnotes, function(memo, note){ return memo + Math.abs(note.length); }, 0);
		if (lSum != rSum) {
			console.log(lSum, rSum);
			console.warn("DrumPair should have tracks of equal length! Adding some padding.");
			if (lSum < rSum) {
				leftnotes.push(rSum - lSum);
			} else {
				rightnotes.push(lSum - rSum);
			}
		}

		this.leftdrum = new Drum(this.game, leftkey, position, leftnotes, play);
		this.rightdrum = new Drum(this.game, rightkey, position, rightnotes, play);
	}

	setLoopCallback(func) {
		this.leftdrum.onLoop = func;
	}

	tick() {
		this.leftdrum.tick();
		this.rightdrum.tick();
	}

	pause() {
		this.leftdrum.pause();
		this.rightdrum.pause();
	}

	start() {
		this.leftdrum.start();
		this.rightdrum.start();
	}

	rewind() {
		this.leftdrum.rewind();
		this.rightdrum.rewind();
	}

	update() {

	}

	render() {

	}
}

export default DrumPair;
