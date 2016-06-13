//Drum + playerlistener.
//Either alternates between listening and playing, or does both at the same time.

import BeatThing from './BeatThing';
import DrumPair from './DrumPair';
import Circle from '../Circle';
import Vector from '../Vector';
import ListenerPair from './ListenerPair';
import Maths from '../Maths';

class CallResponse extends Circle {
	constructor(game, position, lKey, rKey, lNotes, rNotes, zIndex) {
		super(game, position, 64, '#ff00ff', zIndex);

		this.player = this.game.world.getEntitiesWithTagName('player')[0];
		console.log(this.player);

		this.following = false;
		this.playing = true;
		this.listening = false;
		this.active = false;
		this.completed = false;

		this.drumPair = this.game.world.add(
			new DrumPair(
					this.game, 
					lKey, 
					rKey, 
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

		this.colours = {
    		listening: '#ff00ff',
    		playing: '#ffff00',
    		completed: '#00ffff'
    	};
    	this.setColour();
    	this.correctCount = 0;
    	this.correctsNeeded = this.listenPair.correctsNeeded();
		this.listenPair.setFinishCallback(this.onListenFinished.bind(this));
		this.listenPair.pause();
		this.listenPair.rewind();
		this.listenPair.onCorrect = function() {
			this.happy();
			this.correctCount++;
		}.bind(this);
		this.incorrectCount = 0;
		this.listenPair.onIncorrect = function() {
			this.revolt();
			this.incorrectCount++;
		}.bind(this);
	}

	happy() {

	}

	revolt() {

	}

	tick() {
		if (this.active) {
			this.drumPair.tick();
			this.listenPair.tick();
		}
	}

	setColours(listening, playing, completed) {
		if (!this.completed) {
			this.colours.listening = listening;
			this.colours.playing = playing;
			this.colours.completed = completed;

			this.setColour();
		}
	}

	setColour() {
		if (this.completed) {
			this.colour = this.colours.completed;
		} else if (this.playing) {
			this.colour = this.colours.playing;
		} else if (this.listening) {
			this.colour = this.colours.listening;
		}
	}

	onComplete() {

	}

	onListenFinished() {
		if (this.correctCount == this.correctsNeeded && this.incorrectCount == 0) {
			this.onComplete();
		}

		this.playing = true;
		this.listening = false;
		this.setColour();

		this.listenPair.pause();
		this.drumPair.rewind();
		this.drumPair.start();
		// this.player.muteMe();
	}

	mute(m) {
		this.drumPair.mute(m);
		this.listenPair.mute(m);
	}

	pause() {
		this.drumPair.pause();
		this.listenPair.pause();
	}

	start() {
		this.drumPair.start();
		this.listenPair.start();
	}

	rewind() {
		this.drumPair.rewind();
		this.listenPair.rewind();
	}

	setLoops(loop) {
		this.drumPair.setLoops(loop);
	}

	onCallFinished() {
		this.correctCount = 0;
		this.incorrectCount = 0;

		if (!this.completed) {
			this.playing = false;
			this.listening = true;
			this.setColour();

			this.drumPair.pause();
			this.listenPair.rewind();
			this.listenPair.start();
		}

		// this.player.canSpeak();
	}

	activate() {
		this.active = true;
	}

	update() {
		this.radius = Maths.lerp(this.radius, 0.25, 64);
	}
}

export default CallResponse;