/*jslint devel: true, browser: true */
/*global AudioPlayer, requestAnimationFrame*/

var gl, // WebGL Context
	sceneFadeIn = function () {
		'use strict';
		this.init = function () {
			
		};
		this.draw = function (scenetime) {
			var fd = scenetime / 4.0;
			gl.clearColor(fd, fd, fd, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		};
		this.init();
		return this;
	},
	scene1 = function () {
		'use strict';
		this.init = function () {
			
		};
		this.draw = function (scenetime) {
			gl.clearColor(0.0, 1.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT);
		};
		this.init();
		return this;
	},
	sceneTable = [
		{'sceneClass': sceneFadeIn, 'time': 4.0},
		{'sceneClass': scene1,      'time': 8.0}
	],
	audioPlayer = new AudioPlayer(),
	render = function () {
		'use strict';
		var wave      = audioPlayer.getWave(),
			spectrums = audioPlayer.getSpectrums(),
			canvas    = document.getElementById('canvas'),
			timeCode  = document.getElementById('timecode'),
			demotime  = audioPlayer.getTime(),
			i;
		
		// For debug
		if (timeCode) {
			timeCode.innerHTML = demotime.toFixed(3);
		}
		
		// Draw scene
		for (i = 0; i < sceneTable.length; i = i + 1) {
			if (demotime < sceneTable[i].end) {
				sceneTable[i].sceneInst.draw(demotime - sceneTable[i].start);
				break;
			}
		}
		
		// next frame
		requestAnimationFrame(render);
	},
	init = function () {
		'use strict';
		var i,
			timeOffset = 0,
			c = document.getElementById('canvas');
		
		// WebGL Init
		gl = c.getContext('webgl') || c.getContext('experimental-webgl');
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Scene Init
		for (i = 0; i < sceneTable.length; i = i + 1) {
			sceneTable[i].start = timeOffset;
			timeOffset = timeOffset + sceneTable[i].time;
			sceneTable[i].end = timeOffset;
			sceneTable[i].sceneInst = new sceneTable[i].sceneClass();
		}
		
		// Music
		audioPlayer.loadMusic('music.mp3', function () {
			requestAnimationFrame(render); // START
		});
	};