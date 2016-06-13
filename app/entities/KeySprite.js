import Sprite from './Sprite';

class KeySprite extends Sprite {
	constructor(game, position, keyName, zIndex) {
		super(game, position, keyName + '_up', zIndex);
		this.offset = position;
		this.keyName = keyName;
		this.setAnchor(0.5, 1);

		this.switchCounter = 0;
		this.renderKeyDown = false;
		this.keyIsDown = false;
		this.waitTime = 10;
		this.automatic = true;
	}

	press() {
		var key = this.keyName + '_down';
		this.loadTexture(key);
		this.waitTime = 2.5;
		this.switchCounter = 0;
	}

	release() {
		var key = this.keyName + '_up';
		this.loadTexture(key);
		this.waitTime = 10;
		this.switchCounter = 0;
	}

	update() {
		this.position = this.game.camera.position.add(this.offset);

		if (this.keyIsDown && !this.game.input[this.keyName].isDown) {
			this.destroy();
		} else if (this.game.input[this.keyName].isDown) {
			this.loadTexture(this.keyName + '_down');
			this.keyIsDown = true;
		} else {
			this.switchCounter += this.game.delta;

			if (this.switchCounter > this.waitTime) {
				if (this.automatic) {
					this.renderKeyDown = !this.renderKeyDown;

					if (this.renderKeyDown) {
						this.press();
					} else {
						this.release();
					}
				} else {
					this.release();
				}
			}
		}
	}
}

export default KeySprite;