/*jslint devel: true, browser: true */
/*global gl, ShaderDrawer*/

var Scene4 = function () {
    'use strict';
    this.init = function () {
        var shader = "precision highp float;";
        shader += "uniform vec3 val;";
        shader += "uniform float time;";
        shader += "uniform vec2 resolution;";
        shader += " mat3 genRotMat(float a0,float x,float y,float z){";
        shader += "     float a=a0*3.1415926535897932384626433832795/180.0;";
        shader += "     return mat3(";
        shader += "                 1.0+(1.0-cos(a))*(x*x-1.0),";
        shader += "                 -z*sin(a)+(1.0-cos(a))*x*y,";
        shader += "                 y*sin(a)+(1.0-cos(a))*x*z,";
        shader += "                 z*sin(a)+(1.0-cos(a))*x*y,";
        shader += "                 1.0+(1.0-cos(a))*(y*y-1.0),";
        shader += "                 -x*sin(a)+(1.0-cos(a))*y*z,";
        shader += "                 -y*sin(a)+(1.0-cos(a))*x*z,";
        shader += "                 x*sin(a)+(1.0-cos(a))*y*z,";
        shader += "                 1.0+(1.0-cos(a))*(z*z-1.0)";
        shader += "                 );";
        shader += " }";
        shader += "float cubeDist(vec3 p){";
        shader += "     return max(abs(p.x),max(abs(p.y),abs(p.z)));";
        shader += "}";
        shader += "void main(){";
        shader += "     float spread=5.5;";
        shader += "     float total=0.0;";
        shader += "     float delta=0.01;";
        shader += "     float cameraZ=-1.75;";
        shader += "     float nearZ=-1.0;";
        shader += "     float farZ=1.0;";
        shader += "     float gs=0.0;";
        shader += "     int iter=0;";
        shader += "     vec3 col=vec3(0.0,0.0,0.0);";
        shader += "     vec3 ray=vec3(0.0,0.0,0.0);";
        shader += "     mat3 rot=genRotMat(sin(time/4.13+(2.0*sqrt(val.z)))*360.0,1.0,0.0,0.0);";
        shader += "     rot=rot*genRotMat(sin(time/4.64)*360.0,0.0,1.0,0.0);";
        shader += "     rot=rot*genRotMat(sin(time/4.24)*360.0,0.0,0.0,1.0);";
        shader += "     vec2 p=vec2(0.0,0.0);";
        shader += "     p.x=gl_FragCoord.x/resolution.y-0.5*resolution.x/resolution.y;";
        shader += "     p.y=gl_FragCoord.y/resolution.y-0.5;";
        shader += "     ray.xy+=p.xy*spread*(nearZ-cameraZ);";
        shader += "     vec3 rayDir=vec3(spread*p.xy*delta,delta);";
        shader += "     vec3 tempDir=rayDir*rot;";
        shader += "     vec3 norm;";
        shader += "     ray.z=nearZ;";
        shader += "     bool refracted=false;";
        shader += "     for(int i=0;i<15;i++){";
        shader += "         vec3 temp;";
        shader += "         vec3 tempc;";
        shader += "         float val;";
        shader += "         temp=ray.xyz*rot;";
        shader += "         tempc=temp;";
        shader += "         float thres=0.5;";
        shader += "         if(tempc.x<0.0)tempc.x=abs(tempc.x);";
        shader += "         if(tempc.x<thres)tempc.x=0.0;";
        shader += "         else tempc.x=1.0/tempc.x*sin(time);";
        shader += "         if(tempc.y<0.0)tempc.y=abs(tempc.y);";
        shader += "         if(tempc.y<thres)tempc.y=0.0;";
        shader += "         else tempc.y=1.0/tempc.y*sin(time*0.842);";
        shader += "         if(tempc.z<0.0)tempc.z=abs(tempc.z);";
        shader += "         if(tempc.z<thres)tempc.z=0.0;";
        shader += "         else tempc.z=1.0/tempc.z*sin(time*1.132);";
        shader += "         val=cubeDist(temp);";
        shader += "         if(val<thres && !refracted){";
        shader += "             rayDir=vec3(0.5*spread*p.xy*delta,delta);";
        shader += "             refracted=true;";
        shader += "         }";
        shader += "         if(val<0.0)val=abs(val);";
        shader += "         if(val<thres)val=0.0;";
        shader += "         else val=1.0/val;";
        shader += "         col.x+=(val+tempc.x)/2.0;";
        shader += "         col.y+=(val+tempc.y)/2.0;";
        shader += "         col.z+=(val+tempc.z)/2.0;";
        shader += "         ray+=rayDir;";
        shader += "         iter++;";
        shader += "         if(ray.z>=farZ)break;";
        shader += "     }";
        shader += "     col.x=col.x/float(iter);";
        shader += "     col.y=col.y/float(iter);";
        shader += "     col.z=col.z/float(iter);";
        shader += "     gl_FragColor=vec4(col,1.0);";
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