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
	}

	onCorrect() {
		console.log("GOOD! ");
		if (this.slow) {
			// console.log("slow");
		}
		if (this.fast) {
			// console.log("fast");
		}
	}

	onIncorrect() {
		console.log("BAD!");
	}

	play() {
		super.play();
		this.lastBeatTimeStamp = this.game.timestamp();
		this.checkPreviousInputs();
	}

	checkPreviousInputs() {
		if (this.playerDrum.active && !this.fast) {
			if (this.lastBeatTimeStamp > this.playerDrum.timestamp) {
				if (this.lastBeatTimeStamp - this.playerDrum.timestamp < this.allowableTime) {
					this.slow = true;
					this.onCorrect();
				}
			}

			this.playerDrum.active = false;
		}
		this.fast = false;
		this.playerDrum.active = false;
	}

	triggerBeat(timestamp) {
		//The player just did an input.
		//So it's correct if the player 
		//was after a beat, but not too slow.

		//If the player was too slow, they might just be going for the next beat.
		//So, we need to wait before we can say it was incorrect.
		
		if (timestamp > this.lastBeatTimeStamp && !this.fast) {
			if (timestamp - this.lastBeatTimeStamp <= this.allowableTime) {
				this.fast = true;
				this.onCorrect();
			} else {
				this.playerDrum.active = true;
				this.playerDrum.timestamp = timestamp;
			}
		}
	}

	checkBeats(clear) {
		var timestamp = this.lastBeatTimeStamp;
		var timeslot = this.allowableTime;
		var playerDrum = this.playerDrum;

		if (playerDrum.active) {
			if (Math.abs(timestamp - playerDrum.timestamp) <= timeslot) {
				this.onCorrect();
				this.playerDrum.active = false;
			} else {
				this.onIncorrect();
			}
		} else {
			if (this.lastBeatTimeStamp - playerDrum.timestamp > timestamp) {
				this.onIncorrect();
			}
		}

		if (clear) {
			this.playerDrum.active = false;
		}
	}
}

export default PlayerListener;