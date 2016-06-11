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
		Audio.load('tick', '/tick.wav');
		Audio.load('G#3', '/xylophone/g#3.wav');
		Audio.load('B4', '/xylophone/B4.wav');
		Audio.load('C#4', '/xylophone/C#4.wav');
		Audio.load('D#4', '/xylophone/D#4.wav');
		Audio.load('F#4', '/xylophone/F#4.wav');
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
