var Howl = require('howler');
import Audio from '../Audio';

class Note {
	constructor(rest, length) {
		this.rest = rest;
		this.length = length;
	}
}

export default Note;