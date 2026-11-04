// cn-scene.js: the CustomerNode 3D scene in "Building" on the homepage.
// Lazy-loaded by an inline loader when #cjs nears the viewport; 'three' resolves through the page's import map.
// Story on one 26.5 s clock: Create builds the six-stage journey ring and the selling team; Share adds sellers
// and the buying team; Navigate walks Discovery -> Success, showing each stage's owner and AI agent in the hub.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const box=document.getElementById('cjs'),row=document.getElementById('cjc');if(!box)throw 0;
const lis=[...row.querySelectorAll('.cjc-v')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const BG=0x07070A,ACC=new THREE.Color('#7F89FF'),TXT=new THREE.Color('#ECEAE5'),CYC=26.5;
const cl=t=>t<0?0:t>1?1:t,sg=(t,a,b)=>cl((t-a)/(b-a)),io=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,q5=t=>t<.5?16*t**5:1-Math.pow(-2*t+2,5)/2,lerp=(a,b,t)=>a+(b-a)*t;
function spring(t,w=10,z=.52){if(t<=0)return 0;const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+(z*w/wd)*Math.sin(wd*t));}
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
let DT=1/60;const SM={};
// frame-rate independent easing toward a target: every state change glides instead of snapping
function sm(k,t,rate){const v=SM[k]===undefined?t:SM[k],n=v+(t-v)*(1-Math.exp(-rate*DT));SM[k]=n;return n}
function smV(k,t,rate,snap){const v=SM[k];if(!v||snap){SM[k]=t.clone();return SM[k]}v.lerp(t,1-Math.exp(-rate*DT));return v}
await document.fonts.ready;
const MONO='"Geist Mono", ui-monospace, monospace',SANS='"Geist", system-ui, sans-serif';

const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.toneMapping=THREE.NoToneMapping;box.appendChild(R.domElement);
const S=new THREE.Scene();S.background=new THREE.Color(BG);S.fog=new THREE.Fog(BG,13,24);
function studio(){const e=new THREE.Scene();e.background=new THREE.Color(0);const p=(w,h,c,pos,rx,ry)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.copy(pos);m.rotation.set(rx||0,ry||0,0);e.add(m)};
  p(14,4,new THREE.Color(.34,.33,.32),V(0,3,-6));p(14,.1,new THREE.Color(2.6,2.55,2.45),V(0,.55,-6));p(.3,6,new THREE.Color(1.5,1.47,1.42),V(-6,1.4,0),0,Math.PI/2);p(.3,6,new THREE.Color(1.1,1.08,1.05),V(6,1.4,0),0,-Math.PI/2);p(14,.14,new THREE.Color(.8,.79,.77),V(0,1,7),0,Math.PI);return e}
S.environment=new THREE.PMREMGenerator(R).fromScene(studio(),0).texture;
S.add(new THREE.HemisphereLight(0xf2efe9,0x0b0b0e,.55));const key=new THREE.DirectionalLight(0xfffaf2,1.05);key.position.set(-3,6,4);S.add(key);
const cam=new THREE.PerspectiveCamera(22,2.5,.1,80);cam.layers.enable(1);
const glass=(c=0x2b2b2f)=>new THREE.MeshPhysicalMaterial({polygonOffset:true,polygonOffsetFactor:2,polygonOffsetUnits:8,color:c,metalness:.1,roughness:.46,clearcoat:.25,clearcoatRoughness:.45,envMapIntensity:1.7,specularIntensity:.3,transparent:true});
const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(127,137,255,1)');g.addColorStop(.3,'rgba(127,137,255,.32)');g.addColorStop(1,'rgba(127,137,255,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const add=(o,p=S)=>(p.add(o),o);
function canvasTex(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=R.capabilities.getMaxAnisotropy();return{c,x:c.getContext('2d'),t,key:''}}
function sprite(w,h,sx,parent){const T=canvasTex(w,h),sp=new THREE.Sprite(new THREE.SpriteMaterial({map:T.t,transparent:true,depthWrite:false,depthTest:false}));sp.scale.set(sx,sx*h/w,1);sp.renderOrder=10;sp.layers.set(1);add(sp,parent);
  return{sp,draw(key,fn){if(T.key===key)return;T.key=key;T.x.clearRect(0,0,w,h);fn(T.x,w,h);T.t.needsUpdate=true}}}
function Swap(w,h,sx,parent){const A=sprite(w,h,sx,parent),B=sprite(w,h,sx,parent);let cur=A,old=B,key=null,t=1,n=0;A.sp.material.opacity=B.sp.material.opacity=0;
  return{set(k,fn){if(k===key)return;key=k;const o=cur;cur=old;old=o;cur.draw(k+'#'+(n++),fn);t=0},update(op,pos,rise){t=Math.min(1,t+DT/.5);const e=io(t);cur.sp.material.opacity=op*e;old.sp.material.opacity=op*(1-e);cur.sp.position.copy(pos).add(V(0,0,(1-e)*rise));old.sp.position.copy(pos).add(V(0,0,-e*rise))}}}
function rr(x,X,Y,W,H,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+W,Y,X+W,Y+H,r);x.arcTo(X+W,Y+H,X,Y+H,r);x.arcTo(X,Y+H,X,Y,r);x.arcTo(X,Y,X+W,Y,r);x.closePath()}
function glowPlane(w,h,parent){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:glowTex,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));m.rotation.x=-Math.PI/2;return add(m,parent)}

