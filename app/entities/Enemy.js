import Circle from '../Circle';
import Vector from '../Vector';

class Enemy extends Circle {
	constructor(main, position, parent, radius) {
		super(main.game, position, radius, '#ff0000');
		this.main = main;
		this.alpha = 1;
		this.tag = 'enemy';
		this.main.game.enemyCount++;
		this.useCache = false;
		this.parent = parent;

		if (this.radius > 16) {
			//



			for (var i = 0; i < this.parent == null ? 4 : 2; i++) {
				var pos = this.position.add(new Vector(
					(Math.random() - 0.5) * 2 * this.radius,
					(Math.random() - 0.5) * 2 * this.radius
				));


				this.main.enemies.add(new Enemy(this.main, pos, this, this.radius * 0.5));
			}
		}
	}

	update() {

	}
}

export default Enemy;