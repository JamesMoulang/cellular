var _ = require('underscore');

class Group {
	constructor(game) {
		this.game = game;
		this.entities = [];
	}

	add(entity) {
		entity.group = this;
		this.entities.unshift(entity);
	}

	update() {
		this.entities = _.filter(this.entities, (entity) => entity.alive);

		for (var i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].update();
		}
	}

	render() {
		for (var i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].render();
		}
	}
}

export default Group;