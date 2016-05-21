var _ = require('underscore');

class Group {
	constructor(game) {
		this.tag = null;
		this.game = game;
		this.entities = [];
	}

	add(entity) {
		entity.group = this;
		this.entities.push(entity);
	}

	getEntitiesWithTagName(tag) {
		var entities = [];
		for (var i = 0; i < this.entities.length; i++) {
			if (this.entities[i].tag == tag) {
				entities.push(this.entities[i]);
			} else {
				if (this.entities[i].tag == null) {
					entities.push(this.entities[i].getEntitiesWithTagName(tag));
				}
			}
		}
		return entities;
	}

	update() {
		this.entities = _.filter(this.entities, (entity) => entity.alive);

		for (var i = this.entities.length - 1; i >= 0; i--) {
			this.entities[i].update();
		}
	}

	render() {
		for (var i = 0; i < this.entities.length; i++) {
			this.entities[i].render();
		}
	}
}

export default Group;