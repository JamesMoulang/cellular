import State from '../State';
import Audio from '../Audio';

class Preload extends State {
	constructor(game) {
		super(game);
		this.tag = 'preload';
	}

	create() {
		Audio.load('tom1', '/tom1.wav');
		Audio.load('tom2', '/tom2.wav');
	}

	enter() {

	}

	exit() {

	}

	update() {
		if (Audio.isLoaded()) {
			this.game.state.switchState('main');
		}
	}
}

export default Preload;