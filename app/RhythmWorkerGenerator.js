import WorkerGenerator from './WorkerGenerator';

function RhythmWorkerGenerator(barTime, beatCount) {
	var worker = WorkerGenerator(function(barTime, beatCount) {
		var counter = 0;
		var beatListeners = [];
		var lastBeatTime, barTime, beatCount, beatTime, lastDetectableBeatTime, lastDetectableCounter;

		onmessage = function(e) {
			var m = e.data;

	    	switch(m.type) {
	    		case 'queue':
	    			playRhythm(m.data);
	    			break;
	    		case 'timing':
	    			barTime = m.data.barTime;
	    			beatCount = m.data.beatCount;
	    			beatTime = barTime / beatCount;
	    			allowableTime = beatTime * 0.75;
	    			loop();
	    			break;
	    		case 'input':
	    			onInput(m.data);
	    			break;
	    		default:
	    			console.log(m);
	    	}
	    }

	    var success = function(beat) {
	    	if (!beat.hit) {
	    		beat.hit = true;
	    		postMessage({type: 'callback', data: beat.callback.success});
	    	}
	    }

	    var failure = function(beat) {
	    	if (!beat.hit) {
	    		beat.hit = true;
	    		postMessage({type: 'callback', data: beat.callback.failure});
	    	}
	    }

	    var onInput = function(p) {
	    	console.log(p);

	    	var time = performance.now();
	    	if (time - lastDetectableBeatTime < allowableTime) {
    			//Then we're late but not too late.
    			for (var i = 0; i < beatListeners.length; i++) {
    				if (beatListeners[i].listen) {
    					if (beatListeners[i].time == lastDetectableCounter) {
	    					success(beatListeners[i]);
	    				} else if (beatListeners[i].time > lastDetectableCounter) {
	    					break;
	    				}
    				}
    			}
    		} else {
    			for (var i = 0; i < beatListeners.length; i++) {
    				if (beatListeners[i].listen) {
    					if (beatListeners[i].time == lastDetectableCounter) {
	    					failure(beatListeners[i]);
	    				} else if (beatListeners[i].time > lastDetectableCounter) {
	    					break;
	    				}
    				}
    			}
    		}

	    	var threshold = 1000;
	    	var nextDetectableBeat;
	    	var indexes = [];
	    	for (var i = 0; i < beatListeners.length; i++) {
	    		if (nextDetectableBeat == null) {
	    			if (beatListeners[i].listen) {
		    			nextDetectableBeat = beatListeners[i].time;
		    			indexes.push(i);
		    		}
	    		} else {
	    			if (beatListeners[i].time == nextDetectableBeat &&
	    				beatListeners[i].listen) {
	    				indexes.push(i);
	    			}
	    		}
	    	}

	    	if (nextDetectableBeat != null) {
	    		var nextDetectableBeatTime = lastBeatTime + (nextDetectableBeat - counter) * beatTime;
	    		if (nextDetectableBeatTime - time < threshold) {
	    			console.log(nextDetectableBeat - counter);
	    			if (nextDetectableBeatTime - time <= allowableTime) {
	    				for (var i = 0; i < indexes.length; i++) {
		    				success(beatListeners[indexes[i]]);
		    			}
	    			} else {
	    				for (var i = 0; i < indexes.length; i++) {
		    				failure(beatListeners[indexes[i]]);
		    			}
	    			}
	    		} else {
	    			console.log("There aren't any beats in the next " + (threshold / 1000) + " seconds.")
	    		}
	    	} else {
	    		console.log("There aren't any beats?");
	    	}
	    }

	    //Input detection now.
	    //Just like playRhythm, should be able to listen for multiple rhythms at once.
	    //So, perhaps
	    	//Beats
	    	//OnCorrect()
	    	//OnIncorrect()
	    //Now that beats actually have a time, we don't need to wait for them to play to figure out
	    //if they hit or not.

	    //Should be able to call this function to add multiple rhythms.
	    //e.g. one for the metronome, one for a rhythm puzzle, etc.
	    var playRhythm = function(r) {
	    	var nextBarCounter = (Math.floor(counter / beatCount) + 1) * beatCount;
	    	for (var i = 0; i < r.beats.length; i++) {
    			beatListeners.push({
    				alive: true,
    				time: nextBarCounter + r.beats[i],
    				listen: r.listen,
    				hit: false,
    				loop: (r.loop && i == r.beats.length - 1),
    				callback: r.callback,
    				r: r
    			});
	    	}
	    }

	    var onBeat = function() {
	    	counter++;
	    	lastBeatTime = performance.now();

	    	for (var i = 0; i < beatListeners.length; i++) {
	    		var beat = beatListeners[i];

	    		if (beat.time == counter) {
	    			if (beat.listen) {
	    				lastDetectableCounter = beat.time;
	    				lastDetectableBeatTime = performance.now();
	    			} else {
	    				postMessage({type: 'callback', data: beat.callback});
	    			}
	    			if (beat.loop) {
	    				playRhythm(beat.r);
	    				if (beat.onloop) {
	    					postMessage({type: 'callback', data: beat.onloop});
	    				}
	    			}
	    		} else if (beat.time < counter) {
	    			//We don't want to remove this yet.
	    			//It might still be used in input.
	    			//So we can only remove things from beatListeners when they're definitely not going to be used.
	    			//When is that, exactly?
	    			beat.alive = false;
	    			if (beat.listen) {
	    				failure(beat);
	    			}
	    		}
	    	}

	    	for (var i = beatListeners.length - 1; i >= 0; i--) {
	    		if (!beatListeners[i].alive) {
	    			beatListeners.splice(i, 1);
	    		}
	    	}
	    }
 
	    //Long-running work here
	    var lts = performance.now();
	    var elapsed = 0;

	    postMessage({type: 'event', data: 'started'});

	    this.pdown = false;
	    this.qdown = false;

	    var loop = () => {
	    	elapsed += performance.now() - lts;

	    	if (elapsed >= beatTime) {
	    		onBeat();
	    		elapsed -= beatTime - (elapsed - beatTime);
	    	}

	    	lts = performance.now();

			setTimeout(loop, 0);
	    };
	});

	worker.postMessage({
		type: 'timing',
		data: {
			barTime: barTime,
			beatCount: beatCount
		}
	});

	return worker;
}

export default RhythmWorkerGenerator;