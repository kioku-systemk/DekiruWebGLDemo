/*jslint devel: true, browser: true */
/*global gl*/

var SceneE = function () {
    'use strict';
    this.init = function () {
    };
    this.draw = function (scenetime, spectrums, wave) {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    this.init();
    return this;
};