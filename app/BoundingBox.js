import Vector from './Vector';
import Maths from './Maths';

class BoundingBox {
	//x and y are center, not edges.
	constructor(position, width, height) {
		this.position = position;
		this.width = width;
		this.height = height;
	}

	forEachPixel(width, height, callback) {
		var left = Maths.clamp(Math.floor(this.position.x - this.width * 0.5), 0, width - 1);
		var right = Maths.clamp(Math.ceil(this.position.x + this.width * 0.5), 0, width - 1);
		var bottom = Maths.clamp(Math.floor(this.position.y - this.height * 0.5), 0, height - 1);
		var top = Maths.clamp(Math.floor(this.position.y + this.height * 0.5), 0, height - 1);

		var x = left;
		var y = bottom;

		while (y <= top) {
			while (x <= right) {
				callback(x, y);
				x++;
			}
			x = left;
			y++;
		}
	}
}

export default BoundingBox;