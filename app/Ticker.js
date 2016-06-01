var _ = require('underscore');

class Ticker {
	constructor(game, barTime, beats) {
		this.game = game;
		this.barTime = barTime;
		this.beats = beats;
		this.beatTime = this.barTime / this.beats;

		this.subscribers = [];
		this.elapsedTime = 0;
	}

	update(lastFrameTimeElapsed) {
		this.elapsedTime += lastFrameTimeElapsed;
		// console.log(this.elapsedTime, this.barTime);
		if (this.elapsedTime >= this.beatTime) {
			this.elapsedTime -= this.beatTime;

			_.each(this.subscribers, (subscriber) => {
				subscriber.tick();
			});
		}
	}

	subscribe(object) {
		this.subscribers.push(object);
	}

	unsubscribe(object) {
		this.subscribers = _.without(this.subscribers, object);
	}
}

export default Ticker;