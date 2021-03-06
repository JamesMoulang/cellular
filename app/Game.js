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
import PlayerListener from './entities/PlayerListener';
import Note from './entities/Note';

import CallbackManager from './CallbackManager';
import RhythmWorkerGenerator from './RhythmWorkerGenerator';
import Audio from './Audio';

var _ = require('underscore');

const codes = {
	w: 87,
	a: 65,
	s: 83,
	d: 68,
	up: 38,
	p: 80,
	q: 81,
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
		this.backgroundColour = '#eee9e9';
		
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
		this.shownSpaceHint = false;
		this.barTime = 2000;

		this.rhythmCallbacks = new CallbackManager();
		this.rhythmCallbacks.add('flash', function() {
			Audio.play('tick');
		}.bind(this));

		this.rhythmCallbacks.add('success', function() {
			console.log("success");
		}.bind(this));

		this.rhythmCallbacks.add('failure', function() {
			console.log("failure");
		}.bind(this));

		this.worker16 = RhythmWorkerGenerator(2000, 16);
		// this.worker12 = RhythmWorkerGenerator(2000, 12);
		this.worker16.onmessage = function(event) {
			var type = event.data.type;
			var data = event.data.data;

			if (type == 'event') {
				switch(data) {
					case 'started':
						console.log("STARTED!");
						this.worker16.postMessage(
							{
								type: 'queue', 
								data: {
									beats: [0,1,2,4,5,7,9,10],
									loop: true,
									listen: true,
									callback: {
										success: 'success',
										failure: 'failure'
									}
								}
							}
						);



						//Steve Reich
						// this.worker12.postMessage(
						// 	{
						// 		type: 'queue',
						// 		data: {
						// 			beats: [0,1,2,4,5,7,9,10],
						// 			loop: true,
						// 			callback: 'flash',
						// 			listen: false
						// 		}
						// 	}
						// );
						break;
					default:
						break;
				}
			} else if (type == 'callback') {
				this.rhythmCallbacks.trigger(data);
			}
		}.bind(this);

		this.gravity = -0.098;
		this.windDirection = new Vector(0.5, 0.5).normalised();

		this.input = {
			up: new KeyInput(),
			down: new KeyInput(),
			left: new KeyInput(),
			right: new KeyInput(),
			space: new KeyInput(),
			q: new KeyInput(),
			p: new KeyInput(),
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

	triggerBeat(k) {
		console.log(k);
	}

	setBarTime(bt) {
		this.barTime = bt;
		console.warn("this does nothing");
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
			case codes.q:
				this.input.q.isDown = false;
				break;
			case codes.p:
				this.input.p.isDown = false;
				break;
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
			case codes.q:
				if (!this.input.q.isDown) {
					this.input.q.clicked = true;
					this.worker16.postMessage({type: 'input', data: 'q'});
				}
				this.input.q.isDown = true;
				break;
			case codes.p:
				if (!this.input.p.isDown) {
					this.input.p.clicked = true;
					this.worker16.postMessage({type: 'input', data: 'p'});
				}
				this.input.p.isDown = true;
				break;
			case codes.up:
			case codes.w:
				if (!this.input.up.isDown) {
					this.input.up.clicked = true;
				}
				this.input.up.isDown = true;
				this.input.vertical--;
				break;
			case codes.left:
			case codes.a:
				if (!this.input.left.isDown) {
					this.input.left.clicked = true;
				}
				this.input.left.isDown = true;
				this.input.horizontal--;
				break;
			case codes.down:
			case codes.s:
				if (!this.input.down.isDown) {
					this.input.down.clicked = true;
				}
				this.input.down.isDown = true;
				this.input.vertical++;
				break;
			case codes.right:
			case codes.d:
				if (!this.input.right.isDown) {
					this.input.right.clicked = true;
				}
				this.input.right.isDown = true;
				this.input.horizontal++;
				break;
			case codes.space:
				if (!this.input.space.isDown) {
					this.input.space.clicked = true;
				}
				this.input.space.isDown = true;
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

	timestamp() {
		return performance.now();
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
		this.input.q.clicked = false;
		this.input.p.clicked = false;
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