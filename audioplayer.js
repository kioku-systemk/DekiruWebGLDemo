/*jslint devel: true, browser: true */
/*global AudioContext, webkitAudioContext*/
var AudioPlayer = function (url) {
	"use strict";

	if (typeof (webkitAudioContext) !== "undefined") {
		this.ctx = new webkitAudioContext();
	} else if (typeof (AudioContext) !== "undefined") {
		this.ctx = new AudioContext();
	}
	if (!this.ctx) {
		return;
	}
	this.url = url;
	this.source = this.ctx.createBufferSource();
	this.buffer = 0;
	this.startTime = 0;
	
	var analyser;
	analyser = this.ctx.createAnalyser();
	analyser.fftSize = 128;
	analyser.connect(this.ctx.destination);
	this.analyser  = analyser;
	this.spectrums = new Uint8Array(analyser.frequencyBinCount);
	this.source.connect(analyser);
	
	this.wavescope = this.ctx.createAnalyser();
	this.wavescope.fftSize = 2048;
	this.source.connect(this.wavescope);
	this.wavedata = new Uint8Array(this.wavescope.frequencyBinCount);

	this.getWaveCount = function () {
		return this.wavescope.frequencyBinCount;
	};

	this.getWave = function () {
		this.wavescope.getByteTimeDomainData(this.wavedata);
		return this.wavedata;
	};
	
	this.getSpectrumsCount = function () {
		return this.analyser.frequencyBinCount;
	};

	this.getSpectrums = function () {
		this.analyser.getByteFrequencyData(this.spectrums);
		return this.spectrums;
	};
	
	this.getTime = function () {
		if (this.audioDOM) {
			return (Date.now() - this.startTime) * 0.001;
		} else {
			return this.ctx.currentTime - this.startTime;
		}
	};
	
	this.getAllTime = function () {
		return this.source.buffer.duration;
	};

	this.loadMusic = function (filename, callback) {
		var useAudioDom = true,
			timeFunc,
			request,
			loadFunc,
			audioDom;
		
		this.startTime = 0;
		if (useAudioDom) {
			audioDom = document.createElement('audio');
			this.audioDOM = audioDom;
			audioDom.setAttribute('src', 'music.mp3');
			audioDom.setAttribute('type', 'audio/mp3');
			document.body.appendChild(audioDom);
			
			timeFunc = function (thisptr) { return function () {
				if (audioDom.currentTime > 0 && thisptr.startTime === 0) {
					thisptr.startTime = Date.now();
					callback();
				}
			}; };
			audioDom.addEventListener("timeupdate", timeFunc(this), false);
			audioDom.play();
		} else {
			request = new XMLHttpRequest();
			loadFunc = function (thisptr) { return function () {
				/*if (iOS) {
					// TODO:
					// can't play sound..
					thisptr.source.buffer = thisptr.ctx.createBuffer(request.response, false);
					thisptr.source.start(0);
					thisptr.startTime = thisptr.ctx.currentTime;
					callback();
				} else {*/
				thisptr.ctx.decodeAudioData(
					request.response,
					function (buffer) {
						thisptr.source.buffer = buffer;
						thisptr.source.start(0);
						thisptr.startTime = thisptr.ctx.currentTime;
						callback();
					},
					function (error) {
						// Decoding error
						console.log(error);
					}
				);
				//}
			}; };
			request.open('GET', filename, true);
			request.responseType = "arraybuffer";
			request.onload = loadFunc(this);
			request.send(null);
		}
	};
};