// ---------- the surface picker: Create / Share / Navigate (+ Agent Mode), as on the product's home screen
const CNI={create:{vb:24,d:["M10.9 11.77C10.7943 11.7701 10.6898 11.7479 10.5933 11.7049C10.4968 11.6618 10.4105 11.5988 10.34 11.52C10.2704 11.4397 10.2185 11.3457 10.1875 11.2441C10.1564 11.1425 10.1471 11.0355 10.16 10.93C10.16 10.84 11.39 1.79001 19.38 1.79001C19.5625 1.79112 19.7384 1.85877 19.8746 1.98027C20.0109 2.10177 20.0981 2.26879 20.12 2.45001C20.3565 4.80481 19.6559 7.15798 18.17 9.00001C16.57 10.85 14.12 11.77 10.9 11.77Z", "M10.9 11.76H10.81C8.4 11.46 3.81 9.59001 3.81 4.70001C3.81082 4.51636 3.87812 4.33921 3.99945 4.20133C4.12078 4.06346 4.28793 3.97418 4.47 3.95002C6.29444 3.76532 8.11851 4.30392 9.55 5.45001C10.2852 6.16484 10.8543 7.03244 11.2172 7.99148C11.5801 8.95052 11.7278 9.97758 11.65 11C11.6501 11.1057 11.6279 11.2102 11.5849 11.3067C11.5418 11.4032 11.4788 11.4896 11.4 11.56C11.2624 11.6839 11.0851 11.7548 10.9 11.76Z", "M10.9 15.9C10.7011 15.9 10.5103 15.821 10.3697 15.6803C10.229 15.5397 10.15 15.3489 10.15 15.15V11C10.15 10.8011 10.229 10.6103 10.3697 10.4697C10.5103 10.329 10.7011 10.25 10.9 10.25C11.0989 10.25 11.2897 10.329 11.4303 10.4697C11.571 10.6103 11.65 10.8011 11.65 11V15.13C11.6541 15.2305 11.6376 15.3308 11.6016 15.4248C11.5657 15.5187 11.5109 15.6043 11.4407 15.6764C11.3705 15.7485 11.2864 15.8055 11.1934 15.8439C11.1004 15.8824 11.0006 15.9014 10.9 15.9Z", "M13.5 22.21H8.7C7.71495 22.1943 6.77542 21.7926 6.08348 21.0913C5.39155 20.39 5.00249 19.4452 5 18.46V15.15C5 14.9511 5.07902 14.7603 5.21967 14.6197C5.36032 14.479 5.55109 14.4 5.75 14.4H16.5C16.6989 14.4 16.8897 14.479 17.0303 14.6197C17.171 14.7603 17.25 14.9511 17.25 15.15V18.46C17.2474 19.4537 16.8514 20.406 16.1487 21.1087C15.446 21.8114 14.4938 22.2074 13.5 22.21Z"]},share:{vb:24,d:["M9 6C9 7.65685 10.3431 9 12 9C13.6569 9 15 7.65685 15 6C15 4.34315 13.6569 3 12 3C10.3431 3 9 4.34315 9 6Z", "M2.5 18C2.5 19.6569 3.84315 21 5.5 21C7.15685 21 8.5 19.6569 8.5 18C8.5 16.3431 7.15685 15 5.5 15C3.84315 15 2.5 16.3431 2.5 18Z", "M18.5 21C16.8431 21 15.5 19.6569 15.5 18C15.5 16.3431 16.8431 15 18.5 15C20.1569 15 21.5 16.3431 21.5 18C21.5 19.6569 20.1569 21 18.5 21Z", "M7.20468 7.56231C7.51523 7.28821 7.54478 6.81426 7.27069 6.5037C6.99659 6.19315 6.52264 6.1636 6.21208 6.43769C4.39676 8.03991 3.25 10.3865 3.25 13C3.25 13.4142 3.58579 13.75 4 13.75C4.41421 13.75 4.75 13.4142 4.75 13C4.75 10.8347 5.69828 8.89187 7.20468 7.56231Z", "M17.7879 6.43769C17.4774 6.1636 17.0034 6.19315 16.7293 6.5037C16.4552 6.81426 16.4848 7.28821 16.7953 7.56231C18.3017 8.89187 19.25 10.8347 19.25 13C19.25 13.4142 19.5858 13.75 20 13.75C20.4142 13.75 20.75 13.4142 20.75 13C20.75 10.3865 19.6032 8.03991 17.7879 6.43769Z", "M10.1869 20.0217C9.7858 19.9184 9.37692 20.1599 9.27367 20.561C9.17043 20.9622 9.41192 21.3711 9.81306 21.4743C10.5129 21.6544 11.2458 21.75 12 21.75C12.7542 21.75 13.4871 21.6544 14.1869 21.4743C14.5881 21.3711 14.8296 20.9622 14.7263 20.561C14.6231 20.1599 14.2142 19.9184 13.8131 20.0217C13.2344 20.1706 12.627 20.25 12 20.25C11.373 20.25 10.7656 20.1706 10.1869 20.0217Z"]},navigate:{vb:16,d:["M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0", "m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z"]}};
const CNA=[["M567.47 303.058c-10.01-.47-20.2.054-30.48 1.658l-163.57 25.527c-82.23 12.833-138.48 89.891-125.65 172.115l6.94 44.477c12.84 82.224 89.89 138.478 172.12 125.646l163.57-25.528c82.22-12.832 138.48-89.89 125.64-172.114l-6.94-44.477c-11.22-71.946-71.63-124.008-141.63-127.304Zm-29.46-126.63c175.52-5.988 327.51 108.714 347.66 268.88C907.16 616.152 770.51 774.03 580.45 797.94c-190.07 23.91-361.56-95.21-383.05-266.051-21.49-170.844 115.16-328.723 305.22-352.631a389.956 389.956 0 0 1 35.39-2.83Z", "fill", "0"], ["M341 461c0-25.957 17.24-47 38.5-47s38.5 21.043 38.5 47-17.24 47-38.5 47-38.5-21.043-38.5-47ZM519 445c0-25.957 17.01-47 38-47s38 21.043 38 47-17.01 47-38 47-38-21.043-38-47ZM536.64 541.613l.7 1.629c3.53 24.703-20.64 48.583-53.98 53.339-33.33 4.755-63.21-11.415-66.74-36.118l.87-6.929Z", "fill", "0"], ["M314.73 879.87c-4.28-77.59 55.15-143.96 132.75-148.24l183.05-10.1c77.59-4.28 143.97 55.15 148.25 132.74l12.13 219.9c4.28 77.59-55.15 143.96-132.74 148.24l-183.06 10.1c-77.59 4.28-143.96-55.15-148.25-132.74Z", "fill", "0"], ["M552.38 180c-12.6-38.231 24.09-89.048 94.69-131.145", "stroke", "18.333"], ["M633 38c0-20.987 16.12-38 36-38s36 17.013 36 38-16.12 38-36 38-36-17.013-36-38Z", "fill", "0"], ["M474.574 185.336c1.963-40.531-48.88-80.05-130.915-101.756", "stroke", "18.333"], ["M291 76c0-20.987 16.34-38 36.5-38S364 55.013 364 76s-16.34 38-36.5 38S291 96.987 291 76Z", "fill", "0"], ["M353.24 904.05C232.65 932.48 110.79 859.12 76.8 737.64", "stroke", "34.375"], ["M8.79 700.54C-7.73 648.753.12 600 26.31 591.645c26.19-8.355 60.82 26.85 77.34 78.634 16.51 51.781 8.67 100.531-17.52 108.891-26.19 8.36-60.82-26.85-77.34-78.63Z", "fill", "0"], ["M95.09 695.65c9.55-25.308 24.68-43.035 33.8-39.595 9.11 3.44 8.75 26.745-.8 52.055s-24.69 43.03-33.8 39.59c-9.11-3.44-8.76-26.74.8-52.05ZM970.32 1118.5c-21.45 49.94-59.31 81.63-84.58 70.79-25.26-10.85-28.35-60.14-6.9-110.08 21.45-49.94 59.32-81.63 84.58-70.78 25.26 10.84 28.35 60.13 6.9 110.07Z", "fill", "0"], ["M901.93 1065.65c-23.8 12.86-46.85 16.34-51.48 7.77-4.63-8.57 10.91-25.94 34.71-38.8 23.8-12.86 46.84-16.34 51.48-7.77 4.63 8.57-10.91 25.94-34.71 38.8Z", "fill", "0"], ["M750.94 862.56c108.63 7.32 197.27 90.74 212.9 200.37", "stroke", "34.375"]];
function cnIcon(x,name,s,col){const I=CNI[name];x.save();x.scale(s/I.vb,s/I.vb);x.fillStyle=col;I.d.forEach(d=>x.fill(new Path2D(d)));x.restore()}
function cnAgent(x,s){x.save();x.scale(s/1233,s/1233);const g=x.createLinearGradient(0,0,985,1233);g.addColorStop(0,'#4EACF1');g.addColorStop(.5,'#5699F1');g.addColorStop(1,'#7873F5');x.fillStyle=g;x.strokeStyle=g;CNA.forEach(([d,m,w])=>{const p=new Path2D(d);if(m=='stroke'){x.lineWidth=+w;x.stroke(p)}else x.fill(p,'evenodd')});x.restore()}
const TB=new RoundedBoxGeometry(1.7,.14,1.05,6,.06),TE=new THREE.EdgesGeometry(TB,25);
function Surface(name){const g=add(new THREE.Group()),m=add(new THREE.Mesh(TB,glass()),g),em=new THREE.LineBasicMaterial({color:TXT.clone(),transparent:true});add(new THREE.LineSegments(TE,em),g);
  const T=canvasTex(512,316),lm=new THREE.MeshBasicMaterial({map:T.t,transparent:true,depthWrite:false}),l=add(new THREE.Mesh(new THREE.PlaneGeometry(1.56,.96),lm),g);l.rotation.x=-Math.PI/2;l.position.y=.072;
  const T2=canvasTex(512,316),lm2=new THREE.MeshBasicMaterial({map:T2.t,transparent:true,depthWrite:false,opacity:0}),l2=add(new THREE.Mesh(new THREE.PlaneGeometry(1.56,.96),lm2),g);l2.rotation.x=-Math.PI/2;l2.position.y=.073;
  const draw=(on,T)=>{const x=T.x;x.clearRect(0,0,512,316);x.save();x.translate(48,40);cnIcon(x,name.toLowerCase(),104,on?'#ECEAE5':'rgba(236,234,229,.5)');x.restore();
    x.fillStyle=on?'rgba(236,234,229,.98)':'rgba(236,234,229,.62)';x.font='500 64px '+SANS;x.fillText(name,48,250);T.t.needsUpdate=true};draw(false,T);draw(true,T2);
  const gl=glowPlane(3,2.2,g);gl.position.y=-.1;let lastOn=null;
  return{g,set(on,press,op=1){m.material.opacity=op;lm.opacity=(1-on)*op;lm2.opacity=on*op;em.opacity=(.16+.34*on)*op;gl.material.opacity=on*.22*op;g.children[0].position.y=-.03*press}}}
