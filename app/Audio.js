var howler = require('howler');
var Howl = howler.Howl;
console.log(Howl);
var _ = require('underscore');

var Audio = {
	cache: {},
	loadedCount: 0,

	load: function(key, urls) {
		this.loading = true;
		this.loadedCount++;

		if (typeof(urls) === "string") {
			urls = [urls];
		}

		var sound = new Howl({
		  	urls: urls,
		  	onloaderror: function() {
				this.cache[key] = null;
				Console.warn("Couldn't put sound with url " + urls[0] + " and key " + key);
				this.loadedCount--;
			}.bind(this),
			onload: function() {
				this.loadedCount--;
			}.bind(this)
		});

		if (this.cache[key] != null) {
			Console.warn("Already cached a sound with key " + key);
		} else {
			this.cache[key] = sound;
		}
	},

	isLoaded: function() {
		return this.loadedCount == 0 && this.loading;
	},

	play: function(key) {
		if (this.cache[key] == null) {
			Console.warn("Can't find a sound with key " + key);
		} else {
			this.cache[key].play();
		}
	}
};

export default Audio;