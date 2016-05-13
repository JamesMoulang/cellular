class Group {
	constructor(game) {
		this.game = game;
		this.entities = [];
	}

	add(entity) {
		this.entities.unshift(entity);
	}

	update() {
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