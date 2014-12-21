/*jslint devel: true, browser: true */
/*global gl, Float32Array*/

var ShaderDrawer = function (shader) {
    'use strict';
    var fs = gl.createShader(gl.FRAGMENT_SHADER),
        vs = gl.createShader(gl.VERTEX_SHADER),
        pr;
    gl.shaderSource(vs, "attribute vec4 p;void main(){gl_Position=p;}");
    gl.shaderSource(fs, shader);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(vs));
        return null;
    }
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(fs));
        return null;
    }

    pr = gl.createProgram();
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, 1, 1, -3, -3, 1]), gl.STATIC_DRAW);
    this.prg = pr;
    this.draw = function (tm, w, h, val) {
        gl.viewport(0, 0, w, h);
        gl.useProgram(this.prg);
        gl.uniform2fv(gl.getUniformLocation(this.prg, "resolution"), [w, h]);
        gl.uniform1f(gl.getUniformLocation(this.prg, "time"), tm);
        gl.uniform3f(gl.getUniformLocation(this.prg, "val"), val, val, val);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
};