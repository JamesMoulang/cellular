var Howl = require('howler');
import Audio from '../Audio';

class Note {
	constructor(rest, length) {
		this.rest = rest;
		this.length = length;
		this.note = '___undefined___';
	}

	play() {
		Audio.play(this.note);
	}
}

export default Note;