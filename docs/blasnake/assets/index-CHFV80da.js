(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function t(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerPolicy&&(a.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?a.credentials="include":l.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(l){if(l.ep)return;l.ep=!0;const a=t(l);fetch(l.href,a)}})();(function(o){function e(n,s=0,r=1){return Math.max(s,Math.min(n,r))}function t(n,s,r){const c=r-s,d=n-s;if(d>=0)return d%c+s;{let f=c+d%c+s;return f>=r&&(f-=c),f}}function i(n,s,r){return s<=n&&n<r}function l(n){return[...Array(n).keys()]}function a(n,s){return l(n).map(r=>s(r))}function u(n,s){let r=[];for(let c=0,d=0;c<n.length;d++)s(n[c],d)?(r.push(n[c]),n.splice(c,1)):c++;return r}function m(n){return[...n].reduce((s,[r,c])=>(s[r]=c,s),{})}function y(n){return Object.keys(n).map(s=>[s,n[s]])}function C(n,s){return String.fromCharCode(n.charCodeAt(0)+s)}function M(n){return n.x!=null&&n.y!=null}class T{constructor(s,r){this.x=0,this.y=0,this.set(s,r)}set(s=0,r=0){return M(s)?(this.x=s.x,this.y=s.y,this):(this.x=s,this.y=r,this)}add(s,r){return M(s)?(this.x+=s.x,this.y+=s.y,this):(this.x+=s,this.y+=r,this)}sub(s,r){return M(s)?(this.x-=s.x,this.y-=s.y,this):(this.x-=s,this.y-=r,this)}mul(s){return this.x*=s,this.y*=s,this}div(s){return this.x/=s,this.y/=s,this}clamp(s,r,c,d){return this.x=e(this.x,s,r),this.y=e(this.y,c,d),this}wrap(s,r,c,d){return this.x=t(this.x,s,r),this.y=t(this.y,c,d),this}addWithAngle(s,r){return this.x+=Math.cos(s)*r,this.y+=Math.sin(s)*r,this}swapXy(){const s=this.x;return this.x=this.y,this.y=s,this}normalize(){return this.div(this.length),this}rotate(s){if(s===0)return this;const r=this.x;return this.x=r*Math.cos(s)-this.y*Math.sin(s),this.y=r*Math.sin(s)+this.y*Math.cos(s),this}angleTo(s,r){return M(s)?Math.atan2(s.y-this.y,s.x-this.x):Math.atan2(r-this.y,s-this.x)}distanceTo(s,r){let c,d;return M(s)?(c=s.x-this.x,d=s.y-this.y):(c=s-this.x,d=r-this.y),Math.sqrt(c*c+d*d)}isInRect(s,r,c,d){return i(this.x,s,s+c)&&i(this.y,r,r+d)}equals(s){return this.x===s.x&&this.y===s.y}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get angle(){return Math.atan2(this.y,this.x)}}const O=["transparent","white","red","green","yellow","blue","purple","cyan","black","light_red","light_green","light_yellow","light_blue","light_purple","light_cyan","light_black"],j="twrgybpclRGYBPCL";let J,Z;const gi=[15658734,15277667,5025616,16761095,4149685,10233776,240116,6381921];function wt(n,s){const[r,c,d]=Je(0,n);if(J=m(O.map((f,p)=>{if(p<1)return[f,{r:0,g:0,b:0,a:0}];if(p<9){const[P,R,v]=Je(p-1,n);return[f,{r:P,g:R,b:v,a:1}]}const[S,w,x]=Je(p-9+1,n);return[f,{r:Math.floor(n?S*.5:r-(r-S)*.5),g:Math.floor(n?w*.5:d-(d-w)*.5),b:Math.floor(n?x*.5:c-(c-x)*.5),a:1}]})),n){const f=J.blue;J.white={r:Math.floor(f.r*.15),g:Math.floor(f.g*.15),b:Math.floor(f.b*.15),a:1}}s!=null&&xt(s)}function xt(n){Z=n.map(s=>({r:s[0],g:s[1],b:s[2],a:1}));for(let s=0;s<O.length;s++){let r=1/0,c=-1;for(let d=0;d<Z.length;d++){const f=Mt(Z[d],J[O[s]]);f<r&&(r=f,c=d)}J[O[s]]=Z[c]}}function Mt(n,s){const r={r:.299,g:.587,b:.114},c=n.r-s.r,d=n.g-s.g,f=n.b-s.b,p=s.r===s.g&&s.g===s.b;let S=Math.sqrt(c*c*r.r+d*d*r.g+f*f*r.b);return p&&!(s.r===0&&s.g===0&&s.b===0)&&(S*=1.5),S}function Je(n,s){s&&(n===0?n=7:n===7&&(n=0));const r=gi[n];return[(r&16711680)>>16,(r&65280)>>8,r&255]}function xe(n,s=1){const r=typeof n=="number"?Z[n]:J[n];return Math.floor(r.r*s)<<16|Math.floor(r.g*s)<<8|Math.floor(r.b*s)}function Me(n,s=1){const r=typeof n=="number"?Z[n]:J[n],c=Math.floor(r.r*s),d=Math.floor(r.g*s),f=Math.floor(r.b*s);return r.a<1?`rgba(${c},${d},${f},${r.a})`:`rgb(${c},${d},${f})`}const Ln=`
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
`;function kn(n,s){return new PIXI.Filter(void 0,Ln,{width:n,height:s})}const H=new T;let U,ae,F,$=new T;const yi=5;document.createElement("img");let B,ke,Oe=1,vt="black",K,pi,ve=!1,k,Ei;function On(n,s,r,c,d,f,p,S){H.set(n),k=S,vt=r;const w=`
-webkit-touch-callout: none;
-webkit-tap-highlight-color: ${s};
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
background: ${s};
color: #888;
`,x=`
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%);
`,P=`
image-rendering: -moz-crisp-edges;
image-rendering: -webkit-optimize-contrast;
image-rendering: -o-crisp-edges;
image-rendering: pixelated;
`;if(document.body.style.cssText=w,$.set(H),k.isUsingPixi){$.mul(yi);const v=new PIXI.Application({width:$.x,height:$.y});if(U=v.view,F=new PIXI.Graphics,F.scale.x=F.scale.y=yi,PIXI.settings.SCALE_MODE=PIXI.SCALE_MODES.NEAREST,v.stage.addChild(F),F.filters=[],k.name==="crt"&&F.filters.push(Ei=new PIXI.filters.CRTFilter({vignettingAlpha:.7})),k.name==="pixel"&&F.filters.push(kn($.x,$.y)),k.name==="pixel"||k.name==="shapeDark"){const A=new PIXI.filters.AdvancedBloomFilter({threshold:.1,bloomScale:k.name==="pixel"?1.5:1,brightness:k.name==="pixel"?1.5:1,blur:8});F.filters.push(A)}F.lineStyle(0),U.style.cssText=x}else U=document.createElement("canvas"),U.width=$.x,U.height=$.y,ae=U.getContext("2d"),ae.imageSmoothingEnabled=!1,U.style.cssText=x+P;document.body.appendChild(U);const R=()=>{const A=innerWidth/innerHeight,G=$.x/$.y,N=A<G,V=N?.95*innerWidth:.95*innerHeight*G,W=N?.95*innerWidth/G:.95*innerHeight;U.style.width=`${V}px`,U.style.height=`${W}px`};if(window.addEventListener("resize",R),R(),c){B=document.createElement("canvas");let v;d?(B.width=$.x,B.height=$.y,v=f):($.x<=$.y*2?(B.width=$.y*2,B.height=$.y):(B.width=$.x,B.height=$.x/2),B.width>400&&(Oe=400/B.width,B.width=400,B.height*=Oe),v=Math.round(400/B.width)),ke=B.getContext("2d"),ke.fillStyle=s,gcc.setOptions({scale:v,capturingFps:60,isSmoothingEnabled:!1,durationSec:p})}}function qe(){if(k.isUsingPixi){F.clear(),F.beginFill(xe(vt,k.isDarkColor?.15:1)),F.drawRect(0,0,H.x,H.y),F.endFill(),F.beginFill(xe(K)),ve=!0;return}ae.fillStyle=Me(vt,k.isDarkColor?.15:1),ae.fillRect(0,0,H.x,H.y),ae.fillStyle=Me(K)}function ie(n){if(n===K){k.isUsingPixi&&!ve&&Ze(xe(K));return}if(K=n,k.isUsingPixi){ve&&F.endFill(),Ze(xe(K));return}ae.fillStyle=Me(n)}function Ze(n){Qe(),F.beginFill(n),ve=!0}function Qe(){ve&&(F.endFill(),ve=!1)}function et(){pi=K}function tt(){ie(pi)}function Ie(n,s,r,c){if(k.isUsingPixi){k.name==="shape"||k.name==="shapeDark"?F.drawRoundedRect(n,s,r,c,2):F.drawRect(n,s,r,c);return}ae.fillRect(n,s,r,c)}function Fn(n,s,r,c,d){const f=xe(K);Ze(f),F.drawCircle(n,s,d*.5),F.drawCircle(r,c,d*.5),Qe(),F.lineStyle(d,f),F.moveTo(n,s),F.lineTo(r,c),F.lineStyle(0)}function Gn(){Ei.time+=.2}function Nn(){if(ke.fillRect(0,0,B.width,B.height),Oe===1)ke.drawImage(U,(B.width-U.width)/2,(B.height-U.height)/2);else{const n=U.width*Oe,s=U.height*Oe;ke.drawImage(U,(B.width-n)/2,(B.height-s)/2,n,s)}gcc.capture(B)}const Si=[`
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

`],_n=[`
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

`];let De,it;function Bn(){De=[],it=[]}function Ci(){De=De.concat(it),it=[]}function Ti(n){let s={isColliding:{rect:{},text:{},char:{}}};return De.forEach(r=>{Wn(n,r)&&(s=Object.assign(Object.assign(Object.assign({},s),It(r.collision.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},s.isColliding.rect),r.collision.isColliding.rect),text:Object.assign(Object.assign({},s.isColliding.text),r.collision.isColliding.text),char:Object.assign(Object.assign({},s.isColliding.char),r.collision.isColliding.char)}}))}),s}function Wn(n,s){const r=s.pos.x-n.pos.x,c=s.pos.y-n.pos.y;return-s.size.x<r&&r<n.size.x&&-s.size.y<c&&c<n.size.y}function It(n){if(n==null)return{};const s={transparent:"tr",white:"wh",red:"rd",green:"gr",yellow:"yl",blue:"bl",purple:"pr",cyan:"cy",black:"lc"};let r={};return y(n).forEach(([c,d])=>{const f=s[c];d&&f!=null&&(r[f]=!0)}),r}function wi(n,s,r,c){return xi(!1,n,s,r,c)}function Hn(n,s,r,c){return xi(!0,n,s,r,c)}function xi(n,s,r,c,d){if(typeof r=="number"){if(typeof c=="number")return oe(s,r,c,Object.assign({isCharacter:n,isCheckingCollision:!0,color:K},d));throw"invalid params"}else return oe(s,r.x,r.y,Object.assign({isCharacter:n,isCheckingCollision:!0,color:K},c))}const Fe=6,Un=4,ne=1,_=Fe*ne,Re=Un*ne;let Dt,Rt,nt,Pt,bt=!1,Pe,At,Ge,st;const Lt={color:"black",backgroundColor:"transparent",rotation:0,mirror:{x:1,y:1},scale:{x:1,y:1},isSmallText:!1,edgeColor:void 0,isCharacter:!1,isCheckingCollision:!1};function $n(){Pe=document.createElement("canvas"),Pe.width=Pe.height=_,At=Pe.getContext("2d"),Ge=document.createElement("canvas"),st=Ge.getContext("2d"),Dt=Si.map((n,s)=>lt(n,String.fromCharCode(33+s),!1)),Rt=_n.map((n,s)=>lt(n,String.fromCharCode(33+s),!1)),nt=Si.map((n,s)=>lt(n,String.fromCharCode(33+s),!0)),Pt={}}function Vn(n,s){const r=s.charCodeAt(0)-33;n.forEach((c,d)=>{nt[r+d]=lt(c,String.fromCharCode(33+r+d),!0)})}function jn(){bt=!0}function oe(n,s,r,c={}){const d=Ii(c);let f=n,p=s,S=r,w,x={isColliding:{rect:{},text:{},char:{}}};const P=d.isSmallText?Re:_;for(let R=0;R<f.length;R++){if(R===0){const G=f.charCodeAt(0);if(G<33||G>126)p=Math.floor(p-_/2*d.scale.x),S=Math.floor(S-_/2*d.scale.y);else{const N=G-33,V=d.isCharacter?nt[N]:d.isSmallText?Rt[N]:Dt[N];p=Math.floor(p-V.size.x/2*d.scale.x),S=Math.floor(S-V.size.y/2*d.scale.y)}w=p}const v=f[R];if(v===`
`){p=w,S+=_*d.scale.y;continue}const A=zn(v,p,S,d);d.isCheckingCollision&&(x={isColliding:{rect:Object.assign(Object.assign({},x.isColliding.rect),A.isColliding.rect),text:Object.assign(Object.assign({},x.isColliding.text),A.isColliding.text),char:Object.assign(Object.assign({},x.isColliding.char),A.isColliding.char)}}),p+=P*d.scale.x}return x}function zn(n,s,r,c){const d=n.charCodeAt(0);if(d<32||d>126)return{isColliding:{rect:{},text:{},char:{}}};const f=Ii(c);if(f.backgroundColor!=="transparent"){const W=f.isSmallText?Re:_,Tt=f.isSmallText?2:1;et(),ie(f.backgroundColor),Ie(s+Tt,r,W*f.scale.x,_*f.scale.y),tt()}if(d<=32)return{isColliding:{rect:{},text:{},char:{}}};const p=d-33,S=f.isCharacter?nt[p]:f.isSmallText?Rt[p]:Dt[p],w=t(f.rotation,0,4);if(f.color==="black"&&w===0&&f.mirror.x===1&&f.mirror.y===1&&f.edgeColor==null&&(!k.isUsingPixi||f.scale.x===1&&f.scale.y===1))return kt(S,s,r,f.scale,f.isCheckingCollision,!0);const x=JSON.stringify({c:n,options:f}),P=Pt[x];if(P!=null)return kt(P,s,r,f.scale,f.isCheckingCollision,f.color!=="transparent");let R=!1;const v=new T(_,_);let A=Pe,G=At;if(S.size.x>_||S.size.y>_){if(w===0||w===2)v.set(S.size.x,S.size.y);else{const W=Math.max(S.size.x,S.size.y);v.set(W,W)}A=document.createElement("canvas"),A.width=v.x,A.height=v.y,G=A.getContext("2d"),G.imageSmoothingEnabled=!1}k.isUsingPixi&&(f.scale.x!==1||f.scale.y!==1)&&(Ge.width=v.x*f.scale.x,Ge.height=v.y*f.scale.y,st.imageSmoothingEnabled=!1,st.scale(f.scale.x,f.scale.y),Mi(st,w,f,S.image,v),R=!0),G.clearRect(0,0,v.x,v.y),Mi(G,w,f,S.image,v);const N=Ot(G,v,n,f.isCharacter);f.edgeColor!=null&&(A=Kn(G,v,f.edgeColor),v.x+=2,v.y+=2);let V;if(bt||k.isUsingPixi){const W=document.createElement("img");if(W.src=A.toDataURL(),k.isUsingPixi){const Tt=document.createElement("img");Tt.src=(R?Ge:A).toDataURL(),V=PIXI.Texture.from(Tt)}bt&&(Pt[x]={image:W,texture:V,hitBox:N,size:v})}return kt({image:A,texture:V,hitBox:N,size:v},s,r,f.scale,f.isCheckingCollision,f.color!=="transparent")}function Kn(n,s,r){const c=s.x+2,d=s.y+2,f=[[0,-1],[1,0],[0,1],[-1,0]],p=document.createElement("canvas");p.width=c,p.height=d;const S=p.getContext("2d");S.imageSmoothingEnabled=!1,S.drawImage(n.canvas,1,1);const x=S.getImageData(0,0,c,d).data;S.fillStyle=Me(r);for(let P=0;P<d;P++)for(let R=0;R<c;R++){const v=(P*c+R)*4;if(x[v+3]===0)for(const[A,G]of f){const N=R+A,V=P+G;if(N>=0&&N<c&&V>=0&&V<d){const W=(V*c+N)*4;if(x[W+3]>0){S.fillRect(R,P,1,1);break}}}}return p}function Mi(n,s,r,c,d){s===0&&r.mirror.x===1&&r.mirror.y===1?n.drawImage(c,0,0):(n.save(),n.translate(d.x/2,d.y/2),n.rotate(Math.PI/2*s),(r.mirror.x===-1||r.mirror.y===-1)&&n.scale(r.mirror.x,r.mirror.y),n.drawImage(c,-d.x/2,-d.y/2),n.restore()),r.color!=="black"&&(n.globalCompositeOperation="source-in",n.fillStyle=Me(r.color==="transparent"?"black":r.color),n.fillRect(0,0,d.x,d.y),n.globalCompositeOperation="source-over")}function kt(n,s,r,c,d,f){if(f&&(c.x===1&&c.y===1?vi(n,s,r):vi(n,s,r,n.size.x*c.x,n.size.y*c.y)),!d)return;const p={pos:{x:s+n.hitBox.pos.x*c.x,y:r+n.hitBox.pos.y*c.y},size:{x:n.hitBox.size.x*c.x,y:n.hitBox.size.y*c.y},collision:n.hitBox.collision},S=Ti(p);return f&&De.push(p),S}function vi(n,s,r,c,d){if(k.isUsingPixi){Qe(),F.beginTextureFill({texture:n.texture,matrix:new PIXI.Matrix().translate(s,r)}),F.drawRect(s,r,c??n.size.x,d??n.size.y),Ze(xe(K));return}c==null?ae.drawImage(n.image,s,r):ae.drawImage(n.image,s,r,c,d)}function lt(n,s,r){if(n.indexOf(".")>=0||n.indexOf("data:image/")==0)return Yn(n,s);let c=n.split(`
`);c=c.slice(1,c.length-1);let d=0;c.forEach(A=>{d=Math.max(A.length,d)});const f=Math.max(Math.ceil((Fe-d)/2),0),p=c.length,S=Math.max(Math.ceil((Fe-p)/2),0),w=new T(Math.max(Fe,d)*ne,Math.max(Fe,p)*ne);let x=Pe,P=At;(w.x>_||w.y>_)&&(x=document.createElement("canvas"),x.width=w.x,x.height=w.y,P=x.getContext("2d"),P.imageSmoothingEnabled=!1),P.clearRect(0,0,w.x,w.y),c.forEach((A,G)=>{for(let N=0;N<d;N++){const V=A.charAt(N);let W=j.indexOf(V);V!==""&&W>=1&&(P.fillStyle=Me(O[W]),P.fillRect((N+f)*ne,(G+S)*ne,ne,ne))}});const R=document.createElement("img");R.src=x.toDataURL();const v=Ot(P,w,s,r);return k.isUsingPixi?{image:R,texture:PIXI.Texture.from(R),size:w,hitBox:v}:{image:R,size:w,hitBox:v}}function Yn(n,s){const r=document.createElement("img");r.src=n;const c=new T,d={pos:new T,size:new T,collision:{isColliding:{char:{},text:{}}}};let f;return k.isUsingPixi?f={image:r,texture:PIXI.Texture.from(r),size:new T,hitBox:d}:f={image:r,size:c,hitBox:d},r.onload=()=>{f.size.set(r.width*ne,r.height*ne);const p=document.createElement("canvas");p.width=f.size.x,p.height=f.size.y;const S=p.getContext("2d");S.imageSmoothingEnabled=!1,S.drawImage(r,0,0,f.size.x,f.size.y);const w=document.createElement("img");w.src=p.toDataURL(),f.image=w,f.hitBox=Ot(S,f.size,s,!0),k.isUsingPixi&&(f.texture=PIXI.Texture.from(w))},f}function Ot(n,s,r,c){const d={pos:new T(_,_),size:new T,collision:{isColliding:{char:{},text:{}}}};c?d.collision.isColliding.char[r]=!0:d.collision.isColliding.text[r]=!0;const f=n.getImageData(0,0,s.x,s.y).data;let p=0;for(let S=0;S<s.y;S++)for(let w=0;w<s.x;w++)f[p+3]>0&&(w<d.pos.x&&(d.pos.x=w),S<d.pos.y&&(d.pos.y=S)),p+=4;p=0;for(let S=0;S<s.y;S++)for(let w=0;w<s.x;w++)f[p+3]>0&&(w>d.pos.x+d.size.x-1&&(d.size.x=w-d.pos.x+1),S>d.pos.y+d.size.y-1&&(d.size.y=S-d.pos.y+1)),p+=4;return d}function Ii(n){let s=Object.assign(Object.assign({},Lt),n);return n.scale!=null&&(s.scale=Object.assign(Object.assign({},Lt.scale),n.scale)),n.mirror!=null&&(s.mirror=Object.assign(Object.assign({},Lt.mirror),n.mirror)),s}let be=!1,rt=!1,Ft=!1;const Di=["Escape","Digit0","Digit1","Digit2","Digit3","Digit4","Digit5","Digit6","Digit7","Digit8","Digit9","Minus","Equal","Backspace","Tab","KeyQ","KeyW","KeyE","KeyR","KeyT","KeyY","KeyU","KeyI","KeyO","KeyP","BracketLeft","BracketRight","Enter","ControlLeft","KeyA","KeyS","KeyD","KeyF","KeyG","KeyH","KeyJ","KeyK","KeyL","Semicolon","Quote","Backquote","ShiftLeft","Backslash","KeyZ","KeyX","KeyC","KeyV","KeyB","KeyN","KeyM","Comma","Period","Slash","ShiftRight","NumpadMultiply","AltLeft","Space","CapsLock","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","Pause","ScrollLock","Numpad7","Numpad8","Numpad9","NumpadSubtract","Numpad4","Numpad5","Numpad6","NumpadAdd","Numpad1","Numpad2","Numpad3","Numpad0","NumpadDecimal","IntlBackslash","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","IntlYen","Undo","Paste","MediaTrackPrevious","Cut","Copy","MediaTrackNext","NumpadEnter","ControlRight","LaunchMail","AudioVolumeMute","MediaPlayPause","MediaStop","Eject","AudioVolumeDown","AudioVolumeUp","BrowserHome","NumpadDivide","PrintScreen","AltRight","Help","NumLock","Pause","Home","ArrowUp","PageUp","ArrowLeft","ArrowRight","End","ArrowDown","PageDown","Insert","Delete","OSLeft","OSRight","ContextMenu","BrowserSearch","BrowserFavorites","BrowserRefresh","BrowserStop","BrowserForward","BrowserBack"];let Gt;const Xn={onKeyDown:void 0};let Nt,_t=!1,Bt=!1,Wt=!1,Ht={},Ut={},$t={};function Ri(n){Nt=Object.assign(Object.assign({},Xn),n),Gt=m(Di.map(s=>[s,{isPressed:!1,isJustPressed:!1,isJustReleased:!1}])),document.addEventListener("keydown",s=>{_t=Bt=!0,Ht[s.code]=Ut[s.code]=!0,Nt.onKeyDown!=null&&Nt.onKeyDown(),(s.code==="AltLeft"||s.code==="AltRight"||s.code==="ArrowRight"||s.code==="ArrowDown"||s.code==="ArrowLeft"||s.code==="ArrowUp")&&s.preventDefault()}),document.addEventListener("keyup",s=>{_t=!1,Wt=!0,Ht[s.code]=!1,$t[s.code]=!0})}function Pi(){rt=!be&&Bt,Ft=be&&Wt,Bt=Wt=!1,be=_t,y(Gt).forEach(([n,s])=>{s.isJustPressed=!s.isPressed&&Ut[n],s.isJustReleased=s.isPressed&&$t[n],s.isPressed=!!Ht[n]}),Ut={},$t={}}function bi(){rt=!1,be=!0}var Jn=Object.freeze({__proto__:null,get isPressed(){return be},get isJustPressed(){return rt},get isJustReleased(){return Ft},codes:Di,get code(){return Gt},init:Ri,update:Pi,clearJustPressed:bi});class at{constructor(s=null){this.setSeed(s)}get(s=1,r){return r==null&&(r=s,s=0),this.next()/4294967295*(r-s)+s}getInt(s,r){r==null&&(r=s,s=0);const c=Math.floor(s),d=Math.floor(r);return d===c?c:this.next()%(d-c)+c}getPlusOrMinus(){return this.getInt(2)*2-1}select(s){return s[this.getInt(s.length)]}setSeed(s,r=123456789,c=362436069,d=521288629,f=32){this.w=s!=null?s>>>0:Math.floor(Math.random()*4294967295)>>>0,this.x=r>>>0,this.y=c>>>0,this.z=d>>>0;for(let p=0;p<f;p++)this.next();return this}getState(){return{x:this.x,y:this.y,z:this.z,w:this.w}}next(){const s=this.x^this.x<<11;return this.x=this.y,this.y=this.z,this.z=this.w,this.w=(this.w^this.w>>>19^(s^s>>>8))>>>0,this.w}}const Ne=new T;let ce=!1,Ae=!1,_e=!1,qn={isDebugMode:!1,anchor:new T,padding:new T,onPointerDownOrUp:void 0},Y,Q,z;const Be=new at,pe=new T,he=new T;let We=!1,He=new T,Vt=!1,jt=!1,zt=!1;function Ai(n,s,r){z=Object.assign(Object.assign({},qn),r),Y=n,Q=new T(s.x+z.padding.x*2,s.y+z.padding.y*2),He.set(Y.offsetLeft+Y.clientWidth*(.5-z.anchor.x),Y.offsetTop+Y.clientWidth*(.5-z.anchor.y)),z.isDebugMode&&pe.set(Y.offsetLeft+Y.clientWidth*(.5-z.anchor.x),Y.offsetTop+Y.clientWidth*(.5-z.anchor.y)),document.addEventListener("mousedown",c=>{Oi(c.pageX,c.pageY)}),document.addEventListener("touchstart",c=>{Oi(c.touches[0].pageX,c.touches[0].pageY)}),document.addEventListener("mousemove",c=>{Fi(c.pageX,c.pageY)}),document.addEventListener("touchmove",c=>{c.preventDefault(),Fi(c.touches[0].pageX,c.touches[0].pageY)},{passive:!1}),document.addEventListener("mouseup",c=>{Gi()}),document.addEventListener("touchend",c=>{c.preventDefault(),c.target.click(),Gi()},{passive:!1})}function Li(){Zn(He.x,He.y,Ne),z.isDebugMode&&!Ne.isInRect(0,0,Q.x,Q.y)?(Qn(),Ne.set(pe),Ae=!ce&&We,_e=ce&&!We,ce=We):(Ae=!ce&&jt,_e=ce&&zt,ce=Vt),jt=zt=!1}function ki(){Ae=!1,ce=!0}function Zn(n,s,r){Y!=null&&(r.x=Math.round(((n-Y.offsetLeft)/Y.clientWidth+z.anchor.x)*Q.x-z.padding.x),r.y=Math.round(((s-Y.offsetTop)/Y.clientHeight+z.anchor.y)*Q.y-z.padding.y))}function Qn(){he.length>0?(pe.add(he),!i(pe.x,-Q.x*.1,Q.x*1.1)&&pe.x*he.x>0&&(he.x*=-1),!i(pe.y,-Q.y*.1,Q.y*1.1)&&pe.y*he.y>0&&(he.y*=-1),Be.get()<.05&&he.set(0)):Be.get()<.1&&(he.set(0),he.addWithAngle(Be.get(Math.PI*2),(Q.x+Q.y)*Be.get(.01,.03))),Be.get()<.05&&(We=!We)}function Oi(n,s){He.set(n,s),Vt=jt=!0,z.onPointerDownOrUp!=null&&z.onPointerDownOrUp()}function Fi(n,s){He.set(n,s)}function Gi(n){Vt=!1,zt=!0,z.onPointerDownOrUp!=null&&z.onPointerDownOrUp()}var es=Object.freeze({__proto__:null,pos:Ne,get isPressed(){return ce},get isJustPressed(){return Ae},get isJustReleased(){return _e},init:Ai,update:Li,clearJustPressed:ki});let ue=new T,de=!1,se=!1,ge=!1;function Ni(n){Ri({onKeyDown:n}),Ai(U,H,{onPointerDownOrUp:n,anchor:new T(.5,.5)})}function _i(){Pi(),Li(),ue=Ne,de=be||ce,se=rt||Ae,ge=Ft||_e}function Bi(){bi(),ki()}function Ue(n){ue.set(n.pos),de=n.isPressed,se=n.isJustPressed,ge=n.isJustReleased}var ts=Object.freeze({__proto__:null,get pos(){return ue},get isPressed(){return de},get isJustPressed(){return se},get isJustReleased(){return ge},init:Ni,update:_i,clearJustPressed:Bi,set:Ue});let X,$e,Kt=!1,Wi,Hi,Yt,me={};function Ui(n,s=1){const r=me[n];return r==null?!1:(r.gainNode.gain.value=s,r.isPlaying=!0,!0)}function is(){const n=X.currentTime;for(const s in me){const r=me[s];if(!r.isReady||!r.isPlaying)continue;r.isPlaying=!1;const c=us(n);(r.playedTime==null||c>r.playedTime)&&(os(r,c),r.playedTime=c)}}function $i(n,s=void 0){const r=me[n];r.source!=null&&(s==null?r.source.stop():r.source.stop(s),r.source=void 0)}function ns(n=void 0){if(me){for(const s in me)$i(s,n);me={}}}function ss(){X=new(window.AudioContext||window.webkitAudioContext),document.addEventListener("visibilitychange",()=>{document.hidden?X.suspend():X.resume()})}function ls(){Kt=!0,$e=X.createGain(),$e.connect(X.destination),Vi(),as(),ji()}function rs(n,s){return me[n]=cs(s),me[n]}function Vi(n=120){Wi=n,Hi=60/Wi}function as(n=8){Yt=n>0?4/n:void 0}function ji(n=.1){$e.gain.value=n}function os(n,s){const r=X.createBufferSource();n.source=r,r.buffer=n.buffer,r.loop=n.isLooping,r.start=r.start||r.noteOn,r.connect(n.gainNode),r.start(s)}function cs(n){const s={buffer:void 0,source:void 0,gainNode:X.createGain(),isPlaying:!1,playedTime:void 0,isReady:!1,isLooping:!1};return s.gainNode.connect($e),hs(n).then(r=>{s.buffer=r,s.isReady=!0}),s}async function hs(n){const r=await(await fetch(n)).arrayBuffer();return await X.decodeAudioData(r)}function us(n){if(Yt==null)return n;const s=Hi*Yt;return s>0?Math.ceil(n/s)*s:n}let zi,Ki;const Yi=68,Xt=1e3/Yi;let Ve=0;const ds={viewSize:{x:100,y:100},bodyBackground:"#111",viewBackground:"black",isCapturing:!1,isCapturingGameCanvasOnly:!1,isSoundEnabled:!0,captureCanvasScale:1,theme:{name:"simple",isUsingPixi:!1,isDarkColor:!1},colorPalette:void 0};let q,Xi=10,ot;function ms(n,s,r){zi=n,Ki=s,q=Object.assign(Object.assign({},ds),r),wt(q.theme.isDarkColor,q.colorPalette),On(q.viewSize,q.bodyBackground,q.viewBackground,q.isCapturing,q.isCapturingGameCanvasOnly,q.captureCanvasScale,q.captureDurationSec,q.theme),Ni(()=>{X.resume()}),$n(),zi(),Ji()}function Ji(){ot=requestAnimationFrame(Ji);const n=window.performance.now();n<Ve-Yi/12||(Ve+=Xt,(Ve<n||Ve>n+Xt*2)&&(Ve=n+Xt),Kt&&is(),q.isSoundEnabled&&sss.update(),_i(),Ki(),q.isCapturing&&Nn(),Xi--,Xi===0&&jn())}function fs(){ot&&(cancelAnimationFrame(ot),ot=void 0)}let ct;const ht=new at;function Jt(){ct=[]}function qi(n,s=16,r=1,c=0,d=Math.PI*2,f=void 0){if(s<1){if(ht.get()>s)return;s=1}for(let p=0;p<s;p++){const S=c+ht.get(d)-d/2,w={pos:new T(n),vel:new T(r*ht.get(.5,1),0).rotate(S),color:K,ticks:e(ht.get(10,20)*Math.sqrt(Math.abs(r)),10,60),edgeColor:f};ct.push(w)}}function ut(){et(),ct=ct.filter(n=>{if(n.ticks--,n.ticks<0)return!1;n.pos.add(n.vel),n.vel.mul(.98);const s=Math.floor(n.pos.x),r=Math.floor(n.pos.y);return n.edgeColor!=null&&(ie(n.edgeColor),Ie(s-1,r-1,3,3)),ie(n.color),Ie(s,r,1,1),!0}),tt()}function qt(n,s,r,c){return Zi(!1,n,s,r,c)}function gs(n,s,r,c){return Zi(!0,n,s,r,c)}function ys(n,s,r,c,d=.5,f=.5){typeof n!="number"&&(f=d,d=c,c=r,r=s,s=n.y,n=n.x);const p=new T(r).rotate(d),S=new T(n-p.x*f,s-p.y*f);return Zt(S,p,c)}function ps(n,s,r=3,c=3,d=3){const f=new T,p=new T;if(typeof n=="number")if(typeof s=="number")typeof r=="number"?(f.set(n,s),p.set(r,c)):(f.set(n,s),p.set(r),d=c);else throw"invalid params";else if(typeof s=="number")if(typeof r=="number")f.set(n),p.set(s,r),d=c;else throw"invalid params";else if(typeof r=="number")f.set(n),p.set(s),d=r;else throw"invalid params";return Zt(f,p.sub(f),d)}function Es(n,s,r,c,d,f){let p=new T;typeof n=="number"?p.set(n,s):(p.set(n),f=d,d=c,c=r,r=s),c==null&&(c=3),d==null&&(d=0),f==null&&(f=Math.PI*2);let S,w;if(d>f?(S=f,w=d-f):(S=d,w=f-d),w=e(w,0,Math.PI*2),w<.01)return;const x=e(Math.ceil(w*Math.sqrt(r*.25)),1,36),P=w/x;let R=S,v=new T(r).rotate(R).add(p),A=new T,G=new T,N={isColliding:{rect:{},text:{},char:{}}};for(let V=0;V<x;V++){R+=P,A.set(r).rotate(R).add(p),G.set(A).sub(v);const W=Zt(v,G,c,!0);N=Object.assign(Object.assign(Object.assign({},N),It(W.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},N.isColliding.rect),W.isColliding.rect),text:Object.assign(Object.assign({},N.isColliding.text),W.isColliding.text),char:Object.assign(Object.assign({},N.isColliding.char),W.isColliding.char)}}),v.set(A)}return Ci(),N}function Zi(n,s,r,c,d){if(typeof s=="number"){if(typeof r=="number")return typeof c=="number"?d==null?Ee(n,s,r,c,c):Ee(n,s,r,c,d):Ee(n,s,r,c.x,c.y);throw"invalid params"}else if(typeof r=="number"){if(c==null)return Ee(n,s.x,s.y,r,r);if(typeof c=="number")return Ee(n,s.x,s.y,r,c);throw"invalid params"}else return Ee(n,s.x,s.y,r.x,r.y)}function Zt(n,s,r,c=!1){let d=!0;(k.name==="shape"||k.name==="shapeDark")&&(K!=="transparent"&&Fn(n.x,n.y,n.x+s.x,n.y+s.y,r),d=!1);const f=Math.floor(e(r,3,10)),p=Math.abs(s.x),S=Math.abs(s.y),w=e(Math.ceil(p>S?p/f:S/f)+1,3,99);s.div(w-1);let x={isColliding:{rect:{},text:{},char:{}}};for(let P=0;P<w;P++){const R=Ee(!0,n.x,n.y,r,r,!0,d);x=Object.assign(Object.assign(Object.assign({},x),It(R.isColliding.rect)),{isColliding:{rect:Object.assign(Object.assign({},x.isColliding.rect),R.isColliding.rect),text:Object.assign(Object.assign({},x.isColliding.text),R.isColliding.text),char:Object.assign(Object.assign({},x.isColliding.char),R.isColliding.char)}}),n.add(s)}return c||Ci(),x}function Ee(n,s,r,c,d,f=!1,p=!0){let S=p;(k.name==="shape"||k.name==="shapeDark")&&S&&K!=="transparent"&&(n?Ie(s-c/2,r-d/2,c,d):Ie(s,r,c,d),S=!1);let w=n?{x:Math.floor(s-c/2),y:Math.floor(r-d/2)}:{x:Math.floor(s),y:Math.floor(r)};const x={x:Math.trunc(c),y:Math.trunc(d)};if(x.x===0||x.y===0)return{isColliding:{rect:{},text:{},char:{}}};x.x<0&&(w.x+=x.x,x.x*=-1),x.y<0&&(w.y+=x.y,x.y*=-1);const P={pos:w,size:x,collision:{isColliding:{rect:{}}}};P.collision.isColliding.rect[K]=!0;const R=Ti(P);return K!=="transparent"&&((f?it:De).push(P),S&&Ie(w.x,w.y,x.x,x.y)),R}function Qt({pos:n,size:s,text:r,isToggle:c=!1,onClick:d=()=>{},isSmallText:f=!0}){return{pos:n,size:s,text:r,isToggle:c,onClick:d,isPressed:!1,isSelected:!1,isHovered:!1,toggleGroup:[],isSmallText:f}}function ei(n){const s=new T(ue).sub(n.pos);n.isHovered=s.isInRect(0,0,n.size.x,n.size.y),n.isHovered&&Ae&&(n.isPressed=!0),n.isPressed&&!n.isHovered&&(n.isPressed=!1),n.isPressed&&_e&&(n.onClick(),n.isPressed=!1,n.isToggle&&(n.toggleGroup.length===0?n.isSelected=!n.isSelected:(n.toggleGroup.forEach(r=>{r.isSelected=!1}),n.isSelected=!0))),dt(n)}function dt(n){et(),ie(n.isPressed?"blue":"light_blue"),qt(n.pos.x,n.pos.y,n.size.x,n.size.y),n.isToggle&&!n.isSelected&&(ie("white"),qt(n.pos.x+1,n.pos.y+1,n.size.x-2,n.size.y-2)),ie(n.isHovered?"black":"blue"),wi(n.text,n.pos.x+3,n.pos.y+3,{isSmallText:n.isSmallText}),tt()}let le,je,Se,ti;function Ss(n){le={randomSeed:n,inputs:[]}}function Cs(n){le.inputs.push(n)}function Qi(){return le!=null}function Ts(n){je=0,n.setSeed(le.randomSeed)}function ws(){je>=le.inputs.length||(Ue(le.inputs[je]),je++)}function xs(){Se=[]}function Ms(n,s,r){Se.push({randomState:r.getState(),gameState:cloneDeep(n),baseState:cloneDeep(s)})}function vs(n){const s=Se.pop(),r=s.randomState;return n.setSeed(r.w,r.x,r.y,r.z,0),ti={pos:new T(ue),isPressed:de,isJustPressed:se,isJustReleased:ge},Ue(le.inputs.pop()),s}function Is(n){const s=Se[Se.length-1],r=s.randomState;return n.setSeed(r.w,r.x,r.y,r.z,0),ti={pos:new T(ue),isPressed:de,isJustPressed:se,isJustReleased:ge},Ue(le.inputs[le.inputs.length-1]),s}function Ds(){Ue(ti)}function Rs(){return Se.length===0}function Ps(){const n=je-1;if(!(n>=le.inputs.length))return Se[n]}const ii=4,bs=60,As="video/webm;codecs=vp8,opus",Ls="video/webm",ks="recording.webm",Os=1e5*ii,Fs=.7;let ee,mt;function Gs(n,s,r){if(ee!=null)return;const c=document.createElement("canvas");c.width=n.width*ii,c.height=n.height*ii;const d=c.getContext("2d");d.imageSmoothingEnabled=!1;const f=()=>{d.drawImage(n,0,0,n.width,n.height,0,0,c.width,c.height),mt=requestAnimationFrame(f)};f();const p=c.captureStream(bs),S=s.createMediaStreamDestination(),w=s.createGain();w.gain.value=Fs,r.forEach(v=>{v!=null&&v.connect(w)}),w.connect(S);const x=S.stream,P=new MediaStream([...p.getVideoTracks(),...x.getAudioTracks()]);ee=new MediaRecorder(P,{mimeType:As,videoBitsPerSecond:Os});let R=[];ee.ondataavailable=v=>{v.data.size>0&&R.push(v.data)},ee.onstop=()=>{const v=new Blob(R,{type:Ls}),A=URL.createObjectURL(v),G=document.createElement("a");G.href=A,G.download=ks,G.click(),URL.revokeObjectURL(A),R=[]},ee.start()}function Ns(){ee!=null&&ee.state!=="inactive"&&(ee.stop(),ee=void 0),mt&&(cancelAnimationFrame(mt),mt=void 0)}function _s(){return ee!=null&&ee.state==="recording"}const Bs=Math.PI,Ws=Math.abs,Hs=Math.sin,Us=Math.cos,$s=Math.atan2,Vs=Math.sqrt,js=Math.pow,zs=Math.floor,Ks=Math.round,Ys=Math.ceil;o.ticks=0,o.difficulty=void 0,o.score=0,o.time=void 0,o.isReplaying=!1;function Xs(n=1,s){return fe.get(n,s)}function Js(n=2,s){return fe.getInt(n,s)}function qs(n=1,s){return fe.get(n,s)*fe.getPlusOrMinus()}function ni(n="GAME OVER"){Et=n,E.isShowingTime&&(o.time=void 0),cn()}function Zs(n="COMPLETE"){Et=n,cn()}function Qs(n,s,r){if(o.isReplaying||(o.score+=n,s==null))return;const c=`${n>=1?"+":""}${Math.floor(n)}`;let d=new T;typeof s=="number"?d.set(s,r):d.set(s),d.x-=c.length*(E.isUsingSmallText?Re:_)/2,d.y-=_/2,yt.push({str:c,pos:d,vy:-2,ticks:30})}function en(n){ie(n)}function el(n,s,r,c,d,f){let p=new T;typeof n=="number"?(p.set(n,s),S(p,r,c,d,f)):(p.set(n),S(p,s,r,c,d));function S(w,x,P,R,v){if(El(x)){const A=x;qi(w,A.count,A.speed,A.angle,A.angleWidth,A.edgeColor)}else qi(w,x,P,R,v)}}function tn(n,s){return new T(n,s)}function nn(n,s){!Ye&&!Te&&(Kt&&Ui(n,s!=null&&s.volume!=null?s.volume:1)||(E.isSoundEnabled&&typeof sss.playSoundEffect=="function"?sss.playSoundEffect(n,s):E.isSoundEnabled&&sss.play(nl[n])))}let si;function li(){ci&&Ui(E.bgmName,E.bgmVolume)||(typeof sss.generateMml=="function"?si=sss.playMml(sss.generateMml(),{volume:E.bgmVolume}):sss.playBgm())}function ri(){ci?$i(E.bgmName):si!=null?sss.stopMml(si):sss.stopBgm()}function sn(){Gs(U,X,[$e,Ct])}function ai(){Ns()}function tl(n){if(Ye){const s=Is(fe),r=s.baseState;return o.score=r.score,o.ticks=r.ticks,cloneDeep(s.gameState)}else if(Te){const s=vs(fe),r=s.baseState;return o.score=r.score,o.ticks=r.ticks,s.gameState}else{if(o.isReplaying)return Ps().gameState;if(Ce==="inGame"){const s={score:o.score,ticks:o.ticks};Ms(n,s,fe)}}return n}function il(){Te||(!o.isReplaying&&E.isRewindEnabled?ml():ni())}const nl={coin:"c",laser:"l",explosion:"e",powerUp:"p",hit:"h",jump:"j",select:"s",lucky:"u",random:"r",click:"i",synth:"y",tone:"t"},ln={isPlayingBgm:!1,isCapturing:!1,isCapturingGameCanvasOnly:!1,captureCanvasScale:1,captureDurationSec:5,isShowingScore:!0,isShowingTime:!1,isReplayEnabled:!1,isRewindEnabled:!1,isDrawingParticleFront:!1,isDrawingScoreFront:!1,isUsingSmallText:!0,isMinifying:!1,isSoundEnabled:!0,viewSize:{x:100,y:100},audioSeed:0,seed:0,audioVolume:1,theme:"simple",colorPalette:void 0,textEdgeColor:{score:void 0,floatingScore:void 0,title:void 0,description:void 0,gameOver:void 0},bgmName:"bgm",bgmVolume:1,audioTempo:120,isRecording:!1},sl=new at,fe=new at;let Ce,ll={title:ul,inGame:hl,gameOver:dl,rewind:fl},ze=0,ft,gt=!0,Ke=0,E,rn,yt,Ye=!1,Te=!1,Xe,pt,Et,oi,St,Ct,ci=!1;function rl(n){window.update=n.update,window.title=n.title,window.description=n.description,window.characters=n.characters,window.options=n.options,window.audioFiles=n.audioFiles,an()}function an(){typeof options<"u"&&options!=null?E=Object.assign(Object.assign({},ln),options):E=ln;const n={name:E.theme,isUsingPixi:!1,isDarkColor:!1};E.theme!=="simple"&&E.theme!=="dark"&&(n.isUsingPixi=!0),(E.theme==="pixel"||E.theme==="shapeDark"||E.theme==="crt"||E.theme==="dark")&&(n.isDarkColor=!0),Ke=E.audioSeed+E.seed,E.isMinifying&&Cl(),rn={viewSize:E.viewSize,bodyBackground:n.isDarkColor?"#101010":"#e0e0e0",viewBackground:n.isDarkColor?"blue":"white",theme:n,isSoundEnabled:E.isSoundEnabled,isCapturing:E.isCapturing,isCapturingGameCanvasOnly:E.isCapturingGameCanvasOnly,captureCanvasScale:E.captureCanvasScale,captureDurationSec:E.captureDurationSec,colorPalette:E.colorPalette},ms(ol,cl,rn)}function al(){fs(),ai(),ns(),window.update=void 0,window.title=void 0,window.description=void 0,window.characters=void 0,window.options=void 0,window.audioFiles=void 0}function ol(){if(typeof description<"u"&&description!=null&&description.trim().length>0&&(gt=!1,Ke+=fn(description)),typeof title<"u"&&title!=null&&title.trim().length>0&&(gt=!1,document.title=title,Ke+=fn(title),St=`crisp-game-${encodeURIComponent(title)}-${Ke}`,ze=pl()),typeof characters<"u"&&characters!=null&&Vn(characters,"a"),ss(),typeof audioFiles<"u"&&audioFiles!=null){ls(),ji(.1*E.audioVolume),Vi(E.audioTempo);for(let n in audioFiles){const s=rs(n,audioFiles[n]);n===E.bgmName&&(s.isLooping=!0,ci=!0)}}E.isSoundEnabled&&(Ct=X.createGain(),Ct.connect(X.destination),sss.init(Ke,X,Ct),sss.setVolume(.1*E.audioVolume),sss.setTempo(E.audioTempo)),ie("black"),gt?(hi(),o.ticks=0):on()}function cl(){o.df=o.difficulty=o.ticks/3600+1,o.tc=o.ticks;const n=o.score,s=o.time;o.sc=o.score;const r=o.sc;o.inp={p:ue,ip:de,ijp:se,ijr:ge},Bn(),ll[Ce](),k.isUsingPixi&&(Qe(),k.name==="crt"&&Gn()),o.ticks++,o.isReplaying?(o.score=n,o.time=s):o.sc!==r&&(o.score=o.sc)}function hi(){Ce="inGame",o.ticks=-1,Jt();const n=Math.floor(o.score);n>ze&&(ze=n),E.isShowingTime&&o.time!=null&&(ft==null||ft>o.time)&&(ft=o.time),o.score=0,o.time=0,yt=[],E.isPlayingBgm&&E.isSoundEnabled&&li();const s=sl.getInt(999999999);fe.setSeed(s),(E.isReplayEnabled||E.isRewindEnabled)&&(Ss(s),xs(),o.isReplaying=!1)}function hl(){qe(),E.isDrawingParticleFront||ut(),E.isDrawingScoreFront||mn(),(E.isReplayEnabled||E.isRewindEnabled)&&Cs({pos:tn(ue),isPressed:de,isJustPressed:se,isJustReleased:ge}),typeof update=="function"&&update(),E.isDrawingParticleFront&&ut(),E.isDrawingScoreFront&&mn(),ui(),E.isShowingTime&&o.time!=null&&o.time++,E.isRecording&&!_s()&&sn()}function on(){Ce="title",o.ticks=-1,Jt(),qe(),Qi()&&(Ts(fe),o.isReplaying=!0)}function ul(){if(se){hi();return}if(qe(),E.isReplayEnabled&&Qi()&&(ws(),o.inp={p:ue,ip:de,ijp:se,ijr:ge},E.isDrawingParticleFront||ut(),update(),E.isDrawingParticleFront&&ut()),ui(),typeof title<"u"&&title!=null){let n=0;title.split(`
`).forEach(r=>{r.length>n&&(n=r.length)});const s=Math.floor((H.x-n*_)/2);title.split(`
`).forEach((r,c)=>{oe(r,s,Math.floor(H.y*.25)+c*_,{edgeColor:E.textEdgeColor.title})})}if(typeof description<"u"&&description!=null){let n=0;description.split(`
`).forEach(c=>{c.length>n&&(n=c.length)});const s=E.isUsingSmallText?Re:_,r=Math.floor((H.x-n*s)/2);description.split(`
`).forEach((c,d)=>{oe(c,r,Math.floor(H.y/2)+d*_,{isSmallText:E.isUsingSmallText,edgeColor:E.textEdgeColor.description})})}}function cn(){Ce="gameOver",o.isReplaying||Bi(),o.ticks=-1,un(),E.isPlayingBgm&&E.isSoundEnabled&&ri();const n=Math.floor(o.score);n>ze&&yl(n)}function dl(){o.ticks===0&&!k.isUsingPixi&&un(),(o.isReplaying||o.ticks>20)&&se?(hn(),hi()):o.ticks===(E.isReplayEnabled?120:300)&&!gt&&(hn(),on())}function hn(){!E.isRecording||o.isReplaying||ai()}function un(){o.isReplaying||oe(Et,Math.floor((H.x-Et.length*_)/2),Math.floor(H.y/2),{edgeColor:E.textEdgeColor.gameOver})}function ml(){Ce="rewind",Ye=!0,Xe=Qt({pos:{x:H.x-39,y:11},size:{x:36,y:7},text:"Rewind",isSmallText:E.isUsingSmallText}),pt=Qt({pos:{x:H.x-39,y:H.y-19},size:{x:36,y:7},text:"GiveUp",isSmallText:E.isUsingSmallText}),E.isPlayingBgm&&E.isSoundEnabled&&ri(),k.isUsingPixi&&(dt(Xe),dt(pt))}function fl(){qe(),update(),ui(),Ds(),Te?(dt(Xe),(Rs()||!de)&&gl()):(ei(Xe),ei(pt),Xe.isPressed&&(Te=!0,Ye=!1)),pt.isPressed&&(Ye=Te=!1,ni()),E.isShowingTime&&o.time!=null&&o.time++}function gl(){Te=!1,Ce="inGame",Jt(),E.isPlayingBgm&&E.isSoundEnabled&&li()}function ui(){if(E.isShowingTime)dn(o.time,3,3),dn(ft,H.x-7*(E.isUsingSmallText?Re:_),3);else if(E.isShowingScore){oe(`${Math.floor(o.score)}`,3,3,{isSmallText:E.isUsingSmallText,edgeColor:E.textEdgeColor.score});const n=`HI ${ze}`;oe(n,H.x-n.length*(E.isUsingSmallText?Re:_),3,{isSmallText:E.isUsingSmallText,edgeColor:E.textEdgeColor.score})}}function dn(n,s,r){if(n==null)return;let c=Math.floor(n*100/50);c>=10*60*100&&(c=10*60*100-1);const d=di(Math.floor(c/6e3),1)+"'"+di(Math.floor(c%6e3/100),2)+'"'+di(Math.floor(c%100),2);oe(d,s,r,{isSmallText:E.isUsingSmallText,edgeColor:E.textEdgeColor.score})}function di(n,s){return("0000"+n).slice(-s)}function mn(){et(),ie("black"),yt=yt.filter(n=>(oe(n.str,n.pos.x,n.pos.y,{isSmallText:E.isUsingSmallText,edgeColor:E.textEdgeColor.floatingScore}),n.pos.y+=n.vy,n.vy*=.9,n.ticks--,n.ticks>0)),tt()}function fn(n){let s=0;for(let r=0;r<n.length;r++){const c=n.charCodeAt(r);s=(s<<5)-s+c,s|=0}return s}function yl(n){if(St!=null)try{const s={highScore:n};localStorage.setItem(St,JSON.stringify(s))}catch(s){console.warn("Unable to save high score:",s)}}function pl(){try{const n=localStorage.getItem(St);if(n)return JSON.parse(n).highScore}catch(n){console.warn("Unable to load high score:",n)}return 0}function El(n){return n!=null&&n.constructor===Object}function Sl(){let n=window.location.search.substring(1);if(n=n.replace(/[^A-Za-z0-9_-]/g,""),n.length===0)return;const s=document.createElement("script");oi=`${n}/main.js`,s.setAttribute("src",oi),document.head.appendChild(s)}function Cl(){fetch(oi).then(n=>n.text()).then(n=>{const s=Terser.minify(n+"update();",{toplevel:!0}).code,r="function(){",c=s.indexOf(r),d="options={",f=s.indexOf(d);let p=s;if(c>=0)p=s.substring(s.indexOf(r)+r.length,s.length-4);else if(f>=0){let S=1,w;for(let x=f+d.length;x<s.length;x++){const P=s.charAt(x);if(P==="{")S++;else if(P==="}"&&(S--,S===0)){w=x+2;break}}S===0&&(p=s.substring(w))}gn.forEach(([S,w])=>{p=p.split(S).join(w)}),console.log(p),console.log(`${p.length} letters`)})}o.inp=void 0;function Tl(...n){return en.apply(this,n)}function wl(...n){return nn.apply(this,n)}function xl(...n){return a.apply(this,n)}function Ml(...n){return u.apply(this.args)}o.tc=void 0,o.df=void 0,o.sc=void 0;const vl="transparent",Il="white",Dl="red",Rl="green",Pl="yellow",bl="blue",Al="purple",Ll="cyan",kl="black",Ol="coin",Fl="laser",Gl="explosion",Nl="powerUp",_l="hit",Bl="jump",Wl="select",Hl="lucky";let gn=[["===","=="],["!==","!="],["input.pos","inp.p"],["input.isPressed","inp.ip"],["input.isJustPressed","inp.ijp"],["input.isJustReleased","inp.ijr"],["color(","clr("],["play(","ply("],["times(","tms("],["remove(","rmv("],["ticks","tc"],["difficulty","df"],["score","sc"],[".isColliding.rect.transparent",".tr"],[".isColliding.rect.white",".wh"],[".isColliding.rect.red",".rd"],[".isColliding.rect.green",".gr"],[".isColliding.rect.yellow",".yl"],[".isColliding.rect.blue",".bl"],[".isColliding.rect.purple",".pr"],[".isColliding.rect.cyan",".cy"],[".isColliding.rect.black",".lc"],['"transparent"',"tr"],['"white"',"wh"],['"red"',"rd"],['"green"',"gr"],['"yellow"',"yl"],['"blue"',"bl"],['"purple"',"pr"],['"cyan"',"cy"],['"black"',"lc"],['"coin"',"cn"],['"laser"',"ls"],['"explosion"',"ex"],['"powerUp"',"pw"],['"hit"',"ht"],['"jump"',"jm"],['"select"',"sl"],['"lucky"',"uc"]];o.PI=Bs,o.abs=Ws,o.addGameScript=Sl,o.addScore=Qs,o.addWithCharCode=C,o.arc=Es,o.atan2=$s,o.bar=ys,o.bl=bl,o.box=gs,o.ceil=Ys,o.char=Hn,o.clamp=e,o.clr=Tl,o.cn=Ol,o.color=en,o.complete=Zs,o.cos=Us,o.cy=Ll,o.end=ni,o.ex=Gl,o.floor=zs,o.frameState=tl,o.getButton=Qt,o.gr=Rl,o.ht=_l,o.init=rl,o.input=ts,o.jm=Bl,o.keyboard=Jn,o.lc=kl,o.line=ps,o.ls=Fl,o.minifyReplaces=gn,o.onLoad=an,o.onUnload=al,o.particle=el,o.play=nn,o.playBgm=li,o.ply=wl,o.pointer=es,o.pow=js,o.pr=Al,o.pw=Nl,o.range=l,o.rd=Dl,o.rect=qt,o.remove=u,o.rewind=il,o.rmv=Ml,o.rnd=Xs,o.rndi=Js,o.rnds=qs,o.round=Ks,o.sin=Hs,o.sl=Wl,o.sqrt=Vs,o.startRecording=sn,o.stopBgm=ri,o.stopRecording=ai,o.text=wi,o.times=a,o.tms=xl,o.tr=vl,o.uc=Hl,o.updateButton=ei,o.vec=tn,o.wh=Il,o.wrap=t,o.yl=Pl})(window||{});const b=40,L=25;class An{constructor(e={}){this.internalHighScore=0;const{initialLives:t=3,isDemoPlay:i=!1,audioService:l,gameName:a,enableHighScoreStorage:u=!1,isBrowserEnvironment:m=!1}=e;if(this.initialLives=t,this.isDemoPlay=i,this.audioService=l,this.score=0,this.lives=t,this.gameOverState=!1,this.virtualScreen=this.initializeVirtualScreen(),this.gameName=a,this.enableHighScoreStorage=u,this.isBrowserEnvironment=m,this.internalHighScore=0,this.enableHighScoreStorage&&this.isBrowserEnvironment){const y=this.getHighScoreKey();if(y)try{const C=localStorage.getItem(y);if(C){const M=parseInt(C,10);isNaN(M)||(this.internalHighScore=M)}}catch(C){console.error("Failed to retrieve high score from localStorage during init:",C)}}}initializeVirtualScreen(){const e=[];for(let t=0;t<L;t++){const i=[];for(let l=0;l<b;l++)i.push({char:" ",attributes:{}});e.push(i)}return e}clearVirtualScreen(){for(let e=0;e<L;e++)for(let t=0;t<b;t++)this.virtualScreen[e][t]={char:" ",attributes:{}}}drawText(e,t,i,l){if(i<0||i>=L){console.warn(`drawText: y coordinate (${i}) out of bounds.`);return}for(let a=0;a<e.length;a++){const u=t+a;u<0||u>=b||(this.virtualScreen[i][u]={char:e[a],attributes:{...l}})}}drawCenteredText(e,t,i){const l=Math.floor(b/2-e.length/2);this.drawText(e,l,t,i)}renderStandardUI(){this.drawText(`Score: ${this.score}`,1,0,{color:"white"}),this.drawText(`Lives: ${this.lives}`,31,0,{color:"white"}),this.drawText("R: Restart",1,L-1,{color:"light_black"})}renderGameOverScreen(){const e="Game Over!",t="red",i=Math.floor(L/2)-2;this.drawCenteredText(e,i,{color:t});const l=i+1;this.drawCenteredText(`Score: ${this.score}`,l,{color:"white"});const a=this.getHighScore();if(a!==null){const m=l+1;this.drawCenteredText(`High: ${a}`,m,{color:"light_cyan"})}const u=a!==null?Math.floor(L/2)+2:Math.floor(L/2)+1;this.drawCenteredText("Press R to restart",u,{color:"white"})}getCellInfo(e,t){return e<0||e>=b||t<0||t>=L?null:this.virtualScreen[t][e]}addScore(e){this.score+=e,this.score>this.internalHighScore&&(this.internalHighScore=this.score)}loseLife(){this.lives--,this.lives<=0&&(this.lives=0,this.triggerGameOver())}getScore(){return this.score}getLives(){return this.lives}gainLife(e=1){e<=0||(this.lives+=e,console.log(`BaseGame: Gained ${e} life/lives. Current lives: ${this.lives}`))}isGameOver(){return this.gameOverState}getVirtualScreenData(){return this.virtualScreen}resetGame(){this.score=0,this.lives=this.initialLives,this.gameOverState=!1,this.virtualScreen=this.initializeVirtualScreen()}setIsDemoPlay(e){this.isDemoPlay=e}play(e,t){!this.isDemoPlay&&this.audioService&&this.audioService.playSoundEffect(e,t)}playMml(e){!this.isDemoPlay&&this.audioService&&this.audioService.playMml(e)}playBgm(){!this.isDemoPlay&&this.audioService&&this.audioService.startPlayingBgm()}stopBgm(){!this.isDemoPlay&&this.audioService&&this.audioService.stopPlayingBgm()}triggerGameOver(){this.gameOverState=!0,this.commitHighScoreToStorage()}getHighScoreKey(){return this.gameName?`abagames-vgct-${this.gameName}`:null}commitHighScoreToStorage(){if(!this.enableHighScoreStorage||!this.isBrowserEnvironment)return;const e=this.getHighScoreKey();if(e)try{localStorage.setItem(e,this.internalHighScore.toString()),console.log(`[${this.gameName}] High score committed to storage: ${this.internalHighScore}`)}catch(t){console.error("Failed to commit high score to localStorage:",t)}}getHighScore(){return this.internalHighScore}update(e){this.clearVirtualScreen(),this.gameOverState?this.renderGameOverScreen():this.updateGame(e),this.renderStandardUI()}}var g=(o=>(o[o.UP=0]="UP",o[o.DOWN=1]="DOWN",o[o.LEFT=2]="LEFT",o[o.RIGHT=3]="RIGHT",o))(g||{}),h=(o=>(o.WANDERER="wanderer",o.GUARD="guard",o.CHASER="chaser",o.SPLITTER="splitter",o.SPEEDSTER="speedster",o.MIMIC="mimic",o.SNAKE="snake",o.WALL_CREEPER="wall_creeper",o.GHOST="ghost",o.SWARM="swarm",o))(h||{}),te=(o=>(o[o.LOW=1]="LOW",o[o.MEDIUM=2]="MEDIUM",o[o.HIGH=3]="HIGH",o[o.EXTREME=4]="EXTREME",o))(te||{});class we{constructor(){this.nextId=1}static getInstance(){return we.instance||(we.instance=new we),we.instance}generateId(e){return`${e}_${this.nextId++}`}reset(){this.nextId=1}}class re{constructor(){this.enemies=new Map,this.destroyEffects=[],this.scoreDisplayEffects=[]}addEnemy(e){this.enemies.set(e.id,e)}removeEnemy(e){this.enemies.delete(e)}getEnemy(e){return this.enemies.get(e)}getAllEnemies(){return Array.from(this.enemies.values())}getEnemiesByType(e){return this.getAllEnemies().filter(t=>t.type===e)}updateAllEnemies(e){const t={enemiesToRemove:[],effectsToAdd:[],scoreToAdd:0};for(const i of this.enemies.values()){if(this.updateBlinking(i),i.isDestroyed){t.enemiesToRemove.push(i.id);continue}this.updateEnemyLogic(i,e),this.updateMovement(i,e)}for(const i of t.enemiesToRemove)this.removeEnemy(i);return t}updateBlinking(e){e.isBlinking&&(e.blinkDuration--,e.blinkDuration<=0&&(e.isBlinking=!1))}updateMovement(e,t){if(e.isBlinking){e.moveCounter=0;return}e.moveCounter++,e.moveCounter>=e.moveInterval&&(e.moveCounter=0,this.moveEnemy(e,t))}moveEnemy(e,t){Math.random()<.3&&(e.direction=Math.floor(Math.random()*4));const i=this.calculateNewPosition(e);this.isValidPosition(i,t)?(e.x=i.x,e.y=i.y):e.direction=Math.floor(Math.random()*4)}calculateNewPosition(e){const t={x:e.x,y:e.y};switch(e.direction){case g.UP:t.y--;break;case g.DOWN:t.y++;break;case g.LEFT:t.x--;break;case g.RIGHT:t.x++;break}return t}isValidPosition(e,t){return!(e.x<1||e.x>=39||e.y<2||e.y>=24||t.snakeSegments.some(a=>a.x===e.x&&a.y===e.y)||this.getAllEnemies().some(a=>!a.isBlinking&&a.x===e.x&&a.y===e.y))}generateEnemyId(e="enemy"){return we.getInstance().generateId(e)}addDestroyEffect(e){this.destroyEffects.push(e)}updateDestroyEffects(){for(let e=this.destroyEffects.length-1;e>=0;e--)if(this.destroyEffects[e].duration--,this.destroyEffects[e].duration<=0){const t=this.destroyEffects[e];if(t.score>0){const i=t.multiplier>0?Math.floor(t.score/t.multiplier):t.score;this.scoreDisplayEffects.push({x:t.x,y:t.y,duration:90,maxDuration:90,score:t.score,baseScore:i,multiplier:t.multiplier})}this.destroyEffects.splice(e,1)}for(let e=this.scoreDisplayEffects.length-1;e>=0;e--)this.scoreDisplayEffects[e].duration--,this.scoreDisplayEffects[e].duration<=0&&this.scoreDisplayEffects.splice(e,1)}getDestroyEffects(){return this.destroyEffects}getScoreDisplayEffects(){return this.scoreDisplayEffects}destroyEnemy(e,t=0,i=1){const l=this.getEnemy(e);return l?(l.isDestroyed=!0,this.addDestroyEffect({x:l.x,y:l.y,duration:120,maxDuration:120,score:t,multiplier:i}),!0):!1}getEnemiesInArea(e,t){const i=Math.min(e.x,t.x),l=Math.max(e.x,t.x),a=Math.min(e.y,t.y),u=Math.max(e.y,t.y);return this.getAllEnemies().filter(m=>m.x>=i&&m.x<=l&&m.y>=a&&m.y<=u)}getEnemyAtPosition(e){return this.getAllEnemies().find(t=>t.x===e.x&&t.y===e.y)||null}getDebugInfo(){return{totalEnemies:this.enemies.size,enemiesByType:Object.fromEntries(Object.values(h).map(e=>[e,this.getEnemiesByType(e).length])),activeEffects:this.destroyEffects.length}}}class yn extends re{constructor(){super(...arguments),this.WANDERER_CONFIG={displayChar:"W",color:"red",blinkingColor:"light_red",blinkingChar:"o",moveInterval:96,directionChangeChance:.3,blinkDuration:120,baseScore:100,threatLevel:te.LOW}}isWandererEnemy(e){return e.type===h.WANDERER}createEnemy(e,t,i={}){if(e!==h.WANDERER)return null;const l=i.isBlinking?this.WANDERER_CONFIG.blinkDuration:0;return{id:this.generateEnemyId("wanderer"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:l,maxBlinkDuration:l,type:h.WANDERER,baseScore:this.WANDERER_CONFIG.baseScore,moveInterval:this.WANDERER_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.WANDERER_CONFIG.threatLevel,playerLearningHints:["ワンダラー敵を囲んで破壊しよう","点滅中は通過可能","ランダムに移動するので予測は困難"],directionChangeChance:this.WANDERER_CONFIG.directionChangeChance}}updateEnemyLogic(e,t){this.isWandererEnemy(e)}moveEnemy(e,t){if(!this.isWandererEnemy(e))return;Math.random()<e.directionChangeChance&&(e.direction=Math.floor(Math.random()*4));const i=this.calculateNewPosition(e);this.isValidPosition(i,t)?(e.x=i.x,e.y=i.y):e.direction=Math.floor(Math.random()*4)}getEnemyDisplayInfo(e){return this.isWandererEnemy(e)?e.isBlinking?Math.floor((e.maxBlinkDuration-e.blinkDuration)/5)%2===0?{char:this.WANDERER_CONFIG.blinkingChar,attributes:{entityType:"enemy_blinking",isPassable:!0,color:this.WANDERER_CONFIG.blinkingColor}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}}:{char:this.WANDERER_CONFIG.displayChar,attributes:{entityType:"enemy",isPassable:!1,color:this.WANDERER_CONFIG.color}}:{char:"?",attributes:{color:"white"}}}spawnWanderer(e,t=!0){const i=this.createEnemy(h.WANDERER,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getWandererCount(){return this.getEnemiesByType(h.WANDERER).length}getAllWanderers(){return this.getEnemiesByType(h.WANDERER).filter(this.isWandererEnemy.bind(this))}getWandererDebugInfo(){const e=this.getAllWanderers();return{count:e.length,blinking:e.filter(t=>t.isBlinking).length,positions:e.map(t=>({id:t.id,x:t.x,y:t.y,blinking:t.isBlinking}))}}}class pn extends re{constructor(){super(...arguments),this.GUARD_CONFIG={displayChar:"G",color:"yellow",alertColor:"light_red",moveInterval:144,blinkDuration:120,baseScore:120,threatLevel:te.LOW,patrolRadius:2,maxDistanceFromFood:3,returnTimeout:120,searchRadius:8,alertRadius:3}}createEnemy(e,t,i={}){if(e!==h.GUARD)return null;const l=i.isBlinking?this.GUARD_CONFIG.blinkDuration:0;return{id:this.generateEnemyId("guard"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:l,maxBlinkDuration:l,type:h.GUARD,baseScore:this.GUARD_CONFIG.baseScore,moveInterval:this.GUARD_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.GUARD_CONFIG.threatLevel,playerLearningHints:["ガード敵は食べ物を守っている","食べ物から離れた隙を狙おう","ガードを囲んで撃破後に食べ物を安全に取る"],guardTarget:i.foodPosition||null,patrolRadius:this.GUARD_CONFIG.patrolRadius,patrolAngle:Math.random()*Math.PI*2,returnToFoodTimer:0,alertLevel:0}}updateEnemyLogic(e,t){if(e.type!==h.GUARD)return;const i=e;t.foodPosition&&(i.guardTarget=t.foodPosition),i.guardTarget||(i.guardTarget=this.findNearestFood(i,t));const l=this.calculateDistance(i,t.playerPosition);l<=this.GUARD_CONFIG.alertRadius?i.alertLevel=Math.max(1,i.alertLevel):i.alertLevel=Math.max(0,i.alertLevel-1),i.guardTarget?this.calculateDistance(i,i.guardTarget)>this.GUARD_CONFIG.maxDistanceFromFood?(i.moveInterval=Math.max(this.GUARD_CONFIG.moveInterval*.167,24),i.alertLevel=Math.max(2,i.alertLevel),i.returnToFoodTimer++,i.returnToFoodTimer>=this.GUARD_CONFIG.returnTimeout&&(i.returnToFoodTimer=0)):(i.moveInterval=this.GUARD_CONFIG.moveInterval,i.returnToFoodTimer=0,l>this.GUARD_CONFIG.alertRadius&&(i.alertLevel=Math.max(0,i.alertLevel-1))):i.moveInterval=this.GUARD_CONFIG.moveInterval,i.patrolAngle+=.15,i.patrolAngle>Math.PI*2&&(i.patrolAngle-=Math.PI*2)}moveEnemy(e,t){if(e.type!==h.GUARD)return;const i=e;if(!i.guardTarget){this.moveRandomly(i,t);return}this.calculateDistance(i,i.guardTarget)>this.GUARD_CONFIG.maxDistanceFromFood||i.returnToFoodTimer>0?this.moveTowardsTarget(i,i.guardTarget,t):this.patrolAroundFood(i,t)}moveRandomly(e,t){Math.random()<.3&&(e.direction=Math.floor(Math.random()*4));const i=this.calculateNewPosition(e);this.isValidPosition(i,t)?(e.x=i.x,e.y=i.y):e.direction=Math.floor(Math.random()*4)}moveTowardsTarget(e,t,i){const l=t.x-e.x,a=t.y-e.y;let u=e.direction;Math.abs(l)>Math.abs(a)?u=l>0?g.RIGHT:g.LEFT:u=a>0?g.DOWN:g.UP;const m=this.calculateNewPositionInDirection(e,u);if(this.isValidPosition(m,i))e.direction=u,e.x=m.x,e.y=m.y;else{const y=[g.UP,g.DOWN,g.LEFT,g.RIGHT].filter(C=>C!==u);for(const C of y){const M=this.calculateNewPositionInDirection(e,C);if(this.isValidPosition(M,i)){e.direction=C,e.x=M.x,e.y=M.y;break}}}}patrolAroundFood(e,t){if(!e.guardTarget)return;const i=e.guardTarget.x+Math.cos(e.patrolAngle)*e.patrolRadius,l=e.guardTarget.y+Math.sin(e.patrolAngle)*e.patrolRadius,a={x:Math.round(i),y:Math.round(l)};this.calculateDistance(e,e.guardTarget)<=1.5?this.moveTowardsTarget(e,a,t):this.moveTowardsTarget(e,e.guardTarget,t)}calculateNewPositionInDirection(e,t){const i={x:e.x,y:e.y};switch(t){case g.UP:i.y--;break;case g.DOWN:i.y++;break;case g.LEFT:i.x--;break;case g.RIGHT:i.x++;break}return i}calculateDistance(e,t){const i=e.x-t.x,l=e.y-t.y;return Math.sqrt(i*i+l*l)}findNearestFood(e,t){return t.foodPosition||null}getEnemyDisplayInfo(e){if(e.type!==h.GUARD)return{char:"?",attributes:{color:"white"}};const t=e;if(t.isBlinking)return Math.floor((t.maxBlinkDuration-t.blinkDuration)/5)%2===0?{char:this.GUARD_CONFIG.displayChar,attributes:{entityType:"enemy_blinking",isPassable:!0,color:"light_yellow"}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}};{const i=t.alertLevel>0?"light_red":this.GUARD_CONFIG.color;return{char:this.GUARD_CONFIG.displayChar,attributes:{entityType:"enemy",isPassable:!1,color:i}}}}spawnGuard(e,t,i=!0){const l=this.createEnemy(h.GUARD,e,{isBlinking:i,foodPosition:t});return l?(this.addEnemy(l),l.id):null}spawnGuardNearFood(e,t=!0){const i=this.findGoodGuardPosition(e);return i?this.spawnGuard(i,e,t):null}findGoodGuardPosition(e){const l=[{x:0,y:-3},{x:0,y:3},{x:-3,y:0},{x:3,y:0}];for(const a of l){const u={x:e.x+a.x,y:e.y+a.y};if(this.isValidGuardPosition(u))return u}for(let a=0;a<20;a++){const u=Math.random()*Math.PI*2,m=Math.random()*2+2,y={x:Math.round(e.x+Math.cos(u)*m),y:Math.round(e.y+Math.sin(u)*m)};if(this.isValidGuardPosition(y))return y}return null}isValidGuardPosition(e){if(e.x<1||e.x>38||e.y<2||e.y>23)return!1;const t=this.getAllGuards();for(const i of t)if(i.x===e.x&&i.y===e.y)return!1;return!0}getGuardCount(){return this.getEnemiesByType(h.GUARD).length}getAllGuards(){return this.getEnemiesByType(h.GUARD)}updateGuardTargets(e){const t=this.getAllGuards();for(const i of t)i.guardTarget=e,i.returnToFoodTimer=0}getGuardDebugInfo(){const e=this.getAllGuards();return{count:e.length,blinking:e.filter(t=>t.isBlinking).length,alerting:e.filter(t=>t.alertLevel>0).length,positions:e.map(t=>{const i=t.guardTarget?this.calculateDistance(t,t.guardTarget):null,l=i&&i>this.GUARD_CONFIG.maxDistanceFromFood;return{id:t.id,x:t.x,y:t.y,blinking:t.isBlinking,alertLevel:t.alertLevel,guardTarget:t.guardTarget,patrolAngle:t.patrolAngle,foodDistance:i?i.toFixed(1):"N/A",isRushing:l,currentSpeed:t.moveInterval,alertReason:l?"RUSHING_TO_FOOD":t.alertLevel>0?"PLAYER_NEARBY":"NORMAL"}})}}}class En extends re{constructor(){super(...arguments),this.CHASER_CONFIG={displayChar:"C",color:"light_cyan",baseScore:220,moveInterval:10,blinkDuration:120,threatLevel:te.MEDIUM,stunDuration:60,pathfindingInterval:12,maxStuckFrames:36,chaseRange:15,intensityDecayRate:.95}}createEnemy(e,t,i={}){if(e!==h.CHASER)return null;const l=i.isBlinking?this.CHASER_CONFIG.blinkDuration:0;return{id:this.generateEnemyId("chaser"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:l,maxBlinkDuration:l,type:h.CHASER,baseScore:this.CHASER_CONFIG.baseScore,moveInterval:this.CHASER_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.CHASER_CONFIG.threatLevel,playerLearningHints:["チェイサーは壁や障害物を利用して行き詰まらせよう","他の敵を盾として利用する","長い直線を避け、複雑な経路を選ぶ","チェイサーを囲い込みエリアに誘導する"],chaseTarget:{x:20,y:12},stunDuration:0,lastValidDirection:g.UP,pathfindingCooldown:0,stuckCounter:0,chaseIntensity:1}}updateEnemyLogic(e,t){if(e.type!==h.CHASER)return;const i=e;if(i.stunDuration>0){i.stunDuration--,i.stunDuration===0&&this.updateChaseTarget(i,t);return}i.moveInterval=this.CHASER_CONFIG.moveInterval,i.pathfindingCooldown>0&&i.pathfindingCooldown--,this.updateChaseTarget(i,t),i.chaseIntensity*=this.CHASER_CONFIG.intensityDecayRate,i.chaseIntensity<.1&&(i.chaseIntensity=.1),this.updateStuckCounter(i)}updateChaseTarget(e,t){if(t.snakeSegments&&t.snakeSegments.length>0){const i=t.snakeSegments[0];this.calculateDistance(e,i)<=this.CHASER_CONFIG.chaseRange&&(e.chaseTarget={x:i.x,y:i.y},e.chaseIntensity=Math.min(e.chaseIntensity+.1,2))}}updateStuckCounter(e){e.stuckCounter>this.CHASER_CONFIG.maxStuckFrames&&(e.stuckCounter=0,e.direction=Math.floor(Math.random()*4))}moveEnemy(e,t){if(e.type!==h.CHASER)return;const i=e;i.stunDuration>0||this.performChaseMovement(i,t)}performChaseMovement(e,t){if(e.pathfindingCooldown===0){const l=this.calculateBestDirection(e,t);l!==null&&(e.direction=l,e.lastValidDirection=l,e.pathfindingCooldown=this.CHASER_CONFIG.pathfindingInterval)}const i=this.calculateNewPosition(e);this.isValidPosition(i,t)?(e.x=i.x,e.y=i.y,e.stuckCounter=0):this.applyStunToChaser(e)}calculateBestDirection(e,t){const i=e.chaseTarget,l=i.x-e.x,a=i.y-e.y;if(l===0&&a===0)return null;const u=[];l>0?u.push({direction:g.RIGHT,priority:Math.abs(l)}):l<0&&u.push({direction:g.LEFT,priority:Math.abs(l)}),a>0?u.push({direction:g.DOWN,priority:Math.abs(a)}):a<0&&u.push({direction:g.UP,priority:Math.abs(a)}),u.sort((y,C)=>C.priority-y.priority);for(const{direction:y}of u){const C=this.calculateNewPositionForDirection(e,y);if(this.isValidPosition(C,t))return y}const m=[g.UP,g.DOWN,g.LEFT,g.RIGHT];for(const y of m){const C=this.calculateNewPositionForDirection(e,y);if(this.isValidPosition(C,t))return y}return null}calculateNewPositionForDirection(e,t){const i={x:e.x,y:e.y};switch(t){case g.UP:i.y--;break;case g.DOWN:i.y++;break;case g.LEFT:i.x--;break;case g.RIGHT:i.x++;break}return i}calculateDistance(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}applyStunToChaser(e){e.stunDuration=this.CHASER_CONFIG.stunDuration,e.stuckCounter++,e.direction=Math.floor(Math.random()*4),console.log(`🥴 Chaser ${e.id} stunned for ${this.CHASER_CONFIG.stunDuration} frames (completely immobilized)`)}getEnemyDisplayInfo(e){if(e.type!==h.CHASER)return{char:"?",attributes:{color:"white"}};const t=e;if(t.isBlinking)return Math.floor((t.maxBlinkDuration-t.blinkDuration)/5)%2===0?{char:this.CHASER_CONFIG.displayChar,attributes:{entityType:"enemy_blinking",isPassable:!0,color:"blue"}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}};{const i=t.stunDuration>0?"yellow":this.CHASER_CONFIG.color;return{char:this.CHASER_CONFIG.displayChar,attributes:{entityType:"enemy",isPassable:!1,color:i}}}}spawnChaser(e,t=!0){const i=this.createEnemy(h.CHASER,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getChaserCount(){return this.getEnemiesByType(h.CHASER).length}getAllChasers(){return this.getEnemiesByType(h.CHASER)}resetChaserTarget(e,t){const i=this.getEnemy(e);i&&i.type===h.CHASER&&(t&&(i.chaseTarget=t),i.stunDuration=0,i.stuckCounter=0,i.chaseIntensity=1)}getChaserDebugInfo(){const e=this.getAllChasers();return{count:e.length,blinking:e.filter(t=>t.isBlinking).length,stunned:e.filter(t=>t.stunDuration>0).length,positions:e.map(t=>({id:t.id,x:t.x,y:t.y,blinking:t.isBlinking,stunned:t.stunDuration>0,target:t.chaseTarget,intensity:t.chaseIntensity}))}}}class Sn extends re{constructor(){super(...arguments),this.SPLITTER_CONFIG={displayChar:"S",color:"purple",baseScore:80,moveInterval:48,blinkDuration:120,threatLevel:te.MEDIUM,maxSplits:1,childBlinkDuration:60,childScoreMultiplier:1,splitSearchRadius:2,splitWarningDuration:30}}createEnemy(e,t,i={}){if(e!==h.SPLITTER)return null;const l=i.isChild||!1,a=i.splitCount||0,u=i.isBlinking?l?this.SPLITTER_CONFIG.childBlinkDuration:this.SPLITTER_CONFIG.blinkDuration:0;return{id:this.generateEnemyId("splitter"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:u,maxBlinkDuration:u,type:h.SPLITTER,baseScore:l?Math.floor(this.SPLITTER_CONFIG.baseScore*this.SPLITTER_CONFIG.childScoreMultiplier):this.SPLITTER_CONFIG.baseScore,moveInterval:this.SPLITTER_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.SPLITTER_CONFIG.threatLevel,playerLearningHints:["分裂を見越して広いエリアで囲む","子敵の出現位置を予測して対処","分裂タイミングを調整して有利な状況を作る","他の敵との位置関係を考慮して撃破順序を決める"],isChild:l,splitCount:a,parentId:i.parentId||null,maxSplits:this.SPLITTER_CONFIG.maxSplits,splitWarningTimer:0}}spawnSplitter(e,t=!1,i={}){const l=this.createEnemy(h.SPLITTER,e,{isBlinking:t,...i});return l?(this.addEnemy(l),l.id):null}updateEnemyLogic(e,t){if(e.type!==h.SPLITTER)return;const i=e;i.splitWarningTimer>0&&(i.splitWarningTimer--,i.splitWarningTimer===0&&i.specialTimer===1&&(this.performSplit(i),i.isDestroyed=!0))}moveEnemy(e,t){if(e.type!==h.SPLITTER)return;const i=e;Math.random()<.3&&(i.direction=Math.floor(Math.random()*4));const l=this.calculateNewPosition(i);this.isValidPosition(l,t)?(i.x=l.x,i.y=l.y):i.direction=Math.floor(Math.random()*4)}getEnemyDisplayInfo(e){if(e.type!==h.SPLITTER)return{char:"?",attributes:{color:"white"}};const t=e;if(t.splitWarningTimer>0){const i=Math.floor(t.splitWarningTimer/5)%2===0;return{char:this.SPLITTER_CONFIG.displayChar,attributes:{color:i?"light_purple":this.SPLITTER_CONFIG.color,isPassable:t.isBlinking}}}return{char:this.SPLITTER_CONFIG.displayChar,attributes:{color:t.isBlinking?"light_purple":this.SPLITTER_CONFIG.color,isPassable:t.isBlinking}}}destroyEnemy(e,t=0,i=1){const l=this.getEnemy(e);if(!l||l.type!==h.SPLITTER)return!1;const a=l;return!a.isChild&&a.splitCount<a.maxSplits?(a.splitWarningTimer=this.SPLITTER_CONFIG.splitWarningDuration,a.specialTimer=1,!1):super.destroyEnemy(e,t,i)}performSplit(e){const t=this.findSplitPositions(e);if(t.length===0){console.log(`⚠️ No valid split positions found for splitter ${e.id}`);return}console.log(`💥 Splitter ${e.id} splitting into ${t.length} children`);for(const i of t){const l=this.spawnSplitter(i,!0,{isChild:!0,parentId:e.id,splitCount:e.splitCount+1});l&&console.log(`👶 Child splitter ${l} spawned at (${i.x}, ${i.y})`)}}findSplitPositions(e){const t=[],i=[{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];for(const l of i){const a={x:e.x+l.x,y:e.y+l.y};a.x<1||a.x>=39||a.y<2||a.y>=24||this.isValidSplitPosition(a)&&t.push(a)}return t}isValidSplitPosition(e){return e.x<1||e.x>=39||e.y<2||e.y>=24?!1:!this.getAllEnemies().some(i=>!i.isBlinking&&i.x===e.x&&i.y===e.y)}getDebugInfo(){const t=this.getEnemiesByType(h.SPLITTER).filter(i=>i.type===h.SPLITTER);return{type:"SPLITTER",count:t.length,children:t.filter(i=>i.isChild).length,parents:t.filter(i=>!i.isChild).length,warningTimers:t.map(i=>({id:i.id,warningTimer:i.splitWarningTimer,isChild:i.isChild}))}}}class Cn extends re{constructor(){super(...arguments),this.SPEEDSTER_CONFIG={displayChar:"F",color:"cyan",blinkingColor:"light_cyan",baseScore:300,moveInterval:6,speedMultiplier:3,directionChangeInterval:10,directionChangeChance:.3,wallReflectionEnabled:!0,predictabilityThreshold:5,blinkDuration:120,threatLevel:te.MEDIUM,spawnWeight:50,maxCount:4,minMovementDistance:8,maxMovementDistance:12,pauseDuration:60,learningObjective:"反応速度と動的判断力を向上させる",counterStrategies:["スピードスターの回転パターンを観察して予測","停止中を狙って囲い込み","回転方向を利用して先回り","角での方向転換を利用した囲い込み"]},this.CLOCKWISE_DIRECTIONS=[g.RIGHT,g.DOWN,g.LEFT,g.UP],this.COUNTERCLOCKWISE_DIRECTIONS=[g.RIGHT,g.UP,g.LEFT,g.DOWN]}createEnemy(e,t,i={}){if(e!==h.SPEEDSTER)return null;const l=i.isBlinking?this.SPEEDSTER_CONFIG.blinkDuration:0,a=Math.random()<.5?"clockwise":"counterclockwise",u=a==="clockwise"?this.CLOCKWISE_DIRECTIONS:this.COUNTERCLOCKWISE_DIRECTIONS,m=Math.floor(Math.random()*u.length),y=u[m],C=m,M=Math.floor(Math.random()*(this.SPEEDSTER_CONFIG.maxMovementDistance-this.SPEEDSTER_CONFIG.minMovementDistance+1))+this.SPEEDSTER_CONFIG.minMovementDistance;return{id:this.generateEnemyId("speedster"),x:t.x,y:t.y,direction:y,moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:l,maxBlinkDuration:l,type:h.SPEEDSTER,baseScore:this.SPEEDSTER_CONFIG.baseScore,moveInterval:this.SPEEDSTER_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.SPEEDSTER_CONFIG.threatLevel,playerLearningHints:this.SPEEDSTER_CONFIG.counterStrategies,speedMultiplier:this.SPEEDSTER_CONFIG.speedMultiplier,directionChangeTimer:0,lastDirectionChange:0,boostCooldown:0,predictabilityCounter:0,movementState:"moving",pauseDuration:0,maxPauseDuration:this.SPEEDSTER_CONFIG.pauseDuration,movementDistance:0,maxMovementDistance:M,rotationPattern:a,currentDirectionIndex:C}}updateEnemyLogic(e,t){if(e.type!==h.SPEEDSTER)return;const i=e;if(i.movementState==="paused"){i.pauseDuration--,i.pauseDuration<=0&&(this.changeDirection(i),i.movementState="moving",i.movementDistance=0,i.predictabilityCounter=0);return}i.directionChangeTimer++,i.predictabilityCounter++,i.boostCooldown>0&&i.boostCooldown--}moveEnemy(e,t){if(e.type!==h.SPEEDSTER)return;const i=e;if(i.movementState==="paused")return;const l=this.calculateNewPosition(i);this.isValidPosition(l,t)?(i.x=l.x,i.y=l.y,i.movementDistance++,i.movementDistance>=i.maxMovementDistance&&(i.movementState="paused",i.pauseDuration=i.maxPauseDuration,i.movementDistance=0)):(i.movementState="paused",i.pauseDuration=i.maxPauseDuration,i.movementDistance=0,i.predictabilityCounter=0)}changeDirection(e){const t=e.rotationPattern==="clockwise"?this.CLOCKWISE_DIRECTIONS:this.COUNTERCLOCKWISE_DIRECTIONS;e.currentDirectionIndex=(e.currentDirectionIndex+1)%t.length,e.direction=t[e.currentDirectionIndex],e.maxMovementDistance=Math.floor(Math.random()*(this.SPEEDSTER_CONFIG.maxMovementDistance-this.SPEEDSTER_CONFIG.minMovementDistance+1))+this.SPEEDSTER_CONFIG.minMovementDistance,e.lastDirectionChange=Date.now(),e.directionChangeTimer=0}handleWallReflection(e,t){e.movementState="paused",e.pauseDuration=e.maxPauseDuration,e.movementDistance=0,e.predictabilityCounter=0,this.changeDirection(e)}getEnemyDisplayInfo(e){if(e.type!==h.SPEEDSTER)return{char:"?",attributes:{color:"white"}};const t=e;if(t.isBlinking)return Math.floor((t.maxBlinkDuration-t.blinkDuration)/3)%2===0?{char:this.SPEEDSTER_CONFIG.displayChar,attributes:{entityType:"enemy_blinking",isPassable:!0,color:this.SPEEDSTER_CONFIG.blinkingColor}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}};{const i=t.movementState==="paused"?"P":this.SPEEDSTER_CONFIG.displayChar,l=t.movementState==="paused"?"light_red":this.SPEEDSTER_CONFIG.color;return{char:i,attributes:{entityType:"enemy",isPassable:!1,color:l}}}}spawnSpeedster(e,t=!0){const i=this.createEnemy(h.SPEEDSTER,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getSpeedsterCount(){return this.getEnemiesByType(h.SPEEDSTER).length}getAllSpeedsters(){return this.getEnemiesByType(h.SPEEDSTER)}adjustSpeedsterDifficulty(e){const t=this.getAllSpeedsters();for(const i of t){i.moveInterval=Math.max(Math.floor(this.SPEEDSTER_CONFIG.moveInterval/e),3);const l=this.SPEEDSTER_CONFIG.directionChangeInterval;i.directionChangeTimer=Math.max(Math.floor(l/e),5)}}getSpeedsterMetrics(){const e=this.getAllSpeedsters();if(e.length===0)return{averageSpeed:0,directionChangesPerSecond:0,wallReflections:0,predictabilityScore:0};const t=e.reduce((l,a)=>l+a.speedMultiplier,0),i=e.reduce((l,a)=>l+a.predictabilityCounter,0)/e.length;return{averageSpeed:t/e.length,directionChangesPerSecond:0,wallReflections:0,predictabilityScore:i/this.SPEEDSTER_CONFIG.predictabilityThreshold}}getSpeedsterDebugInfo(){const e=this.getAllSpeedsters();return{count:e.length,config:this.SPEEDSTER_CONFIG,speedsters:e.map(t=>({id:t.id,x:t.x,y:t.y,direction:t.direction,speedMultiplier:t.speedMultiplier,directionChangeTimer:t.directionChangeTimer,predictabilityCounter:t.predictabilityCounter,isBlinking:t.isBlinking,moveInterval:t.moveInterval,movementState:t.movementState,movementDistance:t.movementDistance,maxMovementDistance:t.maxMovementDistance,pauseDuration:t.pauseDuration,maxPauseDuration:t.maxPauseDuration,rotationPattern:t.rotationPattern,currentDirectionIndex:t.currentDirectionIndex})),metrics:this.getSpeedsterMetrics()}}getConfig(){return{...this.SPEEDSTER_CONFIG}}}class Tn extends re{constructor(){super(...arguments),this.MIMIC_CONFIG={displayChar:"M",color:"light_cyan",baseScore:130,moveInterval:8,spawnWeight:12,maxCount:1,threatLevel:te.HIGH,learningObjective:"自己の行動パターンを客観視し、戦略的思考を深める",counterStrategies:["意図的に複雑な軌跡を描いてミミックを混乱させる","急激な方向転換でミミックとの距離を作る","ミミックの遅延を利用して罠に誘導","直線的な動きを避け、予測困難な動きを心がける"]},this.MIMIC_BEHAVIOR_CONFIG={mimicDelay:45,mimicAccuracy:.85,maxRecordLength:120,accuracyDecayRate:.02},this.playerTrajectoryBuffer=[]}createEnemy(e,t,i){return e!==h.MIMIC?null:{id:this.generateEnemyId("mimic"),x:t.x,y:t.y,direction:g.UP,moveCounter:0,isBlinking:!0,blinkDuration:120,maxBlinkDuration:120,type:h.MIMIC,baseScore:this.MIMIC_CONFIG.baseScore,moveInterval:this.MIMIC_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.MIMIC_CONFIG.threatLevel,playerLearningHints:this.MIMIC_CONFIG.counterStrategies,mimicTarget:[],mimicDelay:this.MIMIC_BEHAVIOR_CONFIG.mimicDelay,mimicAccuracy:this.MIMIC_BEHAVIOR_CONFIG.mimicAccuracy,recordingBuffer:[...this.playerTrajectoryBuffer],maxRecordLength:this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength}}updateEnemyLogic(e,t){if(e.type!==h.MIMIC)return;const i=e;this.recordPlayerTrajectory(t.playerPosition),this.updateMimicBehavior(i,t)}recordPlayerTrajectory(e){this.playerTrajectoryBuffer.push({...e}),this.playerTrajectoryBuffer.length>this.MIMIC_BEHAVIOR_CONFIG.maxRecordLength&&this.playerTrajectoryBuffer.shift()}updateMimicBehavior(e,t){if(e.isBlinking)return;const i=this.getMimicTargetPosition(e);if(i){const l=this.calculateDirectionToTarget(e,i);e.direction=l}}getMimicTargetPosition(e){const t=this.playerTrajectoryBuffer.length-e.mimicDelay;return t>=0&&t<this.playerTrajectoryBuffer.length?this.playerTrajectoryBuffer[t]:null}calculateDirectionToTarget(e,t){const i=t.x-e.x,l=t.y-e.y;let a;return Math.abs(i)>Math.abs(l)?a=i>0?g.RIGHT:g.LEFT:a=l>0?g.DOWN:g.UP,a}moveEnemy(e,t){if(e.type!==h.MIMIC){super.moveEnemy(e,t);return}const i=this.calculateNewPosition(e);this.isValidPosition(i,t)&&(e.x=i.x,e.y=i.y)}getEnemyDisplayInfo(e){if(e.type!==h.MIMIC)return{char:"?",attributes:{color:"white"}};if(e.isBlinking){const t=Math.floor(e.blinkDuration/10)%2;return{char:t===0?this.MIMIC_CONFIG.displayChar:"m",attributes:{color:t===0?this.MIMIC_CONFIG.color:"light_black"}}}return{char:this.MIMIC_CONFIG.displayChar,attributes:{color:this.MIMIC_CONFIG.color}}}spawnMimic(e,t=!0){const i=this.createEnemy(h.MIMIC,e);return i?(t||(i.isBlinking=!1,i.blinkDuration=0),this.addEnemy(i),i.id):null}getMimicAccuracy(e){const t=this.getEnemy(e);return t?t.mimicAccuracy:0}getPlayerTrajectoryLength(){return this.playerTrajectoryBuffer.length}clearPlayerTrajectory(){this.playerTrajectoryBuffer=[]}getDebugInfo(){const e=super.getDebugInfo(),t=this.getEnemiesByType(h.MIMIC);return{...e,mimicSpecific:{playerTrajectoryLength:this.playerTrajectoryBuffer.length,mimicEnemies:t.map(i=>({id:i.id,position:{x:i.x,y:i.y},mimicAccuracy:i.mimicAccuracy,mimicDelay:i.mimicDelay,recordingBufferLength:i.recordingBuffer.length}))}}}}class wn extends re{constructor(){super(...arguments),this.SNAKE_CONFIG={displayChar:"S",bodyChar:"s",color:"yellow",bodyColor:"light_yellow",baseScore:330,bodyScore:0,moveInterval:12,spawnWeight:8,maxCount:2,threatLevel:te.HIGH,learningObjective:"複雑な移動パターンを理解し、空間制御を習得する",counterStrategies:["スネーク敵の頭部を狙って撃破する","スネーク敵を自分の尻尾に衝突させる","スネーク敵の移動パターンを読んで先回りする","スネーク敵の縄張りを避けて安全な領域を確保する"]},this.SNAKE_BEHAVIOR_CONFIG={initialLength:3,maxLength:3,growthInterval:0,territoryRadius:6,pathHistoryLength:20,selfCollisionEnabled:!0,chaseActivationDistance:8,territorialReturnDistance:10,directionChangeChance:.2}}createEnemy(e,t,i){if(e!==h.SNAKE)return null;const l=this.SNAKE_BEHAVIOR_CONFIG,a=(i==null?void 0:i.isBlinking)||!1,u=a?120:0,m={id:this.generateEnemyId("snake"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:a,blinkDuration:u,maxBlinkDuration:u,type:h.SNAKE,baseScore:this.SNAKE_CONFIG.baseScore,moveInterval:this.SNAKE_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.SNAKE_CONFIG.threatLevel,playerLearningHints:this.SNAKE_CONFIG.counterStrategies,body:[{x:t.x,y:t.y}],maxLength:l.maxLength,currentLength:1,growthRate:l.growthInterval,lastGrowthTime:Date.now(),movementPattern:"patrol",territoryCenter:{x:t.x,y:t.y},territoryRadius:l.territoryRadius,pathHistory:[],selfCollisionCheck:l.selfCollisionEnabled};return this.initializeBody(m),m}initializeBody(e){const t=this.SNAKE_BEHAVIOR_CONFIG;for(let i=1;i<t.initialLength;i++){const l=e.body[i-1],a=this.calculateSafeBodyPosition(l,e.direction);a&&(e.body.push(a),e.currentLength++)}}calculateSafeBodyPosition(e,t){const i=this.getOppositeDirection(t),l={...e};switch(i){case g.UP:l.y--;break;case g.DOWN:l.y++;break;case g.LEFT:l.x--;break;case g.RIGHT:l.x++;break}return l.x<1||l.x>=39||l.y<2||l.y>=24?null:l}getOppositeDirection(e){switch(e){case g.UP:return g.DOWN;case g.DOWN:return g.UP;case g.LEFT:return g.RIGHT;case g.RIGHT:return g.LEFT;default:return g.DOWN}}updateEnemyLogic(e,t){if(e.type!==h.SNAKE)return;const i=e;if(this.updateGrowth(i),this.updateMovementPattern(i,t),this.checkSelfCollision(i)){i.isDestroyed=!0;return}this.updatePathHistory(i)}updateGrowth(e){}growSnake(e){if(e.body.length===0)return;const i={...e.body[e.body.length-1]};e.body.push(i),e.currentLength++}updateMovementPattern(e,t){const i=t.playerPosition,l=this.calculateDistance({x:e.x,y:e.y},i),a=this.calculateDistance({x:e.x,y:e.y},e.territoryCenter),u=this.SNAKE_BEHAVIOR_CONFIG;a>u.territorialReturnDistance?e.movementPattern="territorial":l<=u.chaseActivationDistance?e.movementPattern="chase":e.movementPattern="patrol"}calculateDistance(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}checkSelfCollision(e){if(!e.selfCollisionCheck||e.body.length<=1)return!1;const t=e.body[0];for(let i=1;i<e.body.length;i++){const l=e.body[i];if(t.x===l.x&&t.y===l.y)return!0}return!1}updatePathHistory(e){const t=this.SNAKE_BEHAVIOR_CONFIG;e.pathHistory.push({x:e.x,y:e.y}),e.pathHistory.length>t.pathHistoryLength&&e.pathHistory.shift()}updateMovement(e,t){if(e.type!==h.SNAKE)return;const i=e;i.isBlinking||(i.moveCounter++,!(i.moveCounter<i.moveInterval)&&(i.moveCounter=0,this.moveSnakeEnemy(i,t)))}moveSnakeEnemy(e,t){this.determineMovementDirection(e,t);const i=this.calculateNewPosition(e);if(this.isValidSnakePosition(i,e,t))this.moveSnakeBody(e,i);else{this.changeDirection(e);const l=this.calculateNewPosition(e);this.isValidSnakePosition(l,e,t)&&this.moveSnakeBody(e,l)}}determineMovementDirection(e,t){switch(this.SNAKE_BEHAVIOR_CONFIG,e.movementPattern){case"chase":this.setChaseDirection(e,t.playerPosition);break;case"territorial":this.setTerritorialDirection(e);break;case"patrol":default:this.setPatrolDirection(e);break}}setChaseDirection(e,t){const i=t.x-e.x,l=t.y-e.y;Math.abs(i)>Math.abs(l)?e.direction=i>0?g.RIGHT:g.LEFT:e.direction=l>0?g.DOWN:g.UP}setTerritorialDirection(e){const t=e.territoryCenter.x-e.x,i=e.territoryCenter.y-e.y;Math.abs(t)>Math.abs(i)?e.direction=t>0?g.RIGHT:g.LEFT:e.direction=i>0?g.DOWN:g.UP}setPatrolDirection(e){const t=this.SNAKE_BEHAVIOR_CONFIG;Math.random()<t.directionChangeChance&&(e.direction=Math.floor(Math.random()*4))}changeDirection(e){const i=[g.UP,g.DOWN,g.LEFT,g.RIGHT].filter(l=>{const a=this.calculateNewPositionWithDirection(e,l);return this.isValidSnakePosition(a,e,null)});i.length>0&&(e.direction=i[Math.floor(Math.random()*i.length)])}calculateNewPosition(e){return this.calculateNewPositionWithDirection(e,e.direction)}calculateNewPositionWithDirection(e,t){const i={x:e.x,y:e.y};switch(t){case g.UP:i.y--;break;case g.DOWN:i.y++;break;case g.LEFT:i.x--;break;case g.RIGHT:i.x++;break}return i}isValidSnakePosition(e,t,i){return!(e.x<1||e.x>=39||e.y<2||e.y>=24||t.body.some(a=>a.x===e.x&&a.y===e.y)||i&&(i.snakeSegments.some(m=>m.x===e.x&&m.y===e.y)||this.getAllEnemies().some(m=>m.id!==t.id&&!m.isBlinking&&m.x===e.x&&m.y===e.y)))}moveSnakeBody(e,t){e.body.unshift(t),e.x=t.x,e.y=t.y,e.body.length>e.currentLength&&e.body.pop()}getEnemyDisplayInfo(e){if(e.type!==h.SNAKE)return{char:"?",attributes:{color:"white"}};const t=this.SNAKE_CONFIG;if(e.isBlinking){const i=Math.floor(e.blinkDuration/10)%2;return{char:i===0?t.displayChar:"o",attributes:{color:i===0?t.color:"light_red"}}}return{char:t.displayChar,attributes:{color:t.color}}}getSnakeBodyDisplayInfo(e){const t=this.SNAKE_CONFIG,i=[];for(let l=1;l<e.body.length;l++){const a=e.body[l];i.push({pos:a,char:t.bodyChar,attributes:{color:e.isBlinking?"light_red":t.bodyColor}})}return i}getSnakeBodyPositions(e){return e.body.slice(1)}isSnakeHeadEnclosed(e,t){const i=e.body[0];return t.some(l=>l.x===i.x&&l.y===i.y)}calculateDestroyScore(e){const t=this.SNAKE_CONFIG,i=t.baseScore,l=(e.body.length-1)*t.bodyScore;return i+l}spawnSnake(e,t=!0){const i=this.createEnemy(h.SNAKE,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getSnakeCount(){return this.getEnemiesByType(h.SNAKE).length}getAllSnakes(){return this.getEnemiesByType(h.SNAKE)}getDebugInfo(){const e=Array.from(this.enemies.values());return{totalSnakes:e.length,snakes:e.map(t=>({id:t.id,position:{x:t.x,y:t.y},bodyLength:t.body.length,currentLength:t.currentLength,maxLength:t.maxLength,movementPattern:t.movementPattern,isBlinking:t.isBlinking}))}}}class xn extends re{constructor(){super(...arguments),this.WALL_CREEPER_CONFIG={displayChar:"W",color:"light_black",baseScore:150,moveInterval:12,blinkDuration:120,threatLevel:te.MEDIUM,minTimeInWall:120,maxTimeInWall:300,crossingSpeedMultiplier:1}}createEnemy(e,t,i={}){if(e!==h.WALL_CREEPER)return null;const l=this.adjustToWallPosition(t),a=i.isBlinking?120:0;return{id:this.generateEnemyId("wall_creeper"),x:l.x,y:l.y,direction:this.getInitialWallDirection(l),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:a,maxBlinkDuration:a,type:h.WALL_CREEPER,baseScore:this.WALL_CREEPER_CONFIG.baseScore,moveInterval:this.WALL_CREEPER_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.WALL_CREEPER_CONFIG.threatLevel,playerLearningHints:["ウォールクリーパーは壁内を移動する","オープンスペース横断時が攻撃チャンス","反対側の壁への進入地点を予測しよう"],currentBehaviorState:"in_wall",wallFollowCardinalDirection:this.getInitialWallDirection(l),targetCrossPosition:null,behaviorTimer:Math.floor(Math.random()*(this.WALL_CREEPER_CONFIG.maxTimeInWall-this.WALL_CREEPER_CONFIG.minTimeInWall)+this.WALL_CREEPER_CONFIG.minTimeInWall),exitWallDecisionTimer:0}}updateEnemyLogic(e,t){if(e.type!==h.WALL_CREEPER)return;const i=e;i.behaviorTimer--,i.currentBehaviorState==="in_wall"?this.updateInWallBehavior(i,t):i.currentBehaviorState==="crossing_open_space"&&this.updateCrossingBehavior(i,t)}updateInWallBehavior(e,t){e.behaviorTimer<=0&&this.initiateWallCrossing(e)}updateCrossingBehavior(e,t){e.targetCrossPosition&&e.x===e.targetCrossPosition.x&&e.y===e.targetCrossPosition.y&&this.enterWall(e)}initiateWallCrossing(e){const t=this.calculateOppositeWallPosition(e);t&&(e.currentBehaviorState="crossing_open_space",e.targetCrossPosition=t,t.x>e.x?e.direction=g.RIGHT:t.x<e.x?e.direction=g.LEFT:t.y>e.y?e.direction=g.DOWN:e.direction=g.UP,e.moveInterval=Math.floor(this.WALL_CREEPER_CONFIG.moveInterval/this.WALL_CREEPER_CONFIG.crossingSpeedMultiplier))}enterWall(e){e.currentBehaviorState="in_wall",e.targetCrossPosition=null,e.wallFollowCardinalDirection=this.getWallFollowDirection(e),e.direction=e.wallFollowCardinalDirection,e.behaviorTimer=Math.floor(Math.random()*(this.WALL_CREEPER_CONFIG.maxTimeInWall-this.WALL_CREEPER_CONFIG.minTimeInWall)+this.WALL_CREEPER_CONFIG.minTimeInWall),e.moveInterval=this.WALL_CREEPER_CONFIG.moveInterval}moveEnemy(e,t){if(e.type!==h.WALL_CREEPER)return;const i=e;i.currentBehaviorState==="in_wall"?this.moveAlongWall(i):i.currentBehaviorState==="crossing_open_space"&&this.moveCrossingSpace(i,t)}moveAlongWall(e){const t=this.calculateNewPosition(e);this.isWallCorner(t)?(e.wallFollowCardinalDirection=this.getNextWallDirection(e.wallFollowCardinalDirection,t),e.direction=e.wallFollowCardinalDirection,e.x=t.x,e.y=t.y):this.isWallPosition(t)?(e.x=t.x,e.y=t.y):(e.wallFollowCardinalDirection=this.getNextWallDirection(e.wallFollowCardinalDirection,{x:e.x,y:e.y}),e.direction=e.wallFollowCardinalDirection)}moveCrossingSpace(e,t){if(!e.targetCrossPosition)return;const i=this.calculateNewPosition(e);this.isValidPositionForCrossing(i,t)&&(e.x=i.x,e.y=i.y)}adjustToWallPosition(e){const t={...e};return e.x<=20?t.x=0:t.x=39,t.y=Math.max(2,Math.min(23,e.y)),t}getInitialWallDirection(e){return e.x===0||e.x===39?Math.random()<.5?g.UP:g.DOWN:(e.y===2,Math.random()<.5?g.LEFT:g.RIGHT)}calculateOppositeWallPosition(e){const t={x:e.x,y:e.y};return t.x===0?{x:39,y:t.y}:t.x===39?{x:0,y:t.y}:t.y===2?{x:t.x,y:23}:t.y===23?{x:t.x,y:2}:null}isWallPosition(e){return e.x===0||e.x===39||e.y===2||e.y===23}isWallCorner(e){return(e.x===0||e.x===39)&&(e.y===2||e.y===23)}getWallFollowDirection(e){const t={x:e.x,y:e.y};return t.x===0||t.x===39?Math.random()<.5?g.UP:g.DOWN:(t.y===2,Math.random()<.5?g.LEFT:g.RIGHT)}getNextWallDirection(e,t){if(this.isWallCorner(t)){if(t.x===0&&t.y===2)return e===g.UP?g.RIGHT:g.DOWN;if(t.x===39&&t.y===2)return e===g.UP?g.LEFT:g.DOWN;if(t.x===0&&t.y===23)return e===g.DOWN?g.RIGHT:g.UP;if(t.x===39&&t.y===23)return e===g.DOWN?g.LEFT:g.UP}return e}isValidPositionForCrossing(e,t){return!(e.x<0||e.x>=40||e.y<2||e.y>=24||t.snakeSegments.some(a=>a.x===e.x&&a.y===e.y)||this.getAllEnemies().some(a=>!a.isBlinking&&a.x===e.x&&a.y===e.y))}getEnemyDisplayInfo(e){if(e.type!==h.WALL_CREEPER)return{char:"?",attributes:{color:"white"}};const t=e;if(t.isBlinking)return Math.floor((t.maxBlinkDuration-t.blinkDuration)/5)%2===0?{char:this.WALL_CREEPER_CONFIG.displayChar,attributes:{entityType:"enemy_blinking",isPassable:!0,color:"light_red"}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}};{const i=t.currentBehaviorState==="crossing_open_space";return{char:this.WALL_CREEPER_CONFIG.displayChar,attributes:{entityType:t.currentBehaviorState==="in_wall"?"wall":"enemy",isPassable:i,color:this.WALL_CREEPER_CONFIG.color}}}}spawnWallCreeper(e,t=!0){const i=this.createEnemy(h.WALL_CREEPER,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getWallCreeperCount(){return this.getEnemiesByType(h.WALL_CREEPER).length}getAllWallCreepers(){return this.getEnemiesByType(h.WALL_CREEPER)}getWallCreeperDebugInfo(){const e=this.getAllWallCreepers();return{count:e.length,states:e.map(t=>({id:t.id,x:t.x,y:t.y,state:t.currentBehaviorState,direction:t.wallFollowCardinalDirection,behaviorTimer:t.behaviorTimer,targetCrossPosition:t.targetCrossPosition}))}}}class Mn extends re{constructor(){super(...arguments),this.GHOST_CONFIG={displayChar:"?",color:"light_blue",phaseColor:"light_black",warningColor:"yellow",baseScore:270,moveInterval:12,phaseChance:.2,phaseDuration:30,phaseCooldown:60,phaseWarningDuration:15,blinkDuration:120,threatLevel:te.EXTREME,spawnWeight:8,maxCount:2,overlapResolutionAttempts:5,learningObjective:"不確実性に対応し、適応的戦略を身につける",counterStrategies:["無形化のタイミングを観察してパターンを見つける","無形化中は他の敵に集中する","ゴーストを最後に残して確実に対処","無形化終了のタイミングを狙って囲い込み"]}}createEnemy(e,t,i={}){if(e!==h.GHOST)return null;const l=i.isBlinking?this.GHOST_CONFIG.blinkDuration:0;return{id:this.generateEnemyId("ghost"),x:t.x,y:t.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:i.isBlinking||!1,blinkDuration:l,maxBlinkDuration:l,type:h.GHOST,baseScore:this.GHOST_CONFIG.baseScore,moveInterval:this.GHOST_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.GHOST_CONFIG.threatLevel,playerLearningHints:this.GHOST_CONFIG.counterStrategies,isPhasing:!1,phaseTimer:0,phaseChance:this.GHOST_CONFIG.phaseChance,phaseCooldown:0,phaseWarningTimer:0}}updateEnemyLogic(e,t){if(e.type!==h.GHOST)return;const i=e;if(i.phaseWarningTimer>0){i.phaseWarningTimer--,i.phaseWarningTimer===0&&this.startPhasing(i);return}if(i.isPhasing){i.phaseTimer--,i.phaseTimer<=0&&this.endPhasing(i,t);return}i.phaseCooldown>0&&i.phaseCooldown--,i.phaseCooldown===0&&Math.random()<i.phaseChance&&!i.isBlinking&&this.triggerPhaseWarning(i),Math.random()<.3&&(i.direction=Math.floor(Math.random()*4))}triggerPhaseWarning(e){e.phaseWarningTimer=this.GHOST_CONFIG.phaseWarningDuration}startPhasing(e){e.isPhasing=!0,e.phaseTimer=this.GHOST_CONFIG.phaseDuration,e.phaseCooldown=this.GHOST_CONFIG.phaseCooldown}endPhasing(e,t){e.isPhasing=!1,e.phaseTimer=0,this.isPositionOccupied(e,t)&&this.resolveOverlap(e,t)}isPositionOccupied(e,t){return!!(t.snakeSegments.some(a=>a.x===e.x&&a.y===e.y)||this.getAllEnemies().some(a=>a.id!==e.id&&!a.isBlinking&&a.x===e.x&&a.y===e.y))}resolveOverlap(e,t){const i=this.GHOST_CONFIG.overlapResolutionAttempts;for(let a=0;a<i;a++){const u=[{x:0,y:0},{x:-1,y:-1},{x:0,y:-1},{x:1,y:-1},{x:-1,y:0},{x:1,y:0},{x:-1,y:1},{x:0,y:1},{x:1,y:1}];for(const y of u){const C={x:e.x+y.x,y:e.y+y.y};if(this.isValidPositionForPhaseEnd(C,t,e)){e.x=C.x,e.y=C.y;return}}const m=this.findRandomValidPosition(t,e);if(m){e.x=m.x,e.y=m.y;return}}console.warn(`Ghost ${e.id} overlap resolution failed, moving to safe position`);const l=this.findSafePosition(t);l&&(e.x=l.x,e.y=l.y)}isValidPositionForPhaseEnd(e,t,i){return!(e.x<1||e.x>=39||e.y<2||e.y>=24||t.snakeSegments.some(u=>u.x===e.x&&u.y===e.y)||this.getAllEnemies().some(u=>u.id!==i.id&&!u.isBlinking&&u.x===e.x&&u.y===e.y))}findRandomValidPosition(e,t){for(let i=0;i<20;i++){const l={x:Math.floor(Math.random()*38)+1,y:Math.floor(Math.random()*22)+2};if(this.isValidPositionForPhaseEnd(l,e,t))return l}return null}findSafePosition(e){const t=[{x:1,y:2},{x:38,y:2},{x:1,y:23},{x:38,y:23}];for(const i of t)if(this.isValidPosition(i,e))return i;return{x:20,y:12}}moveEnemy(e,t){if(e.type!==h.GHOST)return;const i=e;if(i.phaseWarningTimer>0)return;const l=this.calculateNewPosition(i);i.isPhasing?this.isValidPositionForPhasing(l)?(i.x=l.x,i.y=l.y):i.direction=Math.floor(Math.random()*4):this.isValidPosition(l,t)?(i.x=l.x,i.y=l.y):i.direction=Math.floor(Math.random()*4)}isValidPositionForPhasing(e){return e.x>=1&&e.x<39&&e.y>=2&&e.y<24}getEnemyDisplayInfo(e){if(e.type!==h.GHOST)return{char:"?",attributes:{}};const t=e;let i=this.GHOST_CONFIG.displayChar,l=this.GHOST_CONFIG.color;return t.phaseWarningTimer>0?(l=this.GHOST_CONFIG.warningColor,Math.floor(t.phaseWarningTimer/3)%2===0&&(i="!")):t.isPhasing?(l=this.GHOST_CONFIG.phaseColor,i="?"):t.isBlinking&&(l=this.GHOST_CONFIG.phaseColor,i="o"),{char:i,attributes:{color:l,isPassable:t.isBlinking||t.isPhasing}}}spawnGhost(e,t=!0){const i=this.createEnemy(h.GHOST,e,{isBlinking:t});return i?(this.addEnemy(i),i.id):null}getGhostCount(){return this.getEnemiesByType(h.GHOST).length}getAllGhosts(){return this.getEnemiesByType(h.GHOST)}adjustGhostDifficulty(e){const t=this.getAllGhosts();for(const i of t)i.phaseChance=Math.min(this.GHOST_CONFIG.phaseChance*e,.4),i.moveInterval=Math.max(Math.floor(this.GHOST_CONFIG.moveInterval/e),6)}getGhostMetrics(){const e=this.getAllGhosts();return e.length===0?{averagePhaseFrequency:0,phaseSuccessRate:0,explosionSurvivalRate:0,overlapResolutions:0}:{averagePhaseFrequency:e.reduce((l,a)=>l+a.phaseChance,0)/e.length,phaseSuccessRate:.85,explosionSurvivalRate:0,overlapResolutions:0}}getGhostDebugInfo(){const e=this.getAllGhosts();return{count:e.length,config:this.GHOST_CONFIG,ghosts:e.map(t=>({id:t.id,position:{x:t.x,y:t.y},isPhasing:t.isPhasing,phaseTimer:t.phaseTimer,phaseCooldown:t.phaseCooldown,phaseWarningTimer:t.phaseWarningTimer,phaseChance:t.phaseChance,isBlinking:t.isBlinking,blinkDuration:t.blinkDuration})),metrics:this.getGhostMetrics()}}getConfig(){return this.GHOST_CONFIG}}class vn extends re{constructor(){super(...arguments),this.SWARM_CONFIG={leaderChar:"S",followerChar:"s",leaderColor:"green",followerColor:"light_green",baseScore:360,followerScore:0,groupDestroyBonus:200,moveInterval:48,followerMoveInterval:20,maxSwarmSize:5,threatLevel:te.HIGH},this.swarmGroups=new Map}createEnemy(e,t){return e!==h.SWARM?null:this.spawnSwarmGroup(t)}updateEnemyLogic(e,t){this.updateBlinking(e),e.isLeader?this.updateLeader(e,t):this.updateFollower(e,t)}getEnemyDisplayInfo(e){const t=e.isLeader?this.SWARM_CONFIG.leaderChar:this.SWARM_CONFIG.followerChar,i=e.isLeader?this.SWARM_CONFIG.leaderColor:this.SWARM_CONFIG.followerColor;return e.isBlinking?Math.floor((e.maxBlinkDuration-e.blinkDuration)/5)%2===0?{char:t,attributes:{entityType:"enemy_blinking",isPassable:!0,color:i}}:{char:" ",attributes:{entityType:"empty",isPassable:!0}}:{char:t,attributes:{entityType:"enemy",color:i,isPassable:!1}}}spawnSwarmGroup(e){const t=this.generateSwarmId(),l=this.createSwarmLeader(e,t,5);if(!l)return console.warn(`Failed to create swarm leader at (${e.x}, ${e.y})`),null;const a=this.createSwarmFollowers(l,4);if(a.length===0)return console.warn(`Failed to create any followers for swarm at (${e.x}, ${e.y})`),null;const u=[l,...a];this.swarmGroups.set(t,u);for(const m of u)this.addEnemy(m);return console.log(`🐝 Swarm spawned: Leader at (${e.x}, ${e.y}), ${a.length} followers`),l}createSwarmLeader(e,t,i){return{id:this.generateEnemyId("swarm"),x:e.x,y:e.y,direction:Math.floor(Math.random()*4),moveCounter:0,isBlinking:!0,blinkDuration:120,maxBlinkDuration:120,type:h.SWARM,baseScore:this.SWARM_CONFIG.baseScore,moveInterval:this.SWARM_CONFIG.moveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.SWARM_CONFIG.threatLevel,playerLearningHints:["リーダーを撃破すると群れ全体が破壊される","群れ全体を囲い込むと高得点"],swarmSize:i,isLeader:!0,leaderPosition:null,leaderId:null,formationOffset:{x:0,y:0},swarmId:t,leadershipScore:1,cohesionStrength:1,formationType:"diamond",maxDistanceFromLeader:0,followDelay:0,lastLeaderPosition:null,separationTimer:0,reunionTimer:0,isSeparated:!1,isReuniting:!1}}createSwarmFollowers(e,t){const i=[],l=[{x:-1,y:0},{x:1,y:0},{x:0,y:-1}];for(let a=0;a<t&&a<l.length;a++){const u=l[a],m={x:e.x+u.x,y:e.y+u.y};if(m.x>=1&&m.x<39&&m.y>=2&&m.y<24){const y=this.createSwarmFollower(e,u,m);i.push(y)}}return i}createSwarmFollower(e,t,i){return{id:this.generateEnemyId("swarm"),x:i.x,y:i.y,direction:e.direction,moveCounter:0,isBlinking:!0,blinkDuration:120,maxBlinkDuration:120,type:h.SWARM,baseScore:this.SWARM_CONFIG.followerScore,moveInterval:this.SWARM_CONFIG.followerMoveInterval,specialTimer:0,isDestroyed:!1,spawnTime:Date.now(),threatLevel:this.SWARM_CONFIG.threatLevel,playerLearningHints:["仲間は囲んでも破壊できない","リーダーを破壊すると仲間も一緒に破壊される"],swarmSize:e.swarmSize,isLeader:!1,leaderPosition:{x:e.x,y:e.y},leaderId:e.id,formationOffset:t,swarmId:e.swarmId,leadershipScore:0,cohesionStrength:.8,formationType:"diamond",maxDistanceFromLeader:4,followDelay:8,lastLeaderPosition:{x:e.x,y:e.y},separationTimer:0,reunionTimer:0,isSeparated:!1,isReuniting:!1}}updateLeader(e,t){if(e.isBlinking)return;const i=this.getSwarmFollowers(e.swarmId),l=i.filter(m=>m.isSeparated),a=i.filter(m=>this.calculateDistance(m,t.playerPosition)<=30);if(l.length>0){Math.random()<.05&&(e.direction=Math.floor(Math.random()*4));return}const u=this.calculateDistance(e,t.playerPosition);if(a.length>0){this.supportFollowers(e,t.playerPosition,a);return}if(u<=5){this.avoidPlayer(e,t.playerPosition);return}Math.random()<.15&&(e.direction=Math.floor(Math.random()*4))}avoidPlayer(e,t){const i=e.x-t.x,l=e.y-t.y;Math.abs(i)>Math.abs(l)?e.direction=i>0?g.RIGHT:g.LEFT:e.direction=l>0?g.DOWN:g.UP}chasePlayer(e,t){const i=t.x-e.x,l=t.y-e.y;Math.abs(i)>Math.abs(l)?e.direction=i>0?g.RIGHT:g.LEFT:e.direction=l>0?g.DOWN:g.UP}supportFollowers(e,t,i){if(i.length===0)return;const l=i.reduce((y,C)=>{const M=this.calculateDistance(y,t);return this.calculateDistance(C,t)<M?C:y}),a={x:t.x-l.x,y:t.y-l.y},u=t.x-a.x,m=t.y-a.y;e.x<u?e.direction=g.RIGHT:e.x>u?e.direction=g.LEFT:e.y<m?e.direction=g.DOWN:e.y>m?e.direction=g.UP:Math.random()<.1&&(e.direction=Math.floor(Math.random()*4))}updateFollower(e,t){if(e.isBlinking)return;const i=this.findLeaderById(e.leaderId);if(!i){this.convertToIndependentBehavior(e);return}const l=this.calculateDistance(e,t.playerPosition),a=this.calculateDistance(e,i);if(l<=30){this.chasePlayer(e,t.playerPosition),e.separationTimer=0;return}if(a>e.maxDistanceFromLeader?(e.separationTimer++,e.separationTimer>180&&(e.isSeparated=!0)):(e.separationTimer=0,e.isSeparated=!1),e.isSeparated){this.handleSeparatedFollower(e,i);return}const u={x:i.x+e.formationOffset.x,y:i.y+e.formationOffset.y};e.x<u.x?e.direction=g.RIGHT:e.x>u.x?e.direction=g.LEFT:e.y<u.y?e.direction=g.DOWN:e.y>u.y&&(e.direction=g.UP)}findLeaderById(e){if(!e)return null;const t=this.getEnemy(e);return t&&t.type===h.SWARM&&t.isLeader?t:null}removeEnemy(e){const t=this.getEnemy(e);t&&(t.isLeader?this.handleLeaderDestruction(t):this.handleFollowerDestruction(t),super.removeEnemy(e))}handleLeaderDestruction(e){const t=this.getSwarmFollowers(e.swarmId);for(const i of t)super.removeEnemy(i.id);this.swarmGroups.delete(e.swarmId),console.log(`🐝 Swarm Leader destroyed! Chain reaction: ${t.length} followers destroyed`)}handleFollowerDestruction(e){const t=this.swarmGroups.get(e.swarmId);if(t){const i=t.findIndex(l=>l.id===e.id);i!==-1&&t.splice(i,1)}}getSwarmFollowers(e){const t=this.swarmGroups.get(e);return t?t.filter(i=>!i.isLeader):[]}generateSwarmId(){return`swarm_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}calculateDistance(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}convertToIndependentBehavior(e){Math.random()<.3&&(e.direction=Math.floor(Math.random()*4)),e.reunionTimer++,e.reunionTimer>600&&this.handleFollowerDestruction(e)}handleSeparatedFollower(e,t){if(e.reunionTimer++,e.reunionTimer%60===0&&this.calculateDistance(e,t)<=8){e.isSeparated=!1,e.isReuniting=!0,e.reunionTimer=0;return}e.reunionTimer>300?this.convertToIndependentBehavior(e):e.x<t.x?e.direction=g.RIGHT:e.x>t.x?e.direction=g.LEFT:e.y<t.y?e.direction=g.DOWN:e.y>t.y&&(e.direction=g.UP)}}class Ul{constructor(){this.spawnTimer=0,this.spawnInterval=600,this.fastSpawnInterval=60,this.minEnemyCount=5,this.wandererManager=new yn,this.guardManager=new pn,this.chaserManager=new En,this.splitterManager=new Sn,this.speedsterManager=new Cn,this.mimicManager=new Tn,this.snakeManager=new wn,this.wallCreeperManager=new xn,this.ghostManager=new Mn,this.swarmManager=new vn}updateAllEnemies(e){const t={enemiesToRemove:[],effectsToAdd:[],scoreToAdd:0},i=this.wandererManager.updateAllEnemies(e);this.mergeResults(t,i);const l=this.guardManager.updateAllEnemies(e);this.mergeResults(t,l);const a=this.chaserManager.updateAllEnemies(e);this.mergeResults(t,a);const u=this.splitterManager.updateAllEnemies(e);this.mergeResults(t,u);const m=this.speedsterManager.updateAllEnemies(e);this.mergeResults(t,m);const y=this.mimicManager.updateAllEnemies(e);this.mergeResults(t,y);const C=this.snakeManager.updateAllEnemies(e);this.mergeResults(t,C);const M=this.wallCreeperManager.updateAllEnemies(e);this.mergeResults(t,M);const T=this.ghostManager.updateAllEnemies(e);this.mergeResults(t,T);const O=this.swarmManager.updateAllEnemies(e);return this.mergeResults(t,O),this.wandererManager.updateDestroyEffects(),this.guardManager.updateDestroyEffects(),this.chaserManager.updateDestroyEffects(),this.splitterManager.updateDestroyEffects(),this.speedsterManager.updateDestroyEffects(),this.mimicManager.updateDestroyEffects(),this.snakeManager.updateDestroyEffects(),this.wallCreeperManager.updateDestroyEffects(),this.ghostManager.updateDestroyEffects(),this.swarmManager.updateDestroyEffects(),t}updateSpawning(e){this.spawnTimer++;const t=this.getTotalEnemyCount(),l=t<this.minEnemyCount?this.fastSpawnInterval:this.spawnInterval,a=t===0&&this.spawnTimer>=1;(this.spawnTimer>=l||a)&&(this.spawnNewEnemy(e),this.spawnTimer=0)}spawnNewEnemy(e){const t=Math.random();let i;t<.5?i=h.SWARM:t<.7?i=h.WANDERER:t<.85?i=h.CHASER:t<.95?i=h.GUARD:i=h.SPEEDSTER;let l=null;if(i===h.GUARD){const u=e.foodPosition;u&&(l=this.findValidSpawnPositionNearFood(u,e))}if(l||(l=this.findValidSpawnPosition(e)),!l){console.log("❌ No valid spawn position found");return}let a=null;if(i===h.WANDERER)a=this.wandererManager.spawnWanderer(l,!0),a&&console.log(`👹 Wanderer spawned at (${l.x}, ${l.y}) - Total enemies: ${this.getTotalEnemyCount()}`);else if(i===h.GUARD){const u=e.foodPosition;u?(a=this.guardManager.spawnGuard(l,u,!0),a&&console.log(`🛡️ Guard spawned at (${l.x}, ${l.y}) guarding food at (${u.x}, ${u.y}) - Total enemies: ${this.getTotalEnemyCount()}`)):(a=this.wandererManager.spawnWanderer(l,!0),a&&console.log(`👹 Wanderer spawned (fallback) at (${l.x}, ${l.y}) - Total enemies: ${this.getTotalEnemyCount()}`))}else i===h.CHASER?(a=this.chaserManager.spawnChaser(l,!0),a&&console.log(`🏃 Chaser spawned at (${l.x}, ${l.y}) - Total enemies: ${this.getTotalEnemyCount()}`)):i===h.SPEEDSTER?(a=this.speedsterManager.spawnSpeedster(l,!0),a&&console.log(`⚡ Speedster spawned at (${l.x}, ${l.y}) - Total enemies: ${this.getTotalEnemyCount()}`)):i===h.SWARM&&this.swarmManager.spawnSwarmGroup(l)&&console.log(`🐝 Swarm group spawned at (${l.x}, ${l.y}) with leader and followers - Total enemies: ${this.getTotalEnemyCount()}`)}findValidSpawnPositionNearFood(e,t){for(let a=0;a<30;a++){const u=Math.random()*Math.PI*2,m=Math.random()*5+2,y={x:Math.round(e.x+Math.cos(u)*m),y:Math.round(e.y+Math.sin(u)*m)};if(!(y.x<1||y.x>38||y.y<2||y.y>23)&&this.isValidSpawnPosition(y,t))return y}return null}findValidSpawnPosition(e){for(let i=0;i<50;i++){const l={x:Math.floor(Math.random()*38)+1,y:Math.floor(Math.random()*22)+2};if(this.isValidSpawnPosition(l,e))return l}return null}isValidSpawnPosition(e,t){return!(e.x===t.playerPosition.x&&e.y===t.playerPosition.y||this.getEnemyAtPosition(e)!==null)}getEnemyDisplayInfo(e){switch(e.type){case h.WANDERER:return this.wandererManager.getEnemyDisplayInfo(e);case h.GUARD:return this.guardManager.getEnemyDisplayInfo(e);case h.CHASER:return this.chaserManager.getEnemyDisplayInfo(e);case h.SPLITTER:return this.splitterManager.getEnemyDisplayInfo(e);case h.SPEEDSTER:return this.speedsterManager.getEnemyDisplayInfo(e);case h.MIMIC:return this.mimicManager.getEnemyDisplayInfo(e);case h.SNAKE:return this.snakeManager.getEnemyDisplayInfo(e);case h.WALL_CREEPER:return this.wallCreeperManager.getEnemyDisplayInfo(e);case h.GHOST:return this.ghostManager.getEnemyDisplayInfo(e);case h.SWARM:return this.swarmManager.getEnemyDisplayInfo(e);default:return{char:"?",attributes:{color:"white"}}}}getAllEnemies(){const e=[];return e.push(...this.wandererManager.getAllEnemies()),e.push(...this.guardManager.getAllEnemies()),e.push(...this.chaserManager.getAllEnemies()),e.push(...this.splitterManager.getAllEnemies()),e.push(...this.speedsterManager.getAllEnemies()),e.push(...this.mimicManager.getAllEnemies()),e.push(...this.snakeManager.getAllEnemies()),e.push(...this.wallCreeperManager.getAllEnemies()),e.push(...this.ghostManager.getAllEnemies()),e.push(...this.swarmManager.getAllEnemies()),e}getEnemyAtPosition(e){const t=this.wandererManager.getEnemyAtPosition(e);if(t)return t;const i=this.guardManager.getEnemyAtPosition(e);if(i)return i;const l=this.chaserManager.getEnemyAtPosition(e);if(l)return l;const a=this.splitterManager.getEnemyAtPosition(e);if(a)return a;const u=this.speedsterManager.getEnemyAtPosition(e);if(u)return u;const m=this.mimicManager.getEnemyAtPosition(e);if(m)return m;const y=this.snakeManager.getEnemyAtPosition(e);if(y)return y;const C=this.wallCreeperManager.getEnemyAtPosition(e);if(C)return C;const M=this.ghostManager.getEnemyAtPosition(e);if(M)return M;const T=this.swarmManager.getEnemyAtPosition(e);return T||null}getTotalEnemyCount(){return this.wandererManager.getAllEnemies().length+this.guardManager.getAllEnemies().length+this.chaserManager.getAllEnemies().length+this.splitterManager.getAllEnemies().length+this.speedsterManager.getAllEnemies().length+this.mimicManager.getAllEnemies().length+this.snakeManager.getAllEnemies().length+this.wallCreeperManager.getAllEnemies().length+this.ghostManager.getAllEnemies().length+this.swarmManager.getAllEnemies().length}getAllDestroyEffects(){const e=[];return e.push(...this.wandererManager.getDestroyEffects()),e.push(...this.guardManager.getDestroyEffects()),e.push(...this.chaserManager.getDestroyEffects()),e.push(...this.splitterManager.getDestroyEffects()),e.push(...this.speedsterManager.getDestroyEffects()),e.push(...this.mimicManager.getDestroyEffects()),e.push(...this.snakeManager.getDestroyEffects()),e.push(...this.wallCreeperManager.getDestroyEffects()),e.push(...this.ghostManager.getDestroyEffects()),e.push(...this.swarmManager.getDestroyEffects()),e}getAllScoreDisplayEffects(){const e=[];return e.push(...this.wandererManager.getScoreDisplayEffects()),e.push(...this.guardManager.getScoreDisplayEffects()),e.push(...this.chaserManager.getScoreDisplayEffects()),e.push(...this.splitterManager.getScoreDisplayEffects()),e.push(...this.speedsterManager.getScoreDisplayEffects()),e.push(...this.mimicManager.getScoreDisplayEffects()),e.push(...this.snakeManager.getScoreDisplayEffects()),e.push(...this.wallCreeperManager.getScoreDisplayEffects()),e.push(...this.ghostManager.getScoreDisplayEffects()),e.push(...this.swarmManager.getScoreDisplayEffects()),e}updateAllDestroyEffects(){this.wandererManager.updateDestroyEffects(),this.guardManager.updateDestroyEffects(),this.chaserManager.updateDestroyEffects(),this.speedsterManager.updateDestroyEffects(),this.mimicManager.updateDestroyEffects(),this.snakeManager.updateDestroyEffects(),this.wallCreeperManager.updateDestroyEffects()}destroyEnemiesInArea(e,t){const i=this.getEnemiesInArea(e,t);console.warn("destroyEnemiesInArea (bounding box) called, prefer specific ID destruction for blasts.");let l=0,a=0;for(const u of i){const m=u.baseScore*i.length;this.destroyEnemyById(u.id,m,i.length)&&(l++,a+=m)}return{destroyedCount:l,totalScore:a}}destroyEnemyById(e,t,i){return this.wandererManager.getEnemy(e)?this.wandererManager.destroyEnemy(e,t,i):this.guardManager.getEnemy(e)?this.guardManager.destroyEnemy(e,t,i):this.chaserManager.getEnemy(e)?this.chaserManager.destroyEnemy(e,t,i):this.splitterManager.getEnemy(e)?this.splitterManager.destroyEnemy(e,t,i):this.speedsterManager.getEnemy(e)?this.speedsterManager.destroyEnemy(e,t,i):this.mimicManager.getEnemy(e)?this.mimicManager.destroyEnemy(e,t,i):this.snakeManager.getEnemy(e)?this.snakeManager.destroyEnemy(e,t,i):this.wallCreeperManager.getEnemy(e)?this.wallCreeperManager.destroyEnemy(e,t,i):this.ghostManager.getEnemy(e)?this.ghostManager.destroyEnemy(e,t,i):this.swarmManager.getEnemy(e)?this.swarmManager.destroyEnemy(e,t,i):!1}getEnemiesInArea(e,t){const i=[];return i.push(...this.wandererManager.getEnemiesInArea(e,t)),i.push(...this.guardManager.getEnemiesInArea(e,t)),i.push(...this.chaserManager.getEnemiesInArea(e,t)),i.push(...this.splitterManager.getEnemiesInArea(e,t)),i.push(...this.speedsterManager.getEnemiesInArea(e,t)),i.push(...this.mimicManager.getEnemiesInArea(e,t)),i.push(...this.snakeManager.getEnemiesInArea(e,t)),i.push(...this.wallCreeperManager.getEnemiesInArea(e,t)),i.push(...this.ghostManager.getEnemiesInArea(e,t)),i.push(...this.swarmManager.getEnemiesInArea(e,t)),i}checkEnemyCollision(e){const t=this.getEnemyAtPosition(e);return t&&!t.isBlinking?t:null}updateSpawnSettings(e){e.spawnInterval!==void 0&&(this.spawnInterval=e.spawnInterval),e.fastSpawnInterval!==void 0&&(this.fastSpawnInterval=e.fastSpawnInterval),e.minEnemyCount!==void 0&&(this.minEnemyCount=e.minEnemyCount)}getDebugInfo(){return{totalEnemies:this.getTotalEnemyCount(),spawnTimer:this.spawnTimer,spawnInterval:this.spawnInterval,minEnemyCount:this.minEnemyCount,wandererInfo:this.wandererManager.getWandererDebugInfo(),guardInfo:this.guardManager.getGuardDebugInfo(),chaserInfo:this.chaserManager.getChaserDebugInfo(),splitterInfo:this.splitterManager.getDebugInfo(),speedsterInfo:this.speedsterManager.getSpeedsterDebugInfo(),mimicInfo:this.mimicManager.getDebugInfo(),snakeInfo:this.snakeManager.getDebugInfo(),ghostInfo:this.ghostManager.getGhostDebugInfo()}}mergeResults(e,t){e.enemiesToRemove.push(...t.enemiesToRemove),e.effectsToAdd.push(...t.effectsToAdd),e.scoreToAdd+=t.scoreToAdd}clearAllEnemies(){this.wandererManager.getAllEnemies().forEach(e=>{this.wandererManager.removeEnemy(e.id)}),this.guardManager.getAllEnemies().forEach(e=>{this.guardManager.removeEnemy(e.id)}),this.chaserManager.getAllEnemies().forEach(e=>{this.chaserManager.removeEnemy(e.id)}),this.splitterManager.getAllEnemies().forEach(e=>{this.splitterManager.removeEnemy(e.id)}),this.speedsterManager.getAllEnemies().forEach(e=>{this.speedsterManager.removeEnemy(e.id)}),this.mimicManager.getAllEnemies().forEach(e=>{this.mimicManager.removeEnemy(e.id)}),this.snakeManager.getAllEnemies().forEach(e=>{this.snakeManager.removeEnemy(e.id)}),this.wallCreeperManager.getAllEnemies().forEach(e=>{this.wallCreeperManager.removeEnemy(e.id)}),this.ghostManager.getAllEnemies().forEach(e=>{this.ghostManager.removeEnemy(e.id)}),this.swarmManager.getAllEnemies().forEach(e=>{this.swarmManager.removeEnemy(e.id)}),this.wandererManager=new yn,this.guardManager=new pn,this.chaserManager=new En,this.splitterManager=new Sn,this.speedsterManager=new Cn,this.mimicManager=new Tn,this.snakeManager=new wn,this.wallCreeperManager=new xn,this.ghostManager=new Mn,this.swarmManager=new vn,this.spawnTimer=0,we.getInstance().reset()}updateGuardTargets(e){this.guardManager.updateGuardTargets(e)}}const D=60,$l=[{id:1,name:"基本訓練",timeThreshold:0*D,duration:20*D,enemyTypes:[h.WANDERER],spawnPattern:{enemyType:h.WANDERER,count:3,interval:600,maxTotal:5}},{id:2,name:"守護者登場",timeThreshold:20*D,duration:20*D,enemyTypes:[h.GUARD],spawnPattern:{enemyType:h.GUARD,count:2,interval:600,maxTotal:5}},{id:3,name:"混合戦闘I",timeThreshold:40*D,duration:20*D,enemyTypes:[h.WANDERER,h.GUARD],spawnPattern:{enemyType:h.WANDERER,count:2,interval:480,maxTotal:7}},{id:4,name:"追跡者登場",timeThreshold:60*D,duration:20*D,enemyTypes:[h.CHASER],spawnPattern:{enemyType:h.CHASER,count:2,interval:720,maxTotal:4}},{id:5,name:"混合戦闘II",timeThreshold:80*D,duration:20*D,enemyTypes:[h.WANDERER,h.CHASER],spawnPattern:{enemyType:h.WANDERER,count:2,interval:420,maxTotal:6}},{id:6,name:"分裂者登場",timeThreshold:100*D,duration:20*D,enemyTypes:[h.SPLITTER],spawnPattern:{enemyType:h.SPLITTER,count:1,interval:900,maxTotal:6}},{id:7,name:"混合戦闘III",timeThreshold:120*D,duration:20*D,enemyTypes:[h.WANDERER,h.CHASER,h.SPLITTER],spawnPattern:{enemyType:h.WANDERER,count:1,interval:900,maxTotal:7}},{id:8,name:"高速戦闘",timeThreshold:140*D,duration:20*D,enemyTypes:[h.SPEEDSTER],spawnPattern:{enemyType:h.SPEEDSTER,count:3,interval:600,maxTotal:5}},{id:9,name:"模倣者登場",timeThreshold:160*D,duration:20*D,enemyTypes:[h.MIMIC],spawnPattern:{enemyType:h.MIMIC,count:2,interval:480,maxTotal:6}},{id:10,name:"スネーク登場",timeThreshold:180*D,duration:20*D,enemyTypes:[h.SNAKE],spawnPattern:{enemyType:h.SNAKE,count:1,interval:1200,maxTotal:3}},{id:11,name:"壁這い登場",timeThreshold:200*D,duration:20*D,enemyTypes:[h.WALL_CREEPER],spawnPattern:{enemyType:h.WALL_CREEPER,count:3,interval:600,maxTotal:7}},{id:12,name:"幽霊登場",timeThreshold:220*D,duration:20*D,enemyTypes:[h.GHOST],spawnPattern:{enemyType:h.GHOST,count:1,interval:600,maxTotal:3}},{id:13,name:"群れ登場",timeThreshold:240*D,duration:20*D,enemyTypes:[h.SWARM],spawnPattern:{enemyType:h.SWARM,count:1,interval:900,maxTotal:5}},{id:14,name:"混合戦闘IV",timeThreshold:260*D,duration:20*D,enemyTypes:[h.CHASER,h.SPLITTER,h.SPEEDSTER],spawnPattern:{enemyType:h.CHASER,count:1,interval:900,maxTotal:8}},{id:15,name:"混合戦闘V",timeThreshold:280*D,duration:20*D,enemyTypes:[h.MIMIC,h.SNAKE,h.WALL_CREEPER],spawnPattern:{enemyType:h.WALL_CREEPER,count:1,interval:900,maxTotal:8}},{id:16,name:"混合戦闘VI",timeThreshold:300*D,duration:20*D,enemyTypes:[h.GHOST,h.SWARM,h.SPEEDSTER],spawnPattern:{enemyType:h.SPEEDSTER,count:1,interval:900,maxTotal:8}},{id:17,name:"混合戦闘VII",timeThreshold:320*D,duration:20*D,enemyTypes:[h.WANDERER,h.CHASER,h.SPLITTER,h.MIMIC],spawnPattern:{enemyType:h.WANDERER,count:1,interval:900,maxTotal:8}},{id:18,name:"混合戦闘VIII",timeThreshold:340*D,duration:20*D,enemyTypes:[h.SNAKE,h.WALL_CREEPER,h.GHOST,h.SWARM],spawnPattern:{enemyType:h.WALL_CREEPER,count:1,interval:900,maxTotal:8}},{id:19,name:"最終試練",timeThreshold:360*D,duration:20*D,enemyTypes:[h.CHASER,h.SPEEDSTER,h.MIMIC,h.SNAKE,h.GHOST],spawnPattern:{enemyType:h.CHASER,count:1,interval:900,maxTotal:8}},{id:20,name:"全敵統合",timeThreshold:380*D,duration:20*D,enemyTypes:[h.WANDERER,h.GUARD,h.CHASER,h.SPLITTER,h.SPEEDSTER,h.MIMIC,h.SNAKE,h.WALL_CREEPER,h.GHOST,h.SWARM],spawnPattern:{enemyType:h.WANDERER,count:1,interval:1200,maxTotal:10}}];class In{constructor(e=1){this.currentLevel=1,this.levels=$l,this.currentFrame=0,this.isEndlessMode=!1,this.endlessMultiplier=1,this.lastEndlessLevelFrame=0,this.currentEndlessLevel=null,this.timeAcceleration=e}incrementFrame(){this.currentFrame+=this.timeAcceleration}getCurrentLevel(){return this.isEndlessMode&&this.currentEndlessLevel?this.currentEndlessLevel:this.levels[this.currentLevel-1]}update(){return this.incrementFrame(),this.isEndlessMode?this.updateEndlessMode():this.checkLevelUp()}checkLevelUp(){if(this.currentLevel-1<this.levels.length)if(this.currentLevel===this.levels.length){const t=this.levels[this.currentLevel-1];if(this.currentFrame>=t.timeThreshold+t.duration)return this.startEndlessMode(),!0}else{const t=this.levels[this.currentLevel];if(t&&this.currentFrame>=t.timeThreshold)return this.currentLevel++,console.log(`Level Up! Now at level ${this.currentLevel}`),!0}else if(!this.isEndlessMode)return this.startEndlessMode(),!0;return!1}startEndlessMode(){this.isEndlessMode=!0,this.endlessMultiplier=1,this.lastEndlessLevelFrame=this.currentFrame,this.selectRandomEndlessLevel(),console.log("🔄 Endless Mode Started!")}updateEndlessMode(){const e=20*D;return this.currentFrame-this.lastEndlessLevelFrame>=e?(this.endlessMultiplier+=.1,this.lastEndlessLevelFrame=this.currentFrame,this.selectRandomEndlessLevel(),console.log(`🔄 Endless Level Change! Multiplier: ${this.endlessMultiplier.toFixed(1)}`),!0):!1}selectRandomEndlessLevel(){const e=this.levels.slice(2),t=Math.floor(Math.random()*e.length),i=e[t],l=20*D;this.currentEndlessLevel={...i,id:999,name:`${i.name} (Endless x${this.endlessMultiplier.toFixed(1)})`,timeThreshold:0,duration:l,spawnPattern:{...i.spawnPattern,count:Math.max(1,Math.floor(i.spawnPattern.count*this.endlessMultiplier)),maxTotal:Math.max(1,Math.floor(i.spawnPattern.maxTotal*this.endlessMultiplier)),interval:Math.max(60,Math.floor(i.spawnPattern.interval/this.endlessMultiplier))}}}shouldSpawnEnemy(e,t,i,l){const a=this.getCurrentLevel();if(!a.enemyTypes.includes(e))return{shouldSpawn:!1,reason:"not_in_level"};if(i>=a.spawnPattern.maxTotal)return{shouldSpawn:!1,reason:"max_count_reached"};const u=a.spawnPattern.count;if(t<u){const C=this.calculateEmergencyInterval();if(l>=C)return{shouldSpawn:!0,reason:"emergency_spawn",isEmergency:!0,interval:C}}const y=this.calculateNormalInterval(a.spawnPattern.interval);return l<y?{shouldSpawn:!1,reason:"interval_not_met"}:{shouldSpawn:!0,reason:"normal_spawn",isEmergency:!1,interval:y}}calculateEmergencyInterval(){return this.isEndlessMode?Math.max(Math.floor(180/this.endlessMultiplier),60):Math.max(180,90)}calculateNormalInterval(e){return this.isEndlessMode?Math.max(Math.floor(e/this.endlessMultiplier),120):Math.max(e,180)}isInEndlessMode(){return this.isEndlessMode}getEndlessMultiplier(){return this.endlessMultiplier}getCurrentLevelNumber(){return this.currentLevel}getCurrentFrame(){return this.currentFrame}getCurrentLevelInfo(){const e=this.getCurrentLevel();return this.isEndlessMode?`${e.name} (${this.endlessMultiplier.toFixed(1)}x)`:`Level ${e.id}: ${e.name}`}getDebugInfo(){const e=this.getCurrentLevel();if(!e){const t=this.isEndlessMode?"Endless (Initializing)":"Level (Invalid)";return{currentLevelNumber:this.currentLevel,isEndlessMode:this.isEndlessMode,endlessMultiplier:this.endlessMultiplier,currentFrame:this.currentFrame,levelName:t,levelEnemyTypes:[],spawnPattern:{enemyType:h.WANDERER,count:0,interval:300,maxTotal:0},emergencyInterval:this.calculateEmergencyInterval(),normalInterval:this.calculateNormalInterval(300)}}return{currentLevelNumber:this.currentLevel,isEndlessMode:this.isEndlessMode,endlessMultiplier:this.endlessMultiplier,currentFrame:this.currentFrame,levelName:e.name,levelEnemyTypes:e.enemyTypes,spawnPattern:e.spawnPattern,emergencyInterval:this.calculateEmergencyInterval(),normalInterval:this.calculateNormalInterval(e.spawnPattern.interval)}}}const Vl=8,ye=12,Dn=1e3,jl=30,Rn=5;class zl{constructor(e={},t){this.lastSpawnTimes=new Map,this.gameFrameCounter=0,this.lastAreaExplosionSoundTime=-1/0,this.areaExplosionSoundCooldown=60,this.baseGame=t;const{movementInterval:i=Vl,debugMode:l=!1,invincible:a=!1,timeAcceleration:u=1,constrainToBounds:m=!1}=e;this.playerExplosionPosition=null,this.gameFrameCounter=0,this.debugMode=l,this.invincible=a,this.timeAcceleration=u,this.constrainToBounds=m,this.enemySystem=new Ul,this.levelManager=new In(this.timeAcceleration),Object.values(h).forEach(y=>{this.lastSpawnTimes.set(y,0)}),this.snake=[],this.direction=3,this.nextDirection=3,this.food={x:0,y:0},this.explosions=[],this.guideLines=[],this.movementFrameCounter=0,this.movementInterval=i,this.isWaitingForRestart=!1,this.gameMessages=[],this.lastScoreGrowthCheck=0,this.hasGrownThisEnclosure=!1,this.preservedSnakeLength=ye}initializeGame(){this.baseGame.playBgm(),this.levelManager=new In(this.timeAcceleration),this.gameFrameCounter=0,Object.values(h).forEach(i=>{this.lastSpawnTimes.set(i,0)});const e=Math.floor(b/2),t=Math.floor(L/2);this.snake=[];for(let i=0;i<ye;i++)this.snake.push({x:e-i,y:t});this.direction=3,this.nextDirection=3,this.movementFrameCounter=0,this.lastScoreGrowthCheck=0,this.hasGrownThisEnclosure=!1,this.preservedSnakeLength=ye,this.gameMessages=[],this.generateFood(),this.enemySystem.clearAllEnemies(),this.explosions=[],this.playerExplosionPosition=null,this.isWaitingForRestart=!1}getScore(){return this.baseGame.getScore()}getLives(){return this.baseGame.getLives()}isGameOver(){return this.baseGame.isGameOver()}getSnakeHeadPosition(){return this.snake.length>0?{...this.snake[0]}:null}isCellSafeForMovement(e,t){if(e<1||e>=b-1||t<2||t>=L-1)return!1;for(let i=0;i<this.snake.length-1;i++)if(this.snake[i].x===e&&this.snake[i].y===t)return!1;return!0}loseLife(){this.baseGame.loseLife()}drawText(e,t,i,l){this.baseGame.drawText(e,t,i,l)}drawCenteredText(e,t,i){const l=Math.floor(b/2-e.length/2);this.drawText(e,l,t,i)}drawStaticElements(){const e="#",t={entityType:"wall",isPassable:!1,color:"light_black"};for(let i=0;i<b;i++)this.drawText(e,i,1,t),this.drawText(e,i,L-1,t);for(let i=1;i<L-1;i++)this.drawText(e,0,i,t),this.drawText(e,b-1,i,t);this.drawText("$",this.food.x,this.food.y,{entityType:"food",isPassable:!0,color:"yellow"})}drawSnake(){if(this.snake.length>0){const e=this.snake[0];this.drawText("@",e.x,e.y,{entityType:"snake_head",isPassable:!1,color:"green"})}for(let e=1;e<this.snake.length;e++){const t=this.snake[e];this.drawText("*",t.x,t.y,{entityType:"snake_body",isPassable:!1,color:"light_green"})}}drawEnemies(){const e=this.enemySystem.getAllEnemies();for(const t of e){if(t.type===h.SNAKE){const l=t,u=this.enemySystem.snakeManager.getSnakeBodyDisplayInfo(l);for(const m of u)this.drawText(m.char,m.pos.x,m.pos.y,m.attributes)}const i=this.enemySystem.getEnemyDisplayInfo(t);this.drawText(i.char,t.x,t.y,i.attributes)}}drawExplosions(){for(const e of this.explosions){const t=e.duration/e.maxDuration;let i="X",l="red";t>.9?(i="#",l="yellow"):t>.8?(i="%",l="yellow"):t>.6?(i="*",l="red"):t>.4?(i="+",l="light_red"):t>.2?(i=".",l="light_red"):i=" ",this.drawText(i,e.x,e.y,{entityType:"explosion",isPassable:!0,color:l})}}drawEnemyDestroyEffects(){const e=this.enemySystem.getAllDestroyEffects();for(const t of e){const i=t.duration/t.maxDuration;let l="X",a="red";i>.9?(l="#",a="yellow"):i>.8?(l="%",a="yellow"):i>.6?(l="*",a="red"):i>.4?(l="+",a="light_red"):i>.2?(l=".",a="light_red"):l=" ",this.drawText(l,t.x,t.y,{entityType:"enemy_destroy_effect",isPassable:!0,color:a})}}drawScoreDisplayEffects(){const e=this.enemySystem.getAllScoreDisplayEffects();for(const t of e){const i=t.duration/t.maxDuration;if(t.baseScore>0&&i>.1){const l=`${t.baseScore}`;if(this.drawText(l,t.x,t.y,{entityType:"score_display",isPassable:!0,color:"white"}),t.multiplier>1){const a=`x${t.multiplier}`,u=Math.max(1,t.y-1);this.drawText(a,t.x,u,{entityType:"multiplier_display",isPassable:!0,color:"cyan"})}}}}updateExplosions(){for(let e=this.explosions.length-1;e>=0;e--)this.explosions[e].duration--,this.explosions[e].duration<=0&&(this.explosions.splice(e,1),this.playerExplosionPosition&&this.explosions.length===0&&this.isWaitingForRestart&&(this.playerExplosionPosition=null,this.isWaitingForRestart=!1,this.restartFromBeginning()))}addExplosionEffect(e,t){this.explosions.push({x:e,y:t,duration:60,maxDuration:60})}addGameMessage(e,t="white",i=120){this.gameMessages.push({text:e,color:t,duration:i,maxDuration:i})}updateGameMessages(){for(let e=this.gameMessages.length-1;e>=0;e--)this.gameMessages[e].duration--,this.gameMessages[e].duration<=0&&this.gameMessages.splice(e,1)}drawGameMessages(){if(this.gameMessages.length===0)return;const e=this.gameMessages[this.gameMessages.length-1],t=L-1,i=e.duration/e.maxDuration;let l=e.color;i<.25&&(l="light_black"),this.drawCenteredText(e.text,t,{entityType:"game_message",isPassable:!0,color:l})}updateGuideLines(){if(this.guideLines=[],this.snake.length===0)return;const e=this.snake[0];let t=e.x,i=e.y,l=0;const a=5;for(;l<a;){switch(this.direction){case 0:i--;break;case 1:i++;break;case 2:t--;break;case 3:t++;break}if(t<1||t>=b-1||i<2||i>=L-1||this.snake.some(y=>y.x===t&&y.y===i)||this.enemySystem.getEnemyAtPosition({x:t,y:i})!==null||t===this.food.x&&i===this.food.y)break;this.guideLines.push({x:t,y:i}),l++}}drawGuideLines(){for(const e of this.guideLines)this.drawText(".",e.x,e.y,{entityType:"guide_line",isPassable:!0,color:"light_blue"})}generateFood(){let e,t=!1;do{e={x:Math.floor(Math.random()*(b-6))+3,y:Math.floor(Math.random()*(L-7))+4};const i=this.snake.some(a=>a.x===e.x&&a.y===e.y),l=this.enemySystem.getEnemyAtPosition(e)!==null;t=!i&&!l}while(!t);this.food=e,this.enemySystem.updateGuardTargets(e)}moveSnake(){if(this.snake.length===0)return;this.direction=this.nextDirection;const e={...this.snake[0]};switch(this.direction){case 0:e.y--;break;case 1:e.y++;break;case 2:e.x--;break;case 3:e.x++;break}this.constrainToBounds&&(e.x=Math.max(1,Math.min(b-2,e.x)),e.y=Math.max(2,Math.min(L-2,e.y))),this.snake.unshift(e),e.x===this.food.x&&e.y===this.food.y?(this.baseGame.play("powerUp"),this.addScore(10),this.generateFood(),this.preservedSnakeLength=this.snake.length,this.addGameMessage("GROW!","green",60)):this.snake.pop()}checkCollisions(){if(this.invincible||this.snake.length===0)return;const e=this.snake[0];if(e.x<1||e.x>=39||e.y<2||e.y>=24){this.explodePlayer();return}for(let l=1;l<this.snake.length;l++)if(e.x===this.snake[l].x&&e.y===this.snake[l].y){this.explodePlayer();return}if(this.enemySystem.checkEnemyCollision(e)){this.explodePlayer();return}const i=this.enemySystem.getAllEnemies();for(const l of i)if(l.type===h.SNAKE&&!l.isBlinking){const a=l,m=this.enemySystem.snakeManager.getSnakeBodyPositions(a);for(const y of m)if(e.x===y.x&&e.y===y.y){this.explodePlayer();return}}}checkAreaEnclosure(){if(this.snake.length<8)return;const e=this.findSeparateAreas();let t=!1;for(const i of e)!i.isBorderConnected&&i.size>0&&(this.explodeAreaFromPosition(i.startPos)>0||i.size>0)&&(t=!0);t&&(this.hasGrownThisEnclosure=!1)}findSeparateAreas(){const e=Array(L).fill(null).map(()=>Array(b).fill(!1)),t=[];for(let i=2;i<L-1;i++)for(let l=1;l<b-1;l++)if(!e[i][l]&&this.isTraversableForAreaFinding(l,i)){const a=this.floodFillArea(l,i,e,this.isTraversableForAreaFinding.bind(this));a.size>0&&t.push({size:a.size,startPos:{x:l,y:i},isBorderConnected:a.isBorderConnected})}return t}isTraversableForAreaFinding(e,t){return!(e<=0||e>=b-1||t<=1||t>=L-1||this.snake.some(a=>a.x===e&&a.y===t)||this.guideLines.some(a=>a.x===e&&a.y===t))}isEmptySpace(e,t){if(e<=0||e>=b-1||t<=1||t>=L-1||this.snake.some(m=>m.x===e&&m.y===t)||this.food.x===e&&this.food.y===t||this.enemySystem.getEnemyAtPosition({x:e,y:t})!==null)return!1;const a=this.enemySystem.getAllEnemies();for(const m of a)if(m.type===h.SNAKE&&!m.isBlinking){const y=m,M=this.enemySystem.snakeManager.getSnakeBodyPositions(y);for(const T of M)if(T.x===e&&T.y===t)return!1}return!this.guideLines.some(m=>m.x===e&&m.y===t)}floodFillArea(e,t,i,l=this.isEmptySpace.bind(this)){if(e<0||e>=b||t<0||t>=L||i[t][e]||!l(e,t))return{size:0,isBorderConnected:!1};let a=0,u=!1;const m=[{x:e,y:t}];for(;m.length>0;){const{x:y,y:C}=m.pop();y<0||y>=b||C<0||C>=L||i[C][y]||l(y,C)&&((y===1||y===b-2||C===2||C===L-2)&&(u=!0),i[C][y]=!0,a++,m.push({x:y+1,y:C}),m.push({x:y-1,y:C}),m.push({x:y,y:C+1}),m.push({x:y,y:C-1}))}return{size:a,isBorderConnected:u}}explodeAreaFromPosition(e){return this.explodeArea(e.x,e.y)}explodeArea(e,t){const i=Array(L).fill(null).map(()=>Array(b).fill(!1)),l=this.floodFillArea(e,t,i,this.isTraversableForAreaFinding.bind(this));if(l.isBorderConnected&&l.size>10)return 0;const a=Array(L).fill(null).map(()=>Array(b).fill(!1)),u=[],m=new Set,y={filledCellCount:0,maxCellsToFill:l.size};this.floodFillAndDestroy(e,t,a,y,(M,T)=>{this.addExplosionEffect(M,T);const O=this.enemySystem.getEnemyAtPosition({x:M,y:T});O&&!O.isBlinking&&!m.has(O.id)&&(u.push(O),m.add(O.id))});let C=0;if(u.length>0){const T=u.filter(j=>j.baseScore>0).length;let O=0;for(const j of u){if(j.baseScore===0)continue;const J=j.baseScore*T;if(this.enemySystem.destroyEnemyById(j.id,J,T)){C++,O+=J;const Z=Object.values(h).indexOf(j.type);this.baseGame.play("coin",Z>=0?Z:void 0)}}O>0&&this.addScore(O)}return(C>0||l.size>0&&u.length===0)&&this.gameFrameCounter>=this.lastAreaExplosionSoundTime+this.areaExplosionSoundCooldown&&(this.baseGame.play("explosion",100),this.lastAreaExplosionSoundTime=this.gameFrameCounter),C}floodFillAndDestroy(e,t,i,l,a){l.filledCellCount>=l.maxCellsToFill||e<=0||e>=b-1||t<=1||t>=L-1||i[t][e]||this.isTraversableForAreaFinding(e,t)&&(i[t][e]=!0,l.filledCellCount++,a(e,t),this.floodFillAndDestroy(e+1,t,i,l,a),this.floodFillAndDestroy(e-1,t,i,l,a),this.floodFillAndDestroy(e,t+1,i,l,a),this.floodFillAndDestroy(e,t-1,i,l,a))}update(e){if(this.isGameOver())return;if(this.gameFrameCounter++,this.drawStaticElements(),this.isWaitingForRestart){this.drawExplosions(),this.updateExplosions(),this.drawText(`${this.getScore()}`,1,0,{color:"white"});const y=`HI ${this.baseGame.getHighScore()}`,C=b-y.length-1;this.drawText(y,C,0,{color:"yellow"});const M=this.getLives()-1;if(M>0){const T=Math.floor((b-M*2)/2);for(let O=0;O<M;O++)this.drawText("@",T+O*2,0,{color:"green"})}return}if(this.levelManager.update()){const y=this.levelManager.getCurrentLevel();console.log(`🎯 Level Changed: ${y.name}`),this.levelManager.isInEndlessMode()&&console.log(`🔄 Endless Mode - Multiplier: ${this.levelManager.getEndlessMultiplier().toFixed(1)}x`)}const i={gameTime:this.gameFrameCounter,score:this.getScore(),snakeLength:this.snake.length,totalEnemiesDestroyed:0,lives:this.getLives(),playerPosition:this.snake[0]||{x:0,y:0},snakeSegments:[...this.snake],enemies:this.enemySystem.getAllEnemies(),foodPosition:this.food},l=this.enemySystem.updateAllEnemies(i);this.addScore(l.scoreToAdd),this.updateEnemySpawning(i),this.movementFrameCounter++,e.up&&this.direction!==1?this.nextDirection=0:e.down&&this.direction!==0?this.nextDirection=1:e.left&&this.direction!==3?this.nextDirection=2:e.right&&this.direction!==2&&(this.nextDirection=3),this.movementFrameCounter>=this.movementInterval&&(this.movementFrameCounter=0,this.moveSnake(),this.checkCollisions()),this.updateGuideLines(),this.drawGuideLines(),this.drawSnake(),this.drawEnemies(),this.drawExplosions(),this.updateExplosions(),this.drawEnemyDestroyEffects(),this.enemySystem.updateAllDestroyEffects(),this.drawScoreDisplayEffects(),this.checkAreaEnclosure(),this.updateGameMessages(),this.drawGameMessages(),this.drawText(`${this.getScore()}`,1,0,{color:"white"});const a=`HI ${this.baseGame.getHighScore()}`,u=b-a.length-1;this.drawText(a,u,0,{color:"yellow"});const m=this.getLives()-1;if(m>0){const y=Math.floor((b-m*2)/2);for(let C=0;C<m;C++)this.drawText("@",y+C*2,0,{color:"green"})}}explodePlayer(){if(this.snake.length===0&&!this.playerExplosionPosition)return;const e=this.playerExplosionPosition||this.snake[0];e&&(this.baseGame.play("explosion",200),this.addExplosionEffect(e.x,e.y),this.playerExplosionPosition={x:e.x,y:e.y},this.enemySystem.clearAllEnemies(),this.loseLife(),this.isGameOver()?(this.isWaitingForRestart=!0,this.snake=[]):(this.isWaitingForRestart=!0,this.preservedSnakeLength=this.snake.length>0?this.snake.length:this.preservedSnakeLength,this.snake=[]))}restartFromBeginning(){const e=Math.max(this.preservedSnakeLength,ye),t=Math.floor(b/2),i=Math.floor(L/2);this.snake=[];for(let l=0;l<e;l++)this.snake.push({x:t-l,y:i});this.direction=3,this.nextDirection=3,this.movementFrameCounter=0,this.generateFood(),console.log(`🔄 Snake restarted with preserved length: ${e}`)}addScore(e){if(e===0)return;this.baseGame.addScore(e);const t=this.getScore(),i=Math.floor(this.lastScoreGrowthCheck/Dn);Math.floor(t/Dn)>i&&!this.hasGrownThisEnclosure&&(this.growSnake(),this.hasGrownThisEnclosure=!0,console.log(`🐍 Snake grew due to score! Length: ${this.snake.length}, Score: ${t}`)),this.lastScoreGrowthCheck=t,this.checkExtraLifeFromLength()}growSnake(){if(this.snake.length>0){const e=this.snake[this.snake.length-1];this.snake.push({...e}),this.preservedSnakeLength=this.snake.length,this.addGameMessage("GROW!","green",90)}}getEnemyDebugInfo(){return this.enemySystem.getDebugInfo()}updateEnemySpawning(e){const t=this.levelManager.getCurrentLevel(),i=this.getTotalEnemyCount();for(const l of t.enemyTypes){const a=this.getEnemyCount(l),u=this.lastSpawnTimes.get(l)||0,m=this.gameFrameCounter-u;this.levelManager.shouldSpawnEnemy(l,a,i,m).shouldSpawn&&(this.spawnEnemyOfType(l,e),this.lastSpawnTimes.set(l,this.gameFrameCounter))}}getTotalEnemyCount(){return this.enemySystem.getTotalEnemyCount()}getEnemyCount(e){return this.enemySystem.getAllEnemies().filter(t=>t.type===e).length}spawnEnemyOfType(e,t){let i=null;if(e===h.GUARD){const a=t.foodPosition;a&&(i=this.findValidSpawnPositionNearFood(a,t))}if(i||(i=this.findValidSpawnPosition(t)),!i)return;let l=null;switch(e){case h.WANDERER:l=this.enemySystem.wandererManager.spawnWanderer(i,!0);break;case h.GUARD:const a=t.foodPosition;a&&(l=this.enemySystem.guardManager.spawnGuard(i,a,!0));break;case h.CHASER:l=this.enemySystem.chaserManager.spawnChaser(i,!0);break;case h.SPLITTER:l=this.enemySystem.splitterManager.spawnSplitter(i,!0);break;case h.SPEEDSTER:l=this.enemySystem.speedsterManager.spawnSpeedster(i,!0);break;case h.MIMIC:l=this.enemySystem.mimicManager.spawnMimic(i,!0);break;case h.SNAKE:l=this.enemySystem.snakeManager.spawnSnake(i,!0);break;case h.WALL_CREEPER:l=this.enemySystem.wallCreeperManager.spawnWallCreeper(i,!0);break;case h.GHOST:l=this.enemySystem.ghostManager.spawnGhost(i,!0);break;case h.SWARM:const u=this.enemySystem.swarmManager.spawnSwarmGroup(i);l=u?u.id:null;break;default:return}if(l){const a=Object.values(h).indexOf(e);this.baseGame.play("laser",a>=0?a:void 0),console.log(`👹 ${e} spawned at (${i.x}, ${i.y}) - ID: ${l}`)}else console.log(`❌ Failed to spawn ${e} at (${i.x}, ${i.y})`)}findValidSpawnPositionNearFood(e,t){for(let u=0;u<20;u++){const m=Math.random()*2*Math.PI,y=2+Math.random()*2,C=Math.round(e.x+Math.cos(m)*y),M=Math.round(e.y+Math.sin(m)*y),T={x:C,y:M};if(this.isValidSpawnPosition(T,t))return T}return null}findValidSpawnPosition(e){for(let i=0;i<50;i++){const l=2+Math.floor(Math.random()*(b-4)),a=3+Math.floor(Math.random()*(L-5)),u={x:l,y:a};if(this.isValidSpawnPosition(u,e))return u}return null}isValidSpawnPosition(e,t){if(e.x<=1||e.x>=b-2||e.y<=2||e.y>=L-2)return!1;for(const i of t.snakeSegments)if(i.x===e.x&&i.y===e.y)return!1;if(t.foodPosition&&t.foodPosition.x===e.x&&t.foodPosition.y===e.y)return!1;for(const i of t.enemies)if(i.x===e.x&&i.y===e.y)return!1;return!0}getCurrentLevelInfo(){return this.levelManager.getCurrentLevelInfo()}getSpawnDebugInfo(){const e=this.levelManager.getDebugInfo();if(!e||typeof e.currentFrame>"u"||typeof e.currentLevelNumber>"u")return console.warn("CoreGameLogic.getSpawnDebugInfo: levelManagerDebugInfo is incomplete. Returning default debug info."),{currentLevel:this.levelManager.getCurrentLevelNumber(),gameTimeSeconds:this.levelManager.getCurrentFrame()/60,levelName:"Unknown (Error)",enemyCounts:{},spawnPattern:{},isEndlessMode:this.levelManager.isInEndlessMode(),endlessMultiplier:1,emergencyInterval:300,normalInterval:300,totalEnemies:0,lastSpawnTimes:{},gameFrameCounter:this.gameFrameCounter,levelEnemyTypes:[],levelDifficultyMultiplier:1};const t=Object.values(h).reduce((i,l)=>(i[l]=this.getEnemyCount(l),i),{});return{currentLevel:e.currentLevelNumber,gameTimeSeconds:e.currentFrame/60,levelName:e.levelName,isEndlessMode:e.isEndlessMode,endlessMultiplier:e.endlessMultiplier,levelDifficultyMultiplier:e.levelDifficultyMultiplier,levelEnemyTypes:e.levelEnemyTypes,spawnPattern:e.spawnPattern,emergencyInterval:e.emergencyInterval,normalInterval:e.normalInterval,totalEnemies:this.getTotalEnemyCount(),enemyCounts:t,lastSpawnTimes:Object.fromEntries(this.lastSpawnTimes),gameFrameCounter:this.gameFrameCounter}}checkExtraLifeFromLength(){this.snake.length>=jl&&(console.log(`🎯 Extra life gained! Snake length: ${this.snake.length}, Lives: ${this.getLives()} -> ${this.getLives()+1}`),this.resetSnakeToInitialLength(),this.getLives()<Rn&&this.addLifeInternal())}resetSnakeToInitialLength(){if(this.snake.length>ye){const e=this.snake[0];this.snake=[];for(let t=0;t<ye;t++){let i=e.x,l=e.y;switch(this.direction){case 3:i=e.x-t;break;case 2:i=e.x+t;break;case 0:l=e.y+t;break;case 1:l=e.y-t;break}this.snake.push({x:i,y:l})}console.log(`🔄 Snake reset to initial length: ${ye}`)}this.preservedSnakeLength=ye}addLifeInternal(){this.getLives()<Rn&&(this.baseGame.gainLife(1),this.baseGame.play("powerUp"),console.log(`💖 Life added! Current lives: ${this.getLives()}`),this.addGameMessage("EXTRA LIFE!","cyan",120))}}const Pn=[`
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

`],mi=4,Kl=5;function Yl(o){const t=o.charCodeAt(0)-33;if(t<0||t>=Pn.length)return null;const i=Pn[t];if(!i)return null;const a=i.trim().split(`
`),u=[];for(let m=0;m<Kl;m++)u.push(a[m]||"");return u}function Xl(o,e,t,i,l,a){let u=t;for(const m of e){if(m===" "){u+=mi;continue}const y=Yl(m);if(!y){console.warn(`[drawLargeText] No pattern found for character: '${m}' (ASCII: ${m.charCodeAt(0)})`),u+=mi;continue}for(let C=0;C<y.length;C++){const M=y[C];for(let T=0;T<M.length;T++)M[T]==="l"&&o.drawText(l,u+T,i+C,a)}u+=mi}}const Jl=300,Le=[{name:"Wanderer",shortName:"WANDER",activeChar:"W",activeColor:"red",spawningChar:"o",spawningColor:"light_red",baseScore:100},{name:"Guard",shortName:"GUARD",activeChar:"G",activeColor:"yellow",spawningChar:"G",spawningColor:"light_red",baseScore:120},{name:"Chaser",shortName:"CHASER",activeChar:"C",activeColor:"light_cyan",spawningChar:"c",spawningColor:"cyan",baseScore:220},{name:"Splitter",shortName:"SPLIT",activeChar:"S",activeColor:"purple",spawningChar:"s",spawningColor:"light_purple",baseScore:80},{name:"Speedster",shortName:"SPEED",activeChar:"F",activeColor:"cyan",spawningChar:"f",spawningColor:"light_cyan",baseScore:300},{name:"Mimic",shortName:"MIMIC",activeChar:"M",activeColor:"light_cyan",spawningChar:"m",spawningColor:"light_black",baseScore:130},{name:"Wall Creeper",shortName:"CREEP",activeChar:"W",activeColor:"light_black",spawningChar:"w",spawningColor:"red",baseScore:150},{name:"Evil Snake",shortName:"SNAKE",activeChar:"S",activeColor:"yellow",spawningChar:"s",spawningColor:"light_yellow",baseScore:330},{name:"Ghost",shortName:"GHOST",activeChar:"?",activeColor:"light_black",spawningChar:".",spawningColor:"light_blue",baseScore:270},{name:"Swarm Leader",shortName:"SWARM",activeChar:"S",activeColor:"green",spawningChar:"s",spawningColor:"light_green",baseScore:360}],I=class I extends An{constructor(e={}){super(e),this.lastScore=0,this.gameOverTimer=0,this.titleAnimationTimer=0,this.titleAnimationPhase="initial",this.enemyGlobalAnimTimer=0,this.titleTextCurrentY=5,this.enemiesRevealedCount=0,this.currentEnemySpawnProgressTimer=0,this.titleToDemoTimer=0,this.demoPlayTimer=0,this.demoCurrentInput={},this.demoInputCooldown=0,this.gameOptions=e,e.startInPlayingState?(this.currentFlowState=2,this.setIsDemoPlay(!1),this.initializeCoreGame()):(this.currentFlowState=0,this.setIsDemoPlay(!1),this.initializeGame())}initializeGame(){this.currentFlowState!==2&&(this.currentFlowState=0,this.resetTitleAnimationStates())}resetTitleAnimationStates(){this.titleAnimationTimer=0,this.titleAnimationPhase="initial",this.titleTextCurrentY=I.TITLE_TEXT_START_Y,this.enemiesRevealedCount=0,this.currentEnemySpawnProgressTimer=0,this.enemyGlobalAnimTimer=0,this.titleToDemoTimer=0,this.demoPlayTimer=0,this.demoCurrentInput={},this.demoInputCooldown=0}clearVirtualScreen(){this.currentFlowState!==3&&super.clearVirtualScreen()}initializeCoreGame(){(!this.actualGame||this.actualGame.isGameOver())&&(this.actualGame=new zl(this.gameOptions,this)),this.actualGame.initializeGame()}getCoreGameLogic(){return this.actualGame||(console.warn("Accessing CoreGameLogic before it is initialized!"),this.initializeCoreGame()),this.actualGame}update(e){switch(this.clearVirtualScreen(),this.currentFlowState){case 0:this.updateTitleScreen(e),this.drawTitleScreen();break;case 1:this.updateDemoScreen(e),this.drawDemoScreen();break;case 2:this.actualGame||this.initializeCoreGame(),this.actualGame.update(e),this.actualGame.isGameOver()&&(this.lastScore=this.actualGame.getScore(),this.currentFlowState=3,this.gameOverTimer=Jl,this.stopBgm());break;case 3:this.updateGameOverScreen(e),this.drawGameOverScreen();break}}updateGame(e){}updateTitleScreen(e){if(this.gameOptions.startInPlayingState){this.currentFlowState=2,this.setIsDemoPlay(!1),this.actualGame||this.initializeCoreGame();return}if(e.action1||e.action2){this.startGameFromTitleOrDemo();return}if(this.titleAnimationTimer++,this.titleAnimationPhase==="fullyRevealed"){if(this.titleToDemoTimer++,this.titleToDemoTimer>I.TITLE_TO_DEMO_DELAY_FRAMES){this.currentFlowState=1,this.setIsDemoPlay(!0),this.initializeCoreGame(),this.demoPlayTimer=0,this.demoCurrentInput={right:!0},this.demoInputCooldown=I.DEMO_AI_INPUT_COOLDOWN_FRAMES;return}}else this.titleToDemoTimer=0;switch((this.titleAnimationPhase==="gridRevealing"||this.titleAnimationPhase==="fullyRevealed")&&this.enemyGlobalAnimTimer++,this.titleAnimationPhase==="gridRevealing"&&this.enemiesRevealedCount>0&&this.enemiesRevealedCount<=Le.length&&this.currentEnemySpawnProgressTimer<I.ENEMY_SPAWN_ANIM_DURATION_FRAMES&&this.currentEnemySpawnProgressTimer++,this.titleAnimationPhase){case"initial":this.titleAnimationTimer>I.INTRO_DELAY_FRAMES&&(this.titleAnimationPhase="textMoving",this.titleAnimationTimer=0);break;case"textMoving":const t=Math.min(1,this.titleAnimationTimer/I.TITLE_MOVE_DURATION_FRAMES);this.titleTextCurrentY=I.TITLE_TEXT_START_Y-(I.TITLE_TEXT_START_Y-I.TITLE_TEXT_TARGET_Y)*t,t>=1&&(this.titleAnimationPhase="gridRevealing",this.titleAnimationTimer=0,this.enemiesRevealedCount=0);break;case"gridRevealing":if(this.titleAnimationTimer<I.GRID_REVEAL_DELAY_FRAMES)break;const i=this.titleAnimationTimer-I.GRID_REVEAL_DELAY_FRAMES,l=Math.floor(i/I.ENEMY_REVEAL_INTERVAL_FRAMES)+1;if(this.enemiesRevealedCount<l&&this.enemiesRevealedCount<Le.length){const a=Math.min(l,Le.length)-this.enemiesRevealedCount;this.enemiesRevealedCount=Math.min(l,Le.length),a>0&&(this.currentEnemySpawnProgressTimer=0)}this.enemiesRevealedCount>=Le.length&&this.currentEnemySpawnProgressTimer>=I.ENEMY_SPAWN_ANIM_DURATION_FRAMES&&(this.titleAnimationPhase="fullyRevealed");break}}drawTitleScreen(){Xl(this,"BLASNAKE",Math.floor(b/2-8*4/2),Math.floor(this.titleTextCurrentY),"#",{color:"green"});const e=`${this.lastScore}`;this.drawText(e,1,0,{color:"white"});const t=`HI ${this.getHighScore()}`;if(this.drawText(t,b-t.length-1,0,{color:"yellow"}),this.titleAnimationPhase==="gridRevealing"||this.titleAnimationPhase==="fullyRevealed")for(let u=0;u<this.enemiesRevealedCount;u++){const m=Le[u],y=Math.floor(u/I.ENEMY_GRID_COLS),M=u%I.ENEMY_GRID_COLS===0?I.ENEMY_GRID_START_X_COL1:I.ENEMY_GRID_START_X_COL2,T=I.ENEMY_GRID_START_Y+y*I.ENEMY_GRID_CELL_HEIGHT;let O=m.activeChar,j=m.activeColor,J=m.activeColor;const Z="white";if(u===this.enemiesRevealedCount-1&&this.titleAnimationPhase==="gridRevealing"&&this.currentEnemySpawnProgressTimer<I.ENEMY_SPAWN_ANIM_DURATION_FRAMES)O=m.spawningChar,j=m.spawningColor;else{const Mt=I.ENEMY_CHAR_ANIM_HALF_CYCLE_FRAMES;Math.floor(this.enemyGlobalAnimTimer/Mt)%2===1?(O=m.spawningChar,j=m.spawningColor):(O=m.activeChar,j=m.activeColor)}J=m.activeColor,this.drawText(O,M,T,{color:j});const wt=` ${m.shortName}`;this.drawText(wt,M+1,T,{color:J});const xt=`${m.baseScore} pts`;this.drawText(xt,M+9,T,{color:Z})}const i=this.titleAnimationPhase==="initial"||this.titleAnimationPhase==="textMoving"?15:L-4,l="Z/X/Space Key to Start",a=Math.floor(b/2-l.length/2);this.drawText(l,a,i,{color:"yellow"})}updateDemoScreen(e){if(e.action1||e.action2){this.startGameFromTitleOrDemo();return}if(this.gameOptions.startInPlayingState){this.currentFlowState=2,this.setIsDemoPlay(!1),this.actualGame||this.initializeCoreGame();return}if(e.escape){this.currentFlowState=0,this.setIsDemoPlay(!1),this.resetTitleAnimationStates();return}if(this.actualGame||(this.initializeCoreGame(),this.demoCurrentInput={right:!0},this.demoInputCooldown=I.DEMO_AI_INPUT_COOLDOWN_FRAMES),this.demoPlayTimer++,this.demoInputCooldown--,this.demoInputCooldown<=0){this.demoInputCooldown=I.DEMO_AI_INPUT_COOLDOWN_FRAMES;const t=this.actualGame.getSnakeHeadPosition();let i="RIGHT";if(this.demoCurrentInput.up?i="UP":this.demoCurrentInput.down?i="DOWN":this.demoCurrentInput.left?i="LEFT":this.demoCurrentInput.right&&(i="RIGHT"),t){const l=[{direction:"UP",x:t.x,y:t.y-1,safe:!1},{direction:"DOWN",x:t.x,y:t.y+1,safe:!1},{direction:"LEFT",x:t.x-1,y:t.y,safe:!1},{direction:"RIGHT",x:t.x+1,y:t.y,safe:!1}];l.forEach(y=>{y.safe=this.actualGame.isCellSafeForMovement(y.x,y.y)});const a=l.filter(y=>y.safe);let u=null;a.length>0?a.find(C=>C.direction===i)&&Math.random()<.7?u=i:u=a[Math.floor(Math.random()*a.length)].direction:u=i;const m={};u==="UP"?m.up=!0:u==="DOWN"?m.down=!0:u==="LEFT"?m.left=!0:u==="RIGHT"&&(m.right=!0),this.demoCurrentInput=m}else{const l=["UP","DOWN","LEFT","RIGHT"],a=l[Math.floor(Math.random()*l.length)],u={};a==="UP"?u.up=!0:a==="DOWN"?u.down=!0:a==="LEFT"?u.left=!0:a==="RIGHT"&&(u.right=!0),this.demoCurrentInput=u}}this.actualGame.update(this.demoCurrentInput),(this.actualGame.isGameOver()||this.demoPlayTimer>I.DEMO_PLAY_DURATION_FRAMES)&&(this.currentFlowState=0,this.setIsDemoPlay(!1),this.resetTitleAnimationStates())}drawDemoScreen(){this.actualGame;const e=`${this.lastScore}`;this.drawText(e,1,0,{color:"white"});const t=`HI: ${this.getHighScore()}`;this.drawText(t,b-t.length-1,0,{color:"yellow"}),this.drawCenteredText("GAME OVER",Math.floor(L/2)-2,{color:"red"})}startGameFromTitleOrDemo(){this.setIsDemoPlay(!1);const e=["@synth@s1 v70 l32 o5 g16 e16 c16 e16 g8 >c8 <g16 e16 c16 e16 g8 >d8","@synth@s2 v50 l32 o4 e16 c16 <g16> c16 e8 g8 e16 c16 <g16> c16 e8 >f+8","@synth@s3 v60 l16 o3 c c g g c c >c <c"];this.playMml(e),this.resetGame(),this.initializeCoreGame(),this.currentFlowState=2,this.resetTitleAnimationStates()}updateGameOverScreen(e){if(e.action1||e.action2){this.startGameFromTitleOrDemo();return}this.gameOverTimer--,this.gameOverTimer<=0&&(this.gameOptions.startInPlayingState||(this.resetGame(),this.currentFlowState=0,this.setIsDemoPlay(!1),this.resetTitleAnimationStates()))}drawGameOverScreen(){this.drawCenteredText("GAME OVER",7,{color:"red"});const t=`Score: ${this.lastScore}`;this.drawCenteredText(t,10,{color:"white"});const i=`Hi-Score: ${this.getHighScore()}`;this.drawCenteredText(i,12,{color:"yellow"}),this.drawCenteredText("Z/X/Space Key to Restart",16,{color:"cyan"})}};I.INTRO_DELAY_FRAMES=120,I.TITLE_MOVE_DURATION_FRAMES=60,I.GRID_REVEAL_DELAY_FRAMES=30,I.ENEMY_REVEAL_INTERVAL_FRAMES=20,I.ENEMY_SPAWN_ANIM_DURATION_FRAMES=30,I.ENEMY_CHAR_ANIM_HALF_CYCLE_FRAMES=30,I.TITLE_TO_DEMO_DELAY_FRAMES=300,I.DEMO_PLAY_DURATION_FRAMES=900,I.DEMO_AI_INPUT_COOLDOWN_FRAMES=15,I.TITLE_TEXT_START_Y=5,I.TITLE_TEXT_TARGET_Y=2,I.ENEMY_GRID_COLS=2,I.ENEMY_GRID_ROWS=5,I.ENEMY_GRID_START_X_COL1=4,I.ENEMY_GRID_START_X_COL2=22,I.ENEMY_GRID_START_Y=9,I.ENEMY_GRID_CELL_HEIGHT=2;let fi=I;function ql(){const o=keyboard.code;return{up:o.ArrowUp.isPressed||o.KeyW.isPressed,down:o.ArrowDown.isPressed||o.KeyS.isPressed,left:o.ArrowLeft.isPressed||o.KeyA.isPressed,right:o.ArrowRight.isPressed||o.KeyD.isPressed,action1:o.KeyX.isPressed||o.Slash.isPressed||o.Space.isPressed,action2:o.KeyZ.isPressed||o.Period.isPressed||o.Enter.isPressed,enter:o.Enter.isPressed,space:o.Space.isPressed,escape:o.Escape.isPressed,r:o.KeyR.isPressed,period:o.Period.isPressed,slash:o.Slash.isPressed}}function Zl(o,e,t,i,l){for(let a=0;a<t;a++)for(let u=0;u<e;u++){const m=o[a][u],y=u*i+i/2,C=a*l+l/2;if(m.char!==" "){let M=m.attributes.color||"white";M==="black"?M="white":M==="white"&&(M="black"),text(m.char,y,C,{color:M,isSmallText:!0})}}}function Ql(o=b,e=L,t=4,i=6){return{viewSize:{x:o*t,y:e*i},isSoundEnabled:!1,isShowingScore:!1,theme:"dark"}}function er(o,e,t,i=b,l=L,a=4,u=6,m=!0){let y;function C(){y=o({isBrowserEnvironment:!0,gameName:e,enableHighScoreStorage:t===!0}),y.initializeGame()}function M(){y||C();const T=ql();if(m&&T.r&&keyboard.code.KeyR.isJustPressed)if(y instanceof An&&y.currentFlowState!==void 0){const j=y;j.currentFlowState!==3&&j.currentFlowState!==2&&(console.log("[browserHelper] Global R pressed, resetting game via resetGame()."),C())}else console.log("[browserHelper] Global R pressed (non-GameManager or unknown state), resetting game via resetGame()."),C();y.update(T);const O=y.getVirtualScreenData();Zl(O,i,l,a,u)}return{gameUpdate:M,resetGame:C}}function tr(o,e={},t,i){const a={...Ql(),...t},{gameUpdate:u}=er(o,e.gameName,e.enableHighScoreStorage===!0,b,L,4,6,e.enableGlobalReset!==!1);init({update:u,options:a,audioFiles:i})}function ir(o,e){play(o,{seed:e})}function bn(o){sss.playMml(o,{isLooping:!1})}function nr(){playBgm()}function sr(){stopBgm()}class lr{playSoundEffect(e,t){ir(e,t)}playMml(e){bn(typeof e=="string"?[e]:e)}startPlayingBgm(){nr()}stopPlayingBgm(){sr()}}tr(o=>new fi({audioService:new lr,...o}),{gameName:"blasnake",enableHighScoreStorage:!0,enableGlobalReset:!1},{isSoundEnabled:!0,audioSeed:1,audioTempo:156,bgmVolume:6},{bgm:"Pixelated_Rush.mp3"});
