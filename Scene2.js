/*jslint devel: true, browser: true */
/*global gl, ShaderDrawer*/

var Scene2 = function () {
    'use strict';
    this.init = function () {
        var shader = "precision highp float;";
        shader += "uniform vec3 val;";
        shader += "uniform float time;";
        shader += "uniform vec2 resolution;";
        shader += "vec3 roy(vec3 v, float x)";
        shader += "{";
        shader += "    return vec3(cos(x)*v.x - sin(x)*v.z,v.y,sin(x)*v.x + cos(x)*v.z);";
        shader += "}";
        shader += "vec3 rox(vec3 v, float x)";
        shader += "{";
        shader += "    return vec3(v.x,v.y*cos(x) - v.z*sin(x),v.y*sin(x) + v.z*cos(x));";
        shader += "}";
        shader += "float fdtun(vec3 rd, vec3 ro, float r)";
        shader += "{";
        shader += "    float a = dot(rd.xy,rd.xy);";
        shader += "    float b = dot(ro.xy,rd.xy);";
        shader += "    float d = (b*b)-(10.0*a*(dot(ro.xy,ro.xy)+(r*r)));";
        shader += "    return (-b+sqrt(abs(d)))/(3.75*a);";
        shader += "}";
        shader += "vec2 tunuv(vec3 pos){";
        shader += "    return vec2(pos.z,(atan(pos.y, pos.x))/0.31830988618379);";
        shader += "}";
        shader += "vec3 checkerCol(vec2 loc, vec3 col)";
        shader += "{";
        shader += "	   return mix(col, vec3(0.0005), mod(step(fract(loc.x), 0.75) + step(fract(loc.y), 0.25),7.5));";
        shader += "}";
        shader += "vec3 lcheckcol(vec2 loc, vec3 col)";
        shader += "{";
        shader += "	return checkerCol(loc*7.5,col)*checkerCol(loc*1.75,col);";
        shader += "}";
        shader += "void main( void ) {";
        shader += "     vec3 dif = vec3(0.15,0.25,0.15);";
        shader += "     vec3 scoll = vec3(0.75,0.25,0.75);";
        shader += "     vec3 scolr = vec3(0.75,0.75,0.5);";
        shader += "     vec2 uv = (gl_FragCoord.xy/resolution.xy);";
        shader += "     vec3 ro = vec3(0.0,0.0,time*1.75);";
        shader += "     vec3 dir = normalize( vec3( -1.0 + 2.0*vec2(uv.x - .2, uv.y)* vec2(resolution.x/resolution.y, 1.0), -1.33 ) );";
        shader += "     float ry = time*0.3;";
        shader += "     dir = roy(rox(dir,time*0.5),time*-1.5);";
        shader += "     vec3 lro = ro-dif;";
        shader += "     vec3 rro = ro+dif;";
        shader += "     const float r = 1.0;";
        shader += "     float ld = fdtun(dir,lro,r);";
        shader += "     float rd = fdtun(dir,rro,r);";
        shader += "     vec2 luv = tunuv(ro + ld*dir);";
        shader += "     vec2 ruv = tunuv(ro + rd*dir);";
        shader += "     vec3 coll = lcheckcol(luv*.25,scoll)*(20.0/exp(sqrt(ld)));";
        shader += "     vec3 colr = lcheckcol(ruv*.5,scolr)*(20.0/exp(sqrt(rd)));";
        shader += "     gl_FragColor = vec4(sqrt(val.x)* sqrt(mix(coll + colr, coll * colr, 5.0+sin(time * 0.5))),1.0);";
        shader += " }";
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