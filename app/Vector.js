class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	angleTo(v2) {
		return Math.atan2(v2.y - this.y, v2.x - this.x);
	}
}

export default Vector;