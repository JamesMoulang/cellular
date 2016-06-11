import Maths from '../Maths';
import Vector from '../Vector';
import Note from './Note';
import Audio from '../Audio';
import BeatThing from './BeatThing';
import _ from 'underscore';

class Drum extends BeatThing {
	constructor(game, key, position, notes, playCallback) {
		super(game, notes, playCallback);
		this.tag = 'Drum';
		this.key = key;
		this.sound = Audio.create(key);
		console.log(this.sound);
	}

	play() {
		super.play();
		this.sound.play();
	}

	update() {

	}

	render() {

	}
}

export default Drum;