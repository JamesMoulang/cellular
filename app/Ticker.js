class Ticker {
	constructor(game, barTime, beats) {
		this.game = game;
		this.barTime = barTime;
		this.beats = beats;
		this.beatTime = this.barTime / this.beats;

		this.elapsedTime = 0;
	}

	update() {
		
	}
}

export default Ticker;