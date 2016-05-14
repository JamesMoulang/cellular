class Destroyable {
	constructor() {
		this.alive = true;
	}

	destroy() {
		this.alive = false;
	}
}

export default Destroyable;