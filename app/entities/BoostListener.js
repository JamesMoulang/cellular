import PlayerListener from './PlayerListener';
import notesGenerator from '../notesGenerator';

class BoostListener {
	constructor(game, player) {
		var beat = notesGenerator([2, 2, 2, 2, 2, 2, 2, 2]);
		this.game = game;

		var pListener = new PlayerListener(
			this.game, 
			beat,
			this.game.tickers.sixteen.allowableTime
		);
		pListener.onbeat = false;
		pListener.playCallback = function() {
			this.onbeat = !this.onbeat;
		};
		pListener.onCorrect = function() {
			player.velocity.x += pListener.onbeat ? player.maxSpeed : -player.maxSpeed;
			player.radius = 48;
		}.bind(this);
		this.game.pListeners.push(pListener);
		this.game.tickers.sixteen.subscribe(pListener);
		pListener.loops = true;

		var qListener = new PlayerListener(
			this.game, 
			beat,
			this.game.tickers.sixteen.allowableTime
		);
		qListener.onbeat = false;
		qListener.playCallback = function() {
			this.onbeat = !this.onbeat;
		};
		qListener.onCorrect = function() {
			player.velocity.y += qListener.onbeat ? -player.maxSpeed : player.maxSpeed;
			player.radius = 48;
		}.bind(this);
		qListener.loops = true;
		this.game.qListeners.push(qListener);
		this.game.tickers.sixteen.subscribe(qListener);
	}
}

export default BoostListener;