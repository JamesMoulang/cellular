//Drum + playerlistener.
//Either alternates between listening and playing, or does both at the same time.

import BeatThing from './BeatThing';

class CallResponse extends BeatThing {
	constructor(game, notes, playCallback) {
		super(game, notes, playCallback);
	}
}

export default CallResponse;