const surf=['Create','Share','Navigate'].map(Surface);

// ---------- the six-stage navigator ring, with the hub readout and the Seller / Customer switch
const STAGES=['Discovery','Experience','Scope','Commit','Deploy','Success'];
const HOST=['Think & Sync','Tailored Script','SOW Generator','Execution Readiness','Assign Owners','Cheat Sheet'];
const GUEST=['Smart Conversation','Cheat Sheet','Solution-Needs Fit','Why Commit?','AI Navigator','Auto Solve'];
const ringG=add(new THREE.Group()),flipG=add(new THREE.Group(),ringG);const RI=1.5,RO=2.12,GAP=.045;
const segs=STAGES.map((n,i)=>{const a0=Math.PI/2-i*Math.PI/3-GAP,a1=Math.PI/2-(i+1)*Math.PI/3+GAP,sh=new THREE.Shape();sh.absarc(0,0,RO,a0,a1,true);sh.absarc(0,0,RI,a1,a0,false);sh.closePath();
  const geo=new THREE.ExtrudeGeometry(sh,{depth:.14,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:3,curveSegments:28});geo.rotateX(-Math.PI/2);geo.translate(0,-.07,0);
  const g=add(new THREE.Group(),flipG),m=add(new THREE.Mesh(geo,glass()),g),em=new THREE.LineBasicMaterial({color:TXT.clone(),transparent:true});
  // a single clean hairline traced around the top face (outer arc, end, inner arc, end), floating just above it, so it never breaks into dashes
  {const P=[],N=48,y=.099;for(let k=0;k<=N;k++){const a=a0+(a1-a0)*k/N;P.push(new THREE.Vector3(Math.cos(a)*(RO-.004),y,-Math.sin(a)*(RO-.004)))}for(let k=N;k>=0;k--){const a=a0+(a1-a0)*k/N;P.push(new THREE.Vector3(Math.cos(a)*(RI+.004),y,-Math.sin(a)*(RI+.004)))}P.push(P[0].clone());add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(P),em),g)}
  const mid=(a0+a1)/2,cx=Math.cos(mid)*(RI+RO)/2,cz=-Math.sin(mid)*(RI+RO)/2,gl=glowPlane(2.4,2.4,g);gl.position.set(cx,-.12,cz);
  const fill=add(new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:ACC,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})),g);fill.scale.setScalar(1);
  const LF=(lit)=>(x,w,h)=>{x.fillStyle=lit?'rgba(236,234,229,.75)':'rgba(236,234,229,.4)';x.font='500 30px '+MONO;if('letterSpacing' in x)x.letterSpacing='4px';x.fillText('0'+(i+1),20,48);if('letterSpacing' in x)x.letterSpacing='0px';x.fillStyle=lit?'rgba(236,234,229,1)':'rgba(236,234,229,.7)';x.font='500 54px '+SANS;x.fillText(n,20,118)};const lab=sprite(400,150,1.25,ringG),lab2=sprite(400,150,1.25,ringG);const lr=RO+.62;lab.sp.position.set(Math.cos(mid)*lr,.12,-Math.sin(mid)*lr);lab2.sp.position.copy(lab.sp.position);lab.draw('d',LF(false));lab2.draw('l',LF(true));
  return{g,m,em,gl,fill,lab,mid,c:V(cx,0,cz),set(op,lit,glow,now=0){m.material.opacity=op;em.opacity=op*(.16+.3*lit+.4*now);em.color.copy(TXT).lerp(ACC,now);gl.material.opacity=0;fill.material.opacity=0;g.visible=op>.001;
    lab.sp.material.opacity=op*(1-lit);lab2.sp.material.opacity=op*lit}}});
