class Destroyable {
	constructor(zIndex = 0) {
		this.alive = true;
		this.tag = 'default';
		this.zIndex = zIndex;
	}

	destroy() {
		this.alive = false;
	}
}

export default Destroyable;