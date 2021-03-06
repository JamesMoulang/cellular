import BeatThing from './BeatThing';
import Audio from '../Audio';

class PlayerListener extends BeatThing {
	constructor(game, notes, allowableTime) {
		super(game, notes);
		this.active = false;
		this.lastBeatTimeStamp = false;
		this.allowableTime = allowableTime;
		this.playerDrum = {
			active: false,
			timestamp: 0
		};
		this.lastBeatHit = true;
		this.lastBeatValid = false;
		this.debug = false;
	}

	_onCorrect() {
		this.lastBeatHit = true;
		this.onCorrect();
	}

	onCorrect() {
		console.log("GOOD! ");
	}

	onIncorrect() {
		
	}

	_onFinish() {
		super._onFinish();
	}

	play() {
		super.play();
		this.lastBeatTimeStamp = this.game.timestamp();
		this.lastBeatValid = true;
		this.checkPreviousInputs();
	}

	tick() {
		if (!this.lastBeatHit && this.lastBeatValid && this.playing) {
			this.onIncorrect();
		}

		if (this.lastBeatHit && !this.lastBeatValid && this.playing) {
			this.onIncorrect();
		}
		this.lastBeatValid = false;
		this.lastBeatHit = false;
		super.tick();
	}

	checkPreviousCallback() {

	}

	checkPreviousInputs() {
		if (this.debug) {
			console.log("check previous");
		}

		if (this.playerDrum.active && !this.fast) {
			if (this.lastBeatTimeStamp > this.playerDrum.timestamp) {
				if (this.lastBeatTimeStamp - this.playerDrum.timestamp < this.allowableTime) {
					this.slow = true;
					if (this.debug) {
						console.log('got slow');
					}
					this._onCorrect();
				}
			}

			this.playerDrum.active = false;
		}
		this.fast = false;
		this.playerDrum.active = false;
		this.checkPreviousCallback();
	}

	triggerBeat(timestamp) {
		//The player just did an input.
		//So it's correct if the player 
		//was after a beat, but not too slow.

		//If the player was too slow, they might just be going for the next beat.
		//So, we need to wait before we can say it was incorrect.

		if (this.debug) {
			console.log('trigger');
		}
		
		if (timestamp > this.lastBeatTimeStamp && !this.fast) {
			if (timestamp - this.lastBeatTimeStamp <= this.allowableTime) {
				if (this.debug) {
						console.log('got fast');
					}

				this.fast = true;
				this._onCorrect();
			} else {
				this.playerDrum.active = true;
				this.playerDrum.timestamp = timestamp;
			}
		}
	}
}

export default PlayerListener;