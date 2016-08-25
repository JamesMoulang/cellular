class CallbackManager {
	constructor() {
		this.callbacks = {};
	}

	trigger(key) {
		if (this.callbacks[key]) {
			this.callbacks[key]();
		} else {
			console.warn("No callback with key " + key);
		}
	}

	add(key, callback, override=false) {
		if (this.callbacks[key] && !override) {
			console.warn("There is already a callback with key " + key);
		} else {
			this.callbacks[key] = callback;
		}
	}

	dispose(key) {
		if (this.callbacks[key]) {
			this.callbacks[key] = null;
		}
	}
}

export default CallbackManager