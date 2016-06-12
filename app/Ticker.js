import _ from 'underscore';
import Audio from './Audio';

class Ticker {
	constructor(game, barTime, beats, onBeatCount) {
		this.game = game;
		this.barTime = barTime;
		this.beats = beats;
		this.beatTime = this.barTime / this.beats;
		this.allowableTime = this.beatTime * 0.75;
		this.subscribers = [];
		this.elapsedTime = 0;
		this.onbeat = false;
		this.beatCounter = 0;
		this.onBeatCount = onBeatCount;
		this.beatCallback = null;
	}

	update(lastFrameTimeElapsed) {
		this.elapsedTime += lastFrameTimeElapsed;
		// console.log(this.elapsedTime, this.barTime);
		if (this.elapsedTime >= this.beatTime) {
			this.elapsedTime -= this.beatTime;

			this.beatCounter++;
			if (this.beatCounter == this.onBeatCount) {
				this.beatCounter = 0;
				this.onbeat = !this.onbeat;
				if (this.onbeat && this.beatCallback != null) {
					this.beatCallback();
					this.beatCallback = null;
				}
			}

			_.each(this.subscribers, (subscriber) => {
				subscriber.tick();
			});
		}
	}

	nextBeat(func) {
		this.beatCallback = func;
	}

	subscribe(object) {
		object._ticker = this;
		this.subscribers.push(object);
	}

	unsubscribe(object) {
		this.subscribers = _.without(this.subscribers, object);
	}
}

export default Ticker;