const hubGeo=new THREE.CylinderGeometry(1.2,1.2,.1,72),hub=add(new THREE.Mesh(hubGeo,glass(0x101119)),flipG);hub.position.y=-.03;const hubE=add(new THREE.LineSegments(new THREE.EdgesGeometry(hubGeo,30),new THREE.LineBasicMaterial({color:TXT,transparent:true,opacity:.25})),flipG);hubE.position.y=-.03;
const hubTxt=(()=>{const mk=()=>{const T=canvasTex(1024,1024),m=new THREE.Mesh(new THREE.CircleGeometry(1.16,96),new THREE.MeshBasicMaterial({map:T.t,transparent:true,depthWrite:false,opacity:0}));m.rotation.x=-Math.PI/2;m.position.y=.026;m.renderOrder=6;ringG.add(m);return{T,m}};
  const A=mk(),B=mk();let cur=A,old=B,key=null,t=1;
  return{set(k,fn){if(k===key)return;key=k;const o=cur;cur=old;old=o;const x=cur.T.x;x.clearRect(0,0,1024,1024);fn(x,1024,1024);cur.T.t.needsUpdate=true;t=0},
    update(op){t=Math.min(1,t+DT/.55);const e=io(t);cur.m.material.opacity=op*e;old.m.material.opacity=op*(1-e)}}})();
