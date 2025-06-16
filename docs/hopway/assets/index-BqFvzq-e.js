(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function l(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerPolicy&&(c.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?c.credentials="include":r.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(r){if(r.ep)return;r.ep=!0;const c=l(r);fetch(r.href,c)}})();(function(a){function e(t,i=0,n=1){return Math.max(i,Math.min(t,n))}function l(t,i,n){const o=n-i,h=t-i;if(h>=0)return h%o+i;{let d=o+h%o+i;return d>=n&&(d-=o),d}}function s(t,i,n){return i<=t&&t<n}function r(t){return[...Array(t).keys()]}function c(t,i){return r(t).map(n=>i(n))}function u(t,i){let n=[];for(let o=0,h=0;o<t.length;h++)i(t[o],h)?(n.push(t[o]),t.splice(o,1)):o++;return n}function f(t){return[...t].reduce((i,[n,o])=>(i[n]=o,i),{})}function y(t){return Object.keys(t).map(i=>[i,t[i]])}function x(t,i){return String.fromCharCode(t.charCodeAt(0)+i)}function E(t){return t.x!=null&&t.y!=null}class v{constructor(i,n){this.x=0,this.y=0,this.set(i,n)}set(i=0,n=0){return E(i)?(this.x=i.x,this.y=i.y,this):(this.x=i,this.y=n,this)}add(i,n){return E(i)?(this.x+=i.x,this.y+=i.y,this):(this.x+=i,this.y+=n,this)}sub(i,n){return E(i)?(this.x-=i.x,this.y-=i.y,this):(this.x-=i,this.y-=n,this)}mul(i){return this.x*=i,this.y*=i,this}div(i){return this.x/=i,this.y/=i,this}clamp(i,n,o,h){return this.x=e(this.x,i,n),this.y=e(this.y,o,h),this}wrap(i,n,o,h){return this.x=l(this.x,i,n),this.y=l(this.y,o,h),this}addWithAngle(i,n){return this.x+=Math.cos(i)*n,this.y+=Math.sin(i)*n,this}swapXy(){const i=this.x;return this.x=this.y,this.y=i,this}normalize(){return this.div(this.length),this}rotate(i){if(i===0)return this;const n=this.x;return this.x=n*Math.cos(i)-this.y*Math.sin(i),this.y=n*Math.sin(i)+this.y*Math.cos(i),this}angleTo(i,n){return E(i)?Math.atan2(i.y-this.y,i.x-this.x):Math.atan2(n-this.y,i-this.x)}distanceTo(i,n){let o,h;return E(i)?(o=i.x-this.x,h=i.y-this.y):(o=i-this.x,h=n-this.y),Math.sqrt(o*o+h*h)}isInRect(i,n,o,h){return s(this.x,i,i+o)&&s(this.y,n,n+h)}equals(i){return this.x===i.x&&this.y===i.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const P=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],V="twrgybpclRGYBPCL";let W,me;const Ul=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function Bl(t,i){const[n,o,h]=St(0,t);if(W=f(P.map((d,g)=>{if(g<1)return[d,{r:0,g:0,b:0,a:0}];if(g<9){const[A,M,T]=St(g-1,t);return[d,{r:A,g:M,b:T,a:1}]}const[m,S,C]=St(g-9+1,t);return[d,{r:Math.floor(t?m*.5:n-(n-m)*.5),g:Math.floor(t?S*.5:h-(h-S)*.5),b:Math.floor(t?C*.5:o-(o-C)*.5),a:1}]})),t){const d=W.blue;W.white={r:Math.floor(d.r*.15),g:Math.floor(d.g*.15),b:Math.floor(d.b*.15),a:1}}i!=null&&Wl(i)}function Wl(t){me=t.map(i=>({r:i[0],g:i[1],b:i[2],a:1}));for(let i=0;i<P.length;i++){let n=1/0,o=-1;for(let h=0;h<me.length;h++){const d=zl(me[h],W[P[i]]);d<n&&(n=d,o=h)}W[P[i]]=me[o]}}function zl(t,i){const n={r:.299,g:.587,b:.114},o=t.r-i.r,h=t.g-i.g,d=t.b-i.b,g=i.r===i.g&&i.g===i.b;let m=Math.sqrt(o*o*n.r+h*h*n.g+d*d*n.b);return g&&!(i.r===0&&i.g===0&&i.b===0)&&(m*=1.5),m}function St(t,i){i&&(t===0?t=7:t===7&&(t=0));const n=Ul[t];return[(n&16711680)>>16,(n&65280)>>8,n&255]}function ye(t,i=1){const n=typeof t=="number"?me[t]:W[t];return Math.floor(n.r*i)<<16|Math.floor(n.g*i)<<8|Math.floor(n.b*i)}function Se(t,i=1){const n=typeof t=="number"?me[t]:W[t],o=Math.floor(n.r*i),h=Math.floor(n.g*i),d=Math.floor(n.b*i);return n.a<1?`rgba(${o},${h},${d},${n.a})`:`rgb(${o},${h},${d})`}const Yl=`
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float width;
uniform float height;

float gridValue(vec2 uv, float res) {
  vec2 grid = fract(uv * res);
  return (step(res, grid.x) * step(res, grid.y));
}

void main(void) {
  vec4 color = texture2D(uSampler, vTextureCoord);  
  vec2 grid_uv = vTextureCoord.xy * vec2(width, height);
  float v = gridValue(grid_uv, 0.2);
  gl_FragColor.rgba = color * v;
}
`;function Kl(t,i){return new PIXI.Filter(void 0,Yl,{width:t,height:i})}const F=new v;let G,te,b,$=new v;const mi=5;document.createElement("img");let _,Ie,ke=1,Ct="black",B,yi,Ce=!1,k,Si;function Vl(t,i,n,o,h,d,g,m){F.set(t),k=m,Ct=n;const S=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${i};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${i};
color: #888;
`,C=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,A=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=S,$.set(F),k.isUsingPixi){$.mul(mi);const T=new PIXI.Application({width:$.x,height:$.y});if(G=T.view,b=new PIXI.Graphics,b.scale.x=b.scale.y=mi,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,T.stage.addChild(b),b.filters=[],k.name==="crt"&&b.filters.push(Si=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),k.name==="pixel"&&b.filters.push(Kl($.x,$.y)),k.name==="pixel"||k.name==="shapeDark"){const I=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:k.name==="pixel"?1.5:1,brightness:k.name==="pixel"?1.5:1,blur:8});b.filters.push(I)}b.lineStyle(0),G.style.cssText=C}else G=document.createElement("canvas"),G.width=$.x,G.height=$.y,te=G.getContext("2d"),te.imageSmoothingEnabled=!1,G.style.cssText=C+A;document.body.appendChild(G);const M=()=>{const I=innerWidth/innerHeight,O=$.x/$.y,R=I<O,H=R?.95*innerWidth:.95*innerHeight*O,N=R?.95*innerWidth/O:.95*innerHeight;G.style.width=`${H}px`,G.style.height=`${N}px`};if(window.addEventListener("resize",M),M(),o){_=document.createElement("canvas");let T;h?(_.width=$.x,_.height=$.y,T=d):($.x<=$.y*2?(_.width=$.y*2,_.height=$.y):(_.width=$.x,_.height=$.x/2),_.width>400&&(ke=400/_.width,_.width=400,_.height*=ke),T=Math.round(400/_.width)),Ie=_.getContext("2d"),Ie.fillStyle=i,gcc.setOptions({scale:T,capturingFps:60,isSmoothingEnabled:!1,durationSec:g})}}function Ke(){if(k.isUsingPixi){b.clear(),b.beginFill(ye(Ct,k.isDarkColor?.15:1)),b.drawRect(0,0,F.x,F.y),b.endFill(),b.beginFill(ye(B)),Ce=!0;return}te.fillStyle=Se(Ct,k.isDarkColor?.15:1),te.fillRect(0,0,F.x,F.y),te.fillStyle=Se(B)}function J(t){if(t===B){k.isUsingPixi&&!Ce&&Ve(ye(B));return}if(B=t,k.isUsingPixi){Ce&&b.endFill(),Ve(ye(B));return}te.fillStyle=Se(t)}function Ve(t){je(),b.beginFill(t),Ce=!0}function je(){Ce&&(b.endFill(),Ce=!1)}function Ze(){yi=B}function Xe(){J(yi)}function ve(t,i,n,o){if(k.isUsingPixi){k.name==="shape"||k.name==="shapeDark"?b.drawRoundedRect(t,i,n,o,2):b.drawRect(t,i,n,o);return}te.fillRect(t,i,n,o)}function jl(t,i,n,o,h){const d=ye(B);Ve(d),b.drawCircle(t,i,h*.5),b.drawCircle(n,o,h*.5),je(),b.lineStyle(h,d),b.moveTo(t,i),b.lineTo(n,o),b.lineStyle(0)}function Zl(){Si.time+=.2}function Xl(){if(Ie.fillRect(0,0,_.width,_.height),ke===1)Ie.drawImage(G,(_.width-G.width)/2,(_.height-G.height)/2);else{const t=G.width*ke,i=G.height*ke;Ie.drawImage(G,(_.width-t)/2,(_.height-i)/2,t,i)}gcc.capture(_)}const Ci=[`
l
l
l

l
`,`
l l
l l



`,`
 l l
lllll
 l l
lllll
 l l
`,`
 lll
l l
 lll
  l l
 lll
`,`
l   l
l  l
  l
 l  l
l   l
`,`
 l
l l
 ll l
l  l
 ll l
`,`
l
l



`,`
 l
l
l
l
 l
`,`
l
 l
 l
 l
l
`,`
  l
l l l
 lll
l l l
  l
`,`
  l
  l
lllll
  l
  l
`,`



 l
l
`,`


lllll


`,`




l
`,`
    l
   l
  l
 l
l
`,`
 lll
l  ll
l l l
ll  l
 lll
`,`
 ll
l l
  l
  l
lllll
`,`
 lll
l   l
  ll
 l
lllll
`,`
llll
    l
  ll
    l
llll
`,`
  ll
 l l
l  l
lllll
   l
`,`
lllll
l
llll
    l
llll
`,`
 lll
l
llll
l   l
 lll
`,`
lllll
l   l
   l
  l
 l
`,`
 lll
l   l
 lll
l   l
 lll
`,`
 lll
l   l
 llll
    l
 lll
`,`

l

l

`,`

 l

 l
l
`,`
   ll
 ll
l
 ll
   ll
`,`

lllll

lllll

`,`
ll
  ll
    l
  ll
ll
`,`
 lll
l   l
  ll

  l
`,`
 lll
l   l
l lll
l
 lll
`,`
 lll
l   l
lllll
l   l
l   l
`,`
llll
l   l
llll
l   l
llll
`,`
 llll
l
l
l
 llll
`,`
llll
l   l
l   l
l   l
llll
`,`
lllll
l
llll
l
lllll
`,`
lllll
l
llll
l
l
`,`
 lll
l
l  ll
l   l
 llll
`,`
l   l
l   l
lllll
l   l
l   l
`,`
lllll
  l
  l
  l
lllll
`,`
  lll
   l
   l
   l
lll
`,`
l   l
l  l
lll
l  l
l   l
`,`
l
l
l
l
lllll
`,`
l   l
ll ll
l l l
l   l
l   l
`,`
l   l
ll  l
l l l
l  ll
l   l
`,`
 lll
l   l
l   l
l   l
 lll
`,`
llll
l   l
llll
l
l
`,`
 lll
l   l
l   l
l  ll
 llll
`,`
llll
l   l
llll
l   l
l   l
`,`
 llll
l
 lll
    l
llll
`,`
lllll
  l
  l
  l
  l
`,`
l   l
l   l
l   l
l   l
 lll
`,`
l   l
l   l
l   l
 l l
  l
`,`
l   l
l l l
l l l
l l l
 l l
`,`
l   l
 l l
  l
 l l
l   l
`,`
l   l
 l l
  l
  l
  l
`,`
lllll
   l
  l
 l
lllll
`,`
  ll
  l
  l
  l
  ll
`,`
l
 l
  l
   l
    l
`,`
 ll
  l
  l
  l
 ll
`,`
  l
 l l



`,`




lllll
`,`
 l
  l



`,`

 lll
l  l
l  l
 lll
`,`
l
l
lll
l  l
lll
`,`

 lll
l  
l
 lll
`,`
   l
   l
 lll
l  l
 lll
`,`

 ll
l ll
ll
 ll
`,`
  l
 l 
lll
 l
 l
`,`
 ll
l  l
 lll
   l
 ll
`,`
l
l
ll
l l
l l
`,`

l

l
l
`,`
 l

 l
 l
l
`,`
l
l
l l
ll
l l
`,`
ll
 l
 l
 l
lll
`,`

llll
l l l
l l l
l   l
`,`

lll
l  l
l  l
l  l
`,`

 ll
l  l
l  l
 ll
`,`

lll
l  l
lll
l
`,`

 lll
l  l
 lll
   l
`,`

l ll
ll
l
l
`,`

 lll
ll
  ll
lll
`,`

 l
lll
 l
  l
`,`

l  l
l  l
l  l
 lll
`,`

l  l
l  l
 ll
 ll
`,`

l   l
l l l
l l l
 l l
`,`

l  l
 ll
 ll
l  l
`,`

l  l
 ll
 l
l
`,`

llll
  l
 l
llll
`,`
 ll
 l
l
 l
 ll
`,`
l
l
l
l
l
`,`
ll
 l
  l
 l
ll
`,`

 l
l l l
   l

`],Jl=[`
 l
 l
 l

 l
`,`
l l
l l



`,`
l l
lll
l l
lll
l l
`,`
 ll
ll
lll
 ll
ll
`,`
l l
  l
 l
l
l l
`,`
ll
ll
lll
l 
lll
`,`
 l
 l



`,`
  l
 l
 l
 l
  l
`,`
l
 l
 l
 l
l
`,`
 l
lll
 l
lll
 l
`,`
 l
 l
lll
 l
 l
`,`



 l
l
`,`


lll


`,`




 l
`,`
  l
 l
 l
 l
l
`,`
lll
l l
l l
l l
lll
`,`
  l
  l
  l
  l
  l
`,`
lll
  l
lll
l
lll
`,`
lll
  l
lll
  l
lll
`,`
l l
l l
lll
  l
  l
`,`
lll
l
lll
  l
lll
`,`
l
l
lll
l l
lll
`,`
lll
  l
  l
  l
  l
`,`
lll
l l
lll
l l
lll
`,`
lll
l l
lll
  l
  l
`,`

 l

 l

`,`

 l

 l
l
`,`
  l
 l
l
 l
  l
`,`

lll

lll

`,`
l
 l
  l
 l
l
`,`
lll
  l
 ll

 l
`,`

lll
l l
l
 ll
`,`
lll
l l
lll
l l
l l
`,`
ll
l l
lll
l l
ll
`,`
lll
l
l
l
lll
`,`
ll
l l
l l
l l
ll
`,`
lll
l
lll
l
lll
`,`
lll
l
lll
l
l
`,`
lll
l
l l
l l
 ll
`,`
l l
l l
lll
l l
l l
`,`
 l
 l
 l
 l
 l
`,`
  l
  l
  l
  l
ll
`,`
l l
l l
ll
l l
l l
`,`
l
l
l
l
lll
`,`
l l
lll
l l
l l
l l
`,`
l l
lll
lll
lll
l l
`,`
lll
l l
l l
l l
lll
`,`
lll
l l
lll
l
l
`,`
lll
l l
l l
lll
lll
`,`
ll
l l
ll
l l
l l
`,`
lll
l
lll
  l
lll
`,`
lll
 l
 l
 l
 l
`,`
l l
l l
l l
l l
lll
`,`
l l
l l
l l
l l
 l
`,`
l l
l l
lll
lll
l l
`,`
l l
l l
 l
l l
l l
`,`
l l
l l
lll
 l
 l
`,`
lll
  l
 l
l
lll
`,`
 ll
 l
 l
 l
 ll
`,`
l
 l
 l
 l
  l
`,`
ll
 l
 l
 l
ll
`,`
 l
l l



`,`




lll
`,`
l
 l



`,`


 ll
l l
 ll
`,`

l
lll
l l
lll
`,`


lll
l
lll
`,`

  l
lll
l l
lll
`,`


lll
l
 ll
`,`

 ll
 l
lll
 l
`,`

lll
lll
  l
ll
`,`

l
l
lll
l l
`,`

 l

 l
 l
`,`

 l

 l
ll
`,`

l
l l
ll
l l
`,`

 l
 l
 l
 l
`,`


lll
lll
l l
`,`


ll
l l
l l
`,`


lll
l l
lll
`,`


lll
lll
l
`,`


lll
lll
  l
`,`


lll
l
l
`,`


 ll
lll
ll
`,`


lll
 l
 l
`,`


l l
l l
lll
`,`


l l
l l
 l
`,`


l l
lll
l l
`,`


l l
 l
l l
`,`


l l
 l
l
`,`


lll
 l
lll
`,`
 ll
 l
l
 l
 ll
`,`
 l
 l
 l
 l
 l
`,`
ll
 l
  l
 l
ll
`,`

l
lll
  l

`];let Te,Je;function ql(){Te=[],Je=[]}function vi(){Te=Te.concat(Je),Je=[]}function Ti(t){let i={isColliding:{rect:{},text:{},char:{}}};return Te.forEach(n=>{Ql(t,n)&&(i=Object.assign(Object.assign(Object.assign({},i),vt(n.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},i.isColliding.rect),n.collision.isColliding.rect),text:Object.assign(Object.assign({},i.isColliding.text),n.collision.isColliding.text),char:Object.assign(Object.assign({},i.isColliding.char),n.collision.isColliding.char)}}))}),i}function Ql(t,i){const n=i.pos.x-t.pos.x,o=i.pos.y-t.pos.y;return-i.size.x<n&&n<t.size.x&&-i.size.y<o&&o<t.size.y}function vt(t){if(t==null)return{};const i={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let n={};return y(t).forEach(([o,h])=>{const d=i[o];h&&d!=null&&(n[d]=!0)}),n}function wi(t,i,n,o){return Ei(!1,t,i,n,o)}function es(t,i,n,o){return Ei(!0,t,i,n,o)}function Ei(t,i,n,o,h){if(typeof n=="number"){if(typeof o=="number")return ie(i,n,o,Object.assign({isCharacter:t,isCheckingCollision:!0,color:B},h));throw"invalid params"}else return ie(i,n.x,n.y,Object.assign({isCharacter:t,isCheckingCollision:!0,color:B},o))}const be=6,ts=4,q=1,D=be*q,we=ts*q;let Tt,wt,qe,Et,Mt=!1,Ee,xt,Oe,Qe;const At={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function is(){Ee=document.createElement("canvas"),Ee.width=Ee.height=D,xt=Ee.getContext("2d"),Oe=document.createElement("canvas"),Qe=Oe.getContext("2d"),Tt=Ci.map((t,i)=>et(t,String.fromCharCode(33+i),!1)),wt=Jl.map((t,i)=>et(t,String.fromCharCode(33+i),!1)),qe=Ci.map((t,i)=>et(t,String.fromCharCode(33+i),!0)),Et={}}function ls(t,i){const n=i.charCodeAt(0)-33;t.forEach((o,h)=>{qe[n+h]=et(o,String.fromCharCode(33+n+h),!0)})}function ss(){Mt=!0}function ie(t,i,n,o={}){const h=Ai(o);let d=t,g=i,m=n,S,C={isColliding:{rect:{},text:{},char:{}}};const A=h.isSmallText?we:D;for(let M=0;M<d.length;M++){if(M===0){const O=d.charCodeAt(0);if(O<33||O>126)g=Math.floor(g-D/2*h.scale.x),m=Math.floor(m-D/2*h.scale.y);else{const R=O-33,H=h.isCharacter?qe[R]:h.isSmallText?wt[R]:Tt[R];g=Math.floor(g-H.size.x/2*h.scale.x),m=Math.floor(m-H.size.y/2*h.scale.y)}S=g}const T=d[M];if(T===`
`){g=S,m+=D*h.scale.y;continue}const I=ns(T,g,m,h);h.isCheckingCollision&&(C={isColliding:{rect:Object.assign(Object.assign({},C.isColliding.rect),I.isColliding.rect),text:Object.assign(Object.assign({},C.isColliding.text),I.isColliding.text),char:Object.assign(Object.assign({},C.isColliding.char),I.isColliding.char)}}),g+=A*h.scale.x}return C}function ns(t,i,n,o){const h=t.charCodeAt(0);if(h<32||h>126)return{isColliding:{rect:{},text:{},char:{}}};const d=Ai(o);if(d.backgroundColor!=="transparent"){const N=d.isSmallText?we:D,mt=d.isSmallText?2:1;Ze(),J(d.backgroundColor),ve(i+mt,n,N*d.scale.x,D*d.scale.y),Xe()}if(h<=32)return{isColliding:{rect:{},text:{},char:{}}};const g=h-33,m=d.isCharacter?qe[g]:d.isSmallText?wt[g]:Tt[g],S=l(d.rotation,0,4);if(d.color==="black"&&S===0&&d.mirror.x===1&&d.mirror.y===1&&d.edgeColor==null&&(!k.isUsingPixi||d.scale.x===1&&d.scale.y===1))return It(m,i,n,d.scale,d.isCheckingCollision,!0);const C=JSON.stringify({c:t,options:d}),A=Et[C];if(A!=null)return It(A,i,n,d.scale,d.isCheckingCollision,d.color!=="transparent");let M=!1;const T=new v(D,D);let I=Ee,O=xt;if(m.size.x>D||m.size.y>D){if(S===0||S===2)T.set(m.size.x,m.size.y);else{const N=Math.max(m.size.x,m.size.y);T.set(N,N)}I=document.createElement("canvas"),I.width=T.x,I.height=T.y,O=I.getContext("2d"),O.imageSmoothingEnabled=!1}k.isUsingPixi&&(d.scale.x!==1||d.scale.y!==1)&&(Oe.width=T.x*d.scale.x,Oe.height=T.y*d.scale.y,Qe.imageSmoothingEnabled=!1,Qe.scale(d.scale.x,d.scale.y),Mi(Qe,S,d,m.image,T),M=!0),O.clearRect(0,0,T.x,T.y),Mi(O,S,d,m.image,T);const R=kt(O,T,t,d.isCharacter);d.edgeColor!=null&&(I=as(O,T,d.edgeColor),T.x+=2,T.y+=2);let H;if(Mt||k.isUsingPixi){const N=document.createElement("img");if(N.src=I.toDataURL(),k.isUsingPixi){const mt=document.createElement("img");mt.src=(M?Oe:I).toDataURL(),H=PIXI.Texture.from(mt)}Mt&&(Et[C]={image:N,texture:H,hitBox:R,size:T})}return It({image:I,texture:H,hitBox:R,size:T},i,n,d.scale,d.isCheckingCollision,d.color!=="transparent")}function as(t,i,n){const o=i.x+2,h=i.y+2,d=[[0,-1],[1,0],[0,1],[-1,0]],g=document.createElement("canvas");g.width=o,g.height=h;const m=g.getContext("2d");m.imageSmoothingEnabled=!1,m.drawImage(t.canvas,1,1);const C=m.getImageData(0,0,o,h).data;m.fillStyle=Se(n);for(let A=0;A<h;A++)for(let M=0;M<o;M++){const T=(A*o+M)*4;if(C[T+3]===0)for(const[I,O]of d){const R=M+I,H=A+O;if(R>=0&&R<o&&H>=0&&H<h){const N=(H*o+R)*4;if(C[N+3]>0){m.fillRect(M,A,1,1);break}}}}return g}function Mi(t,i,n,o,h){i===0&&n.mirror.x===1&&n.mirror.y===1?t.drawImage(o,0,0):(t.save(),t.translate(h.x/2,h.y/2),t.rotate(Math.PI/2*i),(n.mirror.x===-1||n.mirror.y===-1)&&t.scale(n.mirror.x,n.mirror.y),t.drawImage(o,-h.x/2,-h.y/2),t.restore()),n.color!=="black"&&(t.globalCompositeOperation="source-in",t.fillStyle=Se(n.color==="transparent"?"black":n.color),t.fillRect(0,0,h.x,h.y),t.globalCompositeOperation="source-over")}function It(t,i,n,o,h,d){if(d&&(o.x===1&&o.y===1?xi(t,i,n):xi(t,i,n,t.size.x*o.x,t.size.y*o.y)),!h)return;const g={pos:{x:i+t.hitBox.pos.x*o.x,y:n+t.hitBox.pos.y*o.y},size:{x:t.hitBox.size.x*o.x,y:t.hitBox.size.y*o.y},collision:t.hitBox.collision},m=Ti(g);return d&&Te.push(g),m}function xi(t,i,n,o,h){if(k.isUsingPixi){je(),b.beginTextureFill({texture:t.texture,matrix:new PIXI.Matrix().translate(i,n)}),b.drawRect(i,n,o??t.size.x,h??t.size.y),Ve(ye(B));return}o==null?te.drawImage(t.image,i,n):te.drawImage(t.image,i,n,o,h)}function et(t,i,n){if(t.indexOf(".")>=0||t.indexOf("data:image/")==0)return rs(t,i);let o=t.split(`
`);o=o.slice(1,o.length-1);let h=0;o.forEach(I=>{h=Math.max(I.length,h)});const d=Math.max(Math.ceil((be-h)/2),0),g=o.length,m=Math.max(Math.ceil((be-g)/2),0),S=new v(Math.max(be,h)*q,Math.max(be,g)*q);let C=Ee,A=xt;(S.x>D||S.y>D)&&(C=document.createElement("canvas"),C.width=S.x,C.height=S.y,A=C.getContext("2d"),A.imageSmoothingEnabled=!1),A.clearRect(0,0,S.x,S.y),o.forEach((I,O)=>{for(let R=0;R<h;R++){const H=I.charAt(R);let N=V.indexOf(H);H!==""&&N>=1&&(A.fillStyle=Se(P[N]),A.fillRect((R+d)*q,(O+m)*q,q,q))}});const M=document.createElement("img");M.src=C.toDataURL();const T=kt(A,S,i,n);return k.isUsingPixi?{image:M,texture:PIXI.Texture.from(M),size:S,hitBox:T}:{image:M,size:S,hitBox:T}}function rs(t,i){const n=document.createElement("img");n.src=t;const o=new v,h={pos:new v,size:new v,collision:{isColliding:{char:{},text:{}}}};let d;return k.isUsingPixi?d={image:n,texture:PIXI.Texture.from(n),size:new v,hitBox:h}:d={image:n,size:o,hitBox:h},n.onload=()=>{d.size.set(n.width*q,n.height*q);const g=document.createElement("canvas");g.width=d.size.x,g.height=d.size.y;const m=g.getContext("2d");m.imageSmoothingEnabled=!1,m.drawImage(n,0,0,d.size.x,d.size.y);const S=document.createElement("img");S.src=g.toDataURL(),d.image=S,d.hitBox=kt(m,d.size,i,!0),k.isUsingPixi&&(d.texture=PIXI.Texture.from(S))},d}function kt(t,i,n,o){const h={pos:new v(D,D),size:new v,collision:{isColliding:{char:{},text:{}}}};o?h.collision.isColliding.char[n]=!0:h.collision.isColliding.text[n]=!0;const d=t.getImageData(0,0,i.x,i.y).data;let g=0;for(let m=0;m<i.y;m++)for(let S=0;S<i.x;S++)d[g+3]>0&&(S<h.pos.x&&(h.pos.x=S),m<h.pos.y&&(h.pos.y=m)),g+=4;g=0;for(let m=0;m<i.y;m++)for(let S=0;S<i.x;S++)d[g+3]>0&&(S>h.pos.x+h.size.x-1&&(h.size.x=S-h.pos.x+1),m>h.pos.y+h.size.y-1&&(h.size.y=m-h.pos.y+1)),g+=4;return h}function Ai(t){let i=Object.assign(Object.assign({},At),t);return t.scale!=null&&(i.scale=Object.assign(Object.assign({},At.scale),t.scale)),t.mirror!=null&&(i.mirror=Object.assign(Object.assign({},At.mirror),t.mirror)),i}let Me=!1,tt=!1,bt=!1;const Ii=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Ot;const os={onKeyDown:void 0};let Rt,Dt=!1,Pt=!1,Lt=!1,_t={},Nt={},Ft={};function ki(t){Rt=Object.assign(Object.assign({},os),t),Ot=f(Ii.map(i=>[i,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",i=>{Dt=Pt=!0,_t[i.code]=Nt[i.code]=!0,Rt.onKeyDown!=null&&Rt.onKeyDown(),(i.code==="AltLeft"||i.code==="AltRight"||i.code==="ArrowRight"||i.code==="ArrowDown"||i.code==="ArrowLeft"||i.code==="ArrowUp")&&i.preventDefault()}),document.addEventListener("keyup",i=>{Dt=!1,Lt=!0,_t[i.code]=!1,Ft[i.code]=!0})}function bi(){tt=!Me&&Pt,bt=Me&&Lt,Pt=Lt=!1,Me=Dt,y(Ot).forEach(([t,i])=>{i.isJustPressed=!i.isPressed&&Nt[t],i.isJustReleased=i.isPressed&&Ft[t],i.isPressed=!!_t[t]}),Nt={},Ft={}}function Oi(){tt=!1,Me=!0}var cs=Object.freeze({__proto__:null,get isPressed(){return Me},get isJustPressed(){return tt},get isJustReleased(){return bt},codes:Ii,get code(){return Ot},init:ki,update:bi,clearJustPressed:Oi});class it{constructor(i=null){this.setSeed(i)}get(i=1,n){return n==null&&(n=i,i=0),this.next()/4294967295*(n-i)+i}getInt(i,n){n==null&&(n=i,i=0);const o=Math.floor(i),h=Math.floor(n);return h===o?o:this.next()%(h-o)+o}getPlusOrMinus(){return this.getInt(2)*2-1}select(i){return i[this.getInt(i.length)]}setSeed(i,n=123456789,o=362436069,h=521288629,d=32){this.w=i!=null?i>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=n>>>0,this.y=o>>>0,this.z=h>>>0;for(let g=0;g<d;g++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const i=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(i^i>>>8))>>>0,this.w}}const Re=new v;let le=!1,xe=!1,De=!1,hs={isDebugMode:!1,anchor:new v,padding:new v,onPointerDownOrUp:void 0},z,Z,U;const Pe=new it,de=new v,se=new v;let Le=!1,_e=new v,Gt=!1,$t=!1,Ht=!1;function Ri(t,i,n){U=Object.assign(Object.assign({},hs),n),z=t,Z=new v(i.x+U.padding.x*2,i.y+U.padding.y*2),_e.set(z.offsetLeft+z.clientWidth*(.5-U.anchor.x),z.offsetTop+z.clientWidth*(.5-U.anchor.y)),U.isDebugMode&&de.set(z.offsetLeft+z.clientWidth*(.5-U.anchor.x),z.offsetTop+z.clientWidth*(.5-U.anchor.y)),document.addEventListener("mousedown",o=>{Li(o.pageX,o.pageY)}),document.addEventListener("touchstart",o=>{Li(o.touches[0].pageX,o.touches[0].pageY)}),document.addEventListener("mousemove",o=>{_i(o.pageX,o.pageY)}),document.addEventListener("touchmove",o=>{o.preventDefault(),_i(o.touches[0].pageX,o.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",o=>{Ni()}),document.addEventListener("touchend",o=>{o.preventDefault(),o.target.click(),Ni()},{passive:!1})}function Di(){ds(_e.x,_e.y,Re),U.isDebugMode&&!Re.isInRect(0,0,Z.x,Z.y)?(us(),Re.set(de),xe=!le&&Le,De=le&&!Le,le=Le):(xe=!le&&$t,De=le&&Ht,le=Gt),$t=Ht=!1}function Pi(){xe=!1,le=!0}function ds(t,i,n){z!=null&&(n.x=Math.round(((t-z.offsetLeft)/z.clientWidth+U.anchor.x)*Z.x-U.padding.x),n.y=Math.round(((i-z.offsetTop)/z.clientHeight+U.anchor.y)*Z.y-U.padding.y))}function us(){se.length>0?(de.add(se),!s(de.x,-Z.x*.1,Z.x*1.1)&&de.x*se.x>0&&(se.x*=-1),!s(de.y,-Z.y*.1,Z.y*1.1)&&de.y*se.y>0&&(se.y*=-1),Pe.get()<.05&&se.set(0)):Pe.get()<.1&&(se.set(0),se.addWithAngle(Pe.get(Math.PI*2),(Z.x+Z.y)*Pe.get(.01,.03))),Pe.get()<.05&&(Le=!Le)}function Li(t,i){_e.set(t,i),Gt=$t=!0,U.onPointerDownOrUp!=null&&U.onPointerDownOrUp()}function _i(t,i){_e.set(t,i)}function Ni(t){Gt=!1,Ht=!0,U.onPointerDownOrUp!=null&&U.onPointerDownOrUp()}var fs=Object.freeze({__proto__:null,pos:Re,get isPressed(){return le},get isJustPressed(){return xe},get isJustReleased(){return De},init:Ri,update:Di,clearJustPressed:Pi});let ne=new v,ae=!1,Q=!1,he=!1;function Fi(t){ki({onKeyDown:t}),Ri(G,F,{onPointerDownOrUp:t,anchor:new v(.5,.5)})}function Gi(){bi(),Di(),ne=Re,ae=Me||le,Q=tt||xe,he=bt||De}function $i(){Oi(),Pi()}function Ne(t){ne.set(t.pos),ae=t.isPressed,Q=t.isJustPressed,he=t.isJustReleased}var gs=Object.freeze({__proto__:null,get pos(){return ne},get isPressed(){return ae},get isJustPressed(){return Q},get isJustReleased(){return he},init:Fi,update:Gi,clearJustPressed:$i,set:Ne});let Y,Fe,Ut=!1,Hi,Ui,Bt,re={};function Bi(t,i=1){const n=re[t];return n==null?!1:(n.gainNode.gain.value=i,n.isPlaying=!0,!0)}function ps(){const t=Y.currentTime;for(const i in re){const n=re[i];if(!n.isReady||!n.isPlaying)continue;n.isPlaying=!1;const o=Ms(t);(n.playedTime==null||o>n.playedTime)&&(Ts(n,o),n.playedTime=o)}}function Wi(t,i=void 0){const n=re[t];n.source!=null&&(i==null?n.source.stop():n.source.stop(i),n.source=void 0)}function ms(t=void 0){if(re){for(const i in re)Wi(i,t);re={}}}function ys(){Y=new(window.AudioContext||window.webkitAudioContext),document.addEventListener("visibilitychange",()=>{document.hidden?Y.suspend():Y.resume()})}function Ss(){Ut=!0,Fe=Y.createGain(),Fe.connect(Y.destination),zi(),vs(),Yi()}function Cs(t,i){return re[t]=ws(i),re[t]}function zi(t=120){Hi=t,Ui=60/Hi}function vs(t=8){Bt=t>0?4/t:void 0}function Yi(t=.1){Fe.gain.value=t}function Ts(t,i){const n=Y.createBufferSource();t.source=n,n.buffer=t.buffer,n.loop=t.isLooping,n.start=n.start||n.noteOn,n.connect(t.gainNode),n.start(i)}function ws(t){const i={buffer:void 0,source:void 0,gainNode:Y.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return i.gainNode.connect(Fe),Es(t).then(n=>{i.buffer=n,i.isReady=!0}),i}async function Es(t){const n=await(await fetch(t)).arrayBuffer();return await Y.decodeAudioData(n)}function Ms(t){if(Bt==null)return t;const i=Ui*Bt;return i>0?Math.ceil(t/i)*i:t}let Ki,Vi;const ji=68,Wt=1e3/ji;let Ge=0;const xs={viewSize:{x:100,y:100},bodyBackground:"#111",viewBackground:"black",isCapturing:!1,isCapturingGameCanvasOnly:!1,isSoundEnabled:!0,captureCanvasScale:1,theme:{name:"simple",isUsingPixi:!1,isDarkColor:!1},colorPalette:void 0};let j,Zi=10,lt;function As(t,i,n){Ki=t,Vi=i,j=Object.assign(Object.assign({},xs),n),Bl(j.theme.isDarkColor,j.colorPalette),Vl(j.viewSize,j.bodyBackground,j.viewBackground,j.isCapturing,j.isCapturingGameCanvasOnly,j.captureCanvasScale,j.captureDurationSec,j.theme),Fi(()=>{Y.resume()}),is(),Ki(),Xi()}function Xi(){lt=requestAnimationFrame(Xi);const t=window.performance.now();t<Ge-ji/12||(Ge+=Wt,(Ge<t||Ge>t+Wt*2)&&(Ge=t+Wt),Ut&&ps(),j.isSoundEnabled&&sss.update(),Gi(),Vi(),j.isCapturing&&Xl(),Zi--,Zi===0&&ss())}function Is(){lt&&(cancelAnimationFrame(lt),lt=void 0)}let st;const nt=new it;function zt(){st=[]}function Ji(t,i=16,n=1,o=0,h=Math.PI*2,d=void 0){if(i<1){if(nt.get()>i)return;i=1}for(let g=0;g<i;g++){const m=o+nt.get(h)-h/2,S={pos:new v(t),vel:new v(n*nt.get(.5,1),0).rotate(m),color:B,ticks:e(nt.get(10,20)*Math.sqrt(Math.abs(n)),10,60),edgeColor:d};st.push(S)}}function at(){Ze(),st=st.filter(t=>{if(t.ticks--,t.ticks<0)return!1;t.pos.add(t.vel),t.vel.mul(.98);const i=Math.floor(t.pos.x),n=Math.floor(t.pos.y);return t.edgeColor!=null&&(J(t.edgeColor),ve(i-1,n-1,3,3)),J(t.color),ve(i,n,1,1),!0}),Xe()}function Yt(t,i,n,o){return qi(!1,t,i,n,o)}function ks(t,i,n,o){return qi(!0,t,i,n,o)}function bs(t,i,n,o,h=.5,d=.5){typeof t!="number"&&(d=h,h=o,o=n,n=i,i=t.y,t=t.x);const g=new v(n).rotate(h),m=new v(t-g.x*d,i-g.y*d);return Kt(m,g,o)}function Os(t,i,n=3,o=3,h=3){const d=new v,g=new v;if(typeof t=="number")if(typeof i=="number")typeof n=="number"?(d.set(t,i),g.set(n,o)):(d.set(t,i),g.set(n),h=o);else throw"invalid params";else if(typeof i=="number")if(typeof n=="number")d.set(t),g.set(i,n),h=o;else throw"invalid params";else if(typeof n=="number")d.set(t),g.set(i),h=n;else throw"invalid params";return Kt(d,g.sub(d),h)}function Rs(t,i,n,o,h,d){let g=new v;typeof t=="number"?g.set(t,i):(g.set(t),d=h,h=o,o=n,n=i),o==null&&(o=3),h==null&&(h=0),d==null&&(d=Math.PI*2);let m,S;if(h>d?(m=d,S=h-d):(m=h,S=d-h),S=e(S,0,Math.PI*2),S<.01)return;const C=e(Math.ceil(S*Math.sqrt(n*.25)),1,36),A=S/C;let M=m,T=new v(n).rotate(M).add(g),I=new v,O=new v,R={isColliding:{rect:{},text:{},char:{}}};for(let H=0;H<C;H++){M+=A,I.set(n).rotate(M).add(g),O.set(I).sub(T);const N=Kt(T,O,o,!0);R=Object.assign(Object.assign(Object.assign({},R),vt(N.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},R.isColliding.rect),N.isColliding.rect),text:Object.assign(Object.assign({},R.isColliding.text),N.isColliding.text),char:Object.assign(Object.assign({},R.isColliding.char),N.isColliding.char)}}),T.set(I)}return vi(),R}function qi(t,i,n,o,h){if(typeof i=="number"){if(typeof n=="number")return typeof o=="number"?h==null?ue(t,i,n,o,o):ue(t,i,n,o,h):ue(t,i,n,o.x,o.y);throw"invalid params"}else if(typeof n=="number"){if(o==null)return ue(t,i.x,i.y,n,n);if(typeof o=="number")return ue(t,i.x,i.y,n,o);throw"invalid params"}else return ue(t,i.x,i.y,n.x,n.y)}function Kt(t,i,n,o=!1){let h=!0;(k.name==="shape"||k.name==="shapeDark")&&(B!=="transparent"&&jl(t.x,t.y,t.x+i.x,t.y+i.y,n),h=!1);const d=Math.floor(e(n,3,10)),g=Math.abs(i.x),m=Math.abs(i.y),S=e(Math.ceil(g>m?g/d:m/d)+1,3,99);i.div(S-1);let C={isColliding:{rect:{},text:{},char:{}}};for(let A=0;A<S;A++){const M=ue(!0,t.x,t.y,n,n,!0,h);C=Object.assign(Object.assign(Object.assign({},C),vt(M.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},C.isColliding.rect),M.isColliding.rect),text:Object.assign(Object.assign({},C.isColliding.text),M.isColliding.text),char:Object.assign(Object.assign({},C.isColliding.char),M.isColliding.char)}}),t.add(i)}return o||vi(),C}function ue(t,i,n,o,h,d=!1,g=!0){let m=g;(k.name==="shape"||k.name==="shapeDark")&&m&&B!=="transparent"&&(t?ve(i-o/2,n-h/2,o,h):ve(i,n,o,h),m=!1);let S=t?{x:Math.floor(i-o/2),y:Math.floor(n-h/2)}:{x:Math.floor(i),y:Math.floor(n)};const C={x:Math.trunc(o),y:Math.trunc(h)};if(C.x===0||C.y===0)return{isColliding:{rect:{},text:{},char:{}}};C.x<0&&(S.x+=C.x,C.x*=-1),C.y<0&&(S.y+=C.y,C.y*=-1);const A={pos:S,size:C,collision:{isColliding:{rect:{}}}};A.collision.isColliding.rect[B]=!0;const M=Ti(A);return B!=="transparent"&&((d?Je:Te).push(A),m&&ve(S.x,S.y,C.x,C.y)),M}function Vt({pos:t,size:i,text:n,isToggle:o=!1,onClick:h=()=>{},isSmallText:d=!0}){return{pos:t,size:i,text:n,isToggle:o,onClick:h,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:d}}function jt(t){const i=new v(ne).sub(t.pos);t.isHovered=i.isInRect(0,0,t.size.x,t.size.y),t.isHovered&&xe&&(t.isPressed=!0),t.isPressed&&!t.isHovered&&(t.isPressed=!1),t.isPressed&&De&&(t.onClick(),t.isPressed=!1,t.isToggle&&(t.toggleGroup.length===0?t.isSelected=!t.isSelected:(t.toggleGroup.forEach(n=>{n.isSelected=!1}),t.isSelected=!0))),rt(t)}function rt(t){Ze(),J(t.isPressed?"blue":"light_blue"),Yt(t.pos.x,t.pos.y,t.size.x,t.size.y),t.isToggle&&!t.isSelected&&(J("white"),Yt(t.pos.x+1,t.pos.y+1,t.size.x-2,t.size.y-2)),J(t.isHovered?"black":"blue"),wi(t.text,t.pos.x+3,t.pos.y+3,{isSmallText:t.isSmallText}),Xe()}let ee,$e,fe,Zt;function Ds(t){ee={randomSeed:t,inputs:[]}}function Ps(t){ee.inputs.push(t)}function Qi(){return ee!=null}function Ls(t){$e=0,t.setSeed(ee.randomSeed)}function _s(){$e>=ee.inputs.length||(Ne(ee.inputs[$e]),$e++)}function Ns(){fe=[]}function Fs(t,i,n){fe.push({randomState:n.getState(),gameState:cloneDeep(t),baseState:cloneDeep(i)})}function Gs(t){const i=fe.pop(),n=i.randomState;return t.setSeed(n.w,n.x,n.y,n.z,0),Zt={pos:new v(ne),isPressed:ae,isJustPressed:Q,isJustReleased:he},Ne(ee.inputs.pop()),i}function $s(t){const i=fe[fe.length-1],n=i.randomState;return t.setSeed(n.w,n.x,n.y,n.z,0),Zt={pos:new v(ne),isPressed:ae,isJustPressed:Q,isJustReleased:he},Ne(ee.inputs[ee.inputs.length-1]),i}function Hs(){Ne(Zt)}function Us(){return fe.length===0}function Bs(){const t=$e-1;if(!(t>=ee.inputs.length))return fe[t]}const Xt=4,Ws=60,zs="video/webm;codecs=vp8,opus",Ys="video/webm",Ks="recording.webm",Vs=1e5*Xt,js=.7;let X,ot;function Zs(t,i,n){if(X!=null)return;const o=document.createElement("canvas");o.width=t.width*Xt,o.height=t.height*Xt;const h=o.getContext("2d");h.imageSmoothingEnabled=!1;const d=()=>{h.drawImage(t,0,0,t.width,t.height,0,0,o.width,o.height),ot=requestAnimationFrame(d)};d();const g=o.captureStream(Ws),m=i.createMediaStreamDestination(),S=i.createGain();S.gain.value=js,n.forEach(T=>{T!=null&&T.connect(S)}),S.connect(m);const C=m.stream,A=new MediaStream([...g.getVideoTracks(),...C.getAudioTracks()]);X=new MediaRecorder(A,{mimeType:zs,videoBitsPerSecond:Vs});let M=[];X.ondataavailable=T=>{T.data.size>0&&M.push(T.data)},X.onstop=()=>{const T=new Blob(M,{type:Ys}),I=URL.createObjectURL(T),O=document.createElement("a");O.href=I,O.download=Ks,O.click(),URL.revokeObjectURL(I),M=[]},X.start()}function Xs(){X!=null&&X.state!=="inactive"&&(X.stop(),X=void 0),ot&&(cancelAnimationFrame(ot),ot=void 0)}function Js(){return X!=null&&X.state==="recording"}const qs=Math.PI,Qs=Math.abs,en=Math.sin,tn=Math.cos,ln=Math.atan2,sn=Math.sqrt,nn=Math.pow,an=Math.floor,rn=Math.round,on=Math.ceil;a.ticks=0,a.difficulty=void 0,a.score=0,a.time=void 0,a.isReplaying=!1;function cn(t=1,i){return oe.get(t,i)}function hn(t=2,i){return oe.getInt(t,i)}function dn(t=1,i){return oe.get(t,i)*oe.getPlusOrMinus()}function Jt(t="GAME OVER"){ft=t,p.isShowingTime&&(a.time=void 0),ol()}function un(t="COMPLETE"){ft=t,ol()}function fn(t,i,n){if(a.isReplaying||(a.score+=t,i==null))return;const o=`${t>=1?"+":""}${Math.floor(t)}`;let h=new v;typeof i=="number"?h.set(i,n):h.set(i),h.x-=o.length*(p.isUsingSmallText?we:D)/2,h.y-=D/2,dt.push({str:o,pos:h,vy:-2,ticks:30})}function el(t){J(t)}function gn(t,i,n,o,h,d){let g=new v;typeof t=="number"?(g.set(t,i),m(g,n,o,h,d)):(g.set(t),m(g,i,n,o,h));function m(S,C,A,M,T){if(Dn(C)){const I=C;Ji(S,I.count,I.speed,I.angle,I.angleWidth,I.edgeColor)}else Ji(S,C,A,M,T)}}function tl(t,i){return new v(t,i)}function il(t,i){!Be&&!pe&&(Ut&&Bi(t,i!=null&&i.volume!=null?i.volume:1)||(p.isSoundEnabled&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(t,i):p.isSoundEnabled&&sss.play(yn[t])))}let qt;function Qt(){li&&Bi(p.bgmName,p.bgmVolume)||(typeof sss.generateMml=="function"?qt=sss.playMml(sss.generateMml(),{volume:p.bgmVolume}):sss.playBgm())}function ei(){li?Wi(p.bgmName):qt!=null?sss.stopMml(qt):sss.stopBgm()}function ll(){Zs(G,Y,[Fe,pt])}function ti(){Xs()}function pn(t){if(Be){const i=$s(oe),n=i.baseState;return a.score=n.score,a.ticks=n.ticks,cloneDeep(i.gameState)}else if(pe){const i=Gs(oe),n=i.baseState;return a.score=n.score,a.ticks=n.ticks,i.gameState}else{if(a.isReplaying)return Bs().gameState;if(ge==="inGame"){const i={score:a.score,ticks:a.ticks};Fs(t,i,oe)}}return t}function mn(){pe||(!a.isReplaying&&p.isRewindEnabled?In():Jt())}const yn={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"},sl={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},Sn=new it,oe=new it;let ge,Cn={title:xn,inGame:Mn,gameOver:An,rewind:kn},He=0,ct,ht=!0,Ue=0,p,nl,dt,Be=!1,pe=!1,We,ut,ft,ii,gt,pt,li=!1;function vn(t){window.update=t.update,window.title=t.title,window.description=t.description,window.characters=t.characters,window.options=t.options,window.audioFiles=t.audioFiles,al()}function al(){typeof options<"u"&&options!=null?p=Object.assign(Object.assign({},sl),options):p=sl;const t={name:p.theme,isUsingPixi:!1,isDarkColor:!1};p.theme!=="simple"&&p.theme!=="dark"&&(t.isUsingPixi=!0),(p.theme==="pixel"||p.theme==="shapeDark"||p.theme==="crt"||p.theme==="dark")&&(t.isDarkColor=!0),Ue=p.audioSeed+p.seed,p.isMinifying&&Ln(),nl={viewSize:p.viewSize,bodyBackground:t.isDarkColor?"#101010":"#e0e0e0",viewBackground:t.isDarkColor?"blue":"white",theme:t,isSoundEnabled:p.isSoundEnabled,isCapturing:p.isCapturing,isCapturingGameCanvasOnly:p.isCapturingGameCanvasOnly,captureCanvasScale:p.captureCanvasScale,captureDurationSec:p.captureDurationSec,colorPalette:p.colorPalette},As(wn,En,nl)}function Tn(){Is(),ti(),ms(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}function wn(){if(typeof description<"u"&&description!=null&&description.trim().length>0&&(ht=!1,Ue+=fl(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(ht=!1,document.title=title,Ue+=fl(title),gt=`crisp-game-${encodeURIComponent(title)}-${Ue}`,He=Rn()),typeof characters<"u"&&characters!=null&&ls(characters,"a"),ys(),typeof audioFiles<"u"&&audioFiles!=null){Ss(),Yi(.1*p.audioVolume),zi(p.audioTempo);for(let t in audioFiles){const i=Cs(t,audioFiles[t]);t===p.bgmName&&(i.isLooping=!0,li=!0)}}p.isSoundEnabled&&(pt=Y.createGain(),pt.connect(Y.destination),sss.init(Ue,Y,pt),sss.setVolume(.1*p.audioVolume),sss.setTempo(p.audioTempo)),J("black"),ht?(si(),a.ticks=0):rl()}function En(){a.df=a.difficulty=a.ticks/3600+1,a.tc=a.ticks;const t=a.score,i=a.time;a.sc=a.score;const n=a.sc;a.inp={p:ne,ip:ae,ijp:Q,ijr:he},ql(),Cn[ge](),k.isUsingPixi&&(je(),k.name==="crt"&&Zl()),a.ticks++,a.isReplaying?(a.score=t,a.time=i):a.sc!==n&&(a.score=a.sc)}function si(){ge="inGame",a.ticks=-1,zt();const t=Math.floor(a.score);t>He&&(He=t),p.isShowingTime&&a.time!=null&&(ct==null||ct>a.time)&&(ct=a.time),a.score=0,a.time=0,dt=[],p.isPlayingBgm&&p.isSoundEnabled&&Qt();const i=Sn.getInt(999999999);oe.setSeed(i),(p.isReplayEnabled||p.isRewindEnabled)&&(Ds(i),Ns(),a.isReplaying=!1)}function Mn(){Ke(),p.isDrawingParticleFront||at(),p.isDrawingScoreFront||ul(),(p.isReplayEnabled||p.isRewindEnabled)&&Ps({pos:tl(ne),isPressed:ae,isJustPressed:Q,isJustReleased:he}),typeof update=="function"&&update(),p.isDrawingParticleFront&&at(),p.isDrawingScoreFront&&ul(),ni(),p.isShowingTime&&a.time!=null&&a.time++,p.isRecording&&!Js()&&ll()}function rl(){ge="title",a.ticks=-1,zt(),Ke(),Qi()&&(Ls(oe),a.isReplaying=!0)}function xn(){if(Q){si();return}if(Ke(),p.isReplayEnabled&&Qi()&&(_s(),a.inp={p:ne,ip:ae,ijp:Q,ijr:he},p.isDrawingParticleFront||at(),update(),p.isDrawingParticleFront&&at()),ni(),typeof title<"u"&&title!=null){let t=0;title.split(`
`).forEach(n=>{n.length>t&&(t=n.length)});const i=Math.floor((F.x-t*D)/2);title.split(`
`).forEach((n,o)=>{ie(n,i,Math.floor(F.y*.25)+o*D,{edgeColor:p.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let t=0;description.split(`
`).forEach(o=>{o.length>t&&(t=o.length)});const i=p.isUsingSmallText?we:D,n=Math.floor((F.x-t*i)/2);description.split(`
`).forEach((o,h)=>{ie(o,n,Math.floor(F.y/2)+h*D,{isSmallText:p.isUsingSmallText,edgeColor:p.textEdgeColor.description})})}}function ol(){ge="gameOver",a.isReplaying||$i(),a.ticks=-1,hl(),p.isPlayingBgm&&p.isSoundEnabled&&ei();const t=Math.floor(a.score);t>He&&On(t)}function An(){a.ticks===0&&!k.isUsingPixi&&hl(),(a.isReplaying||a.ticks>20)&&Q?(cl(),si()):a.ticks===(p.isReplayEnabled?120:300)&&!ht&&(cl(),rl())}function cl(){!p.isRecording||a.isReplaying||ti()}function hl(){a.isReplaying||ie(ft,Math.floor((F.x-ft.length*D)/2),Math.floor(F.y/2),{edgeColor:p.textEdgeColor.gameOver})}function In(){ge="rewind",Be=!0,We=Vt({pos:{x:F.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:p.isUsingSmallText}),ut=Vt({pos:{x:F.x-39,y:F.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:p.isUsingSmallText}),p.isPlayingBgm&&p.isSoundEnabled&&ei(),k.isUsingPixi&&(rt(We),rt(ut))}function kn(){Ke(),update(),ni(),Hs(),pe?(rt(We),(Us()||!ae)&&bn()):(jt(We),jt(ut),We.isPressed&&(pe=!0,Be=!1)),ut.isPressed&&(Be=pe=!1,Jt()),p.isShowingTime&&a.time!=null&&a.time++}function bn(){pe=!1,ge="inGame",zt(),p.isPlayingBgm&&p.isSoundEnabled&&Qt()}function ni(){if(p.isShowingTime)dl(a.time,3,3),dl(ct,F.x-7*(p.isUsingSmallText?we:D),3);else if(p.isShowingScore){ie(`${Math.floor(a.score)}`,3,3,{isSmallText:p.isUsingSmallText,edgeColor:p.textEdgeColor.score});const t=`HI ${He}`;ie(t,F.x-t.length*(p.isUsingSmallText?we:D),3,{isSmallText:p.isUsingSmallText,edgeColor:p.textEdgeColor.score})}}function dl(t,i,n){if(t==null)return;let o=Math.floor(t*100/50);o>=10*60*100&&(o=10*60*100-1);const h=ai(Math.floor(o/6e3),1)+"'"+ai(Math.floor(o%6e3/100),2)+'"'+ai(Math.floor(o%100),2);ie(h,i,n,{isSmallText:p.isUsingSmallText,edgeColor:p.textEdgeColor.score})}function ai(t,i){return("0000"+t).slice(-i)}function ul(){Ze(),J("black"),dt=dt.filter(t=>(ie(t.str,t.pos.x,t.pos.y,{isSmallText:p.isUsingSmallText,edgeColor:p.textEdgeColor.floatingScore}),t.pos.y+=t.vy,t.vy*=.9,t.ticks--,t.ticks>0)),Xe()}function fl(t){let i=0;for(let n=0;n<t.length;n++){const o=t.charCodeAt(n);i=(i<<5)-i+o,i|=0}return i}function On(t){if(gt!=null)try{const i={highScore:t};localStorage.setItem(gt,JSON.stringify(i))}catch(i){console.warn("Unable to save high score:",i)}}function Rn(){try{const t=localStorage.getItem(gt);if(t)return JSON.parse(t).highScore}catch(t){console.warn("Unable to load high score:",t)}return 0}function Dn(t){return t!=null&&t.constructor===Object}function Pn(){let t=window.location.search.substring(1);if(t=t.replace(/[^A-Za-z0-9_-]/g,""),t.length===0)return;const i=document.createElement("script");ii=`${t}/main.js`,i.setAttribute("src",ii),document.head.appendChild(i)}function Ln(){fetch(ii).then(t=>t.text()).then(t=>{const i=Terser.minify(t+"update();",{toplevel:!0}).code,n="function(){",o=i.indexOf(n),h="options={",d=i.indexOf(h);let g=i;if(o>=0)g=i.substring(i.indexOf(n)+n.length,i.length-4);else if(d>=0){let m=1,S;for(let C=d+h.length;C<i.length;C++){const A=i.charAt(C);if(A==="{")m++;else if(A==="}"&&(m--,m===0)){S=C+2;break}}m===0&&(g=i.substring(S))}gl.forEach(([m,S])=>{g=g.split(m).join(S)}),console.log(g),console.log(`${g.length} letters`)})}a.inp=void 0;function _n(...t){return el.apply(this,t)}function Nn(...t){return il.apply(this,t)}function Fn(...t){return c.apply(this,t)}function Gn(...t){return u.apply(this.args)}a.tc=void 0,a.df=void 0,a.sc=void 0;const $n="transparent",Hn="white",Un="red",Bn="green",Wn="yellow",zn="blue",Yn="purple",Kn="cyan",Vn="black",jn="coin",Zn="laser",Xn="explosion",Jn="powerUp",qn="hit",Qn="jump",ea="select",ta="lucky";let gl=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];a.PI=qs,a.abs=Qs,a.addGameScript=Pn,a.addScore=fn,a.addWithCharCode=x,a.arc=Rs,a.atan2=ln,a.bar=bs,a.bl=zn,a.box=ks,a.ceil=on,a.char=es,a.clamp=e,a.clr=_n,a.cn=jn,a.color=el,a.complete=un,a.cos=tn,a.cy=Kn,a.end=Jt,a.ex=Xn,a.floor=an,a.frameState=pn,a.getButton=Vt,a.gr=Bn,a.ht=qn,a.init=vn,a.input=gs,a.jm=Qn,a.keyboard=cs,a.lc=Vn,a.line=Os,a.ls=Zn,a.minifyReplaces=gl,a.onLoad=al,a.onUnload=Tn,a.particle=gn,a.play=il,a.playBgm=Qt,a.ply=Nn,a.pointer=fs,a.pow=nn,a.pr=Yn,a.pw=Jn,a.range=r,a.rd=Un,a.rect=Yt,a.remove=u,a.rewind=mn,a.rmv=Gn,a.rnd=cn,a.rndi=hn,a.rnds=dn,a.round=rn,a.sin=en,a.sl=ea,a.sqrt=sn,a.startRecording=ll,a.stopBgm=ei,a.stopRecording=ti,a.text=wi,a.times=c,a.tms=Fn,a.tr=$n,a.uc=ta,a.updateButton=jt,a.vec=tl,a.wh=Hn,a.wrap=l,a.yl=Wn})(window||{});const w=40,L=25;class _l{constructor(e={}){const{initialLives:l=3,isDemoPlay:s=!1,audioService:r,gameName:c,enableHighScoreStorage:u=!1,isBrowserEnvironment:f=!1}=e;this.initialLives=l,this.isDemoPlay=s,this.audioService=r,this.score=0,this.lives=l,this.gameOverState=!1,this.virtualScreen=this.initializeVirtualScreen(),this.gameTickCounter=0,this.gameName=c,this.enableHighScoreStorage=u,this.isBrowserEnvironment=f,this.internalHighScore=0}initializeVirtualScreen(){const e=[];for(let l=0;l<L;l++){const s=[];for(let r=0;r<w;r++)s.push({char:" ",attributes:{}});e.push(s)}return e}clearVirtualScreen(){for(let e=0;e<L;e++)for(let l=0;l<w;l++)this.virtualScreen[e][l]={char:" ",attributes:{}}}drawText(e,l,s,r){const c=Math.floor(l),u=Math.floor(s);if(!(u<0||u>=L))for(let f=0;f<e.length;f++){const y=c+f;y<0||y>=w||(this.virtualScreen[u][y]={char:e[f],attributes:{...r}})}}drawCenteredText(e,l,s){const r=Math.floor(w/2-e.length/2);this.drawText(e,r,l,s)}renderStandardUI(){this.drawText(`Score: ${this.score}`,1,0,{color:"white"}),this.drawText(`Lives: ${this.lives}`,31,0,{color:"white"}),this.drawText("R: Restart",1,L-1,{color:"light_black"})}renderGameOverScreen(){const e="Game Over!",l="red",s=Math.floor(L/2)-2;this.drawCenteredText(e,s,{color:l});const r=s+1;this.drawCenteredText(`Score: ${this.score}`,r,{color:"white"});const c=this.getHighScore();if(c!==null){const f=r+1;this.drawCenteredText(`High: ${c}`,f,{color:"light_cyan"})}const u=c!==null?Math.floor(L/2)+2:Math.floor(L/2)+1;this.drawCenteredText("Press R to restart",u,{color:"white"})}getCellInfo(e,l){return e<0||e>=w||l<0||l>=L?null:this.virtualScreen[l][e]}addScore(e){this.score+=e,this.score>this.internalHighScore&&(this.internalHighScore=this.score)}loseLife(){this.lives--,this.lives<=0&&(this.lives=0,this.triggerGameOver())}getScore(){return this.score}getLives(){return this.lives}gainLife(e=1){e<=0||(this.lives+=e,console.log(`BaseGame: Gained ${e} life/lives. Current lives: ${this.lives}`))}isGameOver(){return this.gameOverState}getVirtualScreenData(){return this.virtualScreen}resetGame(){this.score=0,this.lives=this.initialLives,this.gameOverState=!1,this.clearVirtualScreen(),this.gameTickCounter=0}setIsDemoPlay(e){this.isDemoPlay=e}play(e,l){!this.isDemoPlay&&this.audioService&&this.audioService.playSoundEffect(e,l)}playMml(e){!this.isDemoPlay&&this.audioService&&this.audioService.playMml(e)}playBgm(){!this.isDemoPlay&&this.audioService&&this.audioService.startPlayingBgm()}stopBgm(){!this.isDemoPlay&&this.audioService&&this.audioService.stopPlayingBgm()}triggerGameOver(){this.gameOverState=!0}getHighScore(){return this.internalHighScore}setHighScore(e){this.internalHighScore=Math.max(this.internalHighScore,e)}update(e){this.gameTickCounter++,this.isGameOver()||(this.clearVirtualScreen(),this.updateGame(e)),this.isGameOver()&&(this.clearVirtualScreen(),this.renderGameOverScreen()),this.renderStandardUI()}}let fi=0;function ri(){return`event_${fi++}`}class ia{constructor(e){this.activeEvents=[],this.registeredEventTypes=[],this.eventCooldowns=new Map,this.effectZones=new Map,this.lastEventCheckTick=0,this.eventCheckInterval=5,this.game=e,fi=0}getMaxConcurrentEvents(){const s=Math.floor(this.game.gameTickCounter/3600)+1;return Math.min(s,5)}registerEventType(e,l,s,r,c){const u={eventType:e,factory:l,probability:s,cooldownTicks:r,factoryArgs:c};if(this.registeredEventTypes.some(f=>f.eventType===u.eventType)){console.warn(`Event type "${u.eventType}" is already registered. Skipping.`);return}this.registeredEventTypes.push(u),console.log(`EventManager: Registered event type "${u.eventType}"`),this.eventCooldowns.set(u.eventType,0)}update(e){const l=[];for(const s of this.activeEvents)if(s.isActive)if(s.update(this.game,e),s.elapsedTicks++,s.isFinished()){console.log(`EventManager: Event "${s.type}" (ID: ${s.id}) finished.`),s.end(this.game),s.isActive=!1;const r=this.registeredEventTypes.find(c=>c.eventType===s.type);r&&this.eventCooldowns.set(r.eventType,this.game.gameTickCounter+r.cooldownTicks)}else l.push(s);this.activeEvents=l,this.game.gameTickCounter-this.lastEventCheckTick>this.eventCheckInterval&&(this.tryToTriggerEvent(),this.lastEventCheckTick=this.game.gameTickCounter)}getRegisteredEventType(e){return this.registeredEventTypes.find(l=>l.eventType===e)}tryToTriggerEvent(){const e=this.getMaxConcurrentEvents(),l=this.activeEvents.filter(r=>r.isActive).length;if(l>=e)return;const s=this.registeredEventTypes.filter(r=>{if(this.activeEvents.some(f=>f.isActive&&f.type===r.eventType))return!1;const u=this.eventCooldowns.get(r.eventType)||0;return this.game.gameTickCounter>=u});if(s.length!==0){for(const r of s)if(Math.random()<r.probability){console.log(`EventManager: Triggering new event "${r.eventType}" (${l+1}/${e} concurrent events)`);const c=r.factory(...r.factoryArgs||[]);c.id=ri(),c.type=r.eventType,c.start(this.game),c.isActive&&this.activeEvents.push(c);break}}}drawActiveEvents(){for(const e of this.activeEvents)e.isActive&&e.draw&&e.draw(this.game)}getActiveEventMessage(){for(let e=this.activeEvents.length-1;e>=0;e--){const l=this.activeEvents[e];if(l.isActive&&l.getDisplayMessage){const s=l.getDisplayMessage();if(s)return s}}return null}reset(){console.log("EventManager: Resetting active events and cooldowns.");for(const e of this.activeEvents)e.isActive&&e.end(this.game);this.activeEvents=[],this.eventCooldowns.clear(),this.effectZones.clear();for(const e of this.registeredEventTypes)this.eventCooldowns.set(e.eventType,0);this.lastEventCheckTick=0,fi=0}forceStartEvent(e){const l=this.getRegisteredEventType(e);if(!l){console.warn(`EventManager: Event type "${e}" is not registered.`);return}if(this.activeEvents.some(c=>c.isActive&&c.type===e)){console.warn(`EventManager: Event type "${e}" is already active.`);return}console.log(`EventManager: Force-triggering event "${l.eventType}"`);const r=l.factory(...l.factoryArgs||[]);r.id=ri(),r.type=l.eventType,r.start(this.game),r.isActive&&this.activeEvents.push(r)}manuallyTriggerEvent(e){e.id=ri(),e.type=e.type||"MANUAL_EVENT",e.start(this.game)}forceEndEvent(e){const l=e?this.activeEvents.filter(s=>s.type===e&&s.isActive):[...this.activeEvents.filter(s=>s.isActive)];for(const s of l)console.log(`EventManager: Forcefully ending event "${s.type}" (ID: ${s.id}).`),s.end(this.game),s.isActive=!1}getActiveEventByType(e){return this.activeEvents.find(l=>l.type===e&&l.isActive)}registerEffectZones(e,l,s){this.effectZones.set(e,{zones:s,type:l})}unregisterEffectZones(e){this.effectZones.delete(e)}getEffectAt(e,l){const s=Math.floor(e),r=Math.floor(l);for(const[,{zones:c,type:u}]of this.effectZones)for(const f of c)if(s>=f.x&&s<f.x+f.width&&r>=f.y&&r<f.y+f.height)return u;return null}getActiveEvents(){return this.activeEvents}}class la{constructor(e={}){this.id="",this.type="TRAFFIC_JAM",this.isActive=!1,this.elapsedTicks=0,this.originalSlowCarProbability=0,this.durationTicks=e.duration??600}start(e){this.isActive=!0,this.elapsedTicks=0;const l=e.getCarManager();this.originalSlowCarProbability=l.slowCarProbability,l.slowCarProbability=.75,e.playEventSound("TRAFFIC_JAM"),console.log(`Event Started: ${this.type}. Duration: ${this.durationTicks} ticks.`)}update(e){}end(e){this.isActive=!1,e.getCarManager().slowCarProbability=this.originalSlowCarProbability,console.log(`Event Ended: ${this.type}.`)}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`TRAFFIC JAM! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(e){}}const pl="B";class sa{constructor(e={}){this.type="BROKEN_DOWN_CAR",this.isActive=!1,this.elapsedTicks=0,this.targetCar=null,this.originalChar="",this.id=`event-${this.type}-${Date.now()}`,this.durationTicks=e.duration??900}start(e){this.isActive=!0,this.elapsedTicks=0;const s=e.getCars().filter(r=>!r.isSignaling&&r.x>10&&r.x<w-10);s.length>0?(this.targetCar=s[Math.floor(Math.random()*s.length)],this.targetCar.isStaticObstacle=!0,this.targetCar.speed=0,this.originalChar=this.targetCar.char,this.targetCar.char=pl,e.play("explosion")):this.end(e)}update(e,l){this.isActive&&(this.elapsedTicks++,this.targetCar&&(this.targetCar.char=e.gameTickCounter%15<15/2?pl:" ",this.targetCar.colorOverride="purple"),this.isFinished()&&this.end(e))}end(e){this.targetCar&&(this.targetCar.isStaticObstacle=!1,this.targetCar.speed=this.targetCar.originalSpeed,this.targetCar.char=this.originalChar,this.targetCar.colorOverride=null,this.targetCar=null),this.isActive=!1}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`BROKEN DOWN CAR! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(e){}}const ml="A",na="yellow";class yl{constructor(e={}){this.type="ROAD_CONSTRUCTION",this.isActive=!1,this.elapsedTicks=0,this.affectedLaneY=-1,this.id=`event-${this.type}-${Date.now()}`,this.durationTicks=e.duration??1800,this.options=e}start(e){this.isActive=!0,this.elapsedTicks=0;const l=e.getLaneDefinitions();if(l.length===0){this.end(e);return}if(this.options.laneY!==void 0)this.affectedLaneY=this.options.laneY;else{const c=e.getPlayerY(),u=12;let f;c<=u?f=l.filter(y=>y.y>u):f=l.filter(y=>y.y<u),f.length===0&&(f=l),this.affectedLaneY=f[Math.floor(Math.random()*f.length)].y}const s=this.options.length??10,r=this.options.startX??Math.floor(w/2)-Math.floor(s/2);for(let c=0;c<s;c++){const u=r+c;u>=0&&u<w&&e.spawnStaticObstacle(u,this.affectedLaneY,ml,na)}e.play("synth")}update(e,l){this.isActive&&(this.elapsedTicks++,this.isFinished()&&this.end(e))}end(e){this.affectedLaneY!==-1&&e.removeStaticObstaclesByChar(ml),this.isActive=!1}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`LANE CLOSED! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(e){}}const aa="E",ra="light_red",oa=.5;class ca{constructor(e={}){this.type="EMERGENCY_VEHICLE",this.isActive=!1,this.durationTicks=1/0,this.elapsedTicks=0,this.vehicle=null,this.id=`event-${this.type}-${Date.now()}`}getVehicle(){return this.vehicle}start(e){this.isActive=!0,this.elapsedTicks=0;const l=e.getLaneDefinitions();if(l.length===0){this.end(e);return}console.log(`[DEBUG] EmergencyVehicleEvent: Starting event. Available lanes: ${l.length}`),l.forEach(c=>console.log(`[DEBUG]   - Lane Y: ${c.y}, Direction: ${c.direction}`));const s=l[Math.floor(Math.random()*l.length)],r=e.getMaxCarSpeed()*oa;console.log(`[DEBUG] EmergencyVehicleEvent: Chosen lane Y: ${s.y}`),this.vehicle=e.spawnCarInLane(s.y,s.direction,{char:aa,colorOverride:ra,speed:r,isEmergency:!0}),this.vehicle?e.playEventSound("EMERGENCY_VEHICLE"):this.end(e)}update(e,l){if(!this.isActive||!this.vehicle)return;this.elapsedTicks++,e.getCars().find(r=>r.id===this.vehicle.id)||this.end(e)}end(e){this.vehicle=null,this.isActive=!1}isFinished(){return!this.isActive}getDisplayMessage(){return this.isActive?"! EMERGENCY VEHICLE !":null}draw(e){this.isActive}}const Sl="X",ha="red";class da{constructor(e={}){this.type="CAR_COLLISION",this.isActive=!1,this.elapsedTicks=0,this.collidedCars=[],this.id=`event-${this.type}-${Date.now()}`,this.durationTicks=e.duration??1e3}findCollisionCandidates(e){const s=[...e.getCars().filter(r=>!r.isStaticObstacle&&!r.isEmergency&&r.x>=0&&r.x<w)].sort(()=>.5-Math.random());for(const r of s)for(const c of s)if(r.id!==c.id&&r.y===c.y&&Math.sign(r.speed)===Math.sign(c.speed)){const u=Math.sign(r.speed)>0?c.x<r.x:c.x>r.x,f=Math.abs(c.speed)>Math.abs(r.speed);if(u&&f&&Math.abs(r.x-c.x)<5)return[r,c]}return null}start(e){const l=this.findCollisionCandidates(e);if(l){this.isActive=!0,this.elapsedTicks=0,this.collidedCars=l;for(const s of this.collidedCars)s.isStaticObstacle=!0,s.speed=0,s.char=Sl,s.colorOverride=ha;e.play("explosion")}else this.isActive=!1}update(e,l){if(!this.isActive)return;this.elapsedTicks++;const s=20,r=this.elapsedTicks%s<s/2;for(const c of this.collidedCars)c.char=r?Sl:" ";this.isFinished()&&this.end(e)}end(e){if(this.collidedCars.length>0){const l=this.collidedCars.map(s=>s.id);e.removeCarsByIds(l)}this.isActive=!1,this.collidedCars=[]}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`! ACCIDENT ! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(e){}}class ua{constructor(){this.id="",this.type="WRONG_WAY_DRIVER",this.isActive=!1,this.durationTicks=1/0,this.elapsedTicks=0,this.wrongWayCar=null}start(e){const s=e.getCarManager().spawnWrongWayCar();s?(this.wrongWayCar=s,this.isActive=!0,e.play("synth"),console.log(`Event Started: ${this.type}. Car ID: ${this.wrongWayCar.id}`)):(this.isActive=!1,this.durationTicks=0,console.warn(`Event Failed: ${this.type}. Could not spawn car.`))}update(e,l){if(!this.wrongWayCar)return;e.getCarManager().getCarById(this.wrongWayCar.id)||(this.wrongWayCar=null,this.isActive=!1)}end(){console.log(`Event Ended: ${this.type}.`)}isFinished(){return!this.isActive}getDisplayMessage(){return this.isActive?"!! WRONG WAY DRIVER !!":null}draw(e){this.isActive}}const fa="T",ga="yellow",Cl="O",pa="light_black",ma=.05,ya=.8,Sa=150;class Ca{constructor(){this.type="CLUMSY_TRUCK",this.isActive=!1,this.durationTicks=1/0,this.elapsedTicks=0,this.truckId=null,this.truckHasDespawned=!1,this.postDespawnElapsedTicks=0,this.id=`event-${this.type}-${Date.now()}`}start(e){this.isActive=!0,this.elapsedTicks=0,this.truckHasDespawned=!1,this.postDespawnElapsedTicks=0;const l=e.getCarManager(),s=l.getLaneDefinitions();if(s.length===0){this.end(e);return}const r=s[Math.floor(Math.random()*s.length)],c=l.getMaxCarSpeed()*ya,u=e.spawnCarInLane(r.y,r.direction,{char:fa,colorOverride:ga,speed:c,isClumsy:!0});u?(this.truckId=u.id,e.play("hit")):this.end(e)}update(e,l){if(!this.isActive)return;if(this.elapsedTicks++,this.truckHasDespawned){this.postDespawnElapsedTicks++,this.postDespawnElapsedTicks>Sa&&this.end(e);return}if(this.truckId===null){this.end(e);return}const s=e.getCarManager().getCarById(this.truckId);if(s){if(Math.random()<ma){const r=Math.sign(s.speed),c=Math.floor(s.x-r*2),u=s.y;if(c>=0&&c<w){const f=e.getCellInfo(c,u);f&&f.char!==" "||e.getCarManager().spawnStaticObstacle(c,u,Cl,pa)}}}else this.truckHasDespawned=!0}end(e){this.isActive&&(e.getCarManager().removeStaticObstaclesByChar(Cl),this.truckId=null,this.isActive=!1)}isFinished(){return!this.isActive}getDisplayMessage(){return this.isActive?"! CLUMSY TRUCK !":null}draw(e){this.isActive}}const va=.4,vl="T",Ta="#",wa=15,yt=30,Tl=1.5,Ea=1.5,Ma=1,Nl="^",Fl="v",xa=10,oi=200,wl=50,El=1,Ml=23,ze=12;class ci{constructor(e){this.id=e.id,this.y=e.y,this.x=e.x,this.speed=e.speed,this.originalSpeed=e.originalSpeed,this.char=e.char,this.colorOverride=e.colorOverride??null,this.isSignaling=e.isSignaling??!1,this.signalTicks=e.signalTicks??0,this.targetLaneY=e.targetLaneY??null,this.laneChangeDecision=e.laneChangeDecision??null,this.ticksSinceLastLaneChange=e.ticksSinceLastLaneChange??999,this.nextActionTick=e.nextActionTick??0,this.lastTrailCleanupTick=e.lastTrailCleanupTick??0,this.targetSpeedOverride=e.targetSpeedOverride??null,this.isStaticObstacle=e.isStaticObstacle??!1,this.isEmergency=e.isEmergency??!1,this.isSlowedByEvent=e.isSlowedByEvent??!1,this.isWrongWay=e.isWrongWay??!1,this.isClumsy=e.isClumsy??!1,this.isEventCar=e.isEventCar??!1,this.isSlipping=e.isSlipping??!1,this.slipCooldown=e.slipCooldown??0,this.y_offset=e.y_offset??0}update(e,l,s,r,c){if(this.ticksSinceLastLaneChange++,this.slipCooldown>0?(this.slipCooldown--,this.x+=(Math.random()-.5)*.6,this.y_offset=(Math.random()-.5)*1.5,this.slipCooldown===0&&(this.isSlipping=!1,this.y_offset=0)):this.y_offset=0,r.getEventManager().getEffectAt(this.x,this.y)==="OIL_SLICK"&&!this.isSlipping&&!this.isStaticObstacle&&!this.isSignaling&&Math.random()<.15&&(this.isSlipping=!0,this.slipCooldown=20,this.x+=(Math.random()-.5)*2),this.isEventCar){this.x+=this.speed;return}if(this.isWrongWay){this.x+=this.speed;return}if(this.isSignaling){if(this.signalTicks++,this.signalTicks>wa&&(this.targetLaneY!==null&&(this.y=this.targetLaneY),this.isSignaling=!1,this.signalTicks=0,this.targetLaneY=null,this.laneChangeDecision=null,this.ticksSinceLastLaneChange=0),this.isStaticObstacle)return;this.x+=this.speed;return}if(this.isEmergency){this.x+=this.speed;return}if(this.isStaticObstacle)return;if(e.getAnimalInFront(this,c))this.speed=this.originalSpeed*.2,this.ticksSinceLastLaneChange>e.laneChangeCooldownTicks&&!this.isSignaling&&e.attemptLaneChange(this);else{e.findOncomingWrongWayCar(this)&&this.ticksSinceLastLaneChange>yt&&!this.isSignaling&&e.attemptLaneChange(this);const x=e.getCarInFront(this);let E=!1,v=this.originalSpeed;if(x){const P=Math.abs(x.x-this.x),V=Math.abs(this.speed),W=Math.abs(x.speed);V>W&&P<V*e.laneChangeInitiateDistanceFactor*10&&(E=!0),P<e.getMinCarFollowingDistance()&&(v=x.speed)}E&&this.ticksSinceLastLaneChange>e.laneChangeCooldownTicks&&e.attemptLaneChange(this),this.speed=v}if(s){const y=s.getPoliceCarPosition();if(Math.sqrt(Math.pow(this.x-y.x,2)+Math.pow(this.y-y.y,2))<s.getInfluenceRadius()){let E=this.originalSpeed*s.getLegalSpeedMultiplier();const v=.1;Math.abs(E)<v&&(E=v*Math.sign(this.originalSpeed)),Math.abs(this.speed)>Math.abs(E)&&(this.speed=E)}}if(l&&this.id!==l.id){const y=this.y<ze,x=l.y<ze;if(y===x){const P=Math.abs(l.speed)*.7;this.speed=P*Math.sign(this.speed),this.y===l.y&&this.ticksSinceLastLaneChange>yt&&e.attemptLaneChange(this)}}this.x+=this.speed}draw(e){let l=this.char;this.isSignaling&&!this.isStaticObstacle&&this.signalTicks%8<8/2&&(l=this.laneChangeDecision==="up"?Nl:Fl),e.drawText(l,this.x,this.y+this.y_offset,{color:this.colorOverride?this.colorOverride:"white"})}}class Aa{constructor(e,l){this.carSpawnTickCounter=0,this.spawnIntervalMultiplier=1,this.carSpeedMultiplier=1,this.followingDistanceMultiplier=1,this.laneChangeCooldownTicks=yt,this.laneChangeInitiateDistanceFactor=Tl,this.game=e,this.cars=[],this.nextCarId=0,this.lanes=[],this.difficulty=1,this.maxCarSpeed=l.maxCarSpeed??.5,this.minCarSpeed=l.minCarSpeed??.2,this.minCarFollowingDistance=l.minCarFollowingDistance??2,this.carChar=l.carChar??Ta,this.slowCarProbability=l.slowCarProbability??0,this.initializeLanes()}initialize(){this.cars=[],this.nextCarId=0,this.carSpawnTickCounter=0,this.difficulty=1,this.initializeLanes(),this.spawnIntervalMultiplier=1,this.carSpeedMultiplier=1,this.followingDistanceMultiplier=1,this.laneChangeCooldownTicks=yt,this.laneChangeInitiateDistanceFactor=Tl}incrementSpawnTick(){this.carSpawnTickCounter++,this.difficulty+=1/(5*3600)}initializeLanes(){this.cars=[],this.lanes=[];for(let e=ze+1;e<Ml;e++){const l=this.carSpawnTickCounter+Math.random()*oi;this.lanes.push({y:e,direction:1,nextSpawnTick:l})}for(let e=El+1;e<ze;e++){const l=this.carSpawnTickCounter+Math.random()*oi;this.lanes.push({y:e,direction:-1,nextSpawnTick:l})}}getCars(){return this.cars}getCarById(e){return this.cars.find(l=>l.id===e)}update(e){this.updateCarsAndHandleSpawning(e)}draw(){const e=this.game.getEventManager().getActiveEventByType("POWER_OUTAGE"),l=e==null?void 0:e.getDarkZone();for(const s of this.cars)if(s.isStaticObstacle)this.game.drawText(s.char,s.x,s.y,{color:s.colorOverride});else{const r=s.y+s.y_offset,c=l&&s.y>=l.y&&s.y<l.y+l.height;if(c||this.game.drawText(s.char,s.x,r,{color:this.getCarColor(s)}),c&&!s.isWrongWay){const u=this.lanes.find(f=>f.y===s.y);if(u){const f=u.direction,y=this.game.getGameTickCounter()%10<5?":":".";this.game.drawText(y,s.x+f,r,{color:"yellow"})}}if(s.isSignaling){const u=s.laneChangeDecision==="up"?Nl:Fl;this.game.drawText(u,s.x,s.y,{color:"yellow"})}}}getCarColor(e){return e.colorOverride?e.colorOverride:e.isWrongWay?"red":e.isEmergency?"light_red":e.isClumsy?"yellow":e.char===vl?"cyan":"white"}updateCarsAndHandleSpawning(e){const l=this.game.getEventManager().getActiveEventByType("EMERGENCY_VEHICLE"),s=l==null?void 0:l.getVehicle();this.cars=this.cars.filter(r=>(r.update(this,s||void 0,this.game.getEventManager().getActiveEventByType("POLICE_PRESENCE"),this.game,e),!((r.speed>0&&r.x>=w||r.speed<0&&r.x<0)&&!r.isEventCar)));for(const r of this.lanes)if(this.carSpawnTickCounter>=r.nextSpawnTick){const c=Math.random()<this.slowCarProbability;this.spawnCar(r.y,r.direction,c);const u=(oi+(Math.random()*wl-wl/2))/this.spawnIntervalMultiplier/Math.sqrt(this.difficulty);r.nextSpawnTick=this.carSpawnTickCounter+u}}getCarInFront(e){if(e.isWrongWay)return;let l,s=1/0;return this.cars.forEach(r=>{if(e.id===r.id||e.y!==r.y)return;const c=(r.x-e.x)*Math.sign(e.speed);c>0&&c<s&&(s=c,l=r)}),l}isLaneSafe(e,l,s){if(e<=El||e>=Ml||e===ze)return!1;for(const r of this.cars)if(r.y===e){const c=r.x-l.x,u=Math.abs(l.speed)*Ea*10,f=Math.abs(r.speed)*Ma*10;if(s>0&&c>0&&c<u||s<0&&c<0&&-c<u||s>0&&c<0&&-c<f||s<0&&c>0&&c<f)return!1}return!0}attemptLaneChange(e){const l=Math.sign(e.speed),s=Math.random()>.5?["up","down"]:["down","up"];for(const r of s){const c=e.y+(r==="up"?-1:1);if(this.isLaneSafe(c,e,l)){e.isSignaling=!0,e.signalTicks=0,e.targetLaneY=c,e.laneChangeDecision=r;return}}}getLaneDefinitions(){return this.lanes.map(e=>({y:e.y,direction:e.direction}))}getMinCarFollowingDistance(){return this.minCarFollowingDistance*this.followingDistanceMultiplier}spawnCar(e,l,s,r=!1){const c=l>0?-1:w,u=this.maxCarSpeed*this.difficulty,f=this.minCarSpeed+Math.random()*(u-this.minCarSpeed);let y=l*f*this.carSpeedMultiplier,x=this.carChar;s&&(y*=va,x=vl);const E=new ci({id:this.nextCarId++,y:e,x:c,speed:y,originalSpeed:y,char:x});this.cars.push(E),s&&r&&this.spawnCar(e,l,!1,!1)}isCarNearEdge(e,l){const s=l>0?0:w-1,r=5;for(const c of this.cars)if(c.y===e&&(l>0&&c.x<r||l<0&&c.x>s-r))return!0;return!1}spawnStaticObstacle(e,l,s,r){this.cars.push(new ci({id:this.nextCarId++,y:l,x:e,speed:0,originalSpeed:0,char:s,colorOverride:r,ticksSinceLastLaneChange:9999,isStaticObstacle:!0}))}removeStaticObstaclesByChar(e){this.cars=this.cars.filter(l=>!(l.isStaticObstacle&&l.char===e))}removeCarsByIds(e){this.cars=this.cars.filter(l=>!e.includes(l.id))}getMaxCarSpeed(){return this.maxCarSpeed}spawnCarInLane(e,l,s={}){const c=(s.speed??this.minCarSpeed+Math.random()*(this.maxCarSpeed-this.minCarSpeed))*l,u=s.char??this.carChar,f=new ci({id:this.nextCarId++,y:e,x:l>0?-1:w,speed:c,originalSpeed:c,char:u,...s});return this.cars.push(f),f}spawnWrongWayCar(){const l=this.getLaneDefinitions().filter(c=>!this.isCarNearEdge(c.y,c.direction)&&!this.cars.some(u=>u.y===c.y&&u.isWrongWay));if(l.length===0)return null;const s=l[Math.floor(Math.random()*l.length)],r=this.maxCarSpeed*1.5*this.carSpeedMultiplier*-s.direction;return this.spawnCarInLane(s.y,-s.direction,{speed:r,originalSpeed:r,colorOverride:"light_red",isWrongWay:!0,char:"W"})}findOncomingWrongWayCar(e){const l=this.cars.filter(s=>s.isWrongWay);for(const s of l){if(s.y!==e.y||Math.abs(e.x-s.x)>xa)continue;const c=e.speed>0;if(c&&s.x>e.x||!c&&s.x<e.x)return s}}getLaneYCoords(){return this.lanes.map(e=>e.y)}getAnimalInFront(e,l){const s=Math.sign(e.speed);if(s===0)return;let r,c=1/0;for(const u of l){if(u.y!==e.y)continue;const f=(u.x-e.x)*s;f>0&&f<c&&(c=f,r=u)}if(c<Math.abs(e.speed*20))return r}}class xl{constructor(e={}){this.id="",this.type="WEATHER",this.isActive=!1,this.elapsedTicks=0,this.raindrops=[],this.fogDensity=.3,this.durationTicks=e.duration??1200,this.weatherType=e.type??(Math.random()<.5?"RAIN":"FOG")}start(e){if(this.isActive=!0,this.elapsedTicks=0,this.weatherType==="RAIN"){const l=e.getCarManager();this.originalMinCarSpeed=l.minCarSpeed,this.originalMaxCarSpeed=l.maxCarSpeed,l.minCarSpeed*=.8,l.maxCarSpeed*=.85,this.initializeRain(e),e.playEventSound("WEATHER_RAIN"),Math.random()<.3&&setTimeout(()=>{e.playEventSound("WEATHER_STORM")},1e3+Math.random()*3e3)}else e.play("synth",12345);console.log(`Event Started: ${this.weatherType}. Duration: ${this.durationTicks} ticks.`)}update(e,l){this.weatherType==="RAIN"&&(this.updateRain(e),this.elapsedTicks%1200===0&&Math.random()<.1&&e.playEventSound("WEATHER_STORM",this.elapsedTicks))}end(e){if(this.isActive=!1,this.weatherType==="RAIN"&&this.originalMinCarSpeed&&this.originalMaxCarSpeed){const l=e.getCarManager();l.minCarSpeed=this.originalMinCarSpeed,l.maxCarSpeed=this.originalMaxCarSpeed}console.log(`Event Ended: ${this.weatherType}.`)}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){if(!this.isActive)return null;const e=((this.durationTicks-this.elapsedTicks)/60).toFixed(1);return`${this.weatherType.toUpperCase()}! ${e}s`}draw(e){if(this.isActive)switch(this.weatherType){case"RAIN":this.drawRain(e);break;case"FOG":this.drawFog(e);break}}initializeRain(e){for(let l=0;l<50;l++)this.raindrops.push({x:Math.floor(Math.random()*w),y:Math.floor(Math.random()*L),char:Math.random()<.5?"`":"."})}updateRain(e){this.raindrops.forEach(l=>{l.y+=1,l.y>L&&(l.y=0,l.x=Math.floor(Math.random()*w))})}drawRain(e){this.raindrops.forEach(l=>{const s=e.getCellInfo(l.x,l.y);(!s||s.char===" "||s.char==="=")&&e.drawText(l.char,l.x,l.y,{color:"cyan"})})}drawFog(e){const l=e.getCarManager().getLaneYCoords();for(const s of l)for(let r=0;r<w;r++){const c=e.getCellInfo(r,s);c&&c.char===" "&&Math.random()<this.fogDensity&&e.drawText("~",r,s,{color:"light_black"})}}}const Ia=1500,Al=12,ka=.5,Il=1e3;class ba{constructor(e){this.game=e,this.type="POLICE_PRESENCE",this.isActive=!1,this.durationTicks=Ia,this.elapsedTicks=0,this.isSpeedTrapActive=!1,this.speedTrapTicks=0,this.id=`police-${Date.now()}`;const l=Math.floor(Math.random()*(w-10))+5;this.policeCarPosition={x:l,y:Gl}}start(){this.isActive=!0,this.isSpeedTrapActive=!0,this.speedTrapTicks=0}update(){this.isActive&&(this.elapsedTicks++,this.isSpeedTrapActive&&(this.speedTrapTicks++,this.speedTrapTicks>=Il&&(this.isSpeedTrapActive=!1,this.speedTrapTicks=0)))}end(){this.isActive=!1}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return this.isActive?this.isSpeedTrapActive?`SPEED TRAP ACTIVE! ${((Il-this.speedTrapTicks)/60).toFixed(1)}s`:`POLICE PRESENCE ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`:null}draw(e){if(this.isActive&&(e.drawText("P",this.policeCarPosition.x,this.policeCarPosition.y,{color:"blue"}),this.isSpeedTrapActive)){const l=Math.min(Al,8);for(let s=-l;s<=l;s+=2)for(let r=-2;r<=2;r+=1){const c=this.policeCarPosition.x+s,u=this.policeCarPosition.y+r;if(c>=0&&c<w&&u>=0&&u<L){const f=e.getCellInfo(c,u);(!f||f.char===" ")&&e.drawText(".",c,u,{color:"blue"})}}}}getPoliceCarPosition(){return this.policeCarPosition}getInfluenceRadius(){return Al}getLegalSpeedMultiplier(){return ka}}const Oa="V",Ra="E",Da=.3,Pa=3;class La{constructor(){this.id="vip_escort_event",this.type="VIP_ESCORT",this.isActive=!1,this.elapsedTicks=0,this.durationTicks=3e3,this.processionCars=[],this.leadCar=null,this.targetSpeed=0,this.formationLanes=[]}start(e){this.isActive=!0;const l=e.getCarManager(),s=l.getLaneDefinitions(),c=Math.random()<.5?s.filter(V=>V.direction===-1):s.filter(V=>V.direction===1);if(c.length<2){this.isActive=!1;return}const u=Math.floor(Math.random()*(c.length-1)),f=c[u],y=c[u+1];this.formationLanes=[f.y,y.y];const x=f.direction;this.targetSpeed=(l.minCarSpeed+l.maxCarSpeed)/2*Da*x;const E=x>0?-5:w+5,v=l.spawnCarInLane(f.y,x,{char:Oa,colorOverride:"purple",speed:this.targetSpeed,isEventCar:!0});if(v)v.x=E,this.leadCar=v,this.processionCars.push(v);else{this.isActive=!1;return}const P=[{x:E+x*-3,y:f.y},{x:E+x*Pa,y:f.y},{x:E,y:y.y},{x:E+x*-3,y:y.y}];for(const V of P){const W=l.spawnCarInLane(V.y,x,{char:Ra,colorOverride:"yellow",speed:this.targetSpeed,isEventCar:!0});W&&(W.x=V.x,this.processionCars.push(W))}this.processionCars.length>1&&e.play("synth")}update(e,l){if(this.isActive){if(this.elapsedTicks++,this.leadCar&&this.processionCars.length>1)for(const s of this.processionCars)s!==this.leadCar&&(s.speed=this.leadCar.speed);this.processionCars=this.processionCars.filter(s=>e.getCarManager().getCarById(s.id)!==void 0),this.leadCar&&!e.getCarManager().getCarById(this.leadCar.id)&&(this.leadCar=this.processionCars.length>0?this.processionCars[0]:null)}}isFinished(){return this.elapsedTicks>=this.durationTicks||this.processionCars.length===0||!this.leadCar?!0:this.leadCar.speed>0?this.leadCar.x>=w+5:this.leadCar.x<-5}end(e){this.isActive=!1}getDisplayMessage(){return this.isActive?"VIP ESCORT PASSING - KEEP CLEAR":null}draw(e){}}function ce(a,e){return a=Math.ceil(a),e=Math.floor(e),Math.floor(Math.random()*(e-a+1))+a}const _a=":",Na="light_blue",Fa="blue",Ga=5,$a=2,Ha=5,Ua=800;class Ba{constructor(e=Ua){this.type="OIL_SLICK",this.isActive=!1,this.elapsedTicks=0,this.patches=[],this.id=`event-${this.type}-${Date.now()}`,this.durationTicks=e}start(e){this.isActive=!0,this.elapsedTicks=0,this.patches=[],console.log(`[OilSlickEvent] Starting event ${this.id}`);const s=e.getCarManager().getLaneYCoords();if(s.length===0){this.end(e);return}const r=ce(1,Ga);for(let c=0;c<r;c++){const u=s[Math.floor(Math.random()*s.length)],f=ce($a,Ha),y=ce(1,2),x=ce(0,w-f);this.patches.push({x,y:u,width:f,height:y})}e.getEventManager().registerEffectZones(this.id,this.type,this.patches),e.play("hit")}update(e,l){this.isActive&&this.elapsedTicks++}end(e){this.isActive&&(e.getEventManager().unregisterEffectZones(this.id),this.isActive=!1)}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return this.isActive?`OIL SLICK ON ROAD! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`:null}draw(e){if(this.isActive)for(const l of this.patches)for(let s=l.y;s<l.y+l.height;s++)for(let r=l.x;r<l.x+l.width;r++)r<w&&s<L&&e.drawText(_a,r,s,{color:Fa,backgroundColor:Na})}}class Wa{constructor(e){this.id="",this.type="RUSH_HOUR",this.isActive=!1,this.elapsedTicks=0,this.originalSpawnIntervalMultiplier=1,this.originalCarSpeedMultiplier=1,this.originalLaneChangeCooldown=0,this.originalLaneChangeDistance=0,this.durationTicks=e.duration??300,this.spawnMultiplier=e.spawnMultiplier??2,this.speedMultiplier=e.speedMultiplier??1.15,this.laneChangeCooldownFactor=e.laneChangeCooldownFactor??.5,this.laneChangeDistanceFactor=e.laneChangeDistanceFactor??1.5}start(e){this.isActive=!0;const l=e.getCarManager();this.originalSpawnIntervalMultiplier=l.spawnIntervalMultiplier,this.originalCarSpeedMultiplier=l.carSpeedMultiplier,this.originalLaneChangeCooldown=l.laneChangeCooldownTicks,this.originalLaneChangeDistance=l.laneChangeInitiateDistanceFactor,l.spawnIntervalMultiplier=this.spawnMultiplier,l.carSpeedMultiplier=this.speedMultiplier,l.laneChangeCooldownTicks*=this.laneChangeCooldownFactor,l.laneChangeInitiateDistanceFactor*=this.laneChangeDistanceFactor,console.log(`Rush Hour event started. Duration: ${this.durationTicks} ticks.`)}update(e,l){}end(e){this.isActive=!1;const l=e.getCarManager();l.spawnIntervalMultiplier=this.originalSpawnIntervalMultiplier,l.carSpeedMultiplier=this.originalCarSpeedMultiplier,l.laneChangeCooldownTicks=this.originalLaneChangeCooldown,l.laneChangeInitiateDistanceFactor=this.originalLaneChangeDistance,console.log("Rush Hour event ended.")}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`RUSH HOUR! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(){}}const kl=1,bl=23,Ye=class Ye{constructor(){this.id="",this.type="ANIMAL_CROSSING",this.isActive=!1,this.durationTicks=1500,this.elapsedTicks=0,this.animals=[],this.nextAnimalSpawnTicks=0}getAnimals(){return this.animals}start(e){this.isActive=!0,this.elapsedTicks=0,this.animals=[],this.spawnAnimal(e),this.nextAnimalSpawnTicks=ce(120,240),e.playEventSound("ANIMAL_CROSSING"),console.log(`Event Started: ${this.type}`)}update(e,l){this.isActive&&(this.elapsedTicks++,this.nextAnimalSpawnTicks--,this.nextAnimalSpawnTicks<=0&&(this.spawnAnimal(e),this.nextAnimalSpawnTicks=ce(200,400)),this.updateAnimals(e))}updateAnimals(e){for(let l=this.animals.length-1;l>=0;l--){const s=this.animals[l];s.ticksUntilNextMove--,s.ticksUntilNextMove<=0&&(s.y+=s.direction,s.type==="DEER"&&Math.random()<.1&&(s.x+=Math.random()<.5?1:-1,s.x=Math.max(0,Math.min(w-1,s.x))),s.ticksUntilNextMove=s.speed),s.direction===1&&s.y>=bl?this.animals.splice(l,1):s.direction===-1&&s.y<=kl&&this.animals.splice(l,1)}}end(e){this.isActive=!1,this.animals=[],console.log(`Event Ended: ${this.type}`),this.animals.forEach(l=>{e.drawText(l.char,l.x,l.y,{color:l.color})})}isFinished(){return this.elapsedTicks>=this.durationTicks&&this.animals.length===0}getDisplayMessage(){return this.isActive?"ANIMAL CROSSING!":null}draw(e){this.isActive&&this.animals.forEach(l=>{e.drawText(l.char,l.x,l.y,{color:l.color})})}spawnAnimal(e){if(e.getCarManager().getLaneYCoords().length===0)return;const s=Math.random()<.4?"DEER":"TURTLE",r=Math.random()<.5?1:-1,c=ce(1,w-2),u=r===1?kl+1:bl-1;let f;s==="DEER"?f={id:Ye.nextId++,type:"DEER",x:c,y:u,char:"D",color:"light_yellow",speed:ce(10,15),ticksUntilNextMove:0,direction:r,isSpooked:!1}:f={id:Ye.nextId++,type:"TURTLE",x:c,y:u,char:"t",color:"light_green",speed:ce(30,45),ticksUntilNextMove:0,direction:r,isSpooked:!1},this.animals.push(f)}};Ye.nextId=0;let gi=Ye;class za{constructor(e){this.type="POWER_OUTAGE",this.isActive=!1,this.elapsedTicks=0,this.darkZoneY=0,this.darkZoneHeight=0,this.hasInitializedLanes=!1,this.id=`power-outage-${Date.now()}`,this.durationTicks=e.duration??600}selectRandomLanes(e){const l=e.getCarManager().getLaneYCoords();if(l.length<3){this.darkZoneY=l[0]??5,this.darkZoneHeight=l.length;return}this.darkZoneHeight=Math.floor(Math.random()*3)+3;const s=Math.floor(Math.random()*(l.length-this.darkZoneHeight));this.darkZoneY=l[s]}start(e){this.hasInitializedLanes||(this.selectRandomLanes(e),this.hasInitializedLanes=!0),this.isActive=!0,e.play("explosion")}update(e,l){this.elapsedTicks++}end(e){this.isActive=!1}isFinished(){return this.elapsedTicks>=this.durationTicks}getDisplayMessage(){return`POWER OUTAGE! ${((this.durationTicks-this.elapsedTicks)/60).toFixed(1)}s`}draw(e){if(!this.isActive)return;const l=e.getCarManager().getLaneYCoords();for(let s=this.darkZoneY;s<this.darkZoneY+this.darkZoneHeight;s++)if(l.includes(s))for(let r=0;r<w;r++){const c=e.getCellInfo(r,s);(c==null?void 0:c.char)===" "&&e.drawText(" ",r,s,{backgroundColor:"black"})}if(this.elapsedTicks%25<5)for(let s=this.darkZoneY;s<this.darkZoneY+this.darkZoneHeight;s++)l.includes(s)&&(e.drawText("-",0,s,{color:"light_black"}),e.drawText("-",w-1,s,{color:"light_black"}))}getDarkZone(){return{y:this.darkZoneY,height:this.darkZoneHeight}}}const Ol=Math.floor(w/2),Rl=L-2,Ya=L-2,hi=1,Gl=12,Dl=5,di=[1e4,2e4,3e4,5e4,8e4],K={EMERGENCY_SIREN:"@synth@s12345 v60 l8 o5 c>c<c>c<c>c<",POLICE_SIREN:"@synth@s54321 v50 l4 o5 c>c<r4c>c<r4c>c<r4",TRAFFIC_JAM_HORNS:["@synth@s11111 v45 l4 o4 c2","@synth@s22222 v40 l4 o3 f2","@synth@s33333 v40 l4 o4 g2"],CONSTRUCTION_NOISE:"@hit@d@s99999 v45 l16 o4 cr cr cr cr",RAIN_SOUND:"@synth@s77777 v36 l32 o6 crcrcrcrcrcrcr",THUNDER:"@explosion@s88888 v70 l1 o3 c",EXTRA_LIFE_JINGLE:["@synth@s100 v90 l8 o6 ceg>c<egc","@synth@s200 v80 l4 o5 cg"],DANGER_WARNING:["@laser@s1000 v80 l16 o6 c r c r c r c r","@synth@s1100 v40 l8 o4 c+ r c+ r c+ r c+ r"],TIME_WARNING:"@synth@s800 v50 l4 o5 c r c r c r >c<",OIL_SLIP:"@laser@s666 v40 l16 o4 c>c<c>c<c>c<",ANIMAL_SOUNDS:["@synth@s111 v40 l8 o4 ege","@synth@s222 v35 l4 o3 c2","@synth@s333 v45 l16 o5 crcrcr"]};class Ka{constructor(){this.zones=[],this.lastGenerationTick=0,this.generationInterval=600}generateZones(){this.zones=[];const e=[];for(let s=0;s<w;s++)e.push(s);const l=[{multiplier:2,width:6,probability:.5,char:"2",color:"green"},{multiplier:3,width:4,probability:1/3,char:"3",color:"yellow"},{multiplier:5,width:2,probability:.2,char:"5",color:"red"}];for(const s of l)if(Math.random()<s.probability){const r=e.filter(c=>c+s.width<=w&&this.canPlaceZone(c,s.width));if(r.length>0){const c=Math.floor(Math.random()*r.length),u=r[c];this.zones.push({x:u,width:s.width,multiplier:s.multiplier,char:s.char,color:s.color});for(let f=u;f<u+s.width;f++){const y=e.indexOf(f);y>-1&&e.splice(y,1)}}}}canPlaceZone(e,l){for(const s of this.zones)if(!(e>=s.x+s.width||e+l<=s.x))return!1;return!0}shouldGenerateNewZones(e){return e-this.lastGenerationTick>=this.generationInterval}markGenerated(e){this.lastGenerationTick=e}getZones(){return this.zones}getMultiplierAt(e){for(const l of this.zones)if(e>=l.x&&e<l.x+l.width)return l.multiplier;return 1}reset(){this.zones=[],this.lastGenerationTick=0}}class Va extends _l{constructor(e={}){super({...e,gameName:"Hopway",enableHighScoreStorage:!0}),this.isPlayingDeathAnimation=!1,this.deathAnimationStartTick=0,this.deathAnimationDurationTicks=120,this.deathAnimationFrame=0,this.isShowingScoreDisplay=!1,this.scoreDisplayStartTick=0,this.scoreDisplayDurationTicks=60,this.scoreDisplayText="",this.scoreDisplayX=0,this.scoreDisplayY=0,this.gameTickCounter=0,this.timeScore=1e3,this.lastTimeScoreDecreaseTick=0,this.timeScoreDecreaseInterval=1,this.timeScoreDecreaseAmount=1,this.extraLifeThresholdIndex=0,this.options=e,this.playerMoveInterval=e.playerMoveInterval??5,this.safeZoneChar=e.safeZoneChar??"=",this.playerX=0,this.playerY=0,this.lastPlayerMoveTick=0,this.playerSlipState={isSlipping:!1,dx:0,dy:0,ticks:0},this.playerCanMove=!1,this.previousInputState={up:!1,down:!1,left:!1,right:!1,action1:!1,r:!1},this.isPlayingDeathAnimation=!1,this.deathAnimationStartTick=0,this.deathAnimationFrame=0,this.eventManager=new ia(this),this.carManager=new Aa(this,e),this.scoreZoneManager=new Ka,this.eventManager.registerEventType("TRAFFIC_JAM",()=>new la({duration:300}),.002,1800),this.eventManager.registerEventType("BROKEN_DOWN_CAR",()=>new sa({duration:900}),.001,2400),this.eventManager.registerEventType("ROAD_CONSTRUCTION",()=>new yl({duration:1200}),.001,3e3),this.eventManager.registerEventType("EMERGENCY_VEHICLE",()=>new ca,.003,3e3),this.eventManager.registerEventType("CAR_COLLISION",()=>new da({duration:600}),.002,1200),this.eventManager.registerEventType("WRONG_WAY_DRIVER",()=>new ua,.003,2500),this.eventManager.registerEventType("CLUMSY_TRUCK",()=>new Ca,.002,2e3),this.eventManager.registerEventType("WEATHER",()=>new xl({duration:600}),.0025,3e3),this.eventManager.registerEventType("POLICE_PRESENCE",()=>new ba(this),.0015,4e3),this.eventManager.registerEventType("VIP_ESCORT",()=>new La,.001,8e3),this.eventManager.registerEventType("OIL_SLICK",()=>new Ba,.003,2e3),this.eventManager.registerEventType("RUSH_HOUR",()=>new Wa({}),.001,5e3),this.eventManager.registerEventType("ANIMAL_CROSSING",()=>new gi,.002,2e3),this.eventManager.registerEventType("POWER_OUTAGE",()=>new za({duration:900}),.0015,4e3)}initializeGame(){super.resetGame(),this.playerX=Ol,this.playerY=Rl,this.lastPlayerMoveTick=-1,this.gameTickCounter=0,this.playerSlipState={isSlipping:!1,dx:0,dy:0,ticks:0},this.playerCanMove=!1,this.previousInputState={up:!1,down:!1,left:!1,right:!1,action1:!1,r:!1},this.timeScore=1e3,this.lastTimeScoreDecreaseTick=0,this.extraLifeThresholdIndex=0,this.isPlayingDeathAnimation=!1,this.deathAnimationStartTick=0,this.deathAnimationFrame=0,this.carManager.initialize(),this.eventManager.reset(),this.scoreZoneManager.reset(),this.scoreZoneManager.generateZones(),this.scoreZoneManager.markGenerated(this.gameTickCounter),this.playBgm(),this.options.forceWeather&&this.eventManager.manuallyTriggerEvent(new xl({type:this.options.forceWeather,duration:9999})),this.options.forceRoadConstruction&&this.eventManager.manuallyTriggerEvent(new yl({duration:9999}))}updateGame(e){if(this.isGameOver())return;if(this.gameTickCounter++,this.isPlayingDeathAnimation&&!this.isDemoPlay){this.updateDeathAnimation();return}if(this.isShowingScoreDisplay&&!this.isDemoPlay){this.updateScoreDisplay(),this.updateTimeScore(),this.updateScoreZones(),this.eventManager.update(e);const r=this.eventManager.getActiveEventByType("ANIMAL_CROSSING"),c=r?r.getAnimals():[];this.carManager.update(c);return}this.isDemoPlay||this.updateTimeScore(),this.updateScoreZones(),this.eventManager.update(e),this.isDemoPlay||this.updatePlayerState(e);const l=this.eventManager.getActiveEventByType("ANIMAL_CROSSING"),s=l?l.getAnimals():[];this.carManager.incrementSpawnTick(),this.carManager.update(s),this.isDemoPlay||(this.checkCollisions(),this.playerY===hi&&this.levelComplete())}levelComplete(){const e=this.scoreZoneManager.getMultiplierAt(this.playerX),l=100+this.timeScore,s=l*e;this.addScore(s),this.checkForExtraLife(),e>1?(this.play("powerUp",999+e),console.log(`Score multiplied by ${e}x! ${l} × ${e} = ${s}`)):this.play("powerUp"),this.timeScore=1e3,this.lastTimeScoreDecreaseTick=this.gameTickCounter,this.scoreZoneManager.generateZones(),this.scoreZoneManager.markGenerated(this.gameTickCounter),this.isShowingScoreDisplay=!0,this.scoreDisplayStartTick=this.gameTickCounter,this.scoreDisplayText=`+${s.toLocaleString()}`,this.scoreDisplayX=this.playerX,this.scoreDisplayY=this.playerY}updateTimeScore(){if(this.gameTickCounter-this.lastTimeScoreDecreaseTick>=this.timeScoreDecreaseInterval){const e=this.timeScore;this.timeScore=Math.max(0,this.timeScore-this.timeScoreDecreaseAmount),this.lastTimeScoreDecreaseTick=this.gameTickCounter,e>100&&this.timeScore<=100?this.playMml(K.TIME_WARNING):e>50&&this.timeScore<=50?this.playMml([...K.DANGER_WARNING]):e>10&&this.timeScore<=10&&this.play("laser",999),e>0&&this.timeScore<=0&&(this.play("explosion",999),this.startDeathAnimation())}}updateScoreZones(){}drawScoreZones(){if(this.isDemoPlay)return;const e=this.scoreZoneManager.getZones();for(const l of e){let s;l.width===6?s=`--x${l.char}--`:l.width===4?s=`-x${l.char}-`:l.width===2?s=`x${l.char}`:s=`x${l.char}`,this.drawText(s,l.x,hi,{color:l.color})}}getNextExtraLifeThreshold(){if(this.extraLifeThresholdIndex<di.length)return di[this.extraLifeThresholdIndex];{const e=this.extraLifeThresholdIndex-di.length;let l=5e4,s=8e4;for(let r=0;r<=e;r++){const c=l+s;l=s,s=c}return s}}checkForExtraLife(){const e=this.getScore(),l=this.getNextExtraLifeThreshold();e>=l&&this.getLives()<Dl&&(this.gainLife(1),this.playMml([...K.EXTRA_LIFE_JINGLE]),console.log(`Extra life earned at ${l.toLocaleString()} points! Lives: ${this.getLives()}`),this.extraLifeThresholdIndex++)}updateDeathAnimation(){const e=this.gameTickCounter-this.deathAnimationStartTick;this.deathAnimationFrame=e,e>=this.deathAnimationDurationTicks&&(this.isPlayingDeathAnimation=!1,super.loseLife(),this.isGameOver()||this.resetPlayerPosition())}updateScoreDisplay(){this.gameTickCounter-this.scoreDisplayStartTick>=this.scoreDisplayDurationTicks&&(this.isShowingScoreDisplay=!1,this.resetPlayerPosition())}startDeathAnimation(){this.isPlayingDeathAnimation=!0,this.deathAnimationStartTick=this.gameTickCounter,this.deathAnimationFrame=0}loseLife(){this.isPlayingDeathAnimation||super.loseLife()}updatePlayerState(e){if(this.isPlayingDeathAnimation)return;let l=this.gameTickCounter-this.lastPlayerMoveTick>=this.playerMoveInterval;if(!this.playerCanMove){const c=e.up&&!this.previousInputState.up,u=e.down&&!this.previousInputState.down,f=e.left&&!this.previousInputState.left,y=e.right&&!this.previousInputState.right;if(c||u||f||y)this.playerCanMove=!0,this.play("select");else{this.previousInputState={...e};return}}if(this.playerSlipState.isSlipping&&(this.playerSlipState.ticks>0?(this.movePlayer(this.playerSlipState.dx,this.playerSlipState.dy,!0),this.playerSlipState.ticks--,l=!1):this.playerSlipState.isSlipping=!1),!l)return;let s=0,r=0;e.up?r=-1:e.down?r=1:e.left?s=-1:e.right&&(s=1),(s!==0||r!==0)&&this.movePlayer(s,r),this.previousInputState={...e}}movePlayer(e,l,s=!1){const r=this.playerX+e,c=this.playerY+l;r>=0&&r<w&&c>0&&c<L-1&&(this.playerX=r,this.playerY=c,s||(this.lastPlayerMoveTick=this.gameTickCounter,this.eventManager.getEffectAt(this.playerX,this.playerY)==="OIL_SLICK"&&!this.playerSlipState.isSlipping&&(this.playerSlipState={isSlipping:!0,dx:e,dy:l,ticks:2},this.playMml(K.OIL_SLIP))))}drawEverything(){this.drawSafeZones(),this.isShowingScoreDisplay||this.drawScoreZones(),this.eventManager.drawActiveEvents(),this.carManager.draw(),this.drawPlayer()}renderStandardUI(){if(this.isGameOver()||(this.drawEverything(),this.isShowingScoreDisplay&&!this.isDemoPlay&&this.drawScoreDisplay(),this.isDemoPlay))return;this.drawText(`${this.getScore()}`,1,0,{color:"white"});const e=`HI ${this.getHighScore()}`,l=w-e.length-1;this.drawText(e,l,0,{color:"yellow"});const s=Math.min(this.getLives()-1,Dl-1);if(s>0){const f=Math.floor((w-s*2)/2);for(let y=0;y<s;y++)this.drawText("P",f+y*2,0,{color:"cyan"})}const r=`Time: ${this.timeScore}`,c=w-r.length;this.drawText(r,c,L-1,{color:this.timeScore>500?"green":this.timeScore>200?"yellow":"red"});const u=this.eventManager.getActiveEventMessage();if(u){const f=w-r.length-2,y=u.length>f?u.substring(0,f-3)+"...":u;this.drawText(y,1,L-1,{color:"yellow"})}}getMaxConcurrentEvents(){const s=Math.floor(this.gameTickCounter/3600)+1;return Math.min(s,7)}drawSafeZones(){this.drawText(this.safeZoneChar.repeat(w),0,hi,{color:"green"}),this.drawText(this.safeZoneChar.repeat(w),0,Gl,{color:"yellow"}),this.drawText(this.safeZoneChar.repeat(w),0,Ya,{color:"green"})}drawPlayer(){if(!this.isDemoPlay)if(this.isPlayingDeathAnimation){const e=["X","*","+","."," "],l=["red","yellow","white","light_black","light_black"],r=Math.floor(this.deathAnimationFrame/8)%e.length;e[r]!==" "&&this.drawText(e[r],this.playerX,this.playerY,{color:l[r]})}else this.drawText("P",this.playerX,this.playerY,{color:"cyan"})}drawScoreDisplay(){const e=this.scoreDisplayText.length;let l=this.scoreDisplayX;l+e>w&&(l=w-e),l<0&&(l=0),this.drawText(this.scoreDisplayText,l,this.scoreDisplayY,{color:"white"})}resetPlayerPosition(){this.playerX=Ol,this.playerY=Rl,this.lastPlayerMoveTick=this.gameTickCounter,this.playerCanMove=!1,this.previousInputState={up:!1,down:!1,left:!1,right:!1,action1:!1,r:!1},this.timeScore=1e3,this.lastTimeScoreDecreaseTick=this.gameTickCounter,this.scoreZoneManager.generateZones(),this.scoreZoneManager.markGenerated(this.gameTickCounter)}checkCollisions(){const e=this.carManager.getCars(),l=this.getCellInfo(this.playerX,this.playerY);for(const s of e)if(Math.floor(this.playerX)===Math.floor(s.x)&&this.playerY===s.y){this.play("explosion",s.id%9),s.speed&&Math.abs(s.speed)>.5&&this.playMml("@explosion@s"+(s.id%9||123)+" v80 l8 o2 c4r4c4"),this.startDeathAnimation();return}if(l&&l.attributes.entityType==="static_obstacle"){this.play("hit",this.gameTickCounter%9),this.startDeathAnimation();return}}getGameTickCounter(){return this.gameTickCounter}getCarManager(){return this.carManager}getEventManager(){return this.eventManager}getLaneDefinitions(){return this.carManager.getLaneDefinitions()}getCars(){return this.carManager.getCars()}spawnStaticObstacle(e,l,s,r){this.carManager.spawnStaticObstacle(e,l,s,r)}removeStaticObstaclesByChar(e){this.carManager.removeStaticObstaclesByChar(e)}removeCarsByIds(e){this.carManager.removeCarsByIds(e)}getMaxCarSpeed(){return this.carManager.getMaxCarSpeed()}spawnCarInLane(e,l,s={}){return this.carManager.spawnCarInLane(e,l,s)}getPlayerY(){return this.playerY}playEventSound(e,l){const s=l||Math.floor(Math.random()*9);switch(e){case"EMERGENCY_VEHICLE":this.playMml(K.EMERGENCY_SIREN);break;case"POLICE_PRESENCE":this.playMml(K.POLICE_SIREN);break;case"TRAFFIC_JAM":const r=s%K.TRAFFIC_JAM_HORNS.length;this.playMml(K.TRAFFIC_JAM_HORNS[r]);break;case"ROAD_CONSTRUCTION":this.playMml(K.CONSTRUCTION_NOISE);break;case"WEATHER_RAIN":this.playMml(K.RAIN_SOUND);break;case"WEATHER_STORM":this.playMml(K.THUNDER);break;case"ANIMAL_CROSSING":const c=s%K.ANIMAL_SOUNDS.length;this.playMml(K.ANIMAL_SOUNDS[c]);break;case"CAR_COLLISION":this.play("explosion",s),this.playMml("@explosion@s"+s+" v60 l4 o3 c2r2c2");break;case"WRONG_WAY_DRIVER":this.playMml([...K.DANGER_WARNING]);break;case"POWER_OUTAGE":this.playMml("@synth@s"+s+" v40 l8 o4 c4>c<c4>c<c2");break;default:this.play("select",s);break}}playAmbientEventSound(e,l=1){const s=Math.min(70,20+l*10),r=999+Math.floor(Math.random()*9);switch(e){case"RUSH_HOUR":this.playMml(`@synth@s${r} v${s} l16 o3 crcrcrcr`);break;case"WEATHER_RAIN":this.playMml(`@synth@s${r} v${Math.min(s,30)} l32 o6 ${"cr".repeat(8)}`);break;case"CONSTRUCTION":this.gameTickCounter%120===0&&this.playMml(`@hit@d@s${r} v${s} l16 o4 cr cr cr`);break}}}const Pl=[`
 l
 l
 l

 l
`,`
l l
l l



`,`
l l
lll
l l
lll
l l
`,`
 ll
ll
lll
 ll
ll
`,`
l l
  l
 l
l
l l
`,`
ll
ll
lll
l 
lll
`,`
 l
 l



`,`
  l
 l
 l
 l
  l
`,`
l
 l
 l
 l
l
`,`
 l
lll
 l
lll
 l
`,`
 l
 l
lll
 l
 l
`,`



 l
l
`,`


lll


`,`




 l
`,`
  l
 l
 l
 l
l
`,`
lll
l l
l l
l l
lll
`,`
  l
  l
  l
  l
  l
`,`
lll
  l
lll
l
lll
`,`
lll
  l
lll
  l
lll
`,`
l l
l l
lll
  l
  l
`,`
lll
l
lll
  l
lll
`,`
l
l
lll
l l
lll
`,`
lll
  l
  l
  l
  l
`,`
lll
l l
lll
l l
lll
`,`
lll
l l
lll
  l
  l
`,`

 l

 l

`,`

 l

 l
l
`,`
  l
 l
l
 l
  l
`,`

lll

lll

`,`
l
 l
  l
 l
l
`,`
lll
  l
 ll

 l
`,`

lll
l l
l
 ll
`,`
lll
l l
lll
l l
l l
`,`
ll
l l
lll
l l
ll
`,`
lll
l
l
l
lll
`,`
ll
l l
l l
l l
ll
`,`
lll
l
lll
l
lll
`,`
lll
l
lll
l
l
`,`
lll
l
l l
l l
 ll
`,`
l l
l l
lll
l l
l l
`,`
 l
 l
 l
 l
 l
`,`
  l
  l
  l
  l
ll
`,`
l l
l l
ll
l l
l l
`,`
l
l
l
l
lll
`,`
l l
lll
l l
l l
l l
`,`
l l
lll
lll
lll
l l
`,`
lll
l l
l l
l l
lll
`,`
lll
l l
lll
l
l
`,`
lll
l l
l l
lll
lll
`,`
ll
l l
ll
l l
l l
`,`
lll
l
lll
  l
lll
`,`
lll
 l
 l
 l
 l
`,`
l l
l l
l l
l l
lll
`,`
l l
l l
l l
l l
 l
`,`
l l
l l
lll
lll
l l
`,`
l l
l l
 l
l l
l l
`,`
l l
l l
lll
 l
 l
`,`
lll
  l
 l
l
lll
`,`
 ll
 l
 l
 l
 ll
`,`
l
 l
 l
 l
  l
`,`
ll
 l
 l
 l
ll
`,`
 l
l l



`,`




lll
`,`
l
 l



`,`


 ll
l l
 ll
`,`

l
lll
l l
lll
`,`


lll
l
lll
`,`

  l
lll
l l
lll
`,`


lll
l
 ll
`,`

 ll
 l
lll
 l
`,`

lll
lll
  l
ll
`,`

l
l
lll
l l
`,`

 l

 l
 l
`,`

 l

 l
ll
`,`

l
l l
ll
l l
`,`

 l
 l
 l
 l
`,`


lll
lll
l l
`,`


ll
l l
l l
`,`


lll
l l
lll
`,`


lll
lll
l
`,`


lll
lll
  l
`,`


lll
l
l
`,`


 ll
lll
ll
`,`


lll
 l
 l
`,`


l l
l l
lll
`,`


l l
l l
 l
`,`


l l
lll
l l
`,`


l l
 l
l l
`,`


l l
 l
l
`,`


lll
 l
lll
`,`
 ll
 l
l
 l
 ll
`,`
 l
 l
 l
 l
 l
`,`
ll
 l
  l
 l
ll
`,`

l
lll
  l

`],ui=4,$l=5;function ja(a){let e=-1;for(let s=a.length-1;s>=0;s--)if(a[s].includes("l")){e=s;break}return e===-1?0:$l-1-e}function Za(a){const l=a.charCodeAt(0)-33;if(l<0||l>=Pl.length)return null;const s=Pl[l];if(!s)return null;const c=s.trim().split(`
`),u=[];for(let f=0;f<$l;f++)u.push(c[f]||"");return u}function Xa(a,e,l,s,r,c){let u=l;for(const f of e){if(f===" "){u+=ui;continue}const y=Za(f);if(!y){console.warn(`[drawLargeText] No pattern found for character: '${f}' (ASCII: ${f.charCodeAt(0)})`),u+=ui;continue}const x=ja(y);for(let E=0;E<y.length;E++){const v=y[E];for(let P=0;P<v.length;P++)v[P]==="l"&&a(r,u+P,s+E+x,c)}u+=ui}}const Ja=300,Ae=class Ae extends _l{constructor(e={}){super({...e,gameName:"Hopway",enableHighScoreStorage:!0}),this.lastScore=0,this.gameOverTimer=0,this.titleAnimationTimer=0,this.blinkTimer=0,this.showStartMessage=!0,this.titleToDemoTimer=0,this.demoPlayTimer=0,this.gameOptions=e,e.startInPlayingState?(this.currentFlowState=1,this.setIsDemoPlay(!1),this.initializeCoreGame()):(this.currentFlowState=0,this.setIsDemoPlay(!1),this.initializeGame())}initializeGame(){this.currentFlowState!==1&&(this.currentFlowState=0,this.resetTitleAnimationStates())}resetTitleAnimationStates(){this.titleAnimationTimer=0,this.blinkTimer=0,this.showStartMessage=!0,this.titleToDemoTimer=0,this.demoPlayTimer=0}initializeCoreGame(){this.actualGame=new Va({...this.gameOptions,carDensity:this.currentFlowState===0?.3:this.gameOptions.carDensity}),this.actualGame.setIsDemoPlay(this.isDemoPlay),this.actualGame.setHighScore(this.getHighScore()),this.actualGame.initializeGame()}updateGame(e){switch(this.currentFlowState){case 0:this.updateTitleScreen(e);break;case 1:this.actualGame||this.initializeCoreGame(),this.actualGame.setHighScore(this.getHighScore()),this.actualGame.update(e);const l=this.actualGame.getHighScore();l>this.getHighScore()&&(this.internalHighScore=l),this.actualGame.isGameOver()&&(this.lastScore=this.actualGame.getScore(),this.currentFlowState=2,this.gameOverTimer=Ja,this.stopBgm());break;case 2:this.updateGameOverScreen(e);break}}renderStandardUI(){switch(this.currentFlowState){case 0:this.drawTitleScreen();break;case 1:this.actualGame&&this.actualGame.renderStandardUI();break;case 2:this.drawGameOverScreen();break}}getVirtualScreenData(){return this.currentFlowState===1&&this.actualGame?this.actualGame.getVirtualScreenData():super.getVirtualScreenData()}updateTitleScreen(e){if(e.action1||e.action2||e.space||e.enter){this.startGameFromTitleOrDemo();return}if(this.titleAnimationTimer++,this.blinkTimer++,this.blinkTimer>=Ae.BLINK_INTERVAL_FRAMES&&(this.showStartMessage=!this.showStartMessage,this.blinkTimer=0),this.actualGame||(this.setIsDemoPlay(!0),this.initializeCoreGame(),this.demoPlayTimer=0),this.actualGame){this.demoPlayTimer++;const l={up:this.demoPlayTimer%180===0,down:!1,left:!1,right:!1,action1:!1,r:!1};this.actualGame.update(l)}}updateGameOverScreen(e){if(e.action1||e.action2||e.space||e.enter){this.startGameFromTitleOrDemo();return}this.gameOverTimer--,this.gameOverTimer<=0&&(this.currentFlowState=0,this.resetTitleAnimationStates(),this.resetGame(),this.setIsDemoPlay(!0),this.initializeCoreGame(),this.demoPlayTimer=0)}startGameFromTitleOrDemo(){this.currentFlowState=1,this.setIsDemoPlay(!1),this.initializeCoreGame(),this.playBgm()}drawTitleScreen(){if(this.actualGame){const f=this.actualGame.getVirtualScreenData();for(let y=0;y<L;y++)for(let x=0;x<w;x++){const E=f[y][x];E&&E.char&&E.char!==" "&&this.drawText(E.char,x,y,E.attributes)}}const e="Hopway",l=e.length*4,s=Math.floor((w-l)/2);Xa((f,y,x,E)=>{this.drawText(f,y,x,E)},e,s,2,"W",{color:"cyan"});const c=`${this.lastScore}`;this.drawText(c,1,0,{color:"white"});const u=`HI ${this.getHighScore()}`;if(this.drawText(u,w-u.length-1,0,{color:"yellow"}),this.showStartMessage){const f="Press Space/Z/X to Start",y=Math.floor((w-f.length)/2);this.drawText(f,y,L-3,{color:"yellow"})}}drawGameOverScreen(){this.drawCenteredText("GAME OVER",7,{color:"red"});const l=`Score: ${this.lastScore}`;this.drawCenteredText(l,10,{color:"white"});const s=`Hi-Score: ${this.getHighScore()}`;this.drawCenteredText(s,12,{color:"yellow"}),this.drawCenteredText("Press Space/Z/X to Start",16,{color:"cyan"})}getCoreGame(){return this.actualGame}getEventManager(){var e;return(e=this.actualGame)==null?void 0:e.getEventManager()}getGameTickCounter(){var e;return((e=this.actualGame)==null?void 0:e.getGameTickCounter())||0}isGameOver(){return this.currentFlowState===2}getScore(){return this.actualGame?this.actualGame.getScore():this.lastScore}getLives(){return this.actualGame?this.actualGame.getLives():3}update(e){this.gameTickCounter++,this.clearVirtualScreen(),this.updateGame(e),this.renderStandardUI()}resetGame(){super.resetGame(),this.gameOverTimer=0,this.titleAnimationTimer=0,this.blinkTimer=0,this.showStartMessage=!0,this.titleToDemoTimer=0,this.demoPlayTimer=0}};Ae.TITLE_TO_DEMO_DELAY_FRAMES=300,Ae.DEMO_PLAY_DURATION_FRAMES=900,Ae.BLINK_INTERVAL_FRAMES=30;let pi=Ae;function qa(){const a=keyboard.code;return{up:a.ArrowUp.isPressed||a.KeyW.isPressed,down:a.ArrowDown.isPressed||a.KeyS.isPressed,left:a.ArrowLeft.isPressed||a.KeyA.isPressed,right:a.ArrowRight.isPressed||a.KeyD.isPressed,action1:a.KeyX.isPressed||a.Slash.isPressed||a.Space.isPressed,action2:a.KeyZ.isPressed||a.Period.isPressed||a.Enter.isPressed,enter:a.Enter.isPressed,space:a.Space.isPressed,escape:a.Escape.isPressed,r:a.KeyR.isPressed,period:a.Period.isPressed,slash:a.Slash.isPressed}}function Qa(a,e,l,s,r){for(let c=0;c<l;c++)for(let u=0;u<e;u++){const f=a[c][u],y=u*s+s/2,x=c*r+r/2;if(f.char!==" "){let E=f.attributes.color||"white";E==="black"?E="white":E==="white"&&(E="black"),text(f.char,y,x,{color:E,backgroundColor:f.attributes.backgroundColor||"transparent",isSmallText:!0})}}}function er(a=w,e=L,l=4,s=6){return{viewSize:{x:a*l,y:e*s},isSoundEnabled:!1,isShowingScore:!1,theme:"dark"}}function Hl(a){return`abagames-vgct-${a}`}function tr(a){try{const e=Hl(a),l=localStorage.getItem(e);if(l){const s=parseInt(l,10);if(!isNaN(s))return s}}catch(e){console.error(`Failed to retrieve high score from localStorage for ${a}:`,e)}return 0}function ir(a,e){try{const l=Hl(a);localStorage.setItem(l,e.toString()),console.log(`[${a}] High score saved to storage: ${e}`)}catch(l){console.error(`Failed to save high score to localStorage for ${a}:`,l)}}function lr(a,e){play(a,{seed:e})}function Ll(a){sss.playMml(a,{isLooping:!1})}function sr(){playBgm()}function nr(){stopBgm()}function ar(a,e){lr(a,e)}function rr(a){Ll(typeof a=="string"?[a]:a)}function or(){sr()}function cr(){nr()}function hr(){return{playSoundEffect:ar,playMml:rr,startPlayingBgm:or,stopPlayingBgm:cr}}function dr(a={}){const e={...a,audioService:hr(),maxCarSpeed:.25,minCarSpeed:.1,playerMoveInterval:8,initialLives:3,minCarFollowingDistance:2};return new pi(e)}const ur={enableGlobalReset:!0,gameName:"Hopway",enableHighScoreStorage:!0};fr(dr,ur,{isSoundEnabled:!0,audioSeed:3,audioTempo:150,bgmVolume:3},{bgm:"Digital_Leap.mp3"});function fr(a,e={},l,s){const c={...er(),...l},{gameUpdate:u}=gr(a,e.gameName,e.enableHighScoreStorage===!0,w,L,4,6,e.enableGlobalReset===!0);init({update:u,options:c,audioFiles:s}),sss.setQuantize(0)}function gr(a,e,l,s=w,r=L,c=4,u=6,f=!0){let y;function x(){if(y=a({isBrowserEnvironment:!0,gameName:e,enableHighScoreStorage:l===!0}),l&&e&&y.internalHighScore!==void 0){const P=tr(e);y.internalHighScore=Math.max(y.internalHighScore,P)}}function E(){y||x();const v=qa(),P=y.isGameOver?y.isGameOver():!1;f&&v.r&&keyboard.code.KeyR.isJustPressed?P?y.update(v):(console.log("[browserHelper] Global R pressed, reinitializing game via reinitializeGame()."),x()):y.update(v);const V=y.isGameOver?y.isGameOver():!1;!P&&V&&l&&e&&y.internalHighScore!==void 0&&ir(e,y.internalHighScore);const W=y.getVirtualScreenData();Qa(W,s,r,c,u)}return{gameUpdate:E,reinitializeGame:x}}
