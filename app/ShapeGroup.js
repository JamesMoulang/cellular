import Shape from './Shape';
import Group from './Group';
import Maths from './Maths';
import Vector from './Vector';

class ShapeGroup extends Group {
	constructor(game, canvas) {
		super(game, canvas);
		this.r = 255;
		this.g = 0;
		this.b = 0;
		this.a = 255;
	}

	render() {
		var id = this.ctx.createImageData(this.canvas.width, this.canvas.height);
		var data = [];

		for (var x = 0; x < this.canvas.width; x++) {
			data[x] = [];
			for (var y = 0; y < this.canvas.height; y++) {
				data[y] = false;
			}
		}

		for (var i = this.entities.length - 1; i >= 0; i--) {
			data = this.entities[i].updateImageData(data);
		}

		for (var i = 0; i < id.data.length; i+=4) {
			var x = (i / 4) % this.canvas.width;
			var y = Math.floor((i / 4) / this.canvas.width);

			// if (data[x][y]) {
			// 	id.data[i] = this.r;
			// 	id.data[i + 1] = this.g;
			// 	id.data[i + 2] = this.b;
			// 	id.data[i + 3] = this.a;
			// }

			var v = new Vector(x, y);

			if (Maths.pointInCircle(v, new Vector(1024*0.5, 768*0.5), 100)) {
				id.data[i] = this.r;
				id.data[i + 1] = this.g;
				id.data[i + 2] = this.b;
				id.data[i + 3] = this.a;
			}
		}
		
		this.ctx.putImageData(id, 0, 0);
	}
}

export default ShapeGroup;