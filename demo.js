/*jslint devel: true, browser: true */
/*global AudioPlayer, requestAnimationFrame, ShaderDrawer*/
/*global Scene1, Scene2 */

var gl, // WebGL Context
	sceneTable = [
		{'sceneClass': Scene4, 'time': 7.2},
		{'sceneClass': Scene3, 'time': 7.2},
        {'sceneClass': Scene1, 'time': 7.2},
		{'sceneClass': Scene2, 'time': 7.8},
		{'sceneClass': SceneE, 'time': 10.0}
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
				sceneTable[i].sceneInst.draw(demotime - sceneTable[i].start, spectrums, wave);
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
		audioPlayer.loadMusic('music.mp3', true, function () {
			requestAnimationFrame(render); // START
		});
	},

	resizeFunc = function () {
        'use strict';
        var canvas = document.getElementById('canvas');
        canvas.setAttribute('width', window.innerWidth);
        canvas.setAttribute('height', window.innerHeight);
    },
    loadFunc = function () {
		'use strict';
        this.onresize();
        var btn = document.getElementById('startbtn'),
            timecode = document.getElementById("timecode");
        btn.addEventListener('click', function () {
            this.style.display = 'none';
            if (timecode) {
                timecode.style.display = "";
            }
            init();
        });
    };

window.onresize = resizeFunc;
window.onload = loadFunc;