import Group from './Group';
import Camera from './Camera';
import Circle from './Circle';
import Player from './entities/Player';
import Maths from './Maths';
import Vector from './Vector';
import StateManager from './StateManager';
import Main from './states/Main';
import Preload from './states/Preload';
import KeyInput from './KeyInput';
import Ticker from './Ticker';

var _ = require('underscore');

const codes = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
	up: 38,
	left: 37,
	down: 40,
	right: 39,
	space: 32
};

class Game {
	constructor(width, height, canvas, ctx, fps = 30) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.backgroundColour = '#ffffff';
		
		this.updatables = [];
		this.camera = new Camera(this);
		this.paused = true;
		this.canvases = [];
		this.world = new Group(this, this.canvas, false);
		
		this.lastTimestamp = 0;
		this.frameTimeElapseCounter = 0;
		this.fps = fps;
		this.timeScaleFPS = 30;
		this.idealFrameTime = 1000 / this.timeScaleFPS;
		this.delta = 0;
		
		this.tickTime = this.idealFrameTime * 0.25;
		this.tickers = {};
		this.barTime = 2000;
		this.tickers.twelve = new Ticker(this, this.barTime, 12);
		this.tickers.sixteen = new Ticker(this, this.barTime, 16);

		this.gravity = -0.098;
		this.windDirection = new Vector(0.5, 0.5).normalised();

		this.input = {
			up: new KeyInput(),
			down: new KeyInput(),
			left: new KeyInput(),
			right: new KeyInput(),
			space: new KeyInput(),
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

		this.circleCanvases = [];

		window.onresize = this.resizeCanvas.bind(this);
		window.onkeydown = this.onkeydown.bind(this);
		window.onkeyup = this.onkeyup.bind(this);
		window.onmousemove = this.onmousemove.bind(this);
		window.onmousedown = this.onmousedown.bind(this);
		window.onmouseup = this.onmouseup.bind(this);
		this.resizeCanvas();
		this.preRenderCircles();

		this.state = new StateManager();
		var main = new Main(this);
		this.state.add(main);
		var preload = new Preload(this);
		this.state.add(preload);
		this.state.switchState('preload');
	}

	setBarTime(bt) {
		this.barTime = bt;
		_.each(this.tickers, (ticker) => {
			ticker.barTime = bt;
		});
	}

	createCanvas(id) {
		var canv = document.createElement('canvas');
		canv.id = id;
		canv.style.zIndex = this.canvases.push(canv) + 1;
		document.body.appendChild(canv);
		this.resizeCanvas();
		return canv;
	}

	preRenderCircles() {
		for (var r = 2; r <= 512; r*=2) {
			var cache_canvas = document.createElement('canvas');
			cache_canvas.width = cache_canvas.height = r * 2;
			var cache_ctx = cache_canvas.getContext('2d');
			
			cache_ctx.fillStyle = '#87ceeb';
			cache_ctx.beginPath();
			cache_ctx.arc(
				r,
				r,
				r,
				0, 
				2 * Math.PI
			);
			cache_ctx.fill();

			this.circleCanvases[r] = cache_canvas;
		}
	}

	getCachedCircle(radius) {
		return this.circleCanvases[radius];
	}

	resizeCanvas () {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		for (var i = this.canvases.length - 1; i >= 0; i--) {
			this.canvases[i].width = window.innerWidth;
			this.canvases[i].height = window.innerHeight;
		}
		this.camera.onCanvasResize();
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
				this.input.up.isDown = false;
				this.input.vertical++;
				break;
			case codes.left:
			case codes.a:
				this.input.left.isDown = false;
				this.input.horizontal++;
				break;
			case codes.down:
			case codes.s:
				this.input.down.isDown = false;
				this.input.vertical--;
				break;
			case codes.right:
			case codes.d:
				this.input.right.isDown = false;
				this.input.horizontal--;
				break;
			case codes.space:
				this.input.space.isDown = false;
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
				this.input.up.isDown = true;
				this.input.up.clicked = true;
				this.input.vertical--;
				break;
			case codes.left:
			case codes.a:
				this.input.left.isDown = true;
				this.input.left.clicked = true;
				this.input.horizontal--;
				break;
			case codes.down:
			case codes.s:
				this.input.down.isDown = true;
				this.input.down.clicked = true;
				this.input.vertical++;
				break;
			case codes.right:
			case codes.d:
				this.input.right.isDown = true;
				this.input.right.clicked = true;
				this.input.horizontal++;
				break;
			case codes.space:
				this.input.space.isDown = true;
				this.input.space.clicked = true;
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
		this.frameTimeElapseCounter += lastFrameTimeElapsed;

		_.each(this.tickers, (ticker) => {
			ticker.update(lastFrameTimeElapsed);
		});

		if (this.frameTimeElapseCounter >= this.idealFrameTime) {
			this.delta = this.frameTimeElapseCounter / this.idealFrameTime;
			this.update();
			this.render();
			this.frameTimeElapseCounter = 0;
		}

		this.lastTimestamp = this.timestamp();
		if (lastFrameTimeElapsed < this.tickTime) {
			setTimeout(this.loop.bind(this), this.tickTime - lastFrameTimeElapsed);
		} else {
			this.loop();
		}
	}

	getEntitiesWithTagName(tag) {
		var entities = [];
		entities.push(this.world.getEntitiesWithTagName(tag));
		return entities;
	}

	update() {
		this.state.update();
		this.world.update();
		this.input.pointer.movedThisFrame = false;
		this.input.pointer.clicked = false;
		this.input.up.clicked = false;
		this.input.down.clicked = false;
		this.input.left.clicked = false;
		this.input.right.clicked = false;
		this.input.space.clicked = false;
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

		if (this.camera.debug) {
			ctx.globalAlpha = 0.5;
			ctx.strokeStyle='#ffffff';
			ctx.strokeRect(
				this.camera.getMidPoint().x - this.camera.deadZone.width * 0.5 * this.camera.scale,
				this.camera.getMidPoint().y - this.camera.deadZone.height * 0.5 * this.camera.scale,
				this.camera.deadZone.width * this.camera.scale,
				this.camera.deadZone.height * this.camera.scale
			);
			ctx.globalAlpha = 1;
		}
	}
}

export default Game;