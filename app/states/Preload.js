import State from '../State';
import Audio from '../Audio';
import Images from '../Images';

class Preload extends State {
	constructor(game) {
		super(game);
		this.tag = 'preload';
	}

	create() {
		Audio.load('tom1', '/tom1.wav');
		Audio.load('tom2', '/tom2.wav');
		Audio.load('tick', '/tick.wav');
		Audio.load('Gs3', '/xylophone/Gs3.wav');
		Audio.load('B4', '/xylophone/B4.wav');
		Audio.load('Cs4', '/xylophone/Cs4.wav');
		Audio.load('Ds4', '/xylophone/Ds4.wav');
		Audio.load('Fs4', '/xylophone/Fs4.wav');

		Images.load('space_up', '/images/spacebar_up.png');
		Images.load('space_down', '/images/spacebar_down.png');

		Images.load('p_up', '/images/p_up.png');
		Images.load('p_down', '/images/p_down.png');
		Images.load('q_up', '/images/q_up.png');
		Images.load('q_down', '/images/q_down.png');
	}

	enter() {

	}

	exit() {

	}

	update() {
		if (Audio.isLoaded() && Images.isLoaded()) {
			this.game.state.switchState('main');
		}
	}
}

export default Preload;
