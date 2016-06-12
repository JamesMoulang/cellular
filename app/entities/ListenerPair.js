import PlayerListener from './PlayerListener';
import Audio from '../Audio';
import Destroyable from '../Destroyable';

class ListenerPair extends Destroyable {
	constructor(game, lNotes, rNotes) {
		super();
		this.game = game;
		this.lNotes = lNotes;
		this.rNotes = rNotes;

		console.log(lNotes, rNotes);

		this.pListener = new PlayerListener(
			this.game,
			lNotes,
			this.game.tickers.sixteen.allowableTime
		);
		// this.pListener.playCallback = function() {
		// 	Audio.play('Fs4');
		// };
		this.pListener.onCorrect = this.onCorrectP.bind(this);
		this.pListener.onIncorrect = function() {
			console.log("p wrong");
		}
		this.game.pListeners.push(this.pListener);

		this.qListener = new PlayerListener(
			this.game, 
			rNotes,
			this.game.tickers.sixteen.allowableTime
		);
		// this.qListener.playCallback = function() {
		// 	Audio.play('Gs3');
		// };
		this.qListener.onCorrect = this.onCorrectQ.bind(this);
		this.qListener.onIncorrect = function() {
			console.log("q wrong");
		}
		this.game.qListeners.push(this.qListener);
	}

	setLoopCallback(func) {
		this.qListener.onLoop = func;
	}

	setFinishCallback(func) {
		this.qListener.onFinish = func;
	}

	pause() {
		this.qListener.pause();
		this.pListener.pause();
	}

	start() {
		this.qListener.start();
		this.pListener.start();
	}

	rewind() {
		this.qListener.rewind();
		this.pListener.rewind();
	}

	tick() {
		this.qListener.tick();
		this.pListener.tick();
	}

	onCorrect() {
		console.log("yeeeee boi");
	}

	onCorrectQ() {
		console.log("correct q");
		this.onCorrect();
	}

	onCorrectP() {
		console.log("correct p");
		this.onCorrect();
	}

	update() {

	}

	render() {

	}
}

export default ListenerPair;