/*jslint devel: true, browser: true */
/*global gl, ShaderDrawer*/

var Scene3 = function () {
    'use strict';
    this.init = function () {
        var shader = "precision highp float;";
        shader += "uniform vec2 resolution;";
        shader += "uniform float time;";
        shader += "/*Object A (tunnel)*/";
        shader += "float oa(vec3 q)";
        shader += "{";
        shader += "    return cos(q.x)+cos(q.y*0.5)+cos(1.2*q.z)+fract(q.y*3.)*.05;";
        shader += "}";
        shader += "/*Scene*/";
        shader += "float o(vec3 q)";
        shader += "{";
        shader += "    return min(oa(q),1.);";
        shader += "}";
        shader += "/*Get Normal*/";
        shader += "vec3 gn(vec3 q)";
        shader += "{";
        shader += "    vec3 f=vec3(.01,0,0);";
        shader += "    return normalize(vec3(o(q+f.xyy),o(q+f.yxy),o(q+f.yyx)));";
        shader += "}";
        shader += "/*MainLoop*/";
        shader += "void main(void)";
        shader += "{";
        shader += "    vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;";
        shader += "    p.x *= resolution.x/resolution.y;";
        shader += "    vec4 c=vec4(1.0);";
        shader += "    vec3 org=vec3(sin(time)*.5,cos(time*.5*10.0)*.25+.25,time*10.0);";
        shader += "    vec3 dir=normalize(vec3(p.x*1.6,p.y,1.0));";
        shader += "    vec3 q=org;";
        shader += "    vec3 pp;";
        shader += "    float d=.0;";
        shader += "    /*First raymarching*/";
        shader += "    for(int i=0;i<16;i++)";
        shader += "    {";
        shader += "        d=o(q);";
        shader += "        q+=d*dir;";
        shader += "    }";
        shader += "    pp=q;";
        shader += "    float f=length(q-org)*0.02;";
        shader += "    /*Second raymarching (reflection)*/";
        shader += "    dir=reflect(dir,gn(q));";
        shader += "    q+=dir;";
        shader += "    for(int i=0;i<4;i++)";
        shader += "    {";
        shader += "        d=o(q);";
        shader += "        q+=d*dir;";
        shader += "    }";
        shader += "    c=max(dot(gn(q),vec3(.1,.1,.0)),.0)+vec4(.3,cos(time*.5)*.5+.5,sin(time*.5)*.5+.5,1.)*min(length(q-org)*.04,1.);";
        shader += "    /*Final Color*/";
        shader += "    vec4 fcolor = ((c+vec4(f))+(1.-min(pp.y+1.9,1.))*vec4(1.,.8,.7,1.))*min(time*.5,1.);";
        shader += "    gl_FragColor=vec4(fcolor.xyz,1.0);";
        shader += "}";
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