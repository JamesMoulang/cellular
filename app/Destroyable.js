class Destroyable {
	constructor() {
		this.alive = true;
		this.tag = 'default';
	}

	destroy() {
		this.alive = false;
	}
}

export default Destroyable;