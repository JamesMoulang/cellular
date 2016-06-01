import BoundingBox from './BoundingBox';
import Vector from './Vector';
import Destroyable from './Destroyable';

class Shape extends Destroyable {
	constructor(position, box) {
		super();
		this.box = box;
		this.position = position;
	}

	pointInShape(v) {
		return false;
	}

	move(v) {
		this.moveTo(this.position.add(v));
	}

	moveTo(v) {
		this.position = v;
		this.box.position = v;
	}

	render() {

	}

	updateImageData(data) {
		this.box.forEachPixel(data.length, data[0].length, function(x, y) {
			if (!data[x][y]) {
				if (this.pointInShape(x, y)) {
					console.log("yeah!");
					data[x][y] = true;
				}
			}
		}.bind(this));

		return data;
	}
}

export default Shape;