// teams beside the ring: the seller team forms on Create; on Share more sellers and the customer's buying team join
const PEOPLE=[['SK','Sarah K.',0],['DR','Dev R.',0],['LM','Lena M.',0],['JB','Jay B.',1],['PS','Priya S.',1],['TW','Tom W.',1]];
const AVG=new THREE.CylinderGeometry(.27,.27,.09,48),AVE=new THREE.EdgesGeometry(AVG,30);
const teamG=add(new THREE.Group(),ringG);
const people=PEOPLE.map(([ini,name,side],i)=>{const g=add(new THREE.Group(),teamG),m=add(new THREE.Mesh(AVG,glass()),g),em=new THREE.LineBasicMaterial({color:TXT.clone(),transparent:true});add(new THREE.LineSegments(AVE,em),g);
  const T=canvasTex(256,256);const x=T.x;x.textAlign='center';x.fillStyle='rgba(236,234,229,.9)';x.font='500 88px '+SANS;x.fillText(ini,128,160);T.t.needsUpdate=true;
  const l=add(new THREE.Mesh(new THREE.CircleGeometry(.24,48),new THREE.MeshBasicMaterial({map:T.t,transparent:true,depthWrite:false})),g);l.rotation.x=-Math.PI/2;l.position.y=.047;
  const gl=glowPlane(1.3,1.3,g);gl.position.y=-.06;const nm=sprite(300,90,.72,teamG);
  nm.draw(name,(c,w,h)=>{c.textAlign='center';c.fillStyle='rgba(236,234,229,.85)';c.font='500 40px '+SANS;c.fillText(name,w/2,58)});
  return{g,m,em,gl,nm,side,col:i%3,set(op,hot){g.visible=op>.01;m.material.opacity=op;em.opacity=op*(.2+.5*hot);em.color.copy(TXT).lerp(ACC,hot);gl.material.opacity=op*hot*.3;nm.sp.material.opacity=op*(.5+.5*hot);g.scale.setScalar(.6+.4*op+.06*hot);}}});
