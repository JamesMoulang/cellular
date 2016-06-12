//Drum + playerlistener.
//Either alternates between listening and playing, or does both at the same time.

import BeatThing from './BeatThing';
import DrumPair from './DrumPair';
import Circle from '../Circle';
import Vector from '../Vector';
import ListenerPair from './ListenerPair';
import Maths from '../Maths';

class CallResponse extends Circle {
	constructor(game, position, lKey, rKey, lNotes, rNotes) {
		super(game, position, 64, '#ff00ff');

		this.following = false;
		this.playing = true;
		this.listening = false;
		this.active = false;

		this.drumPair = this.game.world.add(
			new DrumPair(
					this.game, 
					'Gs3', 
					'Fs4', 
					new Vector(0, 0), 
					lNotes, 
					rNotes
				)
		);
		this.drumPair.setLoopCallback(this.onCallFinished.bind(this));

		this.listenPair = this.game.world.add(
			new ListenerPair(
				this.game,
				lNotes,
				rNotes
			)
		);
		this.listenPair.setFinishCallback(this.onListenFinished.bind(this));
		this.listenPair.pause();
		this.listenPair.rewind();
		this.listenPair.onCorrect = function() {
			this.radius = 128;
		}.bind(this);
	}

	tick() {
		if (this.active) {
			this.drumPair.tick();
			this.listenPair.tick();
		}
	}

	onListenFinished() {
		// console.log('onListenFinished');
		this.colour = '#ff00ff';
		this.playing = true;
		this.listening = false;

		this.listenPair.pause();
		this.drumPair.rewind();
		this.drumPair.start();
	}

	onCallFinished() {
		// console.log("onCallFinished");
		this.colour = '#ffff00';
		this.playing = false;
		this.listening = true;

		this.drumPair.pause();
		this.listenPair.rewind();
		this.listenPair.start();
	}

	activate() {
		this.active = true;
	}

	update() {
		this.radius = Maths.lerp(this.radius, 0.25, 64);
		this.position.x = this.player.position.x;
		this.position.y = this.player.position.y - 128;
	}
}

export default CallResponse;