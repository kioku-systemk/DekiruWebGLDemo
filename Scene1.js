/*jslint devel: true, browser: true */
/*global gl, ShaderDrawer*/

var Scene1 = function () {
    'use strict';
    this.init = function () {
        var shader = "precision highp float;";
        shader += "/* mods by dist, shrunk slightly by @danbri*/";
        shader += "uniform float time;";
        shader += "uniform vec3 val;";
        shader += "uniform vec2 resolution;";
        shader += "void main(void) {";
        shader += "     vec2 uPos = ( gl_FragCoord.xy / resolution.xy );/*normalize wrt y axis*/";
        shader += "     uPos -= .5;";
        shader += "     vec3 color = vec3(0.1);";
        shader += "     float vertColor = 0.0;";
        shader += "     for( float i = 1.; i < 10.; ++i ) {";
        shader += "         float t = i + 2.0;";
        shader += "         uPos.y += sin( 1.4 + time*10.0 + uPos.x*(t)*40.0*val.z + (val.z* t * t * 0.3) ) * 0.20;";
        shader += "         float fTemp = abs(0.5 / uPos.y / 50.0) * sqrt(val.x);";
        shader += "         vertColor += fTemp;";
        shader += "         color += vec3( fTemp*(7.0-t)/7.0, fTemp*t/10.0, pow(fTemp,0.9)*1.5 );";
        shader += "     }";
        shader += "     gl_FragColor = vec4(color, 1.0);";
        shader += "}  ";
        this.sd = new ShaderDrawer(shader);
    };
    this.draw = function (scenetime, spectrums, wave) {
        gl.clearColor(0, 0, 0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.sd.draw(scenetime, window.innerWidth, window.innerHeight,
                     spectrums[20]  / 255.0,
                     spectrums[50]  / 255.0,
                     spectrums[200] / 255.0);
    };
    this.init();
    return this;
};