const heads=[0,1].map(sd=>{const h=sprite(420,80,1.6,teamG);h.draw(sd,(c,w,hh)=>{c.fillStyle='rgba(143,140,134,1)';c.font='500 28px '+MONO;if('letterSpacing' in c)c.letterSpacing='5px';c.fillText(sd?'BUYING TEAM':'SELLING TEAM',8,52)});return h});
function teamLayout(wide){people.forEach(p=>{const x=wide?3.4+p.col*.72:-2.2+p.col*.74+(p.side?2.4:0),z=wide?(p.side?.95:-.75):3.45;p.g.position.set(x,0,z);p.nm.sp.position.set(x,.05,z+.5)});
  heads.forEach((h,sd)=>h.sp.position.set(wide?3.95:(sd?1.25:-1.05),.1,wide?(sd?.3:-1.4):2.95))}

function drawHub(st,pct,sub,tag,agent){hubTxt.set([st,Math.round(pct*100),sub,tag,agent].join('|'),(x,w,h)=>{const ls=v=>{if('letterSpacing' in x)x.letterSpacing=v};x.textAlign='center';x.textBaseline='alphabetic';const c=w/2;
  const L=agent?[[ 'm',st<0?'JOURNEY':('STAGE '+(st+1)+' OF 6'),300],['h',st<0?tag:STAGES[st],432],['s',sub,512],['r','',568],['m','AI AGENT',640],['a',agent,724]]
              :[[ 'm',st<0?'JOURNEY':('STAGE '+(st+1)+' OF 6'),392],['h',st<0?tag:STAGES[st],528],['s',sub,610]];
  for(const [k,txt,y] of L){if(k=='m'){x.fillStyle='rgba(143,140,134,1)';x.font='500 38px '+MONO;ls('9px');x.fillText(txt,c+4,y);ls('0px')}
    else if(k=='h'){x.fillStyle='rgba(236,234,229,.97)';x.font='500 124px '+SANS;ls('-3px');x.fillText(txt,c,y);ls('0px')}
    else if(k=='s'){x.fillStyle='rgba(236,234,229,.58)';x.font='400 46px '+SANS;x.fillText(txt,c,y)}
    else if(k=='r'){x.fillStyle='rgba(236,234,229,.16)';x.fillRect(c-130,y,260,2)}
    else if(k=='a'){x.fillStyle='rgba(236,234,229,.92)';x.font='500 60px '+SANS;x.fillText(txt,c,y)}}
  if(pct>=0){const y=agent?792:676;x.fillStyle='rgba(255,255,255,.1)';x.fillRect(c-150,y,300,3);x.fillStyle='rgba(236,234,229,.8)';x.fillRect(c-150,y,300*pct,3)}})}

// the light
const orb=(()=>{const g=add(new THREE.Group());add(new THREE.Mesh(new THREE.SphereGeometry(.06,24,16),new THREE.MeshBasicMaterial({color:0xffffff})),g);
  const h=add(new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false})),g);h.scale.set(1.6,1.6,1);const h2=add(new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,depthTest:false})),g);h2.scale.set(.45,.45,1);
  const L=add(new THREE.PointLight(0x8f98ff,0,5.5,1.5),g);return{g,set(p,a,k=1){g.position.copy(p);g.visible=a>.01;h.material.opacity=a*.85*k;h2.material.opacity=a;h.scale.setScalar(1.6*k);L.intensity=a*5*k}}})();
