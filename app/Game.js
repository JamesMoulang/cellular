import Group from './Group';
import Camera from './Camera';
import Circle from './Circle';
import Player from './entities/Player';
import Maths from './Maths';
import Vector from './Vector';

const codes = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
	up: 38,
	left: 37,
	down: 40,
	right: 39
};

class Game {
	constructor(canvas, ctx, fps = 30) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.backgroundColour = '#a1a1a1';
		this.updatables = [];
		this.camera = new Camera(this);
		this.paused = true;
		this.world = new Group(this);
		this.lastTimestamp = 0;
		this.fps = fps;
		this.idealFrameTime = 1000 / this.fps;
		this.delta = 0;
		this.gravity = -0.098;
		this.windDirection = new Vector(0.5, 0.5).normalised();
		this.input = {
			up: false,
			down: false,
			left: false,
			right: false,
			vertical: 0,
			horizontal: 0,
			pointer: {
				world: new Vector(),
				screen: new Vector(),
				down: false,
				movedThisFrame: false,
				clicked: false
			}
		};
		window.onresize = this.resizeCanvas.bind(this);
		window.onkeydown = this.onkeydown.bind(this);
		window.onkeyup = this.onkeyup.bind(this);
		window.onmousemove = this.onmousemove.bind(this);
		window.onmousedown = this.onmousedown.bind(this);
		window.onmouseup = this.onmouseup.bind(this);
		this.resizeCanvas();
		this.world.add(new Circle(this, new Vector(10, 10), 100, '#ff0000'));
		this.world.add(new Player(this));
	}

	resizeCanvas () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	onmouseup() {
		this.input.pointer.down = false;
	}

	onmousedown() {
		this.input.pointer.clicked = true;
		this.input.pointer.down = true;
	}

	onmousemove(e) {
		var x = e.pageX;
		var y = e.pageY;

		this.input.pointer.screen.x = x;
		this.input.pointer.screen.y = y;

		this.input.pointer.world.x = x - this.canvas.width * 0.5 + this.camera.position.x;
		this.input.pointer.world.y = y - this.canvas.height * 0.5 + this.camera.position.y;

		this.input.pointer.movedThisFrame = true;
	}

	onkeyup(e) {
		switch(e.keyCode) {
			case codes.up:
			case codes.w:
				this.input.up = false;
				this.input.vertical++;
				break;
			case codes.left:
			case codes.a:
				this.input.left = false;
				this.input.horizontal++;
				break;
			case codes.down:
			case codes.s:
				this.input.down = false;
				this.input.vertical--;
				break;
			case codes.right:
			case codes.d:
				this.input.right = false;
				this.input.horizontal--;
				break;
			default:
				break;
		}

		this.input.vertical = Maths.clamp(this.input.vertical, -1, 1);
		this.input.horizontal = Maths.clamp(this.input.horizontal, -1, 1);
	}

	onkeydown(e) {
		switch(e.keyCode) {
			case codes.up:
			case codes.w:
				this.input.up = true;
				this.input.vertical--;
				break;
			case codes.left:
			case codes.a:
				this.input.left = true;
				this.input.horizontal--;
				break;
			case codes.down:
			case codes.s:
				this.input.down = true;
				this.input.vertical++;
				break;
			case codes.right:
			case codes.d:
				this.input.right = true;
				this.input.horizontal++;
				break;
			default:
				break;
		}

		this.input.vertical = Maths.clamp(this.input.vertical, -1, 1);
		this.input.horizontal = Maths.clamp(this.input.horizontal, -1, 1);
	}

	start() {
		this.paused = false;
		this.lastTimestamp = this.timestamp();
		this.loop();
	}

	loop() {
		var lastFrameTimeElapsed = this.timestamp() - this.lastTimestamp;
		this.delta = lastFrameTimeElapsed / this.idealFrameTime;
		this.update();
		this.render();

		this.lastTimestamp = this.timestamp();
		if (lastFrameTimeElapsed < this.idealFrameTime) {
			setTimeout(this.loop.bind(this), this.idealFrameTime - lastFrameTimeElapsed);
		} else {
			this.loop();
		}
	}

	update() {
		this.world.update();
		this.input.pointer.movedThisFrame = false;
		this.input.pointer.clicked = false;
	}

	timestamp() {
		return performance.now();
	}

	render() {
		var canvas = this.canvas;
		var ctx = this.ctx;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = this.backgroundColour;
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		this.world.render();

		ctx.fillStyle='#000000';
		ctx.fillRect(canvas.width * 0.5 - 4, canvas.height * 0.5 - 4, 8, 8);
	}
}

export default Game;