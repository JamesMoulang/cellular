import Drum from './Drum';
import Destroyable from '../Destroyable';

class DrumPair extends Destroyable {
	constructor(game, leftkey, rightkey, position, leftnotes, rightnotes, play) {
		this.position = position;
		this.leftdrum = new Drum(this.game, leftkey, position, leftnotes);
		this.rightdrum = new Drum(this.game, leftkey, position, leftnotes);
	}

	tick() {

	}
}

export default DrumPair;