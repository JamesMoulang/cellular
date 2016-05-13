import Game from './Game';

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var game = new Game(canvas, ctx);
	game.start();
};