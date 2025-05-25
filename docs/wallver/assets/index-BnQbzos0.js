(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))f(c);new MutationObserver(c=>{for(const h of c)if(h.type==="childList")for(const p of h.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&f(p)}).observe(document,{childList:!0,subtree:!0});function a(c){const h={};return c.integrity&&(h.integrity=c.integrity),c.referrerPolicy&&(h.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?h.credentials="include":c.crossOrigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function f(c){if(c.ep)return;c.ep=!0;const h=a(c);fetch(c.href,h)}})();(function(o){function n(e,l=0,t=1){return Math.max(l,Math.min(e,t))}function a(e,l,t){const i=t-l,s=e-l;if(s>=0)return s%i+l;{let r=i+s%i+l;return r>=t&&(r-=i),r}}function f(e,l,t){return l<=e&&e<t}function c(e){return[...Array(e).keys()]}function h(e,l){return c(e).map(t=>l(t))}function p(e,l){let t=[];for(let i=0,s=0;i<e.length;s++)l(e[i],s)?(t.push(e[i]),e.splice(i,1)):i++;return t}function w(e){return[...e].reduce((l,[t,i])=>(l[t]=i,l),{})}function S(e){return Object.keys(e).map(l=>[l,e[l]])}function E(e,l){return String.fromCharCode(e.charCodeAt(0)+l)}function T(e){return e.x!=null&&e.y!=null}class C{constructor(l,t){this.x=0,this.y=0,this.set(l,t)}set(l=0,t=0){return T(l)?(this.x=l.x,this.y=l.y,this):(this.x=l,this.y=t,this)}add(l,t){return T(l)?(this.x+=l.x,this.y+=l.y,this):(this.x+=l,this.y+=t,this)}sub(l,t){return T(l)?(this.x-=l.x,this.y-=l.y,this):(this.x-=l,this.y-=t,this)}mul(l){return this.x*=l,this.y*=l,this}div(l){return this.x/=l,this.y/=l,this}clamp(l,t,i,s){return this.x=n(this.x,l,t),this.y=n(this.y,i,s),this}wrap(l,t,i,s){return this.x=a(this.x,l,t),this.y=a(this.y,i,s),this}addWithAngle(l,t){return this.x+=Math.cos(l)*t,this.y+=Math.sin(l)*t,this}swapXy(){const l=this.x;return this.x=this.y,this.y=l,this}normalize(){return this.div(this.length),this}rotate(l){if(l===0)return this;const t=this.x;return this.x=t*Math.cos(l)-this.y*Math.sin(l),this.y=t*Math.sin(l)+this.y*Math.cos(l),this}angleTo(l,t){return T(l)?Math.atan2(l.y-this.y,l.x-this.x):Math.atan2(t-this.y,l-this.x)}distanceTo(l,t){let i,s;return T(l)?(i=l.x-this.x,s=l.y-this.y):(i=l-this.x,s=t-this.y),Math.sqrt(i*i+s*s)}isInRect(l,t,i,s){return f(this.x,l,l+i)&&f(this.y,t,t+s)}equals(l){return this.x===l.x&&this.y===l.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const K=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],J="twrgybpclRGYBPCL";let ae,ge;const ni=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function si(e,l){const[t,i,s]=hl(0,e);if(ae=w(K.map((r,d)=>{if(d<1)return[r,{r:0,g:0,b:0,a:0}];if(d<9){const[v,b,x]=hl(d-1,e);return[r,{r:v,g:b,b:x,a:1}]}const[g,m,y]=hl(d-9+1,e);return[r,{r:Math.floor(e?g*.5:t-(t-g)*.5),g:Math.floor(e?m*.5:s-(s-m)*.5),b:Math.floor(e?y*.5:i-(i-y)*.5),a:1}]})),e){const r=ae.blue;ae.white={r:Math.floor(r.r*.15),g:Math.floor(r.g*.15),b:Math.floor(r.b*.15),a:1}}l!=null&&oi(l)}function oi(e){ge=e.map(l=>({r:l[0],g:l[1],b:l[2],a:1}));for(let l=0;l<K.length;l++){let t=1/0,i=-1;for(let s=0;s<ge.length;s++){const r=ri(ge[s],ae[K[l]]);r<t&&(t=r,i=s)}ae[K[l]]=ge[i]}}function ri(e,l){const t={r:.299,g:.587,b:.114},i=e.r-l.r,s=e.g-l.g,r=e.b-l.b,d=l.r===l.g&&l.g===l.b;let g=Math.sqrt(i*i*t.r+s*s*t.g+r*r*t.b);return d&&!(l.r===0&&l.g===0&&l.b===0)&&(g*=1.5),g}function hl(e,l){l&&(e===0?e=7:e===7&&(e=0));const t=ni[e];return[(t&16711680)>>16,(t&65280)>>8,t&255]}function me(e,l=1){const t=typeof e=="number"?ge[e]:ae[e];return Math.floor(t.r*l)<<16|Math.floor(t.g*l)<<8|Math.floor(t.b*l)}function pe(e,l=1){const t=typeof e=="number"?ge[e]:ae[e],i=Math.floor(t.r*l),s=Math.floor(t.g*l),r=Math.floor(t.b*l);return t.a<1?`rgba(${i},${s},${r},${t.a})`:`rgb(${i},${s},${r})`}const ai=`
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
`;function ci(e,l){return new PIXI.Filter(void 0,ai,{width:e,height:l})}const L=new C;let j,Z,O,B=new C;const tt=5;document.createElement("img");let k,Pe,Me=1,gl="black",A,it,ye=!1,M,nt;function di(e,l,t,i,s,r,d,g){L.set(e),M=g,gl=t;const m=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${l};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${l};
color: #888;
`,y=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,v=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=m,B.set(L),M.isUsingPixi){B.mul(tt);const x=new PIXI.Application({width:B.x,height:B.y});if(j=x.view,O=new PIXI.Graphics,O.scale.x=O.scale.y=tt,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,x.stage.addChild(O),O.filters=[],M.name==="crt"&&O.filters.push(nt=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),M.name==="pixel"&&O.filters.push(ci(B.x,B.y)),M.name==="pixel"||M.name==="shapeDark"){const P=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:M.name==="pixel"?1.5:1,brightness:M.name==="pixel"?1.5:1,blur:8});O.filters.push(P)}O.lineStyle(0),j.style.cssText=y}else j=document.createElement("canvas"),j.width=B.x,j.height=B.y,Z=j.getContext("2d"),Z.imageSmoothingEnabled=!1,j.style.cssText=y+v;document.body.appendChild(j);const b=()=>{const P=innerWidth/innerHeight,R=B.x/B.y,D=P<R,$=D?.95*innerWidth:.95*innerHeight*R,F=D?.95*innerWidth/R:.95*innerHeight;j.style.width=`${$}px`,j.style.height=`${F}px`};if(window.addEventListener("resize",b),b(),i){k=document.createElement("canvas");let x;s?(k.width=B.x,k.height=B.y,x=r):(B.x<=B.y*2?(k.width=B.y*2,k.height=B.y):(k.width=B.x,k.height=B.x/2),k.width>400&&(Me=400/k.width,k.width=400,k.height*=Me),x=Math.round(400/k.width)),Pe=k.getContext("2d"),Pe.fillStyle=l,gcc.setOptions({scale:x,capturingFps:60,isSmoothingEnabled:!1,durationSec:d})}}function Ke(){if(M.isUsingPixi){O.clear(),O.beginFill(me(gl,M.isDarkColor?.15:1)),O.drawRect(0,0,L.x,L.y),O.endFill(),O.beginFill(me(A)),ye=!0;return}Z.fillStyle=pe(gl,M.isDarkColor?.15:1),Z.fillRect(0,0,L.x,L.y),Z.fillStyle=pe(A)}function V(e){if(e===A){M.isUsingPixi&&!ye&&We(me(A));return}if(A=e,M.isUsingPixi){ye&&O.endFill(),We(me(A));return}Z.fillStyle=pe(e)}function We(e){Ne(),O.beginFill(e),ye=!0}function Ne(){ye&&(O.endFill(),ye=!1)}function Xe(){it=A}function Ye(){V(it)}function we(e,l,t,i){if(M.isUsingPixi){M.name==="shape"||M.name==="shapeDark"?O.drawRoundedRect(e,l,t,i,2):O.drawRect(e,l,t,i);return}Z.fillRect(e,l,t,i)}function ui(e,l,t,i,s){const r=me(A);We(r),O.drawCircle(e,l,s*.5),O.drawCircle(t,i,s*.5),Ne(),O.lineStyle(s,r),O.moveTo(e,l),O.lineTo(t,i),O.lineStyle(0)}function fi(){nt.time+=.2}function hi(){if(Pe.fillRect(0,0,k.width,k.height),Me===1)Pe.drawImage(j,(k.width-j.width)/2,(k.height-j.height)/2);else{const e=j.width*Me,l=j.height*Me;Pe.drawImage(j,(k.width-e)/2,(k.height-l)/2,e,l)}gcc.capture(k)}const st=[`
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

`],gi=[`
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

`];let xe,_e;function mi(){xe=[],_e=[]}function ot(){xe=xe.concat(_e),_e=[]}function rt(e){let l={isColliding:{rect:{},text:{},char:{}}};return xe.forEach(t=>{pi(e,t)&&(l=Object.assign(Object.assign(Object.assign({},l),ml(t.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},l.isColliding.rect),t.collision.isColliding.rect),text:Object.assign(Object.assign({},l.isColliding.text),t.collision.isColliding.text),char:Object.assign(Object.assign({},l.isColliding.char),t.collision.isColliding.char)}}))}),l}function pi(e,l){const t=l.pos.x-e.pos.x,i=l.pos.y-e.pos.y;return-l.size.x<t&&t<e.size.x&&-l.size.y<i&&i<e.size.y}function ml(e){if(e==null)return{};const l={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let t={};return S(e).forEach(([i,s])=>{const r=l[i];s&&r!=null&&(t[r]=!0)}),t}function at(e,l,t,i){return ct(!1,e,l,t,i)}function yi(e,l,t,i){return ct(!0,e,l,t,i)}function ct(e,l,t,i,s){if(typeof t=="number"){if(typeof i=="number")return ee(l,t,i,Object.assign({isCharacter:e,isCheckingCollision:!0,color:A},s));throw"invalid params"}else return ee(l,t.x,t.y,Object.assign({isCharacter:e,isCheckingCollision:!0,color:A},i))}const Ee=6,wi=4,H=1,I=Ee*H,Se=wi*H;let pl,yl,Je,wl,xl=!1,Ce,Sl,Te,Ve;const Cl={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function xi(){Ce=document.createElement("canvas"),Ce.width=Ce.height=I,Sl=Ce.getContext("2d"),Te=document.createElement("canvas"),Ve=Te.getContext("2d"),pl=st.map((e,l)=>He(e,String.fromCharCode(33+l),!1)),yl=gi.map((e,l)=>He(e,String.fromCharCode(33+l),!1)),Je=st.map((e,l)=>He(e,String.fromCharCode(33+l),!0)),wl={}}function Si(e,l){const t=l.charCodeAt(0)-33;e.forEach((i,s)=>{Je[t+s]=He(i,String.fromCharCode(33+t+s),!0)})}function Ci(){xl=!0}function ee(e,l,t,i={}){const s=ft(i);let r=e,d=l,g=t,m,y={isColliding:{rect:{},text:{},char:{}}};const v=s.isSmallText?Se:I;for(let b=0;b<r.length;b++){if(b===0){const R=r.charCodeAt(0);if(R<33||R>126)d=Math.floor(d-I/2*s.scale.x),g=Math.floor(g-I/2*s.scale.y);else{const D=R-33,$=s.isCharacter?Je[D]:s.isSmallText?yl[D]:pl[D];d=Math.floor(d-$.size.x/2*s.scale.x),g=Math.floor(g-$.size.y/2*s.scale.y)}m=d}const x=r[b];if(x===`
`){d=m,g+=I*s.scale.y;continue}const P=bi(x,d,g,s);s.isCheckingCollision&&(y={isColliding:{rect:Object.assign(Object.assign({},y.isColliding.rect),P.isColliding.rect),text:Object.assign(Object.assign({},y.isColliding.text),P.isColliding.text),char:Object.assign(Object.assign({},y.isColliding.char),P.isColliding.char)}}),d+=v*s.scale.x}return y}function bi(e,l,t,i){const s=e.charCodeAt(0);if(s<32||s>126)return{isColliding:{rect:{},text:{},char:{}}};const r=ft(i);if(r.backgroundColor!=="transparent"){const F=r.isSmallText?Se:I,fl=r.isSmallText?2:1;Xe(),V(r.backgroundColor),we(l+fl,t,F*r.scale.x,I*r.scale.y),Ye()}if(s<=32)return{isColliding:{rect:{},text:{},char:{}}};const d=s-33,g=r.isCharacter?Je[d]:r.isSmallText?yl[d]:pl[d],m=a(r.rotation,0,4);if(r.color==="black"&&m===0&&r.mirror.x===1&&r.mirror.y===1&&r.edgeColor==null&&(!M.isUsingPixi||r.scale.x===1&&r.scale.y===1))return bl(g,l,t,r.scale,r.isCheckingCollision,!0);const y=JSON.stringify({c:e,options:r}),v=wl[y];if(v!=null)return bl(v,l,t,r.scale,r.isCheckingCollision,r.color!=="transparent");let b=!1;const x=new C(I,I);let P=Ce,R=Sl;if(g.size.x>I||g.size.y>I){if(m===0||m===2)x.set(g.size.x,g.size.y);else{const F=Math.max(g.size.x,g.size.y);x.set(F,F)}P=document.createElement("canvas"),P.width=x.x,P.height=x.y,R=P.getContext("2d"),R.imageSmoothingEnabled=!1}M.isUsingPixi&&(r.scale.x!==1||r.scale.y!==1)&&(Te.width=x.x*r.scale.x,Te.height=x.y*r.scale.y,Ve.imageSmoothingEnabled=!1,Ve.scale(r.scale.x,r.scale.y),dt(Ve,m,r,g.image,x),b=!0),R.clearRect(0,0,x.x,x.y),dt(R,m,r,g.image,x);const D=vl(R,x,e,r.isCharacter);r.edgeColor!=null&&(P=vi(R,x,r.edgeColor),x.x+=2,x.y+=2);let $;if(xl||M.isUsingPixi){const F=document.createElement("img");if(F.src=P.toDataURL(),M.isUsingPixi){const fl=document.createElement("img");fl.src=(b?Te:P).toDataURL(),$=PIXI.Texture.from(fl)}xl&&(wl[y]={image:F,texture:$,hitBox:D,size:x})}return bl({image:P,texture:$,hitBox:D,size:x},l,t,r.scale,r.isCheckingCollision,r.color!=="transparent")}function vi(e,l,t){const i=l.x+2,s=l.y+2,r=[[0,-1],[1,0],[0,1],[-1,0]],d=document.createElement("canvas");d.width=i,d.height=s;const g=d.getContext("2d");g.imageSmoothingEnabled=!1,g.drawImage(e.canvas,1,1);const y=g.getImageData(0,0,i,s).data;g.fillStyle=pe(t);for(let v=0;v<s;v++)for(let b=0;b<i;b++){const x=(v*i+b)*4;if(y[x+3]===0)for(const[P,R]of r){const D=b+P,$=v+R;if(D>=0&&D<i&&$>=0&&$<s){const F=($*i+D)*4;if(y[F+3]>0){g.fillRect(b,v,1,1);break}}}}return d}function dt(e,l,t,i,s){l===0&&t.mirror.x===1&&t.mirror.y===1?e.drawImage(i,0,0):(e.save(),e.translate(s.x/2,s.y/2),e.rotate(Math.PI/2*l),(t.mirror.x===-1||t.mirror.y===-1)&&e.scale(t.mirror.x,t.mirror.y),e.drawImage(i,-s.x/2,-s.y/2),e.restore()),t.color!=="black"&&(e.globalCompositeOperation="source-in",e.fillStyle=pe(t.color==="transparent"?"black":t.color),e.fillRect(0,0,s.x,s.y),e.globalCompositeOperation="source-over")}function bl(e,l,t,i,s,r){if(r&&(i.x===1&&i.y===1?ut(e,l,t):ut(e,l,t,e.size.x*i.x,e.size.y*i.y)),!s)return;const d={pos:{x:l+e.hitBox.pos.x*i.x,y:t+e.hitBox.pos.y*i.y},size:{x:e.hitBox.size.x*i.x,y:e.hitBox.size.y*i.y},collision:e.hitBox.collision},g=rt(d);return r&&xe.push(d),g}function ut(e,l,t,i,s){if(M.isUsingPixi){Ne(),O.beginTextureFill({texture:e.texture,matrix:new PIXI.Matrix().translate(l,t)}),O.drawRect(l,t,i??e.size.x,s??e.size.y),We(me(A));return}i==null?Z.drawImage(e.image,l,t):Z.drawImage(e.image,l,t,i,s)}function He(e,l,t){if(e.indexOf(".")>=0||e.indexOf("data:image/")==0)return Pi(e,l);let i=e.split(`
`);i=i.slice(1,i.length-1);let s=0;i.forEach(P=>{s=Math.max(P.length,s)});const r=Math.max(Math.ceil((Ee-s)/2),0),d=i.length,g=Math.max(Math.ceil((Ee-d)/2),0),m=new C(Math.max(Ee,s)*H,Math.max(Ee,d)*H);let y=Ce,v=Sl;(m.x>I||m.y>I)&&(y=document.createElement("canvas"),y.width=m.x,y.height=m.y,v=y.getContext("2d"),v.imageSmoothingEnabled=!1),v.clearRect(0,0,m.x,m.y),i.forEach((P,R)=>{for(let D=0;D<s;D++){const $=P.charAt(D);let F=J.indexOf($);$!==""&&F>=1&&(v.fillStyle=pe(K[F]),v.fillRect((D+r)*H,(R+g)*H,H,H))}});const b=document.createElement("img");b.src=y.toDataURL();const x=vl(v,m,l,t);return M.isUsingPixi?{image:b,texture:PIXI.Texture.from(b),size:m,hitBox:x}:{image:b,size:m,hitBox:x}}function Pi(e,l){const t=document.createElement("img");t.src=e;const i=new C,s={pos:new C,size:new C,collision:{isColliding:{char:{},text:{}}}};let r;return M.isUsingPixi?r={image:t,texture:PIXI.Texture.from(t),size:new C,hitBox:s}:r={image:t,size:i,hitBox:s},t.onload=()=>{r.size.set(t.width*H,t.height*H);const d=document.createElement("canvas");d.width=r.size.x,d.height=r.size.y;const g=d.getContext("2d");g.imageSmoothingEnabled=!1,g.drawImage(t,0,0,r.size.x,r.size.y);const m=document.createElement("img");m.src=d.toDataURL(),r.image=m,r.hitBox=vl(g,r.size,l,!0),M.isUsingPixi&&(r.texture=PIXI.Texture.from(m))},r}function vl(e,l,t,i){const s={pos:new C(I,I),size:new C,collision:{isColliding:{char:{},text:{}}}};i?s.collision.isColliding.char[t]=!0:s.collision.isColliding.text[t]=!0;const r=e.getImageData(0,0,l.x,l.y).data;let d=0;for(let g=0;g<l.y;g++)for(let m=0;m<l.x;m++)r[d+3]>0&&(m<s.pos.x&&(s.pos.x=m),g<s.pos.y&&(s.pos.y=g)),d+=4;d=0;for(let g=0;g<l.y;g++)for(let m=0;m<l.x;m++)r[d+3]>0&&(m>s.pos.x+s.size.x-1&&(s.size.x=m-s.pos.x+1),g>s.pos.y+s.size.y-1&&(s.size.y=g-s.pos.y+1)),d+=4;return s}function ft(e){let l=Object.assign(Object.assign({},Cl),e);return e.scale!=null&&(l.scale=Object.assign(Object.assign({},Cl.scale),e.scale)),e.mirror!=null&&(l.mirror=Object.assign(Object.assign({},Cl.mirror),e.mirror)),l}let be=!1,qe=!1,Pl=!1;const ht=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Ml;const Mi={onKeyDown:void 0};let El,Tl=!1,Ol=!1,Rl=!1,Dl={},Il={},kl={};function gt(e){El=Object.assign(Object.assign({},Mi),e),Ml=w(ht.map(l=>[l,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",l=>{Tl=Ol=!0,Dl[l.code]=Il[l.code]=!0,El.onKeyDown!=null&&El.onKeyDown(),(l.code==="AltLeft"||l.code==="AltRight"||l.code==="ArrowRight"||l.code==="ArrowDown"||l.code==="ArrowLeft"||l.code==="ArrowUp")&&l.preventDefault()}),document.addEventListener("keyup",l=>{Tl=!1,Rl=!0,Dl[l.code]=!1,kl[l.code]=!0})}function mt(){qe=!be&&Ol,Pl=be&&Rl,Ol=Rl=!1,be=Tl,S(Ml).forEach(([e,l])=>{l.isJustPressed=!l.isPressed&&Il[e],l.isJustReleased=l.isPressed&&kl[e],l.isPressed=!!Dl[e]}),Il={},kl={}}function pt(){qe=!1,be=!0}var Ei=Object.freeze({__proto__:null,get isPressed(){return be},get isJustPressed(){return qe},get isJustReleased(){return Pl},codes:ht,get code(){return Ml},init:gt,update:mt,clearJustPressed:pt});class Qe{constructor(l=null){this.setSeed(l)}get(l=1,t){return t==null&&(t=l,l=0),this.next()/4294967295*(t-l)+l}getInt(l,t){t==null&&(t=l,l=0);const i=Math.floor(l),s=Math.floor(t);return s===i?i:this.next()%(s-i)+i}getPlusOrMinus(){return this.getInt(2)*2-1}select(l){return l[this.getInt(l.length)]}setSeed(l,t=123456789,i=362436069,s=521288629,r=32){this.w=l!=null?l>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=t>>>0,this.y=i>>>0,this.z=s>>>0;for(let d=0;d<r;d++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const l=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(l^l>>>8))>>>0,this.w}}const Oe=new C;let le=!1,ve=!1,Re=!1,Ti={isDebugMode:!1,anchor:new C,padding:new C,onPointerDownOrUp:void 0},W,Y,U;const De=new Qe,ce=new C,te=new C;let Ie=!1,ke=new C,Fl=!1,Ll=!1,jl=!1;function yt(e,l,t){U=Object.assign(Object.assign({},Ti),t),W=e,Y=new C(l.x+U.padding.x*2,l.y+U.padding.y*2),ke.set(W.offsetLeft+W.clientWidth*(.5-U.anchor.x),W.offsetTop+W.clientWidth*(.5-U.anchor.y)),U.isDebugMode&&ce.set(W.offsetLeft+W.clientWidth*(.5-U.anchor.x),W.offsetTop+W.clientWidth*(.5-U.anchor.y)),document.addEventListener("mousedown",i=>{St(i.pageX,i.pageY)}),document.addEventListener("touchstart",i=>{St(i.touches[0].pageX,i.touches[0].pageY)}),document.addEventListener("mousemove",i=>{Ct(i.pageX,i.pageY)}),document.addEventListener("touchmove",i=>{i.preventDefault(),Ct(i.touches[0].pageX,i.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",i=>{bt()}),document.addEventListener("touchend",i=>{i.preventDefault(),i.target.click(),bt()},{passive:!1})}function wt(){Oi(ke.x,ke.y,Oe),U.isDebugMode&&!Oe.isInRect(0,0,Y.x,Y.y)?(Ri(),Oe.set(ce),ve=!le&&Ie,Re=le&&!Ie,le=Ie):(ve=!le&&Ll,Re=le&&jl,le=Fl),Ll=jl=!1}function xt(){ve=!1,le=!0}function Oi(e,l,t){W!=null&&(t.x=Math.round(((e-W.offsetLeft)/W.clientWidth+U.anchor.x)*Y.x-U.padding.x),t.y=Math.round(((l-W.offsetTop)/W.clientHeight+U.anchor.y)*Y.y-U.padding.y))}function Ri(){te.length>0?(ce.add(te),!f(ce.x,-Y.x*.1,Y.x*1.1)&&ce.x*te.x>0&&(te.x*=-1),!f(ce.y,-Y.y*.1,Y.y*1.1)&&ce.y*te.y>0&&(te.y*=-1),De.get()<.05&&te.set(0)):De.get()<.1&&(te.set(0),te.addWithAngle(De.get(Math.PI*2),(Y.x+Y.y)*De.get(.01,.03))),De.get()<.05&&(Ie=!Ie)}function St(e,l){ke.set(e,l),Fl=Ll=!0,U.onPointerDownOrUp!=null&&U.onPointerDownOrUp()}function Ct(e,l){ke.set(e,l)}function bt(e){Fl=!1,jl=!0,U.onPointerDownOrUp!=null&&U.onPointerDownOrUp()}var Di=Object.freeze({__proto__:null,pos:Oe,get isPressed(){return le},get isJustPressed(){return ve},get isJustReleased(){return Re},init:yt,update:wt,clearJustPressed:xt});let ie=new C,ne=!1,q=!1,re=!1;function vt(e){gt({onKeyDown:e}),yt(j,L,{onPointerDownOrUp:e,anchor:new C(.5,.5)})}function Pt(){mt(),wt(),ie=Oe,ne=be||le,q=qe||ve,re=Pl||Re}function Mt(){pt(),xt()}function Fe(e){ie.set(e.pos),ne=e.isPressed,q=e.isJustPressed,re=e.isJustReleased}var Ii=Object.freeze({__proto__:null,get pos(){return ie},get isPressed(){return ne},get isJustPressed(){return q},get isJustReleased(){return re},init:vt,update:Pt,clearJustPressed:Mt,set:Fe});let N,Le,Bl=!1,Et,Tt,$l,se={};function Ot(e,l=1){const t=se[e];return t==null?!1:(t.gainNode.gain.value=l,t.isPlaying=!0,!0)}function ki(){const e=N.currentTime;for(const l in se){const t=se[l];if(!t.isReady||!t.isPlaying)continue;t.isPlaying=!1;const i=Gi(e);(t.playedTime==null||i>t.playedTime)&&(zi(t,i),t.playedTime=i)}}function Rt(e,l=void 0){const t=se[e];t.source!=null&&(l==null?t.source.stop():t.source.stop(l),t.source=void 0)}function Fi(e=void 0){if(se){for(const l in se)Rt(l,e);se={}}}function Li(){N=new(window.AudioContext||window.webkitAudioContext),document.addEventListener("visibilitychange",()=>{document.hidden?N.suspend():N.resume()})}function ji(){Bl=!0,Le=N.createGain(),Le.connect(N.destination),Dt(),$i(),It()}function Bi(e,l){return se[e]=Ui(l),se[e]}function Dt(e=120){Et=e,Tt=60/Et}function $i(e=8){$l=e>0?4/e:void 0}function It(e=.1){Le.gain.value=e}function zi(e,l){const t=N.createBufferSource();e.source=t,t.buffer=e.buffer,t.loop=e.isLooping,t.start=t.start||t.noteOn,t.connect(e.gainNode),t.start(l)}function Ui(e){const l={buffer:void 0,source:void 0,gainNode:N.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return l.gainNode.connect(Le),Ai(e).then(t=>{l.buffer=t,l.isReady=!0}),l}async function Ai(e){const t=await(await fetch(e)).arrayBuffer();return await N.decodeAudioData(t)}function Gi(e){if($l==null)return e;const l=Tt*$l;return l>0?Math.ceil(e/l)*l:e}let kt,Ft;const Lt=68,zl=1e3/Lt;let je=0;const Ki={viewSize:{x:100,y:100},bodyBackground:"#111",viewBackground:"black",isCapturing:!1,isCapturingGameCanvasOnly:!1,isSoundEnabled:!0,captureCanvasScale:1,theme:{name:"simple",isUsingPixi:!1,isDarkColor:!1},colorPalette:void 0};let X,jt=10,Ze;function Wi(e,l,t){kt=e,Ft=l,X=Object.assign(Object.assign({},Ki),t),si(X.theme.isDarkColor,X.colorPalette),di(X.viewSize,X.bodyBackground,X.viewBackground,X.isCapturing,X.isCapturingGameCanvasOnly,X.captureCanvasScale,X.captureDurationSec,X.theme),vt(()=>{N.resume()}),xi(),kt(),Bt()}function Bt(){Ze=requestAnimationFrame(Bt);const e=window.performance.now();e<je-Lt/12||(je+=zl,(je<e||je>e+zl*2)&&(je=e+zl),Bl&&ki(),X.isSoundEnabled&&sss.update(),Pt(),Ft(),X.isCapturing&&hi(),jt--,jt===0&&Ci())}function Ni(){Ze&&(cancelAnimationFrame(Ze),Ze=void 0)}let el;const ll=new Qe;function Ul(){el=[]}function $t(e,l=16,t=1,i=0,s=Math.PI*2,r=void 0){if(l<1){if(ll.get()>l)return;l=1}for(let d=0;d<l;d++){const g=i+ll.get(s)-s/2,m={pos:new C(e),vel:new C(t*ll.get(.5,1),0).rotate(g),color:A,ticks:n(ll.get(10,20)*Math.sqrt(Math.abs(t)),10,60),edgeColor:r};el.push(m)}}function tl(){Xe(),el=el.filter(e=>{if(e.ticks--,e.ticks<0)return!1;e.pos.add(e.vel),e.vel.mul(.98);const l=Math.floor(e.pos.x),t=Math.floor(e.pos.y);return e.edgeColor!=null&&(V(e.edgeColor),we(l-1,t-1,3,3)),V(e.color),we(l,t,1,1),!0}),Ye()}function Al(e,l,t,i){return zt(!1,e,l,t,i)}function Xi(e,l,t,i){return zt(!0,e,l,t,i)}function Yi(e,l,t,i,s=.5,r=.5){typeof e!="number"&&(r=s,s=i,i=t,t=l,l=e.y,e=e.x);const d=new C(t).rotate(s),g=new C(e-d.x*r,l-d.y*r);return Gl(g,d,i)}function _i(e,l,t=3,i=3,s=3){const r=new C,d=new C;if(typeof e=="number")if(typeof l=="number")typeof t=="number"?(r.set(e,l),d.set(t,i)):(r.set(e,l),d.set(t),s=i);else throw"invalid params";else if(typeof l=="number")if(typeof t=="number")r.set(e),d.set(l,t),s=i;else throw"invalid params";else if(typeof t=="number")r.set(e),d.set(l),s=t;else throw"invalid params";return Gl(r,d.sub(r),s)}function Ji(e,l,t,i,s,r){let d=new C;typeof e=="number"?d.set(e,l):(d.set(e),r=s,s=i,i=t,t=l),i==null&&(i=3),s==null&&(s=0),r==null&&(r=Math.PI*2);let g,m;if(s>r?(g=r,m=s-r):(g=s,m=r-s),m=n(m,0,Math.PI*2),m<.01)return;const y=n(Math.ceil(m*Math.sqrt(t*.25)),1,36),v=m/y;let b=g,x=new C(t).rotate(b).add(d),P=new C,R=new C,D={isColliding:{rect:{},text:{},char:{}}};for(let $=0;$<y;$++){b+=v,P.set(t).rotate(b).add(d),R.set(P).sub(x);const F=Gl(x,R,i,!0);D=Object.assign(Object.assign(Object.assign({},D),ml(F.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},D.isColliding.rect),F.isColliding.rect),text:Object.assign(Object.assign({},D.isColliding.text),F.isColliding.text),char:Object.assign(Object.assign({},D.isColliding.char),F.isColliding.char)}}),x.set(P)}return ot(),D}function zt(e,l,t,i,s){if(typeof l=="number"){if(typeof t=="number")return typeof i=="number"?s==null?de(e,l,t,i,i):de(e,l,t,i,s):de(e,l,t,i.x,i.y);throw"invalid params"}else if(typeof t=="number"){if(i==null)return de(e,l.x,l.y,t,t);if(typeof i=="number")return de(e,l.x,l.y,t,i);throw"invalid params"}else return de(e,l.x,l.y,t.x,t.y)}function Gl(e,l,t,i=!1){let s=!0;(M.name==="shape"||M.name==="shapeDark")&&(A!=="transparent"&&ui(e.x,e.y,e.x+l.x,e.y+l.y,t),s=!1);const r=Math.floor(n(t,3,10)),d=Math.abs(l.x),g=Math.abs(l.y),m=n(Math.ceil(d>g?d/r:g/r)+1,3,99);l.div(m-1);let y={isColliding:{rect:{},text:{},char:{}}};for(let v=0;v<m;v++){const b=de(!0,e.x,e.y,t,t,!0,s);y=Object.assign(Object.assign(Object.assign({},y),ml(b.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},y.isColliding.rect),b.isColliding.rect),text:Object.assign(Object.assign({},y.isColliding.text),b.isColliding.text),char:Object.assign(Object.assign({},y.isColliding.char),b.isColliding.char)}}),e.add(l)}return i||ot(),y}function de(e,l,t,i,s,r=!1,d=!0){let g=d;(M.name==="shape"||M.name==="shapeDark")&&g&&A!=="transparent"&&(e?we(l-i/2,t-s/2,i,s):we(l,t,i,s),g=!1);let m=e?{x:Math.floor(l-i/2),y:Math.floor(t-s/2)}:{x:Math.floor(l),y:Math.floor(t)};const y={x:Math.trunc(i),y:Math.trunc(s)};if(y.x===0||y.y===0)return{isColliding:{rect:{},text:{},char:{}}};y.x<0&&(m.x+=y.x,y.x*=-1),y.y<0&&(m.y+=y.y,y.y*=-1);const v={pos:m,size:y,collision:{isColliding:{rect:{}}}};v.collision.isColliding.rect[A]=!0;const b=rt(v);return A!=="transparent"&&((r?_e:xe).push(v),g&&we(m.x,m.y,y.x,y.y)),b}function Kl({pos:e,size:l,text:t,isToggle:i=!1,onClick:s=()=>{},isSmallText:r=!0}){return{pos:e,size:l,text:t,isToggle:i,onClick:s,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:r}}function Wl(e){const l=new C(ie).sub(e.pos);e.isHovered=l.isInRect(0,0,e.size.x,e.size.y),e.isHovered&&ve&&(e.isPressed=!0),e.isPressed&&!e.isHovered&&(e.isPressed=!1),e.isPressed&&Re&&(e.onClick(),e.isPressed=!1,e.isToggle&&(e.toggleGroup.length===0?e.isSelected=!e.isSelected:(e.toggleGroup.forEach(t=>{t.isSelected=!1}),e.isSelected=!0))),il(e)}function il(e){Xe(),V(e.isPressed?"blue":"light_blue"),Al(e.pos.x,e.pos.y,e.size.x,e.size.y),e.isToggle&&!e.isSelected&&(V("white"),Al(e.pos.x+1,e.pos.y+1,e.size.x-2,e.size.y-2)),V(e.isHovered?"black":"blue"),at(e.text,e.pos.x+3,e.pos.y+3,{isSmallText:e.isSmallText}),Ye()}let Q,Be,ue,Nl;function Vi(e){Q={randomSeed:e,inputs:[]}}function Hi(e){Q.inputs.push(e)}function Ut(){return Q!=null}function qi(e){Be=0,e.setSeed(Q.randomSeed)}function Qi(){Be>=Q.inputs.length||(Fe(Q.inputs[Be]),Be++)}function Zi(){ue=[]}function en(e,l,t){ue.push({randomState:t.getState(),gameState:cloneDeep(e),baseState:cloneDeep(l)})}function ln(e){const l=ue.pop(),t=l.randomState;return e.setSeed(t.w,t.x,t.y,t.z,0),Nl={pos:new C(ie),isPressed:ne,isJustPressed:q,isJustReleased:re},Fe(Q.inputs.pop()),l}function tn(e){const l=ue[ue.length-1],t=l.randomState;return e.setSeed(t.w,t.x,t.y,t.z,0),Nl={pos:new C(ie),isPressed:ne,isJustPressed:q,isJustReleased:re},Fe(Q.inputs[Q.inputs.length-1]),l}function nn(){Fe(Nl)}function sn(){return ue.length===0}function on(){const e=Be-1;if(!(e>=Q.inputs.length))return ue[e]}const Xl=4,rn=60,an="video/webm;codecs=vp8,opus",cn="video/webm",dn="recording.webm",un=1e5*Xl,fn=.7;let _,nl;function hn(e,l,t){if(_!=null)return;const i=document.createElement("canvas");i.width=e.width*Xl,i.height=e.height*Xl;const s=i.getContext("2d");s.imageSmoothingEnabled=!1;const r=()=>{s.drawImage(e,0,0,e.width,e.height,0,0,i.width,i.height),nl=requestAnimationFrame(r)};r();const d=i.captureStream(rn),g=l.createMediaStreamDestination(),m=l.createGain();m.gain.value=fn,t.forEach(x=>{x!=null&&x.connect(m)}),m.connect(g);const y=g.stream,v=new MediaStream([...d.getVideoTracks(),...y.getAudioTracks()]);_=new MediaRecorder(v,{mimeType:an,videoBitsPerSecond:un});let b=[];_.ondataavailable=x=>{x.data.size>0&&b.push(x.data)},_.onstop=()=>{const x=new Blob(b,{type:cn}),P=URL.createObjectURL(x),R=document.createElement("a");R.href=P,R.download=dn,R.click(),URL.revokeObjectURL(P),b=[]},_.start()}function gn(){_!=null&&_.state!=="inactive"&&(_.stop(),_=void 0),nl&&(cancelAnimationFrame(nl),nl=void 0)}function mn(){return _!=null&&_.state==="recording"}const pn=Math.PI,yn=Math.abs,wn=Math.sin,xn=Math.cos,Sn=Math.atan2,Cn=Math.sqrt,bn=Math.pow,vn=Math.floor,Pn=Math.round,Mn=Math.ceil;o.ticks=0,o.difficulty=void 0,o.score=0,o.time=void 0,o.isReplaying=!1;function En(e=1,l){return oe.get(e,l)}function Tn(e=2,l){return oe.getInt(e,l)}function On(e=1,l){return oe.get(e,l)*oe.getPlusOrMinus()}function Yl(e="GAME OVER"){cl=e,u.isShowingTime&&(o.time=void 0),Jt()}function Rn(e="COMPLETE"){cl=e,Jt()}function Dn(e,l,t){if(o.isReplaying||(o.score+=e,l==null))return;const i=`${e>=1?"+":""}${Math.floor(e)}`;let s=new C;typeof l=="number"?s.set(l,t):s.set(l),s.x-=i.length*(u.isUsingSmallText?Se:I)/2,s.y-=I/2,rl.push({str:i,pos:s,vy:-2,ticks:30})}function At(e){V(e)}function In(e,l,t,i,s,r){let d=new C;typeof e=="number"?(d.set(e,l),g(d,t,i,s,r)):(d.set(e),g(d,l,t,i,s));function g(m,y,v,b,x){if(Vn(y)){const P=y;$t(m,P.count,P.speed,P.angle,P.angleWidth,P.edgeColor)}else $t(m,y,v,b,x)}}function Gt(e,l){return new C(e,l)}function Kt(e,l){!Ue&&!he&&(Bl&&Ot(e,l!=null&&l.volume!=null?l.volume:1)||(u.isSoundEnabled&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(e,l):u.isSoundEnabled&&sss.play(Ln[e])))}let _l;function Jl(){Ql&&Ot(u.bgmName,u.bgmVolume)||(typeof sss.generateMml=="function"?_l=sss.playMml(sss.generateMml(),{volume:u.bgmVolume}):sss.playBgm())}function Vl(){Ql?Rt(u.bgmName):_l!=null?sss.stopMml(_l):sss.stopBgm()}function Wt(){hn(j,N,[Le,ul])}function Hl(){gn()}function kn(e){if(Ue){const l=tn(oe),t=l.baseState;return o.score=t.score,o.ticks=t.ticks,cloneDeep(l.gameState)}else if(he){const l=ln(oe),t=l.baseState;return o.score=t.score,o.ticks=t.ticks,l.gameState}else{if(o.isReplaying)return on().gameState;if(fe==="inGame"){const l={score:o.score,ticks:o.ticks};en(e,l,oe)}}return e}function Fn(){he||(!o.isReplaying&&u.isRewindEnabled?Nn():Yl())}const Ln={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"},Nt={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},jn=new Qe,oe=new Qe;let fe,Bn={title:Kn,inGame:Gn,gameOver:Wn,rewind:Xn},$e=0,sl,ol=!0,ze=0,u,Xt,rl,Ue=!1,he=!1,Ae,al,cl,ql,dl,ul,Ql=!1;function $n(e){window.update=e.update,window.title=e.title,window.description=e.description,window.characters=e.characters,window.options=e.options,window.audioFiles=e.audioFiles,Yt()}function Yt(){typeof options<"u"&&options!=null?u=Object.assign(Object.assign({},Nt),options):u=Nt;const e={name:u.theme,isUsingPixi:!1,isDarkColor:!1};u.theme!=="simple"&&u.theme!=="dark"&&(e.isUsingPixi=!0),(u.theme==="pixel"||u.theme==="shapeDark"||u.theme==="crt"||u.theme==="dark")&&(e.isDarkColor=!0),ze=u.audioSeed+u.seed,u.isMinifying&&qn(),Xt={viewSize:u.viewSize,bodyBackground:e.isDarkColor?"#101010":"#e0e0e0",viewBackground:e.isDarkColor?"blue":"white",theme:e,isSoundEnabled:u.isSoundEnabled,isCapturing:u.isCapturing,isCapturingGameCanvasOnly:u.isCapturingGameCanvasOnly,captureCanvasScale:u.captureCanvasScale,captureDurationSec:u.captureDurationSec,colorPalette:u.colorPalette},Wi(Un,An,Xt)}function zn(){Ni(),Hl(),Fi(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}function Un(){if(typeof description<"u"&&description!=null&&description.trim().length>0&&(ol=!1,ze+=Zt(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(ol=!1,document.title=title,ze+=Zt(title),dl=`crisp-game-${encodeURIComponent(title)}-${ze}`,$e=Jn()),typeof characters<"u"&&characters!=null&&Si(characters,"a"),Li(),typeof audioFiles<"u"&&audioFiles!=null){ji(),It(.1*u.audioVolume),Dt(u.audioTempo);for(let e in audioFiles){const l=Bi(e,audioFiles[e]);e===u.bgmName&&(l.isLooping=!0,Ql=!0)}}u.isSoundEnabled&&(ul=N.createGain(),ul.connect(N.destination),sss.init(ze,N,ul),sss.setVolume(.1*u.audioVolume),sss.setTempo(u.audioTempo)),V("black"),ol?(Zl(),o.ticks=0):_t()}function An(){o.df=o.difficulty=o.ticks/3600+1,o.tc=o.ticks;const e=o.score,l=o.time;o.sc=o.score;const t=o.sc;o.inp={p:ie,ip:ne,ijp:q,ijr:re},mi(),Bn[fe](),M.isUsingPixi&&(Ne(),M.name==="crt"&&fi()),o.ticks++,o.isReplaying?(o.score=e,o.time=l):o.sc!==t&&(o.score=o.sc)}function Zl(){fe="inGame",o.ticks=-1,Ul();const e=Math.floor(o.score);e>$e&&($e=e),u.isShowingTime&&o.time!=null&&(sl==null||sl>o.time)&&(sl=o.time),o.score=0,o.time=0,rl=[],u.isPlayingBgm&&u.isSoundEnabled&&Jl();const l=jn.getInt(999999999);oe.setSeed(l),(u.isReplayEnabled||u.isRewindEnabled)&&(Vi(l),Zi(),o.isReplaying=!1)}function Gn(){Ke(),u.isDrawingParticleFront||tl(),u.isDrawingScoreFront||Qt(),(u.isReplayEnabled||u.isRewindEnabled)&&Hi({pos:Gt(ie),isPressed:ne,isJustPressed:q,isJustReleased:re}),typeof update=="function"&&update(),u.isDrawingParticleFront&&tl(),u.isDrawingScoreFront&&Qt(),et(),u.isShowingTime&&o.time!=null&&o.time++,u.isRecording&&!mn()&&Wt()}function _t(){fe="title",o.ticks=-1,Ul(),Ke(),Ut()&&(qi(oe),o.isReplaying=!0)}function Kn(){if(q){Zl();return}if(Ke(),u.isReplayEnabled&&Ut()&&(Qi(),o.inp={p:ie,ip:ne,ijp:q,ijr:re},u.isDrawingParticleFront||tl(),update(),u.isDrawingParticleFront&&tl()),et(),typeof title<"u"&&title!=null){let e=0;title.split(`
`).forEach(t=>{t.length>e&&(e=t.length)});const l=Math.floor((L.x-e*I)/2);title.split(`
`).forEach((t,i)=>{ee(t,l,Math.floor(L.y*.25)+i*I,{edgeColor:u.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let e=0;description.split(`
`).forEach(i=>{i.length>e&&(e=i.length)});const l=u.isUsingSmallText?Se:I,t=Math.floor((L.x-e*l)/2);description.split(`
`).forEach((i,s)=>{ee(i,t,Math.floor(L.y/2)+s*I,{isSmallText:u.isUsingSmallText,edgeColor:u.textEdgeColor.description})})}}function Jt(){fe="gameOver",o.isReplaying||Mt(),o.ticks=-1,Ht(),u.isPlayingBgm&&u.isSoundEnabled&&Vl();const e=Math.floor(o.score);e>$e&&_n(e)}function Wn(){o.ticks===0&&!M.isUsingPixi&&Ht(),(o.isReplaying||o.ticks>20)&&q?(Vt(),Zl()):o.ticks===(u.isReplayEnabled?120:300)&&!ol&&(Vt(),_t())}function Vt(){!u.isRecording||o.isReplaying||Hl()}function Ht(){o.isReplaying||ee(cl,Math.floor((L.x-cl.length*I)/2),Math.floor(L.y/2),{edgeColor:u.textEdgeColor.gameOver})}function Nn(){fe="rewind",Ue=!0,Ae=Kl({pos:{x:L.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:u.isUsingSmallText}),al=Kl({pos:{x:L.x-39,y:L.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:u.isUsingSmallText}),u.isPlayingBgm&&u.isSoundEnabled&&Vl(),M.isUsingPixi&&(il(Ae),il(al))}function Xn(){Ke(),update(),et(),nn(),he?(il(Ae),(sn()||!ne)&&Yn()):(Wl(Ae),Wl(al),Ae.isPressed&&(he=!0,Ue=!1)),al.isPressed&&(Ue=he=!1,Yl()),u.isShowingTime&&o.time!=null&&o.time++}function Yn(){he=!1,fe="inGame",Ul(),u.isPlayingBgm&&u.isSoundEnabled&&Jl()}function et(){if(u.isShowingTime)qt(o.time,3,3),qt(sl,L.x-7*(u.isUsingSmallText?Se:I),3);else if(u.isShowingScore){ee(`${Math.floor(o.score)}`,3,3,{isSmallText:u.isUsingSmallText,edgeColor:u.textEdgeColor.score});const e=`HI ${$e}`;ee(e,L.x-e.length*(u.isUsingSmallText?Se:I),3,{isSmallText:u.isUsingSmallText,edgeColor:u.textEdgeColor.score})}}function qt(e,l,t){if(e==null)return;let i=Math.floor(e*100/50);i>=10*60*100&&(i=10*60*100-1);const s=lt(Math.floor(i/6e3),1)+"'"+lt(Math.floor(i%6e3/100),2)+'"'+lt(Math.floor(i%100),2);ee(s,l,t,{isSmallText:u.isUsingSmallText,edgeColor:u.textEdgeColor.score})}function lt(e,l){return("0000"+e).slice(-l)}function Qt(){Xe(),V("black"),rl=rl.filter(e=>(ee(e.str,e.pos.x,e.pos.y,{isSmallText:u.isUsingSmallText,edgeColor:u.textEdgeColor.floatingScore}),e.pos.y+=e.vy,e.vy*=.9,e.ticks--,e.ticks>0)),Ye()}function Zt(e){let l=0;for(let t=0;t<e.length;t++){const i=e.charCodeAt(t);l=(l<<5)-l+i,l|=0}return l}function _n(e){if(dl!=null)try{const l={highScore:e};localStorage.setItem(dl,JSON.stringify(l))}catch(l){console.warn("Unable to save high score:",l)}}function Jn(){try{const e=localStorage.getItem(dl);if(e)return JSON.parse(e).highScore}catch(e){console.warn("Unable to load high score:",e)}return 0}function Vn(e){return e!=null&&e.constructor===Object}function Hn(){let e=window.location.search.substring(1);if(e=e.replace(/[^A-Za-z0-9_-]/g,""),e.length===0)return;const l=document.createElement("script");ql=`${e}/main.js`,l.setAttribute("src",ql),document.head.appendChild(l)}function qn(){fetch(ql).then(e=>e.text()).then(e=>{const l=Terser.minify(e+"update();",{toplevel:!0}).code,t="function(){",i=l.indexOf(t),s="options={",r=l.indexOf(s);let d=l;if(i>=0)d=l.substring(l.indexOf(t)+t.length,l.length-4);else if(r>=0){let g=1,m;for(let y=r+s.length;y<l.length;y++){const v=l.charAt(y);if(v==="{")g++;else if(v==="}"&&(g--,g===0)){m=y+2;break}}g===0&&(d=l.substring(m))}ei.forEach(([g,m])=>{d=d.split(g).join(m)}),console.log(d),console.log(`${d.length} letters`)})}o.inp=void 0;function Qn(...e){return At.apply(this,e)}function Zn(...e){return Kt.apply(this,e)}function es(...e){return h.apply(this,e)}function ls(...e){return p.apply(this.args)}o.tc=void 0,o.df=void 0,o.sc=void 0;const ts="transparent",is="white",ns="red",ss="green",os="yellow",rs="blue",as="purple",cs="cyan",ds="black",us="coin",fs="laser",hs="explosion",gs="powerUp",ms="hit",ps="jump",ys="select",ws="lucky";let ei=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];o.PI=pn,o.abs=yn,o.addGameScript=Hn,o.addScore=Dn,o.addWithCharCode=E,o.arc=Ji,o.atan2=Sn,o.bar=Yi,o.bl=rs,o.box=Xi,o.ceil=Mn,o.char=yi,o.clamp=n,o.clr=Qn,o.cn=us,o.color=At,o.complete=Rn,o.cos=xn,o.cy=cs,o.end=Yl,o.ex=hs,o.floor=vn,o.frameState=kn,o.getButton=Kl,o.gr=ss,o.ht=ms,o.init=$n,o.input=Ii,o.jm=ps,o.keyboard=Ei,o.lc=ds,o.line=_i,o.ls=fs,o.minifyReplaces=ei,o.onLoad=Yt,o.onUnload=zn,o.particle=In,o.play=Kt,o.playBgm=Jl,o.ply=Zn,o.pointer=Di,o.pow=bn,o.pr=as,o.pw=gs,o.range=c,o.rd=ns,o.rect=Al,o.remove=p,o.rewind=Fn,o.rmv=ls,o.rnd=En,o.rndi=Tn,o.rnds=On,o.round=Pn,o.sin=wn,o.sl=ys,o.sqrt=Cn,o.startRecording=Wt,o.stopBgm=Vl,o.stopRecording=Hl,o.text=at,o.times=h,o.tms=es,o.tr=ts,o.uc=ws,o.updateButton=Wl,o.vec=Gt,o.wh=is,o.wrap=a,o.yl=os})(window||{});const G=40,z=25;class xs{constructor(n={}){const{initialLives:a=3}=n;this.initialLives=a,this.score=0,this.lives=a,this.gameOverState=!1,this.wonGame=!1,this.virtualScreen=this.initializeVirtualScreen()}initializeVirtualScreen(){const n=[];for(let a=0;a<z;a++){const f=[];for(let c=0;c<G;c++)f.push({char:" ",attributes:{}});n.push(f)}return n}clearVirtualScreen(){for(let n=0;n<z;n++)for(let a=0;a<G;a++)this.virtualScreen[n][a]={char:" ",attributes:{}}}drawText(n,a,f,c){if(f<0||f>=z){console.warn(`drawText: y coordinate (${f}) out of bounds.`);return}for(let h=0;h<n.length;h++){const p=a+h;p<0||p>=G||(this.virtualScreen[f][p]={char:n[h],attributes:{...c}})}}drawCenteredText(n,a,f){const c=Math.floor(G/2-n.length/2);this.drawText(n,c,a,f)}renderStandardUI(){this.drawText(`Score: ${this.score}`,1,0,{color:"white"}),this.drawText(`Lives: ${this.lives}`,31,0,{color:"white"}),this.drawText("R: Restart",1,z-1,{color:"light_black"})}renderGameOverScreen(n=!1){const a=n?"You Win!":"Game Over!",f=Math.floor(z/2)-1;this.drawCenteredText(a,f,{color:n?"green":"red"});const c=Math.floor(z/2)+1;this.drawCenteredText("Press R to restart",c,{color:"white"})}getCellInfo(n,a){return n<0||n>=G||a<0||a>=z?null:this.virtualScreen[a][n]}addScore(n){this.score+=n}loseLife(){this.lives--,this.lives<=0&&(this.lives=0,this.gameOverState=!0)}getScore(){return this.score}getLives(){return this.lives}isGameOver(){return this.gameOverState}getVirtualScreenData(){return this.virtualScreen}winGame(){this.wonGame=!0,this.gameOverState=!0}isGameWon(){return this.wonGame}resetGame(){this.score=0,this.lives=this.initialLives,this.gameOverState=!1,this.wonGame=!1,this.virtualScreen=this.initializeVirtualScreen()}update(n){this.gameOverState||(this.clearVirtualScreen(),this.updateGame(n),this.renderStandardUI(),this.gameOverState&&this.renderGameOverScreen(this.wonGame))}}const Ss="@",li="#",Cs="*",bs="o",Ge=0,ti=2,vs=[[1,0],[0,1],[-1,0],[0,-1]],ii=[[1,-1],[1,1],[-1,1],[-1,-1]];class Ps extends xs{constructor(n={}){super(n),this.shots=[],this.shotCooldown=0,this.dynamicWalls=new Set,this.enemyBullets=[],this.enclosedTerritories=new Set,this.explosions=[],this.frameCount=0,this.lastInputChangeFrame=0,this.initializeGame()}initializeGame(){this.resetGame(),this.playerX=16,this.playerY=7,this.playerDirection=Ge,this.lastInput=Ge,this.shots=[],this.shotCooldown=0,this.dynamicWalls.clear(),this.enemyBullets=[],this.enclosedTerritories.clear(),this.explosions=[],this.frameCount=0,this.lastInputChangeFrame=0,this.initializeEnemyBullets()}initializeEnemyBullets(){const n=3+Math.floor(Math.random()*3);for(let a=0;a<n;a++){let f,c,h=0;do f=2+Math.floor(Math.random()*(G-4)),c=2+Math.floor(Math.random()*(z-4)),h++;while(this.isWall(f,c)&&h<50);const p=Math.floor(Math.random()*4),[w,S]=ii[p];this.enemyBullets.push({x:f,y:c,directionX:w,directionY:S,active:!0,frameCounter:0})}}drawWalls(){for(let n=0;n<z;n++)for(let a=0;a<G;a++)this.isStaticWall(a,n)&&this.drawText(li,a,n,{entityType:"wall",color:"light_cyan"});for(const n of this.dynamicWalls){const[a,f]=n.split(",").map(Number);this.drawText(li,a,f,{entityType:"wall",color:"cyan"})}}drawPlayer(){this.playerY>=0&&this.playerY<z&&this.playerX>=0&&this.playerX<G&&this.drawText(Ss,this.playerX,this.playerY,{entityType:"player",color:"yellow"})}drawShots(){for(const n of this.shots)n.active&&this.drawText(Cs,n.x,n.y,{entityType:"shot",color:"red"})}drawEnemyBullets(){for(const n of this.enemyBullets)n.active&&this.drawText(bs,n.x,n.y,{entityType:"enemy_bullet",color:"purple"})}drawExplosions(){for(const n of this.explosions){const a=1-n.duration/n.maxDuration;let f,c;a<.3?(f="*",c="yellow"):a<.7?(f="+",c="red"):(f="·",c="light_red"),this.drawText(f,n.x,n.y,{entityType:"explosion",color:c})}}movePlayer(n){const a=n?-1:1;this.playerDirection=(this.playerDirection+a+4)%4;for(let f=0;f<4;f++){const[c,h]=this.getDirectionOffset(this.playerDirection),p=this.playerX+c,w=this.playerY+h;if(!this.isWall(p,w)){let S=!1;for(let E=0;E<4;E++){const[T,C]=this.getDirectionOffset(E),K=p+T,J=w+C;if(this.isWall(K,J)){S=!0;break}}if(!S)for(let E=0;E<4;E++){const[T,C]=ii[E],K=p+T,J=w+C;if(this.isWall(K,J)){S=!0;break}}if(S){this.playerX=p,this.playerY=w;break}}this.playerDirection=(this.playerDirection-a+4)%4}}getDirectionOffset(n){return vs[n]||[0,0]}isWall(n,a){return n<0||n>=G||a<0||a>=z||this.isStaticWall(n,a)||this.dynamicWalls.has(this.getCoordinateKey(n,a))}reverseDirection(){this.playerDirection=(this.playerDirection+2)%4}getInwardDirection(){return this.lastInput===Ge?(this.playerDirection-1+4)%4:(this.playerDirection+1)%4}fireShot(){if(this.shotCooldown<=0){const n=this.getInwardDirection(),[a,f]=this.getDirectionOffset(n);this.shots.push({x:this.playerX+a,y:this.playerY+f,direction:n,active:!0}),this.shotCooldown=10,this.addScore(1)}}updateShots(){for(const n of this.shots){if(!n.active)continue;const[a,f]=this.getDirectionOffset(n.direction);if(n.x+=a,n.y+=f,this.isWall(n.x,n.y)){n.active=!1,this.addScore(5);const c=n.x-a,h=n.y-f;c>=0&&c<G&&h>=0&&h<z&&!this.isWall(c,h)&&!(c===this.playerX&&h===this.playerY)&&(this.dynamicWalls.add(this.getCoordinateKey(c,h)),this.addScore(10),this.checkEnclosedTerritories())}}this.shots=this.shots.filter(n=>n.active),this.shotCooldown>0&&this.shotCooldown--}updateEnemyBullets(){for(const n of this.enemyBullets){if(!n.active||(n.frameCounter++,n.frameCounter%3!==0))continue;const a=n.x,f=n.y,c=n.x+n.directionX,h=n.y+n.directionY,p=!this.isWall(c,f),w=!this.isWall(a,h),S=!this.isWall(c,h);p&&w&&S?(n.x=c,n.y=h):!p&&!w?(n.directionX=-n.directionX,n.directionY=-n.directionY,n.x=a+n.directionX,n.y=f+n.directionY):p?w?(p||(n.directionX=-n.directionX),w||(n.directionY=-n.directionY),n.x=a+n.directionX,n.y=f+n.directionY):(n.directionY=-n.directionY,n.x=c,n.y=f+n.directionY):(n.directionX=-n.directionX,n.x=a+n.directionX,n.y=h),n.x===this.playerX&&n.y===this.playerY&&(this.loseLife(),n.active=!1)}this.enemyBullets=this.enemyBullets.filter(n=>n.active)}updateExplosions(){for(const n of this.explosions)n.duration--;this.explosions=this.explosions.filter(n=>n.duration>0)}updateGame(n){this.frameCount++,this.drawWalls();const a=10;n.right?(this.lastInput===ti&&this.frameCount-this.lastInputChangeFrame>=a&&(this.reverseDirection(),this.lastInputChangeFrame=this.frameCount),this.movePlayer(!1),this.lastInput=Ge):n.left&&(this.lastInput===Ge&&this.frameCount-this.lastInputChangeFrame>=a&&(this.reverseDirection(),this.lastInputChangeFrame=this.frameCount),this.movePlayer(!0),this.lastInput=ti),n.action1&&this.fireShot(),this.updateShots(),this.updateEnemyBullets(),this.updateExplosions(),this.drawShots(),this.drawPlayer(),this.drawEnemyBullets(),this.drawExplosions()}getCoordinateKey(n,a){return`${n},${a}`}isStaticWall(n,a){return a===1||a===z-1||n===0||n===G-1||n===15&&a>=2&&a<=6}floodFill(n,a,f){const c=[[n,a]],h=new Set;let p=!1,w=0;for(;c.length>0;){const[S,E]=c.pop(),T=this.getCoordinateKey(S,E);if(!(h.has(T)||f.has(T))){if(S<0||S>=G||E<0||E>=z){p=!0;continue}this.isWall(S,E)||(h.add(T),f.add(T),w++,c.push([S+1,E]),c.push([S-1,E]),c.push([S,E+1]),c.push([S,E-1]))}}return{area:w,reachedBorder:p}}checkEnclosedTerritories(){const n=new Set,a=[];for(let f=0;f<z;f++)for(let c=0;c<G;c++){const h=this.getCoordinateKey(c,f);if(n.has(h)||this.isWall(c,f))continue;const{area:p,reachedBorder:w}=this.floodFill(c,f,n);a.push({area:p,reachedBorder:w,startX:c,startY:f})}if(a.length>1){const f=a.reduce((h,p)=>p.area>h.area?p:h),c=a.filter(h=>h!==f&&this.hasAdjacentDynamicWall(h.startX,h.startY,h.area));if(c.length>0){const h=c.reduce((w,S)=>S.area<w.area?S:w),p=`territory_${h.startX}_${h.startY}_${h.area}`;if(!this.enclosedTerritories.has(p)){this.enclosedTerritories.add(p);const w=h.area*20;this.addScore(w),this.explodeTerritory(h.startX,h.startY,h.area),console.log(`新しい囲まれた領域を発見! 面積: ${h.area}, スコア: +${w}`),console.log(`全領域数: ${a.length}, 最大領域: ${f.area}マス（除外）`),console.log(`全領域の面積: ${a.map(S=>S.area).join(", ")}`),console.log(`囲まれた領域候補: ${c.map(S=>S.area).join(", ")}`)}}}}hasAdjacentDynamicWall(n,a,f){const c=new Set,h=[[n,a]];let p=0;for(;h.length>0&&p<f;){const[w,S]=h.pop(),E=this.getCoordinateKey(w,S);if(!(c.has(E)||this.isWall(w,S))){c.add(E),p++;for(const[T,C]of[[0,1],[0,-1],[1,0],[-1,0]]){const K=w+T,J=S+C;if(this.dynamicWalls.has(this.getCoordinateKey(K,J)))return!0;!this.isWall(K,J)&&!c.has(this.getCoordinateKey(K,J))&&h.push([K,J])}}}return!1}explodeTerritory(n,a,f){const c=this.getTerritoryCoordinates(n,a);for(const h of c){const[p,w]=h.split(",").map(Number);this.explosions.push({x:p,y:w,duration:20,maxDuration:20})}this.destroyWallsInExplosion(c),this.destroyBulletsInExplosion(c),console.log(`領域爆発! ${c.size}ヶ所で爆発が発生`)}getTerritoryCoordinates(n,a){const f=new Set,c=[[n,a]],h=new Set;for(;c.length>0;){const[p,w]=c.pop(),S=this.getCoordinateKey(p,w);f.has(S)||this.isWall(p,w)||p<0||p>=G||w<0||w>=z||(f.add(S),h.add(S),c.push([p+1,w]),c.push([p-1,w]),c.push([p,w+1]),c.push([p,w-1]))}return h}destroyWallsInExplosion(n){let a=0;for(const f of n){const[c,h]=f.split(",").map(Number);for(let p=-1;p<=1;p++)for(let w=-1;w<=1;w++){const S=c+p,E=h+w,T=this.getCoordinateKey(S,E);this.dynamicWalls.has(T)&&(this.dynamicWalls.delete(T),a++)}}a>0&&console.log(`${a}個の動的壁が爆発で破壊されました`)}destroyBulletsInExplosion(n){let a=0;for(const f of this.enemyBullets){if(!f.active)continue;const c=this.getCoordinateKey(f.x,f.y);n.has(c)&&(f.active=!1,a++)}a>0&&console.log(`${a}個の敵弾が爆発で破壊されました`)}}function Ms(){return{up:keyboard.code.ArrowUp.isPressed||keyboard.code.KeyW.isPressed,down:keyboard.code.ArrowDown.isPressed||keyboard.code.KeyS.isPressed,left:keyboard.code.ArrowLeft.isPressed||keyboard.code.KeyA.isPressed,right:keyboard.code.ArrowRight.isPressed||keyboard.code.KeyD.isPressed,action1:keyboard.code.Space.isPressed||keyboard.code.Enter.isPressed||keyboard.code.KeyZ.isPressed||keyboard.code.KeyX.isPressed}}function Es(o,n,a,f,c){for(let h=0;h<a;h++)for(let p=0;p<n;p++){const w=o[h][p],S=p*f+f/2,E=h*c+c/2;if(w.char!==" "){let T=w.attributes.color||"white";T==="black"?T="white":T==="white"&&(T="black"),text(w.char,S,E,{color:T,isSmallText:!0})}}}function Ts(o=G,n=z,a=4,f=6){return{viewSize:{x:o*a,y:n*f},isSoundEnabled:!1,isShowingScore:!1,theme:"dark"}}function Os(o,n=p=>p.getScore()>=100,a=G,f=z,c=4,h=6){let p;function w(){p=o(),p.initializeGame()}function S(){(!p||keyboard.code.KeyR.isJustPressed)&&w();const E=Ms();p.update(E);const T=p.getVirtualScreenData();Es(T,a,f,c,h)}return{gameUpdate:S,resetGame:w}}function Rs(o,n,a){const c={...Ts(),...a},{gameUpdate:h}=Os(o,n);init({update:h,options:c})}Rs(()=>new Ps);
