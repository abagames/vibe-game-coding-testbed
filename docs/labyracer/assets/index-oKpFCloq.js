(function(){const l=document.createElement("link").relList;if(l&&l.supports&&l.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const c of s)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function i(s){const c={};return s.integrity&&(c.integrity=s.integrity),s.referrerPolicy&&(c.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?c.credentials="include":s.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function o(s){if(s.ep)return;s.ep=!0;const c=i(s);fetch(s.href,c)}})();(function(e){function l(t,n=0,r=1){return Math.max(n,Math.min(t,r))}function i(t,n,r){const a=r-n,f=t-n;if(f>=0)return f%a+n;{let g=a+f%a+n;return g>=r&&(g-=a),g}}function o(t,n,r){return n<=t&&t<r}function s(t){return[...Array(t).keys()]}function c(t,n){return s(t).map(r=>n(r))}function d(t,n){let r=[];for(let a=0,f=0;a<t.length;f++)n(t[a],f)?(r.push(t[a]),t.splice(a,1)):a++;return r}function u(t){return[...t].reduce((n,[r,a])=>(n[r]=a,n),{})}function y(t){return Object.keys(t).map(n=>[n,t[n]])}function h(t,n){return String.fromCharCode(t.charCodeAt(0)+n)}function m(t){return t.x!=null&&t.y!=null}class p{constructor(n,r){this.x=0,this.y=0,this.set(n,r)}set(n=0,r=0){return m(n)?(this.x=n.x,this.y=n.y,this):(this.x=n,this.y=r,this)}add(n,r){return m(n)?(this.x+=n.x,this.y+=n.y,this):(this.x+=n,this.y+=r,this)}sub(n,r){return m(n)?(this.x-=n.x,this.y-=n.y,this):(this.x-=n,this.y-=r,this)}mul(n){return this.x*=n,this.y*=n,this}div(n){return this.x/=n,this.y/=n,this}clamp(n,r,a,f){return this.x=l(this.x,n,r),this.y=l(this.y,a,f),this}wrap(n,r,a,f){return this.x=i(this.x,n,r),this.y=i(this.y,a,f),this}addWithAngle(n,r){return this.x+=Math.cos(n)*r,this.y+=Math.sin(n)*r,this}swapXy(){const n=this.x;return this.x=this.y,this.y=n,this}normalize(){return this.div(this.length),this}rotate(n){if(n===0)return this;const r=this.x;return this.x=r*Math.cos(n)-this.y*Math.sin(n),this.y=r*Math.sin(n)+this.y*Math.cos(n),this}angleTo(n,r){return m(n)?Math.atan2(n.y-this.y,n.x-this.x):Math.atan2(r-this.y,n-this.x)}distanceTo(n,r){let a,f;return m(n)?(a=n.x-this.x,f=n.y-this.y):(a=n-this.x,f=r-this.y),Math.sqrt(a*a+f*f)}isInRect(n,r,a,f){return o(this.x,n,n+a)&&o(this.y,r,r+f)}equals(n){return this.x===n.x&&this.y===n.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const E=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],A="twrgybpclRGYBPCL";let I,_;const Ee=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function yn(t,n){const[r,a,f]=kl(0,t);if(I=u(E.map((g,S)=>{if(S<1)return[g,{r:0,g:0,b:0,a:0}];if(S<9){const[P,v,M]=kl(S-1,t);return[g,{r:P,g:v,b:M,a:1}]}const[x,T,C]=kl(S-9+1,t);return[g,{r:Math.floor(t?x*.5:r-(r-x)*.5),g:Math.floor(t?T*.5:f-(f-T)*.5),b:Math.floor(t?C*.5:a-(a-C)*.5),a:1}]})),t){const g=I.blue;I.white={r:Math.floor(g.r*.15),g:Math.floor(g.g*.15),b:Math.floor(g.b*.15),a:1}}n!=null&&pn(n)}function pn(t){_=t.map(n=>({r:n[0],g:n[1],b:n[2],a:1}));for(let n=0;n<E.length;n++){let r=1/0,a=-1;for(let f=0;f<_.length;f++){const g=Sn(_[f],I[E[n]]);g<r&&(r=g,a=f)}I[E[n]]=_[a]}}function Sn(t,n){const r={r:.299,g:.587,b:.114},a=t.r-n.r,f=t.g-n.g,g=t.b-n.b,S=n.r===n.g&&n.g===n.b;let x=Math.sqrt(a*a*r.r+f*f*r.g+g*g*r.b);return S&&!(n.r===0&&n.g===0&&n.b===0)&&(x*=1.5),x}function kl(t,n){n&&(t===0?t=7:t===7&&(t=0));const r=Ee[t];return[(r&16711680)>>16,(r&65280)>>8,r&255]}function Ce(t,n=1){const r=typeof t=="number"?_[t]:I[t];return Math.floor(r.r*n)<<16|Math.floor(r.g*n)<<8|Math.floor(r.b*n)}function be(t,n=1){const r=typeof t=="number"?_[t]:I[t],a=Math.floor(r.r*n),f=Math.floor(r.g*n),g=Math.floor(r.b*n);return r.a<1?`rgba(${a},${f},${g},${r.a})`:`rgb(${a},${f},${g})`}const wn=`
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
`;function xn(t,n){return new PIXI.Filter(void 0,wn,{width:t,height:n})}const Y=new p;let H,re,D,B=new p;const Dt=5;document.createElement("img");let G,Ie,Oe=1,Dl="black",W,It,Me=!1,k,Ot;function Tn(t,n,r,a,f,g,S,x){Y.set(t),k=x,Dl=r;const T=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${n};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${n};
color: #888;
`,C=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,P=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=T,B.set(Y),k.isUsingPixi){B.mul(Dt);const M=new PIXI.Application({width:B.x,height:B.y});if(H=M.view,D=new PIXI.Graphics,D.scale.x=D.scale.y=Dt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,M.stage.addChild(D),D.filters=[],k.name==="crt"&&D.filters.push(Ot=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),k.name==="pixel"&&D.filters.push(xn(B.x,B.y)),k.name==="pixel"||k.name==="shapeDark"){const F=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:k.name==="pixel"?1.5:1,brightness:k.name==="pixel"?1.5:1,blur:8});D.filters.push(F)}D.lineStyle(0),H.style.cssText=C}else H=document.createElement("canvas"),H.width=B.x,H.height=B.y,re=H.getContext("2d"),re.imageSmoothingEnabled=!1,H.style.cssText=C+P;document.body.appendChild(H);const v=()=>{const F=innerWidth/innerHeight,O=B.x/B.y,L=F<O,U=L?.95*innerWidth:.95*innerHeight*O,N=L?.95*innerWidth/O:.95*innerHeight;H.style.width=`${U}px`,H.style.height=`${N}px`};if(window.addEventListener("resize",v),v(),a){G=document.createElement("canvas");let M;f?(G.width=B.x,G.height=B.y,M=g):(B.x<=B.y*2?(G.width=B.y*2,G.height=B.y):(G.width=B.x,G.height=B.x/2),G.width>400&&(Oe=400/G.width,G.width=400,G.height*=Oe),M=Math.round(400/G.width)),Ie=G.getContext("2d"),Ie.fillStyle=n,gcc.setOptions({scale:M,capturingFps:60,isSmoothingEnabled:!1,durationSec:S})}}function ll(){if(k.isUsingPixi){D.clear(),D.beginFill(Ce(Dl,k.isDarkColor?.15:1)),D.drawRect(0,0,Y.x,Y.y),D.endFill(),D.beginFill(Ce(W)),Me=!0;return}re.fillStyle=be(Dl,k.isDarkColor?.15:1),re.fillRect(0,0,Y.x,Y.y),re.fillStyle=be(W)}function te(t){if(t===W){k.isUsingPixi&&!Me&&tl(Ce(W));return}if(W=t,k.isUsingPixi){Me&&D.endFill(),tl(Ce(W));return}re.fillStyle=be(t)}function tl(t){il(),D.beginFill(t),Me=!0}function il(){Me&&(D.endFill(),Me=!1)}function nl(){It=W}function ol(){te(It)}function ve(t,n,r,a){if(k.isUsingPixi){k.name==="shape"||k.name==="shapeDark"?D.drawRoundedRect(t,n,r,a,2):D.drawRect(t,n,r,a);return}re.fillRect(t,n,r,a)}function En(t,n,r,a,f){const g=Ce(W);tl(g),D.drawCircle(t,n,f*.5),D.drawCircle(r,a,f*.5),il(),D.lineStyle(f,g),D.moveTo(t,n),D.lineTo(r,a),D.lineStyle(0)}function Cn(){Ot.time+=.2}function bn(){if(Ie.fillRect(0,0,G.width,G.height),Oe===1)Ie.drawImage(H,(G.width-H.width)/2,(G.height-H.height)/2);else{const t=H.width*Oe,n=H.height*Oe;Ie.drawImage(H,(G.width-t)/2,(G.height-n)/2,t,n)}gcc.capture(G)}const Lt=[`
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

`],Mn=[`
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

`];let Pe,rl;function vn(){Pe=[],rl=[]}function _t(){Pe=Pe.concat(rl),rl=[]}function Rt(t){let n={isColliding:{rect:{},text:{},char:{}}};return Pe.forEach(r=>{Pn(t,r)&&(n=Object.assign(Object.assign(Object.assign({},n),Il(r.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},n.isColliding.rect),r.collision.isColliding.rect),text:Object.assign(Object.assign({},n.isColliding.text),r.collision.isColliding.text),char:Object.assign(Object.assign({},n.isColliding.char),r.collision.isColliding.char)}}))}),n}function Pn(t,n){const r=n.pos.x-t.pos.x,a=n.pos.y-t.pos.y;return-n.size.x<r&&r<t.size.x&&-n.size.y<a&&a<t.size.y}function Il(t){if(t==null)return{};const n={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let r={};return y(t).forEach(([a,f])=>{const g=n[a];f&&g!=null&&(r[g]=!0)}),r}function zt(t,n,r,a){return Xt(!1,t,n,r,a)}function An(t,n,r,a){return Xt(!0,t,n,r,a)}function Xt(t,n,r,a,f){if(typeof r=="number"){if(typeof a=="number")return se(n,r,a,Object.assign({isCharacter:t,isCheckingCollision:!0,color:W},f));throw"invalid params"}else return se(n,r.x,r.y,Object.assign({isCharacter:t,isCheckingCollision:!0,color:W},a))}const Le=6,Fn=4,ie=1,R=Le*ie,Ae=Fn*ie;let Ol,Ll,sl,_l,Rl=!1,Fe,zl,_e,al;const Xl={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function kn(){Fe=document.createElement("canvas"),Fe.width=Fe.height=R,zl=Fe.getContext("2d"),_e=document.createElement("canvas"),al=_e.getContext("2d"),Ol=Lt.map((t,n)=>cl(t,String.fromCharCode(33+n),!1)),Ll=Mn.map((t,n)=>cl(t,String.fromCharCode(33+n),!1)),sl=Lt.map((t,n)=>cl(t,String.fromCharCode(33+n),!0)),_l={}}function Dn(t,n){const r=n.charCodeAt(0)-33;t.forEach((a,f)=>{sl[r+f]=cl(a,String.fromCharCode(33+r+f),!0)})}function In(){Rl=!0}function se(t,n,r,a={}){const f=Yt(a);let g=t,S=n,x=r,T,C={isColliding:{rect:{},text:{},char:{}}};const P=f.isSmallText?Ae:R;for(let v=0;v<g.length;v++){if(v===0){const O=g.charCodeAt(0);if(O<33||O>126)S=Math.floor(S-R/2*f.scale.x),x=Math.floor(x-R/2*f.scale.y);else{const L=O-33,U=f.isCharacter?sl[L]:f.isSmallText?Ll[L]:Ol[L];S=Math.floor(S-U.size.x/2*f.scale.x),x=Math.floor(x-U.size.y/2*f.scale.y)}T=S}const M=g[v];if(M===`
`){S=T,x+=R*f.scale.y;continue}const F=On(M,S,x,f);f.isCheckingCollision&&(C={isColliding:{rect:Object.assign(Object.assign({},C.isColliding.rect),F.isColliding.rect),text:Object.assign(Object.assign({},C.isColliding.text),F.isColliding.text),char:Object.assign(Object.assign({},C.isColliding.char),F.isColliding.char)}}),S+=P*f.scale.x}return C}function On(t,n,r,a){const f=t.charCodeAt(0);if(f<32||f>126)return{isColliding:{rect:{},text:{},char:{}}};const g=Yt(a);if(g.backgroundColor!=="transparent"){const N=g.isSmallText?Ae:R,Ml=g.isSmallText?2:1;nl(),te(g.backgroundColor),ve(n+Ml,r,N*g.scale.x,R*g.scale.y),ol()}if(f<=32)return{isColliding:{rect:{},text:{},char:{}}};const S=f-33,x=g.isCharacter?sl[S]:g.isSmallText?Ll[S]:Ol[S],T=i(g.rotation,0,4);if(g.color==="black"&&T===0&&g.mirror.x===1&&g.mirror.y===1&&g.edgeColor==null&&(!k.isUsingPixi||g.scale.x===1&&g.scale.y===1))return Gl(x,n,r,g.scale,g.isCheckingCollision,!0);const C=JSON.stringify({c:t,options:g}),P=_l[C];if(P!=null)return Gl(P,n,r,g.scale,g.isCheckingCollision,g.color!=="transparent");let v=!1;const M=new p(R,R);let F=Fe,O=zl;if(x.size.x>R||x.size.y>R){if(T===0||T===2)M.set(x.size.x,x.size.y);else{const N=Math.max(x.size.x,x.size.y);M.set(N,N)}F=document.createElement("canvas"),F.width=M.x,F.height=M.y,O=F.getContext("2d"),O.imageSmoothingEnabled=!1}k.isUsingPixi&&(g.scale.x!==1||g.scale.y!==1)&&(_e.width=M.x*g.scale.x,_e.height=M.y*g.scale.y,al.imageSmoothingEnabled=!1,al.scale(g.scale.x,g.scale.y),Gt(al,T,g,x.image,M),v=!0),O.clearRect(0,0,M.x,M.y),Gt(O,T,g,x.image,M);const L=Nl(O,M,t,g.isCharacter);g.edgeColor!=null&&(F=Ln(O,M,g.edgeColor),M.x+=2,M.y+=2);let U;if(Rl||k.isUsingPixi){const N=document.createElement("img");if(N.src=F.toDataURL(),k.isUsingPixi){const Ml=document.createElement("img");Ml.src=(v?_e:F).toDataURL(),U=PIXI.Texture.from(Ml)}Rl&&(_l[C]={image:N,texture:U,hitBox:L,size:M})}return Gl({image:F,texture:U,hitBox:L,size:M},n,r,g.scale,g.isCheckingCollision,g.color!=="transparent")}function Ln(t,n,r){const a=n.x+2,f=n.y+2,g=[[0,-1],[1,0],[0,1],[-1,0]],S=document.createElement("canvas");S.width=a,S.height=f;const x=S.getContext("2d");x.imageSmoothingEnabled=!1,x.drawImage(t.canvas,1,1);const C=x.getImageData(0,0,a,f).data;x.fillStyle=be(r);for(let P=0;P<f;P++)for(let v=0;v<a;v++){const M=(P*a+v)*4;if(C[M+3]===0)for(const[F,O]of g){const L=v+F,U=P+O;if(L>=0&&L<a&&U>=0&&U<f){const N=(U*a+L)*4;if(C[N+3]>0){x.fillRect(v,P,1,1);break}}}}return S}function Gt(t,n,r,a,f){n===0&&r.mirror.x===1&&r.mirror.y===1?t.drawImage(a,0,0):(t.save(),t.translate(f.x/2,f.y/2),t.rotate(Math.PI/2*n),(r.mirror.x===-1||r.mirror.y===-1)&&t.scale(r.mirror.x,r.mirror.y),t.drawImage(a,-f.x/2,-f.y/2),t.restore()),r.color!=="black"&&(t.globalCompositeOperation="source-in",t.fillStyle=be(r.color==="transparent"?"black":r.color),t.fillRect(0,0,f.x,f.y),t.globalCompositeOperation="source-over")}function Gl(t,n,r,a,f,g){if(g&&(a.x===1&&a.y===1?Nt(t,n,r):Nt(t,n,r,t.size.x*a.x,t.size.y*a.y)),!f)return;const S={pos:{x:n+t.hitBox.pos.x*a.x,y:r+t.hitBox.pos.y*a.y},size:{x:t.hitBox.size.x*a.x,y:t.hitBox.size.y*a.y},collision:t.hitBox.collision},x=Rt(S);return g&&Pe.push(S),x}function Nt(t,n,r,a,f){if(k.isUsingPixi){il(),D.beginTextureFill({texture:t.texture,matrix:new PIXI.Matrix().translate(n,r)}),D.drawRect(n,r,a??t.size.x,f??t.size.y),tl(Ce(W));return}a==null?re.drawImage(t.image,n,r):re.drawImage(t.image,n,r,a,f)}function cl(t,n,r){if(t.indexOf(".")>=0||t.indexOf("data:image/")==0)return _n(t,n);let a=t.split(`
`);a=a.slice(1,a.length-1);let f=0;a.forEach(F=>{f=Math.max(F.length,f)});const g=Math.max(Math.ceil((Le-f)/2),0),S=a.length,x=Math.max(Math.ceil((Le-S)/2),0),T=new p(Math.max(Le,f)*ie,Math.max(Le,S)*ie);let C=Fe,P=zl;(T.x>R||T.y>R)&&(C=document.createElement("canvas"),C.width=T.x,C.height=T.y,P=C.getContext("2d"),P.imageSmoothingEnabled=!1),P.clearRect(0,0,T.x,T.y),a.forEach((F,O)=>{for(let L=0;L<f;L++){const U=F.charAt(L);let N=A.indexOf(U);U!==""&&N>=1&&(P.fillStyle=be(E[N]),P.fillRect((L+g)*ie,(O+x)*ie,ie,ie))}});const v=document.createElement("img");v.src=C.toDataURL();const M=Nl(P,T,n,r);return k.isUsingPixi?{image:v,texture:PIXI.Texture.from(v),size:T,hitBox:M}:{image:v,size:T,hitBox:M}}function _n(t,n){const r=document.createElement("img");r.src=t;const a=new p,f={pos:new p,size:new p,collision:{isColliding:{char:{},text:{}}}};let g;return k.isUsingPixi?g={image:r,texture:PIXI.Texture.from(r),size:new p,hitBox:f}:g={image:r,size:a,hitBox:f},r.onload=()=>{g.size.set(r.width*ie,r.height*ie);const S=document.createElement("canvas");S.width=g.size.x,S.height=g.size.y;const x=S.getContext("2d");x.imageSmoothingEnabled=!1,x.drawImage(r,0,0,g.size.x,g.size.y);const T=document.createElement("img");T.src=S.toDataURL(),g.image=T,g.hitBox=Nl(x,g.size,n,!0),k.isUsingPixi&&(g.texture=PIXI.Texture.from(T))},g}function Nl(t,n,r,a){const f={pos:new p(R,R),size:new p,collision:{isColliding:{char:{},text:{}}}};a?f.collision.isColliding.char[r]=!0:f.collision.isColliding.text[r]=!0;const g=t.getImageData(0,0,n.x,n.y).data;let S=0;for(let x=0;x<n.y;x++)for(let T=0;T<n.x;T++)g[S+3]>0&&(T<f.pos.x&&(f.pos.x=T),x<f.pos.y&&(f.pos.y=x)),S+=4;S=0;for(let x=0;x<n.y;x++)for(let T=0;T<n.x;T++)g[S+3]>0&&(T>f.pos.x+f.size.x-1&&(f.size.x=T-f.pos.x+1),x>f.pos.y+f.size.y-1&&(f.size.y=x-f.pos.y+1)),S+=4;return f}function Yt(t){let n=Object.assign(Object.assign({},Xl),t);return t.scale!=null&&(n.scale=Object.assign(Object.assign({},Xl.scale),t.scale)),t.mirror!=null&&(n.mirror=Object.assign(Object.assign({},Xl.mirror),t.mirror)),n}let ke=!1,fl=!1,Yl=!1;const Ht=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Hl;const Rn={onKeyDown:void 0};let Bl,Ul=!1,$l=!1,jl=!1,Wl={},Vl={},Kl={};function Bt(t){Bl=Object.assign(Object.assign({},Rn),t),Hl=u(Ht.map(n=>[n,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",n=>{Ul=$l=!0,Wl[n.code]=Vl[n.code]=!0,Bl.onKeyDown!=null&&Bl.onKeyDown(),(n.code==="AltLeft"||n.code==="AltRight"||n.code==="ArrowRight"||n.code==="ArrowDown"||n.code==="ArrowLeft"||n.code==="ArrowUp")&&n.preventDefault()}),document.addEventListener("keyup",n=>{Ul=!1,jl=!0,Wl[n.code]=!1,Kl[n.code]=!0})}function Ut(){fl=!ke&&$l,Yl=ke&&jl,$l=jl=!1,ke=Ul,y(Hl).forEach(([t,n])=>{n.isJustPressed=!n.isPressed&&Vl[t],n.isJustReleased=n.isPressed&&Kl[t],n.isPressed=!!Wl[t]}),Vl={},Kl={}}function $t(){fl=!1,ke=!0}var zn=Object.freeze({__proto__:null,get isPressed(){return ke},get isJustPressed(){return fl},get isJustReleased(){return Yl},codes:Ht,get code(){return Hl},init:Bt,update:Ut,clearJustPressed:$t});class ul{constructor(n=null){this.setSeed(n)}get(n=1,r){return r==null&&(r=n,n=0),this.next()/4294967295*(r-n)+n}getInt(n,r){r==null&&(r=n,n=0);const a=Math.floor(n),f=Math.floor(r);return f===a?a:this.next()%(f-a)+a}getPlusOrMinus(){return this.getInt(2)*2-1}select(n){return n[this.getInt(n.length)]}setSeed(n,r=123456789,a=362436069,f=521288629,g=32){this.w=n!=null?n>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=r>>>0,this.y=a>>>0,this.z=f>>>0;for(let S=0;S<g;S++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const n=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(n^n>>>8))>>>0,this.w}}const Re=new p;let ae=!1,De=!1,ze=!1,Xn={isDebugMode:!1,anchor:new p,padding:new p,onPointerDownOrUp:void 0},V,ee,$;const Xe=new ul,pe=new p,ce=new p;let Ge=!1,Ne=new p,Jl=!1,ql=!1,Zl=!1;function jt(t,n,r){$=Object.assign(Object.assign({},Xn),r),V=t,ee=new p(n.x+$.padding.x*2,n.y+$.padding.y*2),Ne.set(V.offsetLeft+V.clientWidth*(.5-$.anchor.x),V.offsetTop+V.clientWidth*(.5-$.anchor.y)),$.isDebugMode&&pe.set(V.offsetLeft+V.clientWidth*(.5-$.anchor.x),V.offsetTop+V.clientWidth*(.5-$.anchor.y)),document.addEventListener("mousedown",a=>{Kt(a.pageX,a.pageY)}),document.addEventListener("touchstart",a=>{Kt(a.touches[0].pageX,a.touches[0].pageY)}),document.addEventListener("mousemove",a=>{Jt(a.pageX,a.pageY)}),document.addEventListener("touchmove",a=>{a.preventDefault(),Jt(a.touches[0].pageX,a.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",a=>{qt()}),document.addEventListener("touchend",a=>{a.preventDefault(),a.target.click(),qt()},{passive:!1})}function Wt(){Gn(Ne.x,Ne.y,Re),$.isDebugMode&&!Re.isInRect(0,0,ee.x,ee.y)?(Nn(),Re.set(pe),De=!ae&&Ge,ze=ae&&!Ge,ae=Ge):(De=!ae&&ql,ze=ae&&Zl,ae=Jl),ql=Zl=!1}function Vt(){De=!1,ae=!0}function Gn(t,n,r){V!=null&&(r.x=Math.round(((t-V.offsetLeft)/V.clientWidth+$.anchor.x)*ee.x-$.padding.x),r.y=Math.round(((n-V.offsetTop)/V.clientHeight+$.anchor.y)*ee.y-$.padding.y))}function Nn(){ce.length>0?(pe.add(ce),!o(pe.x,-ee.x*.1,ee.x*1.1)&&pe.x*ce.x>0&&(ce.x*=-1),!o(pe.y,-ee.y*.1,ee.y*1.1)&&pe.y*ce.y>0&&(ce.y*=-1),Xe.get()<.05&&ce.set(0)):Xe.get()<.1&&(ce.set(0),ce.addWithAngle(Xe.get(Math.PI*2),(ee.x+ee.y)*Xe.get(.01,.03))),Xe.get()<.05&&(Ge=!Ge)}function Kt(t,n){Ne.set(t,n),Jl=ql=!0,$.onPointerDownOrUp!=null&&$.onPointerDownOrUp()}function Jt(t,n){Ne.set(t,n)}function qt(t){Jl=!1,Zl=!0,$.onPointerDownOrUp!=null&&$.onPointerDownOrUp()}var Yn=Object.freeze({__proto__:null,pos:Re,get isPressed(){return ae},get isJustPressed(){return De},get isJustReleased(){return ze},init:jt,update:Wt,clearJustPressed:Vt});let fe=new p,ue=!1,ne=!1,ge=!1;function Zt(t){Bt({onKeyDown:t}),jt(H,Y,{onPointerDownOrUp:t,anchor:new p(.5,.5)})}function Qt(){Ut(),Wt(),fe=Re,ue=ke||ae,ne=fl||De,ge=Yl||ze}function ei(){$t(),Vt()}function Ye(t){fe.set(t.pos),ue=t.isPressed,ne=t.isJustPressed,ge=t.isJustReleased}var Hn=Object.freeze({__proto__:null,get pos(){return fe},get isPressed(){return ue},get isJustPressed(){return ne},get isJustReleased(){return ge},init:Zt,update:Qt,clearJustPressed:ei,set:Ye});let K,He,Ql=!1,li,ti,et,de={};function ii(t,n=1){const r=de[t];return r==null?!1:(r.gainNode.gain.value=n,r.isPlaying=!0,!0)}function Bn(){const t=K.currentTime;for(const n in de){const r=de[n];if(!r.isReady||!r.isPlaying)continue;r.isPlaying=!1;const a=Zn(t);(r.playedTime==null||a>r.playedTime)&&(Kn(r,a),r.playedTime=a)}}function ni(t,n=void 0){const r=de[t];r.source!=null&&(n==null?r.source.stop():r.source.stop(n),r.source=void 0)}function Un(t=void 0){if(de){for(const n in de)ni(n,t);de={}}}function $n(){K=new(window.AudioContext||window.webkitAudioContext),document.addEventListener("visibilitychange",()=>{document.hidden?K.suspend():K.resume()})}function jn(){Ql=!0,He=K.createGain(),He.connect(K.destination),oi(),Vn(),ri()}function Wn(t,n){return de[t]=Jn(n),de[t]}function oi(t=120){li=t,ti=60/li}function Vn(t=8){et=t>0?4/t:void 0}function ri(t=.1){He.gain.value=t}function Kn(t,n){const r=K.createBufferSource();t.source=r,r.buffer=t.buffer,r.loop=t.isLooping,r.start=r.start||r.noteOn,r.connect(t.gainNode),r.start(n)}function Jn(t){const n={buffer:void 0,source:void 0,gainNode:K.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return n.gainNode.connect(He),qn(t).then(r=>{n.buffer=r,n.isReady=!0}),n}async function qn(t){const r=await(await fetch(t)).arrayBuffer();return await K.decodeAudioData(r)}function Zn(t){if(et==null)return t;const n=ti*et;return n>0?Math.ceil(t/n)*n:t}let si,ai;const ci=68,lt=1e3/ci;let Be=0;const Qn={viewSize:{x:100,y:100},bodyBackground:"#111",viewBackground:"black",isCapturing:!1,isCapturingGameCanvasOnly:!1,isSoundEnabled:!0,captureCanvasScale:1,theme:{name:"simple",isUsingPixi:!1,isDarkColor:!1},colorPalette:void 0};let Z,fi=10,dl;function eo(t,n,r){si=t,ai=n,Z=Object.assign(Object.assign({},Qn),r),yn(Z.theme.isDarkColor,Z.colorPalette),Tn(Z.viewSize,Z.bodyBackground,Z.viewBackground,Z.isCapturing,Z.isCapturingGameCanvasOnly,Z.captureCanvasScale,Z.captureDurationSec,Z.theme),Zt(()=>{K.resume()}),kn(),si(),ui()}function ui(){dl=requestAnimationFrame(ui);const t=window.performance.now();t<Be-ci/12||(Be+=lt,(Be<t||Be>t+lt*2)&&(Be=t+lt),Ql&&Bn(),Z.isSoundEnabled&&sss.update(),Qt(),ai(),Z.isCapturing&&bn(),fi--,fi===0&&In())}function lo(){dl&&(cancelAnimationFrame(dl),dl=void 0)}let ml;const gl=new ul;function tt(){ml=[]}function di(t,n=16,r=1,a=0,f=Math.PI*2,g=void 0){if(n<1){if(gl.get()>n)return;n=1}for(let S=0;S<n;S++){const x=a+gl.get(f)-f/2,T={pos:new p(t),vel:new p(r*gl.get(.5,1),0).rotate(x),color:W,ticks:l(gl.get(10,20)*Math.sqrt(Math.abs(r)),10,60),edgeColor:g};ml.push(T)}}function hl(){nl(),ml=ml.filter(t=>{if(t.ticks--,t.ticks<0)return!1;t.pos.add(t.vel),t.vel.mul(.98);const n=Math.floor(t.pos.x),r=Math.floor(t.pos.y);return t.edgeColor!=null&&(te(t.edgeColor),ve(n-1,r-1,3,3)),te(t.color),ve(n,r,1,1),!0}),ol()}function it(t,n,r,a){return mi(!1,t,n,r,a)}function to(t,n,r,a){return mi(!0,t,n,r,a)}function io(t,n,r,a,f=.5,g=.5){typeof t!="number"&&(g=f,f=a,a=r,r=n,n=t.y,t=t.x);const S=new p(r).rotate(f),x=new p(t-S.x*g,n-S.y*g);return nt(x,S,a)}function no(t,n,r=3,a=3,f=3){const g=new p,S=new p;if(typeof t=="number")if(typeof n=="number")typeof r=="number"?(g.set(t,n),S.set(r,a)):(g.set(t,n),S.set(r),f=a);else throw"invalid params";else if(typeof n=="number")if(typeof r=="number")g.set(t),S.set(n,r),f=a;else throw"invalid params";else if(typeof r=="number")g.set(t),S.set(n),f=r;else throw"invalid params";return nt(g,S.sub(g),f)}function oo(t,n,r,a,f,g){let S=new p;typeof t=="number"?S.set(t,n):(S.set(t),g=f,f=a,a=r,r=n),a==null&&(a=3),f==null&&(f=0),g==null&&(g=Math.PI*2);let x,T;if(f>g?(x=g,T=f-g):(x=f,T=g-f),T=l(T,0,Math.PI*2),T<.01)return;const C=l(Math.ceil(T*Math.sqrt(r*.25)),1,36),P=T/C;let v=x,M=new p(r).rotate(v).add(S),F=new p,O=new p,L={isColliding:{rect:{},text:{},char:{}}};for(let U=0;U<C;U++){v+=P,F.set(r).rotate(v).add(S),O.set(F).sub(M);const N=nt(M,O,a,!0);L=Object.assign(Object.assign(Object.assign({},L),Il(N.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},L.isColliding.rect),N.isColliding.rect),text:Object.assign(Object.assign({},L.isColliding.text),N.isColliding.text),char:Object.assign(Object.assign({},L.isColliding.char),N.isColliding.char)}}),M.set(F)}return _t(),L}function mi(t,n,r,a,f){if(typeof n=="number"){if(typeof r=="number")return typeof a=="number"?f==null?Se(t,n,r,a,a):Se(t,n,r,a,f):Se(t,n,r,a.x,a.y);throw"invalid params"}else if(typeof r=="number"){if(a==null)return Se(t,n.x,n.y,r,r);if(typeof a=="number")return Se(t,n.x,n.y,r,a);throw"invalid params"}else return Se(t,n.x,n.y,r.x,r.y)}function nt(t,n,r,a=!1){let f=!0;(k.name==="shape"||k.name==="shapeDark")&&(W!=="transparent"&&En(t.x,t.y,t.x+n.x,t.y+n.y,r),f=!1);const g=Math.floor(l(r,3,10)),S=Math.abs(n.x),x=Math.abs(n.y),T=l(Math.ceil(S>x?S/g:x/g)+1,3,99);n.div(T-1);let C={isColliding:{rect:{},text:{},char:{}}};for(let P=0;P<T;P++){const v=Se(!0,t.x,t.y,r,r,!0,f);C=Object.assign(Object.assign(Object.assign({},C),Il(v.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},C.isColliding.rect),v.isColliding.rect),text:Object.assign(Object.assign({},C.isColliding.text),v.isColliding.text),char:Object.assign(Object.assign({},C.isColliding.char),v.isColliding.char)}}),t.add(n)}return a||_t(),C}function Se(t,n,r,a,f,g=!1,S=!0){let x=S;(k.name==="shape"||k.name==="shapeDark")&&x&&W!=="transparent"&&(t?ve(n-a/2,r-f/2,a,f):ve(n,r,a,f),x=!1);let T=t?{x:Math.floor(n-a/2),y:Math.floor(r-f/2)}:{x:Math.floor(n),y:Math.floor(r)};const C={x:Math.trunc(a),y:Math.trunc(f)};if(C.x===0||C.y===0)return{isColliding:{rect:{},text:{},char:{}}};C.x<0&&(T.x+=C.x,C.x*=-1),C.y<0&&(T.y+=C.y,C.y*=-1);const P={pos:T,size:C,collision:{isColliding:{rect:{}}}};P.collision.isColliding.rect[W]=!0;const v=Rt(P);return W!=="transparent"&&((g?rl:Pe).push(P),x&&ve(T.x,T.y,C.x,C.y)),v}function ot({pos:t,size:n,text:r,isToggle:a=!1,onClick:f=()=>{},isSmallText:g=!0}){return{pos:t,size:n,text:r,isToggle:a,onClick:f,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:g}}function rt(t){const n=new p(fe).sub(t.pos);t.isHovered=n.isInRect(0,0,t.size.x,t.size.y),t.isHovered&&De&&(t.isPressed=!0),t.isPressed&&!t.isHovered&&(t.isPressed=!1),t.isPressed&&ze&&(t.onClick(),t.isPressed=!1,t.isToggle&&(t.toggleGroup.length===0?t.isSelected=!t.isSelected:(t.toggleGroup.forEach(r=>{r.isSelected=!1}),t.isSelected=!0))),yl(t)}function yl(t){nl(),te(t.isPressed?"blue":"light_blue"),it(t.pos.x,t.pos.y,t.size.x,t.size.y),t.isToggle&&!t.isSelected&&(te("white"),it(t.pos.x+1,t.pos.y+1,t.size.x-2,t.size.y-2)),te(t.isHovered?"black":"blue"),zt(t.text,t.pos.x+3,t.pos.y+3,{isSmallText:t.isSmallText}),ol()}let oe,Ue,we,st;function ro(t){oe={randomSeed:t,inputs:[]}}function so(t){oe.inputs.push(t)}function gi(){return oe!=null}function ao(t){Ue=0,t.setSeed(oe.randomSeed)}function co(){Ue>=oe.inputs.length||(Ye(oe.inputs[Ue]),Ue++)}function fo(){we=[]}function uo(t,n,r){we.push({randomState:r.getState(),gameState:cloneDeep(t),baseState:cloneDeep(n)})}function mo(t){const n=we.pop(),r=n.randomState;return t.setSeed(r.w,r.x,r.y,r.z,0),st={pos:new p(fe),isPressed:ue,isJustPressed:ne,isJustReleased:ge},Ye(oe.inputs.pop()),n}function go(t){const n=we[we.length-1],r=n.randomState;return t.setSeed(r.w,r.x,r.y,r.z,0),st={pos:new p(fe),isPressed:ue,isJustPressed:ne,isJustReleased:ge},Ye(oe.inputs[oe.inputs.length-1]),n}function ho(){Ye(st)}function yo(){return we.length===0}function po(){const t=Ue-1;if(!(t>=oe.inputs.length))return we[t]}const at=4,So=60,wo="video/webm;codecs=vp8,opus",xo="video/webm",To="recording.webm",Eo=1e5*at,Co=.7;let le,pl;function bo(t,n,r){if(le!=null)return;const a=document.createElement("canvas");a.width=t.width*at,a.height=t.height*at;const f=a.getContext("2d");f.imageSmoothingEnabled=!1;const g=()=>{f.drawImage(t,0,0,t.width,t.height,0,0,a.width,a.height),pl=requestAnimationFrame(g)};g();const S=a.captureStream(So),x=n.createMediaStreamDestination(),T=n.createGain();T.gain.value=Co,r.forEach(M=>{M!=null&&M.connect(T)}),T.connect(x);const C=x.stream,P=new MediaStream([...S.getVideoTracks(),...C.getAudioTracks()]);le=new MediaRecorder(P,{mimeType:wo,videoBitsPerSecond:Eo});let v=[];le.ondataavailable=M=>{M.data.size>0&&v.push(M.data)},le.onstop=()=>{const M=new Blob(v,{type:xo}),F=URL.createObjectURL(M),O=document.createElement("a");O.href=F,O.download=To,O.click(),URL.revokeObjectURL(F),v=[]},le.start()}function Mo(){le!=null&&le.state!=="inactive"&&(le.stop(),le=void 0),pl&&(cancelAnimationFrame(pl),pl=void 0)}function vo(){return le!=null&&le.state==="recording"}const Po=Math.PI,Ao=Math.abs,Fo=Math.sin,ko=Math.cos,Do=Math.atan2,Io=Math.sqrt,Oo=Math.pow,Lo=Math.floor,_o=Math.round,Ro=Math.ceil;e.ticks=0,e.difficulty=void 0,e.score=0,e.time=void 0,e.isReplaying=!1;function zo(t=1,n){return me.get(t,n)}function Xo(t=2,n){return me.getInt(t,n)}function Go(t=1,n){return me.get(t,n)*me.getPlusOrMinus()}function ct(t="GAME OVER"){El=t,w.isShowingTime&&(e.time=void 0),Ci()}function No(t="COMPLETE"){El=t,Ci()}function Yo(t,n,r){if(e.isReplaying||(e.score+=t,n==null))return;const a=`${t>=1?"+":""}${Math.floor(t)}`;let f=new p;typeof n=="number"?f.set(n,r):f.set(n),f.x-=a.length*(w.isUsingSmallText?Ae:R)/2,f.y-=R/2,xl.push({str:a,pos:f,vy:-2,ticks:30})}function hi(t){te(t)}function Ho(t,n,r,a,f,g){let S=new p;typeof t=="number"?(S.set(t,n),x(S,r,a,f,g)):(S.set(t),x(S,n,r,a,f));function x(T,C,P,v,M){if(rr(C)){const F=C;di(T,F.count,F.speed,F.angle,F.angleWidth,F.edgeColor)}else di(T,C,P,v,M)}}function yi(t,n){return new p(t,n)}function pi(t,n){!We&&!Te&&(Ql&&ii(t,n!=null&&n.volume!=null?n.volume:1)||(w.isSoundEnabled&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(t,n):w.isSoundEnabled&&sss.play($o[t])))}let ft;function ut(){ht&&ii(w.bgmName,w.bgmVolume)||(typeof sss.generateMml=="function"?ft=sss.playMml(sss.generateMml(),{volume:w.bgmVolume}):sss.playBgm())}function dt(){ht?ni(w.bgmName):ft!=null?sss.stopMml(ft):sss.stopBgm()}function Si(){bo(H,K,[He,bl])}function mt(){Mo()}function Bo(t){if(We){const n=go(me),r=n.baseState;return e.score=r.score,e.ticks=r.ticks,cloneDeep(n.gameState)}else if(Te){const n=mo(me),r=n.baseState;return e.score=r.score,e.ticks=r.ticks,n.gameState}else{if(e.isReplaying)return po().gameState;if(xe==="inGame"){const n={score:e.score,ticks:e.ticks};uo(t,n,me)}}return t}function Uo(){Te||(!e.isReplaying&&w.isRewindEnabled?lr():ct())}const $o={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"},wi={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},jo=new ul,me=new ul;let xe,Wo={title:Qo,inGame:Zo,gameOver:er,rewind:tr},$e=0,Sl,wl=!0,je=0,w,xi,xl,We=!1,Te=!1,Ve,Tl,El,gt,Cl,bl,ht=!1;function Vo(t){window.update=t.update,window.title=t.title,window.description=t.description,window.characters=t.characters,window.options=t.options,window.audioFiles=t.audioFiles,Ti()}function Ti(){typeof options<"u"&&options!=null?w=Object.assign(Object.assign({},wi),options):w=wi;const t={name:w.theme,isUsingPixi:!1,isDarkColor:!1};w.theme!=="simple"&&w.theme!=="dark"&&(t.isUsingPixi=!0),(w.theme==="pixel"||w.theme==="shapeDark"||w.theme==="crt"||w.theme==="dark")&&(t.isDarkColor=!0),je=w.audioSeed+w.seed,w.isMinifying&&ar(),xi={viewSize:w.viewSize,bodyBackground:t.isDarkColor?"#101010":"#e0e0e0",viewBackground:t.isDarkColor?"blue":"white",theme:t,isSoundEnabled:w.isSoundEnabled,isCapturing:w.isCapturing,isCapturingGameCanvasOnly:w.isCapturingGameCanvasOnly,captureCanvasScale:w.captureCanvasScale,captureDurationSec:w.captureDurationSec,colorPalette:w.colorPalette},eo(Jo,qo,xi)}function Ko(){lo(),mt(),Un(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}function Jo(){if(typeof description<"u"&&description!=null&&description.trim().length>0&&(wl=!1,je+=Ai(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(wl=!1,document.title=title,je+=Ai(title),Cl=`crisp-game-${encodeURIComponent(title)}-${je}`,$e=or()),typeof characters<"u"&&characters!=null&&Dn(characters,"a"),$n(),typeof audioFiles<"u"&&audioFiles!=null){jn(),ri(.1*w.audioVolume),oi(w.audioTempo);for(let t in audioFiles){const n=Wn(t,audioFiles[t]);t===w.bgmName&&(n.isLooping=!0,ht=!0)}}w.isSoundEnabled&&(bl=K.createGain(),bl.connect(K.destination),sss.init(je,K,bl),sss.setVolume(.1*w.audioVolume),sss.setTempo(w.audioTempo)),te("black"),wl?(yt(),e.ticks=0):Ei()}function qo(){e.df=e.difficulty=e.ticks/3600+1,e.tc=e.ticks;const t=e.score,n=e.time;e.sc=e.score;const r=e.sc;e.inp={p:fe,ip:ue,ijp:ne,ijr:ge},vn(),Wo[xe](),k.isUsingPixi&&(il(),k.name==="crt"&&Cn()),e.ticks++,e.isReplaying?(e.score=t,e.time=n):e.sc!==r&&(e.score=e.sc)}function yt(){xe="inGame",e.ticks=-1,tt();const t=Math.floor(e.score);t>$e&&($e=t),w.isShowingTime&&e.time!=null&&(Sl==null||Sl>e.time)&&(Sl=e.time),e.score=0,e.time=0,xl=[],w.isPlayingBgm&&w.isSoundEnabled&&ut();const n=jo.getInt(999999999);me.setSeed(n),(w.isReplayEnabled||w.isRewindEnabled)&&(ro(n),fo(),e.isReplaying=!1)}function Zo(){ll(),w.isDrawingParticleFront||hl(),w.isDrawingScoreFront||Pi(),(w.isReplayEnabled||w.isRewindEnabled)&&so({pos:yi(fe),isPressed:ue,isJustPressed:ne,isJustReleased:ge}),typeof update=="function"&&update(),w.isDrawingParticleFront&&hl(),w.isDrawingScoreFront&&Pi(),pt(),w.isShowingTime&&e.time!=null&&e.time++,w.isRecording&&!vo()&&Si()}function Ei(){xe="title",e.ticks=-1,tt(),ll(),gi()&&(ao(me),e.isReplaying=!0)}function Qo(){if(ne){yt();return}if(ll(),w.isReplayEnabled&&gi()&&(co(),e.inp={p:fe,ip:ue,ijp:ne,ijr:ge},w.isDrawingParticleFront||hl(),update(),w.isDrawingParticleFront&&hl()),pt(),typeof title<"u"&&title!=null){let t=0;title.split(`
`).forEach(r=>{r.length>t&&(t=r.length)});const n=Math.floor((Y.x-t*R)/2);title.split(`
`).forEach((r,a)=>{se(r,n,Math.floor(Y.y*.25)+a*R,{edgeColor:w.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let t=0;description.split(`
`).forEach(a=>{a.length>t&&(t=a.length)});const n=w.isUsingSmallText?Ae:R,r=Math.floor((Y.x-t*n)/2);description.split(`
`).forEach((a,f)=>{se(a,r,Math.floor(Y.y/2)+f*R,{isSmallText:w.isUsingSmallText,edgeColor:w.textEdgeColor.description})})}}function Ci(){xe="gameOver",e.isReplaying||ei(),e.ticks=-1,Mi(),w.isPlayingBgm&&w.isSoundEnabled&&dt();const t=Math.floor(e.score);t>$e&&nr(t)}function er(){e.ticks===0&&!k.isUsingPixi&&Mi(),(e.isReplaying||e.ticks>20)&&ne?(bi(),yt()):e.ticks===(w.isReplayEnabled?120:300)&&!wl&&(bi(),Ei())}function bi(){!w.isRecording||e.isReplaying||mt()}function Mi(){e.isReplaying||se(El,Math.floor((Y.x-El.length*R)/2),Math.floor(Y.y/2),{edgeColor:w.textEdgeColor.gameOver})}function lr(){xe="rewind",We=!0,Ve=ot({pos:{x:Y.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:w.isUsingSmallText}),Tl=ot({pos:{x:Y.x-39,y:Y.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:w.isUsingSmallText}),w.isPlayingBgm&&w.isSoundEnabled&&dt(),k.isUsingPixi&&(yl(Ve),yl(Tl))}function tr(){ll(),update(),pt(),ho(),Te?(yl(Ve),(yo()||!ue)&&ir()):(rt(Ve),rt(Tl),Ve.isPressed&&(Te=!0,We=!1)),Tl.isPressed&&(We=Te=!1,ct()),w.isShowingTime&&e.time!=null&&e.time++}function ir(){Te=!1,xe="inGame",tt(),w.isPlayingBgm&&w.isSoundEnabled&&ut()}function pt(){if(w.isShowingTime)vi(e.time,3,3),vi(Sl,Y.x-7*(w.isUsingSmallText?Ae:R),3);else if(w.isShowingScore){se(`${Math.floor(e.score)}`,3,3,{isSmallText:w.isUsingSmallText,edgeColor:w.textEdgeColor.score});const t=`HI ${$e}`;se(t,Y.x-t.length*(w.isUsingSmallText?Ae:R),3,{isSmallText:w.isUsingSmallText,edgeColor:w.textEdgeColor.score})}}function vi(t,n,r){if(t==null)return;let a=Math.floor(t*100/50);a>=10*60*100&&(a=10*60*100-1);const f=St(Math.floor(a/6e3),1)+"'"+St(Math.floor(a%6e3/100),2)+'"'+St(Math.floor(a%100),2);se(f,n,r,{isSmallText:w.isUsingSmallText,edgeColor:w.textEdgeColor.score})}function St(t,n){return("0000"+t).slice(-n)}function Pi(){nl(),te("black"),xl=xl.filter(t=>(se(t.str,t.pos.x,t.pos.y,{isSmallText:w.isUsingSmallText,edgeColor:w.textEdgeColor.floatingScore}),t.pos.y+=t.vy,t.vy*=.9,t.ticks--,t.ticks>0)),ol()}function Ai(t){let n=0;for(let r=0;r<t.length;r++){const a=t.charCodeAt(r);n=(n<<5)-n+a,n|=0}return n}function nr(t){if(Cl!=null)try{const n={highScore:t};localStorage.setItem(Cl,JSON.stringify(n))}catch(n){console.warn("Unable to save high score:",n)}}function or(){try{const t=localStorage.getItem(Cl);if(t)return JSON.parse(t).highScore}catch(t){console.warn("Unable to load high score:",t)}return 0}function rr(t){return t!=null&&t.constructor===Object}function sr(){let t=window.location.search.substring(1);if(t=t.replace(/[^A-Za-z0-9_-]/g,""),t.length===0)return;const n=document.createElement("script");gt=`${t}/main.js`,n.setAttribute("src",gt),document.head.appendChild(n)}function ar(){fetch(gt).then(t=>t.text()).then(t=>{const n=Terser.minify(t+"update();",{toplevel:!0}).code,r="function(){",a=n.indexOf(r),f="options={",g=n.indexOf(f);let S=n;if(a>=0)S=n.substring(n.indexOf(r)+r.length,n.length-4);else if(g>=0){let x=1,T;for(let C=g+f.length;C<n.length;C++){const P=n.charAt(C);if(P==="{")x++;else if(P==="}"&&(x--,x===0)){T=C+2;break}}x===0&&(S=n.substring(T))}Fi.forEach(([x,T])=>{S=S.split(x).join(T)}),console.log(S),console.log(`${S.length} letters`)})}e.inp=void 0;function cr(...t){return hi.apply(this,t)}function fr(...t){return pi.apply(this,t)}function ur(...t){return c.apply(this,t)}function dr(...t){return d.apply(this.args)}e.tc=void 0,e.df=void 0,e.sc=void 0;const mr="transparent",gr="white",hr="red",yr="green",pr="yellow",Sr="blue",wr="purple",xr="cyan",Tr="black",Er="coin",Cr="laser",br="explosion",Mr="powerUp",vr="hit",Pr="jump",Ar="select",Fr="lucky";let Fi=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];e.PI=Po,e.abs=Ao,e.addGameScript=sr,e.addScore=Yo,e.addWithCharCode=h,e.arc=oo,e.atan2=Do,e.bar=io,e.bl=Sr,e.box=to,e.ceil=Ro,e.char=An,e.clamp=l,e.clr=cr,e.cn=Er,e.color=hi,e.complete=No,e.cos=ko,e.cy=xr,e.end=ct,e.ex=br,e.floor=Lo,e.frameState=Bo,e.getButton=ot,e.gr=yr,e.ht=vr,e.init=Vo,e.input=Hn,e.jm=Pr,e.keyboard=zn,e.lc=Tr,e.line=no,e.ls=Cr,e.minifyReplaces=Fi,e.onLoad=Ti,e.onUnload=Ko,e.particle=Ho,e.play=pi,e.playBgm=ut,e.ply=fr,e.pointer=Yn,e.pow=Oo,e.pr=wr,e.pw=Mr,e.range=s,e.rd=hr,e.rect=it,e.remove=d,e.rewind=Uo,e.rmv=dr,e.rnd=zo,e.rndi=Xo,e.rnds=Go,e.round=_o,e.sin=Fo,e.sl=Ar,e.sqrt=Io,e.startRecording=Si,e.stopBgm=dt,e.stopRecording=mt,e.text=zt,e.times=c,e.tms=ur,e.tr=mr,e.uc=Fr,e.updateButton=rt,e.vec=yi,e.wh=gr,e.wrap=i,e.yl=pr})(window||{});const z=40,X=25,ln=Object.freeze({char:" ",attributes:{}});function kr(e={}){const{initialLives:l=3,isDemoPlay:i=!1,audioService:o,gameName:s,enableHighScoreStorage:c=!1,isBrowserEnvironment:d=!1}=e;return{virtualScreen:Dr(),score:0,lives:l,gameOverState:!1,initialLives:l,isDemoPlay:i,audioService:o,gameTickCounter:0,gameName:s,enableHighScoreStorage:c,isBrowserEnvironment:d,internalHighScore:0}}function Dr(){const e=[];for(let l=0;l<X;l++){const i=[];for(let o=0;o<z;o++)i.push(ln);e.push(i)}return e}function Ze(e){const l=e.virtualScreen.map(i=>i.map(()=>ln));return{...e,virtualScreen:l}}function b(e,l,i,o,s){const c=Math.floor(i),d=Math.floor(o);if(d<0||d>=X)return e;const u=[...e.virtualScreen],y=[...u[d]];let h=!1;for(let m=0;m<l.length;m++){const p=c+m;p<0||p>=z||(y[p]={char:l[m],attributes:{...s}},h=!0)}return h?(u[d]=y,{...e,virtualScreen:u}):e}function Q(e,l,i,o){const s=Math.floor(z/2-l.length/2);return b(e,l,s,i,o)}function tn(e,l){if(l.length===0)return e;const i=new Set,o=[];for(const d of l){const u=Math.floor(d.y);u>=0&&u<X&&(i.add(u),o.push({...d,y:u}))}if(o.length===0)return e;const s=[...e.virtualScreen],c=new Map;for(const d of i)c.set(d,[...s[d]]);for(const d of o){const u=Math.floor(d.x),y=d.y,h=c.get(y);for(let m=0;m<d.text.length;m++){const p=u+m;p>=0&&p<z&&(h[p]={char:d.text[m],attributes:{...d.attributes}})}}for(const[d,u]of c)s[d]=u;return{...e,virtualScreen:s}}function Ir(e){return tn(e,[{text:`Score: ${e.score}`,x:1,y:0,attributes:{color:"white"}},{text:`Lives: ${e.lives}`,x:31,y:0,attributes:{color:"white"}},{text:"R: Restart",x:1,y:X-1,attributes:{color:"light_black"}}])}function Or(e){const l="Game Over!",i=Math.floor(X/2)-2,o=i+1,s=Pl(e),c=[{text:l,x:Math.floor(z/2-l.length/2),y:i,attributes:{color:"red"}},{text:`Score: ${e.score}`,x:Math.floor(z/2-`Score: ${e.score}`.length/2),y:o,attributes:{color:"white"}}];if(s>0){const y=`High: ${s}`,h=o+1;c.push({text:y,x:Math.floor(z/2-y.length/2),y:h,attributes:{color:"light_cyan"}})}const d=s>0?Math.floor(X/2)+2:Math.floor(X/2)+1,u="Press R to restart";return c.push({text:u,x:Math.floor(z/2-u.length/2),y:d,attributes:{color:"white"}}),tn(e,c)}function xt(e,l){const i=e.score+l;return{...e,score:i,internalHighScore:Math.max(e.internalHighScore,i)}}function Lr(e){const l=e.lives-1,i={...e,lives:l};return l<=0?_r({...i,lives:0}):i}function _r(e){return{...e,gameOverState:!0}}function Rr(e,l,i){!e.isDemoPlay&&e.audioService&&e.audioService.playSoundEffect(l,i)}function J(e,l){!e.isDemoPlay&&e.audioService&&e.audioService.playMml(l)}function zr(e){!e.isDemoPlay&&e.audioService&&e.audioService.startPlayingBgm()}function Xr(e){!e.isDemoPlay&&e.audioService&&e.audioService.stopPlayingBgm()}function Pl(e){return e.internalHighScore}function Gr(e){return e.score}function ye(e){return e.gameOverState}function Nr(e){return e.virtualScreen}function ki(e,l,i){let o={...e,gameTickCounter:e.gameTickCounter+1};return ye(o)&&l.r&&(o=i.initializeGame(o)),o=Ze(o),ye(o)?o=Or(o):o=i.updateGame(o,l),o=Ir(o),o}function Yr(){const e=keyboard.code;return{up:e.ArrowUp.isPressed||e.KeyW.isPressed,down:e.ArrowDown.isPressed||e.KeyS.isPressed,left:e.ArrowLeft.isPressed||e.KeyA.isPressed,right:e.ArrowRight.isPressed||e.KeyD.isPressed,action1:e.KeyX.isPressed||e.Slash.isPressed||e.Space.isPressed,action2:e.KeyZ.isPressed||e.Period.isPressed||e.Enter.isPressed,enter:e.Enter.isPressed,space:e.Space.isPressed,escape:e.Escape.isPressed,r:e.KeyR.isPressed,period:e.Period.isPressed,slash:e.Slash.isPressed}}function Hr(e,l,i,o,s){for(let c=0;c<i;c++)for(let d=0;d<l;d++){const u=e[c][d],y=d*o+o/2,h=c*s+s/2;if(u.char!==" "){let m=u.attributes.color||"white";m==="black"?m="white":m==="white"&&(m="black"),text(u.char,y,h,{color:m,backgroundColor:u.attributes.backgroundColor||"transparent",isSmallText:!0})}}}function Br(e=z,l=X,i=4,o=6){return{viewSize:{x:e*i,y:l*o},isSoundEnabled:!1,isShowingScore:!1,theme:"dark"}}function Ur(e,l,i,o=z,s=X,c=4,d=6,u=!0){let y,h;function m(){const E=e({isBrowserEnvironment:!0,gameName:l,enableHighScoreStorage:i===!0});if(y=E.state,h=E.operations,i&&l){const A=$r(l);y.internalHighScore!==void 0&&(y.internalHighScore=Math.max(y.internalHighScore,A))}y=h.initializeGame(y)}function p(){(!y||!h)&&m();const E=Yr(),A=ye(y);u&&E.r&&keyboard.code.KeyR.isJustPressed?ye(y)?h.updateGame&&typeof h.updateGame=="function"?y=h.updateGame(y,E):y=ki(y,E,h):(console.log("[browserHelper] Global R pressed, reinitializing game via reinitializeGame()."),m()):h.updateGame&&typeof h.updateGame=="function"?y=h.updateGame(y,E):y=ki(y,E,h),!A&&ye(y)&&i&&l&&y.internalHighScore!==void 0&&jr(l,y.internalHighScore);const I=Nr(y);Hr(I,o,s,c,d)}return{gameUpdate:p}}function nn(e){return`abagames-vgct-${e}`}function $r(e){try{const l=nn(e),i=localStorage.getItem(l);if(i){const o=parseInt(i,10);if(!isNaN(o))return o}}catch(l){console.error(`Failed to retrieve high score from localStorage for ${e}:`,l)}return 0}function jr(e,l){try{const i=nn(e);localStorage.setItem(i,l.toString()),console.log(`[${e}] High score saved to storage: ${l}`)}catch(i){console.error(`Failed to save high score to localStorage for ${e}:`,i)}}function Wr(e,l={},i,o){const c={...Br(),...i},{gameUpdate:d}=Ur(e,l.gameName,l.enableHighScoreStorage===!0,z,X,4,6,l.enableGlobalReset===!0);init({update:d,options:c,audioFiles:o}),l.audioQuantize&&sss.setQuantize(l.audioQuantize)}function Vr(e,l){play(e,{seed:l})}function Di(e){sss.playMml(e,{isLooping:!1})}function Kr(){playBgm()}function Jr(){stopBgm()}function qr(e,l,i){return o=>{const s={...i?{audioService:i()}:{},...o};return{state:e(s),operations:l}}}function Zr(e,l,i,o){return qr(e,{initializeGame:l,updateGame:i},o)}function Qr(e){const l=Zr(e.createState,e.initializeGame,e.updateGame,e.defaultAudioService);Wr(l,e.gameSettings,e.cglOptions,e.audioFiles)}function es(e,l){Vr(e,l)}function ls(e){Di(typeof e=="string"?[e]:e)}function ts(){Kr()}function is(){Jr()}function ns(){return{playSoundEffect:es,playMml:ls,startPlayingBgm:ts,stopPlayingBgm:is}}const Ii=[`
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

`],wt=4,on=5;function os(e){let l=-1;for(let o=e.length-1;o>=0;o--)if(e[o].includes("l")){l=o;break}return l===-1?0:on-1-l}function rs(e){const i=e.charCodeAt(0)-33;if(i<0||i>=Ii.length)return null;const o=Ii[i];if(!o)return null;const c=o.trim().split(`
`),d=[];for(let u=0;u<on;u++)d.push(c[u]||"");return d}function ss(e,l,i,o,s,c){let d=i;for(const u of l){if(u===" "){d+=wt;continue}const y=rs(u);if(!y){console.warn(`[drawLargeText] No pattern found for character: '${u}' (ASCII: ${u.charCodeAt(0)})`),d+=wt;continue}const h=os(y);for(let m=0;m<y.length;m++){const p=y[m];for(let E=0;E<p.length;E++)p[E]==="l"&&e(s,d+E,o+m+h,c)}d+=wt}}const as=8,q={FLAG_COLLECT:"@coin@s128 v60 l16 o6 c e",SPECIAL_FLAG_COLLECT:["@synth@s456 v80 l16 o6 c e g >c e g >c<","@synth@s789 v50 l8 o5 c g c g"],SPECIAL_FLAG_SPAWN:["@synth@s123 v70 l16 o6 g a b >c d d e e<","@synth@s456 v50 l8 o4 c e g c e g","@hit@d@s789 v40 l16 o4 c r c r c"],SMOKE_ACTIVATED:"@hit@s33 v80 l16 o4 c>c<c>c<c>c<",ENEMY_SMOKE_HIT:"@hit@s46 v80 l16 o5 c d e f g f e d c",ENEMY_COLLISION:"@hit@s55 v70 l16 o5 c c+ d d+ e",ENEMY_SPAWN_WARNING:"@synth@s65 v50 l16 o5 c+ r c+ r c+ r",ENEMY_DESTRUCTION_BONUS:"@laser@s99 v60 l16 o3 a8 r a a",MAZE_TRANSITION_START:["@synth@s111 v60 l16 o4 c g >c< g c","@hit@d@s223 v60 l16 o4 c r c r c r"],FUEL_WARNING:"@synth@s555 v70 l16 o5 c+ r c+ r c+ r c+ r",FUEL_CRITICAL:"@laser@s666 v60 l16 o6 c r",EXTRA_LIFE_JINGLE:["@synth@s775 v80 l16 o5 c e g >c e g >c<","@synth@s886 v70 l8 o4 c g c"],FUEL_REFILL:"@synth@s999 v40 l16 o5 c d e f g a b >c<"};function cs(e={}){const{movementInterval:l=as,...i}=e,o=kr({...i,initialLives:3}),s=z-2,c=X-4,d=1,u=2;return{...o,playerX:d,playerY:u,movementFrameCounter:0,movementInterval:l,maze:[],mazeWidth:s,mazeHeight:c,direction:0,flags:[],specialFlags:[],hasCollectedAllLeftFlags:!1,hasCollectedAllRightFlags:!1,enemies:[],nextEnemyId:0,smokeTrailActive:!1,smokeTrailRemainingMoves:0,smokeTrails:[],mazeTransitionActive:!1,transitionLineX:0,transitionDirection:"left",transitionTimer:0,previousInputState:{},destructionBonusCounter:0,scoreDisplays:[],difficulty:0,enemyAppearanceCount:0,rocks:[],fuel:100,maxFuel:100,fuelConsumptionMove:.25,fuelConsumptionSmoke:3,fuelRefillAmount:50,isMissAnimation:!1,missAnimationTimer:0,missAnimationFrame:0,explosionX:0,explosionY:0,initialPlayerX:d,initialPlayerY:u,lastVerticalMovement:-1,lastHorizontalMovement:-1,nextLifeThreshold:1e3,lifeThresholdIndex:0}}function fs(e,l){const i=Array(l).fill(null).map(()=>Array(e).fill(!0)),o=Math.floor(e/2),s=Tt(o,l),c=Et(s);for(let d=0;d<l;d++)for(let u=0;u<o;u++)i[d][u]=c[d][u];for(let d=0;d<l;d++)for(let u=0;u<o;u++){const y=e-1-u;i[d][y]=i[d][u]}if(e%2===1){const d=Math.floor(e/2);for(let u=1;u<l-1;u+=2)i[u][d]=!1}return i}function Tt(e,l){const i=Array(l).fill(null).map(()=>Array(e).fill(!0)),o=Array(l).fill(null).map(()=>Array(e).fill(!1));function s(c,d){o[d][c]=!0,i[d][c]=!1;const u=[[0,-2],[0,2],[-2,0],[2,0]].sort(()=>Math.random()-.5);for(const[y,h]of u){const m=c+y,p=d+h;m>=0&&m<e&&p>=0&&p<l&&!o[p][m]&&(i[d+h/2][c+y/2]=!1,s(m,p))}}return s(0,0),i}function Et(e){const l=e.length,i=e[0].length,o=e.map(d=>[...d]);function s(d,u){if(o[u][d])return!1;const y=[[0,-1],[0,1],[-1,0],[1,0]];let h=0;for(const[m,p]of y){const E=d+m,A=u+p;E>=0&&E<i&&A>=0&&A<l&&(o[A][E]||h++)}return h<=1||h===2&&Math.random()<.2}function c(d,u){const h=[[0,-1],[0,1],[-1,0],[1,0]].sort(()=>Math.random());for(const[m,p]of h){const E=d+m,A=u+p,I=E+m,_=A+p;if(I>=0&&I<i&&_>=0&&_<l&&o[A][E]&&!o[_][I]){o[A][E]=!1;return}}}for(let d=0;d<l;d+=2)for(let u=0;u<i;u+=2)s(u,d)&&c(u,d);return o}function us(e,l,i){const o=Ct(e,l,i,"left"),s=[];for(const c of o){const d=l-c.x-1;s.push({x:d,y:c.y})}return[...o,...s]}function Ct(e,l,i,o){const s=[],c=Math.floor(l/2),d=3,u=o==="left"?0:c+2,y=o==="left"?c-2:l,h=[];for(let A=0;A<i;A+=2)for(let I=u;I<y;I+=2)e[A][I]||h.push({x:I,y:A});const p=h.filter(A=>Math.abs(A.x-0)+Math.abs(A.y-0)>3).sort(()=>Math.random()-.5),E=p.slice(0,Math.min(d,p.length));for(const A of E)s.push({x:A.x,y:A.y});return s}function Oi(e,l,i,o,s=[]){const c=Math.floor(l/2),d=o==="left"?0:c+2,u=o==="left"?c-2:l,y=[];for(let E=0;E<i;E+=2)for(let A=d;A<u;A+=2)e[E][A]||y.push({x:A,y:E});const h=y.filter(E=>!s.some(A=>A.x===E.x&&A.y===E.y)),m=Math.floor(i/2),p=h.filter(E=>Math.abs(E.y-m)<i/3).sort(()=>Math.random()-.5);if(p.length>0){const E=p[0];return{x:E.x,y:E.y}}return null}function bt(e,l,i,o){const s=[],c=Math.floor(o);if(c<=0)return s;const d=[];for(let h=0;h<i;h++)for(let m=0;m<l;m++)h%2===0&&m%2===0||h%2===1&&m%2===1||e[h][m]&&(h>0&&h<i-1&&e[h-1][m]&&e[h+1][m]||m>0&&m<l-1&&e[h][m-1]&&e[h][m+1])&&d.push({x:m,y:h});const u=d.sort(()=>Math.random()-.5),y=u.slice(0,Math.min(c,u.length));for(const h of y)s.push({x:h.x,y:h.y}),e[h.y][h.x]=!1;return s}function ds(e,l,i,o){if(o<=0)return e;const s=3,c=[];for(let h=-3;h<=s;h++)for(let m=-3;m<=s;m++){const p=l+m,E=i+h;if(p>=0&&p<e.mazeWidth&&E>=0&&E<e.mazeHeight&&!e.maze[E][p]&&!e.rocks.some(I=>I.x===p&&I.y===E)){const I=e.playerX-1,_=e.playerY-2;Math.abs(p-I)+Math.abs(E-_)>=2&&c.push({x:p,y:E})}}if(c.length===0)return e;let d=e;const u=[];for(let h=0;h<o;h++){const m=c[Math.floor(Math.random()*c.length)],p=Math.floor(Math.random()*4),E={x:m.x+1,y:m.y+2,direction:p,movementCounter:0,id:d.nextEnemyId+h,previousDirection:p,stuckCounter:0,isSpawning:!0,spawnTimer:Math.floor(Math.random()*30)+h*15,blinkState:!0,isStunned:!1,stunnedTimer:0,stunnedRotationDirection:Math.floor(Math.random()*2),originalDirection:p,isFrozen:!1};u.push(E)}const y={...d,enemies:[...d.enemies,...u],nextEnemyId:d.nextEnemyId+o};return o>0&&J(y,q.ENEMY_SPAWN_WARNING),y}function Li(e,l){const i=e.maze.map(s=>[...s]),o=Math.floor(e.mazeWidth/2);if(l==="left"){const s=Tt(o,e.mazeHeight),c=Et(s);for(let m=0;m<e.mazeHeight;m++)for(let p=0;p<o;p++)i[m][p]=c[m][p];const d=e.flags.filter(m=>m.x>=o),y=[...Ct(i,e.mazeWidth,e.mazeHeight,"left"),...d];for(const m of e.specialFlags)i[m.y][m.x]=!1;const h=bt(i,e.mazeWidth,e.mazeHeight,e.difficulty);return{...e,maze:i,flags:y,specialFlags:e.specialFlags,hasCollectedAllLeftFlags:!1,rocks:h}}else{const s=Tt(o,e.mazeHeight),c=Et(s);for(let m=0;m<e.mazeHeight;m++)for(let p=0;p<o;p++){const E=e.mazeWidth-1-p;i[m][E]=c[m][p]}const d=e.flags.filter(m=>m.x<o),u=Ct(i,e.mazeWidth,e.mazeHeight,"right"),y=[...d,...u];for(const m of e.specialFlags)i[m.y][m.x]=!1;const h=bt(i,e.mazeWidth,e.mazeHeight,e.difficulty);return{...e,maze:i,flags:y,specialFlags:e.specialFlags,hasCollectedAllRightFlags:!1,rocks:h}}}function vt(e){let o={...e,score:0,lives:3,gameOverState:!1,playerX:1,playerY:2,movementFrameCounter:0,direction:1,nextEnemyId:0,smokeTrailActive:!1,smokeTrailRemainingMoves:0,smokeTrails:[],mazeTransitionActive:!1,transitionLineX:0,transitionDirection:"left",transitionTimer:0,previousInputState:{action1:!0,action2:!0},destructionBonusCounter:0,scoreDisplays:[],difficulty:0,enemyAppearanceCount:1,rocks:[],fuel:100,maxFuel:100,fuelConsumptionMove:.2,fuelConsumptionSmoke:5,fuelRefillAmount:50,nextLifeThreshold:1e3,lifeThresholdIndex:0},s=fs(o.mazeWidth,o.mazeHeight);const c=us(s,o.mazeWidth,o.mazeHeight),d=bt(s,o.mazeWidth,o.mazeHeight,o.difficulty);return{...o,maze:s,flags:c,specialFlags:[],hasCollectedAllLeftFlags:!1,hasCollectedAllRightFlags:!1,enemies:[],rocks:d}}function ms(e){let l=e;const i=1,o=2,s=5,c=e.playerX-i,d=e.playerY-o;for(let u=0;u<e.mazeHeight;u++)for(let y=0;y<e.mazeWidth;y++){const h=Math.abs(y-c),m=Math.abs(u-d);if(h<=s&&m<=s){const p=e.maze[u][y]?"O":" ",E=e.maze[u][y]?"light_cyan":"black";l=b(l,p,y+i,u+o,{entityType:e.maze[u][y]?"wall":"path",isPassable:!e.maze[u][y],color:E})}}return l}function gs(e){let l=e;const i="#",o={entityType:"wall",isPassable:!1,color:"light_green"},s=5;for(let c=0;c<z;c++){const d=Math.abs(c-e.playerX),u=Math.abs(1-e.playerY),y=Math.abs(X-2-e.playerY);d<=s&&u<=s&&(l=b(l,i,c,1,o)),d<=s&&y<=s&&(l=b(l,i,c,X-2,o))}for(let c=2;c<X-2;c++){const d=Math.abs(0-e.playerX),u=Math.abs(z-1-e.playerX),y=Math.abs(c-e.playerY);d<=s&&y<=s&&(l=b(l,i,0,c,o)),u<=s&&y<=s&&(l=b(l,i,z-1,c,o))}return l}function hs(e){let l=e;for(const i of l.flags)l=b(l,"F",i.x+1,i.y+2,{color:"yellow"});return l}function ys(e){let l=e;for(const i of e.specialFlags)l=b(l,"S",i.x+1,i.y+2,{entityType:"special_flag",isPassable:!0,color:"cyan"});return l}function ps(e){let l=e;const i=5;for(const o of e.rocks){const s=o.x+1,c=o.y+2,d=Math.abs(s-e.playerX),u=Math.abs(c-e.playerY);d<=i&&u<=i&&(l=b(l,"*",s,c,{entityType:"rock",isPassable:!1,color:"red"}))}return l}function Ss(e){if(e.isMissAnimation)return Is(e);const i=["^",">","v","<"][e.direction];return b(e,i,e.playerX,e.playerY,{entityType:"player",isPassable:!0,color:"cyan"})}function ws(e){let l=e;const i=["^",">","v","<"];for(const o of e.enemies){if(o.isFrozen){l=b(l,"X",o.x,o.y,{entityType:"enemy_frozen",isPassable:!0,color:"light_red"});continue}if(o.isSpawning){if(Math.floor(o.spawnTimer/8)%2===0){const c=i[o.direction];l=b(l,c,o.x,o.y,{entityType:"enemy_spawning",isPassable:!0,color:"red"})}}else if(o.isStunned){if(Math.floor(o.stunnedTimer/8)%2===0){const c=i[o.direction];l=b(l,c,o.x,o.y,{entityType:"enemy_stunned",isPassable:!0,color:"red"})}}else{const s=i[o.direction];l=b(l,s,o.x,o.y,{entityType:"enemy",isPassable:!0,color:"red"})}}return l}function xs(e){let l=e;const i=5;for(const o of e.smokeTrails){const s=Math.abs(o.x-e.playerX),c=Math.abs(o.y-e.playerY);s<=i&&c<=i&&(o.timer>40?l=b(l,"*",o.x,o.y,{entityType:"smoke_heavy",isPassable:!0,color:"white"}):o.timer>20?l=b(l,".",o.x,o.y,{entityType:"smoke_medium",isPassable:!0,color:"white"}):l=b(l,"o",o.x,o.y,{entityType:"smoke_light",isPassable:!0,color:"white"}))}return l}function Ts(e){if(!e.mazeTransitionActive)return e;let l=e;for(let i=2;i<X-2;i++)l=b(l,"|",e.transitionLineX,i,{entityType:"transition_line",isPassable:!0,color:"yellow"});return l}function Es(e){let l=e;const i=X-1,o=2,s=20;l=b(l,"FUEL:",0,i,{color:"white"}),l=b(l,"[",o-1,i,{color:"white"}),l=b(l,"]",o+s,i,{color:"white"});const d=Math.max(0,e.fuel)/e.maxFuel,u=Math.floor(d*s);for(let h=0;h<s;h++){let m=" ",p="light_black";h<u&&(m="=",d>.6?p="green":d>.3?p="yellow":p="red"),l=b(l,m,o+h,i,{color:p})}const y=`${Math.max(0,Math.floor(e.fuel))}`;return l=b(l,y,o+s+2,i,{color:"white"}),e.fuel<=0&&(l=b(l,"LOW SPEED!",o+s+6,i,{color:"red"})),l}function qe(e,l,i){if(l<=0||l>=z-1||i<=1||i>=X-2||i<2)return!1;const o=l-1,s=i-2;return!(o<0||o>=e.mazeWidth||s<0||s>=e.mazeHeight||e.maze[s][o])}function Ke(e,l,i){if(!qe(e,l,i))return!1;const o=l-1,s=i-2;return!e.rocks.some(d=>d.x===o&&d.y===s)}function he(e,l,i){switch(i){case 0:return{x:e,y:l-1};case 1:return{x:e+1,y:l};case 2:return{x:e,y:l+1};case 3:return{x:e-1,y:l};default:return{x:e,y:l}}}function Cs(e){return(e+1)%4}function bs(e){return(e+3)%4}function _i(e){return(e+2)%4}function Ms(e,l,i){const o=[];return e===1||e===3?(l===0?o.push(0):l===2&&o.push(2),l!==0&&o.push(0),l!==2&&o.push(2),o.push(_i(e))):(e===0||e===2)&&(i===1?o.push(1):i===3&&o.push(3),i!==1&&o.push(1),i!==3&&o.push(3),o.push(_i(e))),[...new Set(o)]}function vs(e,l,i,o,s){let c=e;if(l.up?c=0:l.down?c=2:l.right?c=1:l.left&&(c=3),c!==e){const d=he(i,o,c);return qe(s,d.x,d.y)?c:e}return e}function Ps(e,l){let i={...e};return l===0||l===2?i.lastVerticalMovement=l:(l===1||l===3)&&(i.lastHorizontalMovement=l),i}function rn(e){return(e+2)%4}function As(e,l){return l.smokeTrails.some(i=>i.x===e.x&&i.y===e.y)}function Fs(e,l){return l.some(i=>i.id!==e.id&&i.x===e.x&&i.y===e.y&&!i.isSpawning&&!i.isStunned)}function Ri(e){return{...e,isStunned:!0,stunnedTimer:0,originalDirection:e.direction,stunnedRotationDirection:Math.floor(Math.random()*2)}}function ks(e,l){if(e.isSpawning)return e;const i=l.playerX-e.x,o=l.playerY-e.y,s=rn(e.previousDirection);let c=e.direction;if(Math.abs(i)>Math.abs(o)?c=i>0?1:3:c=o>0?2:0,c!==s){const m=he(e.x,e.y,c);if(Ke(l,m.x,m.y))return{...e,direction:c,x:m.x,y:m.y,previousDirection:c,stuckCounter:0}}if(e.direction!==s){const m=he(e.x,e.y,e.direction);if(Ke(l,m.x,m.y))return{...e,x:m.x,y:m.y,previousDirection:e.direction,stuckCounter:0}}const y=[0,1,2,3].filter(m=>m!==s&&m!==c&&m!==e.direction).sort(()=>Math.random()-.5);for(const m of y){const p=he(e.x,e.y,m);if(Ke(l,p.x,p.y))return{...e,direction:m,x:p.x,y:p.y,previousDirection:m,stuckCounter:0}}const h=e.stuckCounter+1;if(h>3){const m=he(e.x,e.y,s);if(Ke(l,m.x,m.y))return{...e,direction:s,x:m.x,y:m.y,previousDirection:s,stuckCounter:0}}return{...e,stuckCounter:h}}function sn(e){const l={...e,isMissAnimation:!0,missAnimationTimer:90,missAnimationFrame:0,explosionX:e.playerX,explosionY:e.playerY};return Rr(l,"explosion",e.playerX+e.playerY),l}function Ds(e){if(!e.isMissAnimation)return e;let l={...e};return l.missAnimationTimer=Math.max(0,l.missAnimationTimer-1),l.missAnimationFrame=l.missAnimationFrame+1,l.missAnimationTimer<=0&&(l=Lr(l),l={...l,playerX:l.initialPlayerX,playerY:l.initialPlayerY,direction:0,enemies:[],nextEnemyId:0,smokeTrails:[],smokeTrailActive:!1,smokeTrailRemainingMoves:0,fuel:l.maxFuel,isMissAnimation:!1,missAnimationTimer:0,missAnimationFrame:0}),l}function Is(e){let l=e;const i=Math.floor(e.missAnimationFrame/6),o=e.explosionX,s=e.explosionY;switch(i%4){case 0:l=b(l,"*",o,s,{entityType:"explosion",isPassable:!0,color:"red"});break;case 1:l=b(l,"*",o,s,{entityType:"explosion",isPassable:!0,color:"yellow"});const c=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];for(const y of c){const h=o+y.x,m=s+y.y;h>=0&&h<40&&m>=0&&m<25&&(l=b(l,"+",h,m,{entityType:"explosion",isPassable:!0,color:"yellow"}))}break;case 2:l=b(l,"X",o,s,{entityType:"explosion",isPassable:!0,color:"white"});const d=[{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}];for(const y of d){const h=o+y.x,m=s+y.y;h>=0&&h<40&&m>=0&&m<25&&(l=b(l,"o",h,m,{entityType:"explosion",isPassable:!0,color:"white"}))}break;case 3:l=b(l,".",o,s,{entityType:"explosion",isPassable:!0,color:"light_black"});const u=[{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}];for(const y of u){const h=o+y.x,m=s+y.y;h>=0&&h<40&&m>=0&&m<25&&(l=b(l,".",h,m,{entityType:"explosion",isPassable:!0,color:"light_black"}))}break}return l}function Os(e){let l=e;if(e.isMissAnimation)return l;const i=e.enemies.map(o=>{if(o.isFrozen)return o;if(o.isSpawning){const c=o.spawnTimer+1;return c>=120?{...o,isSpawning:!1,spawnTimer:0,blinkState:!1,movementCounter:0}:{...o,spawnTimer:c,blinkState:Math.floor(c/8)%2===0}}if(o.isStunned){const c=o.stunnedTimer+1;if(c>=180){const u=rn(o.originalDirection),y=he(o.x,o.y,u);let h=o.x,m=o.y;return Ke(l,y.x,y.y)&&(h=y.x,m=y.y),{...o,isStunned:!1,stunnedTimer:0,direction:u,previousDirection:u,movementCounter:0,x:h,y:m}}else{let u=o.direction;return c%15===0&&(o.stunnedRotationDirection===0?u=Cs(o.direction):u=bs(o.direction)),{...o,stunnedTimer:c,direction:u,blinkState:Math.floor(c/8)%2===0}}}if(As(o,l))return l={...l,smokeTrails:l.smokeTrails.filter(c=>!(c.x===o.x&&c.y===o.y))},J(l,q.ENEMY_SMOKE_HIT),Ri(o);if(Fs(o,e.enemies))return J(l,q.ENEMY_COLLISION),Ri(o);const s={...o,movementCounter:o.movementCounter+1};return s.movementCounter>=e.movementInterval+2?(s.movementCounter=0,ks(s,l)):s});return{...l,enemies:i}}function Ls(e){if(e.isMissAnimation)return e;for(const l of e.enemies)if(!(l.isSpawning||l.isStunned||l.isFrozen)&&l.x===e.playerX&&l.y===e.playerY)return sn(e);return e}function _s(e){if(e.isMissAnimation)return e;const l=e.playerX-1,i=e.playerY-2;return e.rocks.some(s=>s.x===l&&s.y===i)?sn(e):e}function Rs(e){const l=e.playerX-1,i=e.playerY-2,o=e.specialFlags.findIndex(c=>c.x===l&&c.y===i);if(o!==-1){const c=[...e.specialFlags],d=c.splice(o,1)[0];let u=xt(e,30);u={...u,specialFlags:c},J(u,[...q.SPECIAL_FLAG_COLLECT]);const y=Math.min(u.fuel+u.fuelRefillAmount,u.maxFuel);u={...u,fuel:y},J(u,q.FUEL_REFILL);const h=Math.floor(e.mazeWidth/2);return d.x>=h?(u=zi(u,"left"),u=Xi(u,"left"),u=Li(u,"left")):(u=zi(u,"right"),u=Xi(u,"right"),u=Li(u,"right")),u}const s=e.flags.findIndex(c=>c.x===l&&c.y===i);if(s!==-1){const c=[...e.flags],d=c.splice(s,1)[0];let u=xt(e,10);u={...u,flags:c},J(u,q.FLAG_COLLECT);let y=u.enemyAppearanceCount;u.enemies.length===0&&(y=1);const h=y+Math.sqrt(u.difficulty),m=Math.floor(h),p=h-m;m>0&&(u=ds(u,d.x,d.y,m)),u={...u,enemyAppearanceCount:p};const E=Math.floor(e.mazeWidth/2),A=c.filter(_=>_.x<E),I=c.filter(_=>_.x>=E);if(A.length===0&&!e.hasCollectedAllLeftFlags){const _=Oi(e.maze,e.mazeWidth,e.mazeHeight,"right",[...c,...e.specialFlags]),Ee=_?[...e.specialFlags,_]:e.specialFlags;u={...u,specialFlags:Ee,hasCollectedAllLeftFlags:!0},_&&J(u,[...q.SPECIAL_FLAG_SPAWN])}else if(I.length===0&&!e.hasCollectedAllRightFlags){const _=Oi(e.maze,e.mazeWidth,e.mazeHeight,"left",[...c,...e.specialFlags]),Ee=_?[...e.specialFlags,_]:e.specialFlags;u={...u,specialFlags:Ee,hasCollectedAllRightFlags:!0},_&&J(u,[...q.SPECIAL_FLAG_SPAWN])}return u}return e}function zs(e){const i=e.smokeTrails.map(o=>({...o,timer:Math.max(o.timer-1,1)})).filter(o=>{const s=Math.abs(o.x-e.playerX),c=Math.abs(o.y-e.playerY);return s<=5&&c<=5});return{...e,smokeTrails:i}}function Xs(e,l,i){const o={x:l,y:i,timer:60};return{...e,smokeTrails:[...e.smokeTrails,o]}}function zi(e,l){const i=Math.floor(z/2),o={...e,mazeTransitionActive:!0,transitionLineX:i,transitionDirection:l,transitionTimer:0,destructionBonusCounter:0};return J(o,[...q.MAZE_TRANSITION_START]),o}function Xi(e,l){Math.floor(e.mazeWidth/2);const i=Math.floor(z/2),o=e.enemies.map(s=>(l==="left"?s.x<i:s.x>i)?{...s,isFrozen:!0}:s);return{...e,enemies:o}}function Gs(e){if(!e.mazeTransitionActive)return e;const l=e.transitionTimer+1,i=30;if(l>=i){const h=e.enemies.filter(m=>!m.isFrozen);return{...e,mazeTransitionActive:!1,transitionTimer:0,enemies:h,destructionBonusCounter:0}}const o=Math.floor(z/2),s=l/i;let c=o;if(e.transitionDirection==="left")c=Math.floor(o-(o-1)*s);else{const h=z-2;c=Math.floor(o+(h-o)*s)}let d=e,u=e.destructionBonusCounter;const y=e.enemies.filter(h=>{if(!h.isFrozen)return!0;let m=!1;if(e.transitionDirection==="left"?m=h.x>=c:m=h.x<=c,m){const p=Hs(u);return d=xt(d,p),d=Bs(d,h.x,h.y,p),J(d,q.ENEMY_DESTRUCTION_BONUS),u++,!1}return!0});return{...d,transitionLineX:c,transitionTimer:l,enemies:y,destructionBonusCounter:u}}function Ns(e){let l=e;for(const i of e.scoreDisplays){const o=`+${i.score}`;l=b(l,o,i.x,i.y,{entityType:"score_display",isPassable:!0,color:"yellow"})}return l}function Ys(e){const l=e.scoreDisplays.map(i=>({...i,timer:i.timer-1})).filter(i=>i.timer>0);return{...e,scoreDisplays:l}}function Hs(e){const l=[100,200,400,800,1600,3200,6400,9890];return e>=l.length?9890:l[e]}function Bs(e,l,i,o){const s={x:l,y:i,score:o,timer:120};return{...e,scoreDisplays:[...e.scoreDisplays,s]}}function Us(e){const i=e.difficulty+.0002777777777777778;return{...e,difficulty:i}}function $s(e){const l=[1,2,3,5,8,13,21,34,55,89,144,233];return e>=l.length?l[l.length-1]*1e3:l[e]*1e3}function js(e){if(e.lives>=5)return e;if(e.score>=e.nextLifeThreshold){const i=Math.min(e.lives+1,5),o=e.lifeThresholdIndex+1,s=$s(o),c={...e,lives:i,nextLifeThreshold:s,lifeThresholdIndex:o};return J(c,[...q.EXTRA_LIFE_JINGLE]),c}return e}function Gi(e){const i=Math.min(e.lives-1,4);if(i>0){const o=Math.floor((z-i*2)/2);let s=e;for(let c=0;c<i;c++)s=b(s,">",o+c*2,0,{color:"cyan"});return s}return e}function Ni(e){let l=e;const i=`Score: ${e.score}`;l=b(l,i,1,0,{color:"white"});const s=`HI ${Pl(e)}`;return l=b(l,s,z-s.length-1,0,{color:"yellow"}),l=b(l,"R: Restart",1,X-1,{color:"light_black"}),l}function Ws(e){const l="Game Over!",i=Math.floor(X/2)-2,o=i+1;let s=e;s=Q(s,l,i,{color:"red"});const c=`Score: ${e.score}`;s=Q(s,c,o,{color:"white"});const d=Math.max(e.score,e.internalHighScore);if(d>0){const u=`High: ${d}`,y=o+1;s=Q(s,u,y,{color:"light_cyan"})}return s}function an(e,l){if(ye(e)){let c=Ze(e);return c=Ws(c),c=Ni(c),c=Gi(c),c}let i=Ze(e);i=Us(i),i=js(i);const o=l.action1&&!e.previousInputState.action1,s=l.action2&&!e.previousInputState.action2;if((o||s)&&i.fuel>=i.fuelConsumptionSmoke&&(i={...i,smokeTrailActive:!0,smokeTrailRemainingMoves:3,fuel:i.fuel-i.fuelConsumptionSmoke},J(i,q.SMOKE_ACTIVATED)),i=Ni(i),i=Gi(i),i=gs(i),i=ms(i),i=hs(i),i=ys(i),i=ps(i),i=xs(i),i=ws(i),i=Os(i),i=zs(i),i=Ds(i),i=Ys(i),i=Gs(i),i=Ts(i),i=Ns(i),i=Es(i),!i.isMissAnimation){i.movementFrameCounter++;const c=i.fuel<=0?i.movementInterval*2:i.movementInterval;if(i.movementFrameCounter>=c){i.movementFrameCounter=0,i={...i,direction:vs(i.direction,l,i.playerX,i.playerY,i)};let d=he(i.playerX,i.playerY,i.direction);if(!qe(i,d.x,d.y)){const u=i.direction,y=Ms(u,i.lastVerticalMovement,i.lastHorizontalMovement);for(const h of y){const m=he(i.playerX,i.playerY,h);if(qe(i,m.x,m.y)){i={...i,direction:h},d=m;break}}}if(qe(i,d.x,d.y)){i.smokeTrailActive&&i.smokeTrailRemainingMoves>0&&(i=Xs(i,i.playerX,i.playerY),i={...i,smokeTrailRemainingMoves:i.smokeTrailRemainingMoves-1},i.smokeTrailRemainingMoves<=0&&(i={...i,smokeTrailActive:!1}));const u=Math.max(0,i.fuel-i.fuelConsumptionMove);i={...i,playerX:d.x,playerY:d.y,fuel:u},i=Ps(i,i.direction),i=Rs(i)}}}return i=Ls(i),i=_s(i),i=Ss(i),i.isMissAnimation||(i.fuel<=i.maxFuel*.2&&i.fuel>0?i.movementFrameCounter%120===0&&J(i,q.FUEL_WARNING):i.fuel<=0&&i.movementFrameCounter%180===0&&J(i,q.FUEL_CRITICAL)),i={...i,previousInputState:l},i}const el=0,cn=1,Pt=2,Yi=3,fn=300,Vs=60,Ks=30,Js=900,un=20,Al=0,Hi=1,Mt=2,Bi=3,Qe=12,Ui=4,$i=120,qs=180,Zs=120,j=16,vl=8,Je=32,At=10,dn=28,Ft=30,mn=12,Fl=0,ji=1,Wi=2,Vi=3,Ki=4,Ji=5,qi=6,Zi=7,Qi=8,en=9;function Qs(e={}){const{startInPlayingState:l=!1,...i}=e;let o=cs({...i,gameName:"Labyracer"});return l&&(o=vt(o)),{...o,gameFlowState:l?Pt:el,titleAnimationTimer:0,blinkTimer:0,showStartMessage:!0,gameOverTimer:0,lastScore:0,demoPlayTimer:0,isDemoPlay:!1,titleToDemoTimer:0,demoCurrentInput:{action1:!1,action2:!1,space:!1,enter:!1},demoInputCooldown:0,gameTickCounter:0,titlePhase:Al,titleY:Qe,titleMoveTimer:0,postDemoWaitTimer:0,demonstrationPhase:Fl,demonstrationTimer:0,demoCarX:At,demoCarDirection:1,demoFlagVisible:!0,demoEnemyVisible:!1,demoEnemyX:Ft,demoEnemyDirection:1,demoSpecialFlagVisible:!1,demoTransitionActive:!1,demoTransitionLineX:0,demoScoreEffectVisible:!1,demoScoreEffectTimer:0,demoScoreEffectX:0,demoScoreEffectY:0,demoSmokeTrails:[],demoSmokeCount:0,demoEnemyStunned:!1,demoEnemyStunnedTimer:0,demoEnemyStunnedDirection:1,demonstrationCompleted:!1}}function gn(e){return{...e,gameFlowState:el,titleAnimationTimer:0,blinkTimer:0,showStartMessage:!0,gameOverTimer:0,demoPlayTimer:0,isDemoPlay:!1,titleToDemoTimer:0,demoCurrentInput:{action1:!1,action2:!1,space:!1,enter:!1},demoInputCooldown:0,gameTickCounter:0,titlePhase:Al,titleY:Qe,titleMoveTimer:0,postDemoWaitTimer:0,demonstrationPhase:Fl,demonstrationTimer:0,demoCarX:At,demoCarDirection:1,demoFlagVisible:!0,demoEnemyVisible:!1,demoEnemyX:Ft,demoEnemyDirection:1,demoSpecialFlagVisible:!1,demoTransitionActive:!1,demoTransitionLineX:0,demoScoreEffectVisible:!1,demoScoreEffectTimer:0,demoScoreEffectX:0,demoScoreEffectY:0,demoSmokeTrails:[],demoSmokeCount:0,demoEnemyStunned:!1,demoEnemyStunnedTimer:0,demoEnemyStunnedDirection:1,demonstrationCompleted:!1}}function ea(e,l){if(l.action1||l.action2||l.space||l.enter)return kt(e);let i={...e};switch(i.titleAnimationTimer++,i.blinkTimer++,i.blinkTimer>=Ks&&(i.showStartMessage=!i.showStartMessage,i.blinkTimer=0),i.titlePhase){case Al:i.titleAnimationTimer>=60&&(i.titlePhase=Hi,i.titleMoveTimer=0);break;case Hi:i.titleMoveTimer++;const o=Math.min(i.titleMoveTimer/$i,1);i.titleY=Math.floor(Qe-(Qe-Ui)*o),i.titleMoveTimer>=$i&&(i.titlePhase=Mt,i.titleY=Ui,i.demonstrationTimer=-60);break;case Mt:i=aa(i),i.demonstrationCompleted&&(i.titlePhase=Bi,i.postDemoWaitTimer=0);break;case Bi:i.postDemoWaitTimer++,i.postDemoWaitTimer>=qs&&(i.gameFlowState=cn,i.isDemoPlay=!0,i=vt(i),i.demoPlayTimer=0,i.demoCurrentInput={right:!0},i.demoInputCooldown=un);break}return i}function la(e,l){let i={...e};return i.gameOverTimer--,fn-i.gameOverTimer>=Vs&&(l.action1||l.action2||l.space||l.enter)?kt(e):(i.gameOverTimer<=0&&(i.gameFlowState=el,i=hn(i),i=gn(i)),i)}function kt(e){let l=vt(e);return l.gameFlowState=Pt,l.isDemoPlay=!1,zr(l),l}function hn(e){return{...e,titleAnimationTimer:0,blinkTimer:0,showStartMessage:!0,demoPlayTimer:0,isDemoPlay:!1,titleToDemoTimer:0,demoCurrentInput:{action1:!1,action2:!1,space:!1,enter:!1},demoInputCooldown:0,titlePhase:Al,titleY:Qe,titleMoveTimer:0,postDemoWaitTimer:0,demonstrationPhase:Fl,demonstrationTimer:0,demoCarX:At,demoCarDirection:1,demoFlagVisible:!0,demoEnemyVisible:!1,demoEnemyX:Ft,demoEnemyDirection:1,demoSpecialFlagVisible:!1,demoTransitionActive:!1,demoTransitionLineX:0,demoScoreEffectVisible:!1,demoScoreEffectTimer:0,demoScoreEffectX:0,demoScoreEffectY:0,demoSmokeTrails:[],demoSmokeCount:0,demoEnemyStunned:!1,demoEnemyStunnedTimer:0,demoEnemyStunnedDirection:1,demonstrationCompleted:!1}}function ta(e,l){if(l.action1||l.action2||l.space||l.enter)return kt(e);let i={...e};if(i.demoPlayTimer++,i.demoInputCooldown--,i.demoInputCooldown<=0){i.demoInputCooldown=un;const o=["up","down","left","right"],s=o[Math.floor(Math.random()*o.length)];i.demoCurrentInput={up:s==="up",down:s==="down",left:s==="left",right:s==="right",action1:Math.random()<.1,action2:!1,space:!1,enter:!1,r:!1}}return i=an(i,i.demoCurrentInput),(ye(i)||i.demoPlayTimer>Js)&&(i.gameFlowState=el,i.isDemoPlay=!1,i=hn(i)),i}function ia(e,l){let i={...e};switch(i={...i,gameTickCounter:i.gameTickCounter+1},i.gameFlowState){case el:let o=Ze(i);return o=ea(o,l),o=na(o),o;case cn:let s=ta(i,l);return s=ra(s),s;case Pt:return i=an(i,l),ye(i)&&(i.lastScore=Gr(i),i.gameFlowState=Yi,i.gameOverTimer=fn,Xr(i)),i;case Yi:let c=Ze(i);return c=la(c,l),c=oa(c),c;default:return i}}function na(e){let l=e;const i="LABYRACER",o=Math.floor((z-i.length*4)/2);if(ss((h,m,p,E)=>{l=b(l,h,m,p,E)},i,o,e.titleY,"O",{color:"cyan"}),e.titlePhase>=Mt){const h="Navigate the maze and collect flags",m="Use smoke to stun enemies",p=e.titleY+8,E=e.titleY+9;l=Q(l,h,p,{color:"white"}),l=Q(l,m,E,{color:"white"}),e.demonstrationTimer>=0&&(l=sa(l))}const c=`SCORE ${e.lastScore}`;l=b(l,c,1,0,{color:"white"});const d=`HI ${Pl(e)}`;if(l=b(l,d,z-d.length-1,0,{color:"yellow"}),e.showStartMessage){const h="Press SPACE/Z/X to Start",m=X-3;l=Q(l,h,m,{color:"yellow"})}const u="Arrow Keys: Move  Space/Z/X: Smoke",y=X-2;return l=Q(l,u,y,{color:"light_black"}),l}function oa(e){const l="Game Over!",i=Math.floor(X/2)-2,o=i+1;let s=e;s=Q(s,l,i,{color:"red"});const c=`Score: ${e.score}`;s=Q(s,c,o,{color:"white"});const d=Pl(e);if(d>0){const u=`High: ${d}`,y=o+1;s=Q(s,u,y,{color:"light_cyan"})}return s}function ra(e){let l=e;return Math.floor(l.demoPlayTimer/30)%2===0&&(l=Q(l,"GAME OVER",Math.floor(X/2)-2,{color:"red"})),l=Q(l,"DEMO - Press SPACE/Z/X to Play",X-3,{color:"yellow"}),l}function sa(e){let l=e;for(let o=vl;o<=Je;o++)l=b(l,"O",o,j-1,{color:"light_cyan"}),l=b(l,"O",o,j+1,{color:"light_cyan"}),l=b(l," ",o,j,{color:"black"});l=b(l,"O",vl-1,j-1,{color:"light_cyan"}),l=b(l,"O",vl-1,j,{color:"light_cyan"}),l=b(l,"O",vl-1,j+1,{color:"light_cyan"}),l=b(l,"O",Je+1,j-1,{color:"light_cyan"}),l=b(l,"O",Je+1,j,{color:"light_cyan"}),l=b(l,"O",Je+1,j+1,{color:"light_cyan"});const i=e.demoCarDirection===1?">":"<";if(l=b(l,i,e.demoCarX,j,{color:"cyan"}),e.demoFlagVisible&&(l=b(l,"F",dn,j,{color:"yellow"})),e.demoEnemyVisible){const o=e.demoEnemyDirection===1?">":e.demoEnemyDirection===3?"<":e.demoEnemyDirection===0?"^":"v";l=b(l,o,e.demoEnemyX,j,{color:"red"})}for(const o of e.demoSmokeTrails){let s="*",c="white";o.timer>40?(s="*",c="white"):o.timer>20?(s="o",c="white"):(s=".",c="light_black"),l=b(l,s,o.x,j,{color:c})}if(e.demoSpecialFlagVisible&&(l=b(l,"S",mn,j,{color:"cyan"})),e.demoTransitionActive)for(let o=j-1;o<=j+1;o++)l=b(l,"|",e.demoTransitionLineX,o,{color:"yellow"});return e.demoScoreEffectVisible&&(l=b(l,"+100",e.demoScoreEffectX,e.demoScoreEffectY,{color:"yellow"})),l}function aa(e){let l={...e};switch(l.demonstrationTimer++,l.demonstrationPhase){case Fl:l.demonstrationTimer>=Zs&&(l.demonstrationPhase=ji,l.demonstrationTimer=0);break;case ji:l.demonstrationTimer%8===0&&(l.demoCarX<dn-1?l.demoCarX++:(l.demonstrationPhase=Wi,l.demonstrationTimer=0));break;case Wi:l.demoFlagVisible=!1,l.demonstrationTimer>=30&&(l.demonstrationPhase=Vi,l.demonstrationTimer=0);break;case Vi:l.demoEnemyVisible=!0,l.demonstrationTimer>=60&&(l.demonstrationPhase=Ki,l.demonstrationTimer=0),l.demonstrationTimer>30&&l.demonstrationTimer%12===0&&l.demoEnemyX>l.demoCarX+2&&(l.demoEnemyX--,l.demoEnemyDirection=3);break;case Ki:l.demoSpecialFlagVisible=!0,l.demonstrationTimer>=60&&(l.demonstrationPhase=Ji,l.demonstrationTimer=0),l.demonstrationTimer%12===0&&(l.demoEnemyX>l.demoCarX+2?(l.demoEnemyX--,l.demoEnemyDirection=3):l.demoEnemyX<l.demoCarX-2&&(l.demoEnemyX++,l.demoEnemyDirection=1));break;case Ji:if(l.demonstrationTimer%8===0&&(l.demoCarX>mn+1?(l.demoSmokeCount<3&&(l.demoSmokeTrails.push({x:l.demoCarX,timer:60}),l.demoSmokeCount++),l.demoCarX--,l.demoCarDirection=3):(l.demonstrationPhase=qi,l.demonstrationTimer=0)),l.demoSmokeTrails=l.demoSmokeTrails.map(i=>({...i,timer:i.timer-1})).filter(i=>i.timer>0),!l.demoEnemyStunned&&l.demonstrationTimer%15===0)if(l.demoEnemyX>l.demoCarX+2){const i=l.demoEnemyX-1;l.demoSmokeTrails.some(s=>s.x===i)?(l.demoEnemyStunned=!0,l.demoEnemyStunnedTimer=0,l.demoEnemyStunnedDirection=Math.random()>.5?1:-1,l.demoSmokeTrails=l.demoSmokeTrails.filter(s=>s.x!==i)):(l.demoEnemyX--,l.demoEnemyDirection=3)}else l.demoEnemyX<l.demoCarX-2&&(l.demoEnemyX++,l.demoEnemyDirection=1);l.demoEnemyStunned&&(l.demoEnemyStunnedTimer++,l.demoEnemyStunnedTimer%10===0&&(l.demoEnemyStunnedDirection>0?l.demoEnemyDirection=(l.demoEnemyDirection+1)%4:l.demoEnemyDirection=(l.demoEnemyDirection+3)%4),l.demoEnemyStunnedTimer>=120&&(l.demoEnemyStunned=!1,l.demoEnemyStunnedTimer=0,l.demoEnemyDirection=3));break;case qi:l.demoSpecialFlagVisible=!1,l.demonstrationTimer>=30&&(l.demonstrationPhase=Zi,l.demonstrationTimer=0,l.demoTransitionActive=!0,l.demoTransitionLineX=20);break;case Zi:if(l.demonstrationTimer<45){const i=l.demonstrationTimer/45,o=20,s=Je;l.demoTransitionLineX=Math.floor(o+(s-o)*i),l.demoTransitionLineX>=l.demoEnemyX&&l.demoEnemyVisible&&(l.demoScoreEffectX=l.demoEnemyX,l.demoScoreEffectY=j,l.demoEnemyVisible=!1,l.demoScoreEffectVisible=!0,l.demoScoreEffectTimer=0)}else l.demoTransitionActive=!1,l.demonstrationPhase=Qi,l.demonstrationTimer=0;break;case Qi:l.demoScoreEffectTimer++,l.demonstrationTimer>=120&&(l.demonstrationPhase=en,l.demonstrationTimer=0);break;case en:l.demonstrationTimer>=60&&(l.demonstrationCompleted=!0);break}return l}Qr({createState:Qs,initializeGame:gn,updateGame:ia,defaultAudioService:ns,gameSettings:{gameName:"labyracer",enableHighScoreStorage:!0,enableGlobalReset:!1,audioQuantize:0},cglOptions:{isSoundEnabled:!0,audioSeed:77,audioTempo:150,bgmVolume:3},audioFiles:{bgm:"Pixelated_Pursuit.mp3"}});