// floor dots
// ground: no pattern and no mirror, just a soft, barely-there pool of light under the scene, plus the moving light's pool
const groundTex=(()=>{const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');const g=x.createRadialGradient(256,256,0,256,256,256);[[0,.085],[.2,.07],[.4,.04],[.6,.014],[.75,.004],[.86,0],[1,0]].forEach(([o,a])=>g.addColorStop(o,'rgba(236,234,229,'+a+')'));x.fillStyle=g;x.fillRect(0,0,512,512);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t})();
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial({map:groundTex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false}));ground.rotation.x=-Math.PI/2;ground.position.y=-.5;S.add(ground);
const pool=glowPlane(3.4,3.4);pool.position.y=-.49;
const dots=(l,F,cx,cz)=>{ground.scale.set(L.wide?12.5:9,L.wide?7:10,1);ground.position.x=cx;ground.position.z=cz-(L.wide?.5:.2);ground.material.opacity=F;if(l){pool.position.x=l.x;pool.position.z=l.z;pool.material.opacity=.2*l.a*F}else pool.material.opacity=0};

// layout: desktop = picker left, ring right; narrow = picker row in front, ring behind
let L={};function layout(asp){const wide=asp>1.6;
  if(wide){surf.forEach((s,i)=>s.g.position.set(-5.0,0,-1.35+i*1.3));ringG.position.set(.2,0,.1);teamLayout(true);L={wide:true,cx:-.35,cz:.15,d:Math.max(12.4,(13.4*box.clientWidth/Math.min(1200,box.clientWidth))/(2*Math.tan(THREE.MathUtils.degToRad(11))*asp)),el:.66}}
  else{surf.forEach((s,i)=>s.g.position.set(-1.85+i*1.85,0,3.55));ringG.position.set(0,0,-1.3);teamLayout(false);L={wide:false,cx:0,cz:.6,d:7.6/(2*Math.tan(THREE.MathUtils.degToRad(11))*asp),el:.82}}}
const rp=i=>{const a=segs[i].mid;return V(Math.cos(a)*(RI+RO)/2,.42,-Math.sin(a)*(RI+RO)/2).add(ringG.position)};
const sp=i=>surf[i].g.position.clone().add(V(.45,.5,-.1));
function arc(a,b,t,h=.9){const p=a.clone().lerp(b,t);p.y+=Math.sin(t*Math.PI)*h;return p}
const WIN=[[.8,5.6],[5.6,10],[10,24.6]];const TS=10.9,STP=2.15;
function frame(g,tt,mx,my){const F=sg(g,0,.7)*(1-sg(g,25.4,26.3));let lp=null,la=0,lk=1;
  // CREATE: light lands on Create, then the six stages assemble into the ring
  const actv=[g>=1&&g<5.6,g>=5.6&&g<10,g>=10&&g<19.6];
  surf.forEach((s,i)=>{const t0=[1.2,5.9,10.15][i],press=Math.sin(sg(g,t0,t0+.5)*Math.PI),rv=io(sg(g,.1+i*.16,.95+i*.16));s.g.position.y=-.4*(1-rv);s.g.rotation.x=.14*(1-rv);s.set(sm('sf'+i,actv[i]?1:0,4),press,rv)});
  if(g>=.9&&g<1.9){lp=arc(sp(0).add(V(-1.2,.6,0)),sp(0),io(sg(g,.9,1.4)),.3);la=sg(g,.9,1.2)}
  if(g>=1.9&&g<3.0){lp=arc(sp(0),ringG.position.clone().add(V(0,.6,0)),io(sg(g,1.9,2.8)),1.1);la=1}
  if(g>=3.0&&g<5.0){lp=ringG.position.clone().add(V(0,.6+.05*Math.sin(tt*3),0));la=1-sg(g,4.4,5.0)*.6;lk=1+.5*Math.sin(sg(g,2.7,3.6)*Math.PI)}
  segs.forEach((s,i)=>{const t0=2.75+i*.16,p=spring(g-t0,8,.5),q=cl(p);const a=s.mid,out=lerp(1.8,0,p);s.g.position.set(Math.cos(a)*out,lerp(-1.2,0,p),-Math.sin(a)*out);s.g.rotation.y=(1-p)*.5;
    s.op=cl((g-t0)*3);});
  const hubOp=sg(g,3.2,3.9);hub.material.opacity=hubOp;hubE.material.opacity=.25*hubOp;hubTxt.update(hubOp*F);
  // SHARE: light hits Share, the switch slides to Customer and the whole journey turns over to the customer's side, then back
  if(g>=5.0&&g<6.0){lp=arc(ringG.position.clone().add(V(0,.6,0)),sp(1),io(sg(g,5.0,5.9)),1);la=lerp(.4,1,sg(g,5,5.4))}
  const tp=i=>people[i].g.position.clone().add(ringG.position).add(V(0,.42,0));
  if(g>=6.0&&g<6.8){lp=arc(sp(1),tp(1),io(sg(g,6.0,6.8)),1.1);la=1}
  if(g>=6.8&&g<9.8){const seq=[[6.8,1],[7.2,2],[7.7,3],[8.1,4],[8.5,5]];let p=tp(1);for(let k=1;k<seq.length;k++){if(g>=seq[k][0]-.4)p=tp(seq[k-1][1]).lerp(tp(seq[k][1]),io(sg(g,seq[k][0]-.4,seq[k][0])))}lp=p;la=1-sg(g,9.2,9.8)*.4}
  // NAVIGATE: light hits Navigate, enters the ring at Discovery and runs the journey stage by stage; each stage's AI agent surfaces
  if(g>=9.8&&g<10.7){lp=arc(tp(5),sp(2),io(sg(g,9.8,10.6)),1);la=lerp(.5,1,sg(g,9.8,10.1))}
  if(g>=10.7&&g<TS){lp=arc(sp(2),rp(0),io(sg(g,10.7,TS)),1.1);la=1}
  let cur=-1,mv=false;if(g>=TS){for(let i=0;i<6;i++){const t0=TS+i*STP;if(g<t0)break;if(i==0){cur=0;lp=rp(0);continue}const f=io(sg(g,t0,t0+.9));const a0=segs[i-1].mid,a1=segs[i].mid,a=lerp(a0,a1,f),r=(RI+RO)/2;lp=V(Math.cos(a)*r,.42+Math.sin(f*Math.PI)*.22,-Math.sin(a)*r).add(ringG.position);if(f<1)mv=true;else cur=i;if(f<1&&cur<i-1)cur=i-1}
    if(!mv&&cur>=0)lp=rp(cur).add(V(0,.04*Math.sin(tt*3),0));la=1-sg(g,24.6,25.6)*.5;lk=mv?1:.9}
  const done=g>=TS+5*STP+.9;
  segs.forEach((s,i)=>{const lit=cur>=i||done?1:0,now=i==cur&&!done,arrT=TS+i*STP+(i?.9:0),pulse=now?Math.sin(sg(g,arrT-.25,arrT+.75)*Math.PI)*.9:0;
    const pr=lp&&g>=10.7?Math.max(0,1-Math.hypot(lp.x-rp(i).x,lp.z-rp(i).z)/1.15)**2:0;
    const nw=sm('sw'+i,now?1:0,3);s.set(s.op,sm('sl'+i,lit,4),sm('sg'+i,(lit?.08:0)+pr*.8+pulse*.3,3.5)+nw*.05*Math.sin(tt*2.4),nw)});
  const JOIN=[3.7,6.8,7.2,7.7,8.1,8.5],OWN=[0,3,1,4,5,2];
  people.forEach((p,i)=>{const op=spring(g-JOIN[i],9,.5),own=cur>=0&&!done&&OWN[cur]==i?1:0,join=Math.max(0,1-sg(g,JOIN[i],JOIN[i]+.8));p.set(cl(op)*(g<JOIN[i]?0:1),Math.max(sm('po'+i,own,4)*(.85+.15*Math.sin(tt*3.2)),join))});
  heads[0].sp.material.opacity=sg(g,3.6,4.1)*F;heads[1].sp.material.opacity=sg(g,7.5,8.0)*F;
  // hub readout + agent chip
  const NM2=['Sarah K.','Jay B.','Dev R.','Priya S.','Tom W.','Lena M.'];if(g<3.2)drawHub(-1,-1,'','');else if(g<5.6)drawHub(-1,-1,'Created by Sarah K. · Selling team','6 stages');else if(g<TS)drawHub(-1,-1,g<7.6?'Shared with your team':'Shared with Acme · both teams','Acme × CN');else drawHub(cur,done?1:(cur+1)/6*.94,done?'Both teams · on track':'Owner · '+NM2[cur],'',done?'':HOST[cur]);
  // light
  const lA=sm('la',lp?la:0,7),lK=sm('lk',lk,6);const lP=lp?smV('lp',lp,14,(SM.la||0)<.02):(SM.lp||V(0,0,0));orb.set(lP,lA*F,lK);
  // camera
  const yaw=Math.sin(tt*.12)*.045+(mx||0)*.14,el=L.el+Math.sin(tt*.1)*.02-(my||0)*.07,d=L.d*(1-.025*Math.sin(tt*.2)),cx=L.cx+(mx||0)*.6;
  cam.position.set(cx+Math.sin(yaw)*d*Math.cos(el),Math.sin(el)*d,L.cz+Math.cos(yaw)*d*Math.cos(el));cam.lookAt(cx,-.1,L.cz);
  dots(lp?{x:lp.x,z:lp.z,a:la}:null,F,L.cx,L.cz);R.domElement.style.opacity=F.toFixed(3);
  WIN.forEach((w,i)=>{const on=g>=w[0]&&g<w[1];lis[i].classList.toggle('on',on||reduce);lis[i].style.setProperty('--p',sg(g,w[0],w[1]));lis[i].style.setProperty('--po',sm('col'+i,on?1:0,3).toFixed(3))});
  R.render(S,cam)}
function fogFit(){S.fog.near=L.d-1;S.fog.far=L.d+11}
function size(){const w=box.clientWidth,h=box.clientHeight;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();layout(cam.aspect);fogFit()}size();if(window.ResizeObserver)new ResizeObserver(size).observe(box);
let mx=0,my=0,tx=0,ty=0;box.addEventListener('pointermove',e=>{const b=box.getBoundingClientRect();tx=(e.clientX-b.left)/b.width-.5;ty=(e.clientY-b.top)/b.height-.5});box.addEventListener('pointerleave',()=>{tx=0;ty=0});
let clock=0,last=0,vis=false,run=false;
function loop(now){if(!vis){run=false;last=0;return}const dt=last?Math.min((now-last)/1000,.05):0;last=now;clock+=dt;DT=dt||1/60;mx+=(tx-mx)*.04;my+=(ty-my)*.04;
  const g=reduce?24:clock%CYC;frame(g,now/1000,mx,my);if(!reduce)requestAnimationFrame(loop);else run=false}

new IntersectionObserver(e=>{vis=e[0].isIntersecting;if(vis&&!run){run=true;requestAnimationFrame(loop)}},{threshold:.1}).observe(box);
