import{S as X,i as Y,s as Z,k,l as y,m as $,h,b as E,g as C,t as b,d as H,f as g,B as ee,C as te,D as le,E as se,v as M,a as L,q as Q,w as N,c as q,r as R,n as w,F as v,x as U,H as oe,N as re,O as ne,y as B,e as W}from"./index-ef4f97a1.js";import{H as ie}from"./Heading-e303b286.js";import{I as ae}from"./Icon-35397eaa.js";import{A as ce}from"./AccessPanel-1c34b651.js";function j(f,s,t){const e=f.slice();return e[7]=s[t],e[9]=t,e}function ue(f){let s;const t=f[5].default,e=ee(t,f,f[4],null);return{c(){e&&e.c()},l(l){e&&e.l(l)},m(l,r){e&&e.m(l,r),s=!0},p(l,r){e&&e.p&&(!s||r&16)&&te(e,t,l,l[4],s?se(t,l[4],r,null):le(l[4]),null)},i(l){s||(g(e,l),s=!0)},o(l){b(e,l),s=!1},d(l){e&&e.d(l)}}}function fe(f){let s,t,e,l,r,c,m,n,o,u,_=[],O=new Map,D,x,A,S;l=new ae({props:{name:"lock",classNames:"w-12 h-12 p-2 bg-white rounded-full group-hover:shadow-xl",stroke:"#d20000",strokeWidth:"2"}});let d=f[2]&&G(),P=Array(f[1]);const T=i=>i[9];for(let i=0;i<P.length;i+=1){let a=j(f,P,i),p=T(a);O.set(p,_[i]=J(p))}return{c(){s=k("div"),t=k("div"),e=k("button"),M(l.$$.fragment),r=L(),c=k("p"),m=Q("Content beyond the Establishing Phase is currently locked."),n=L(),d&&d.c(),o=L(),u=k("div");for(let i=0;i<_.length;i+=1)_[i].c();this.h()},l(i){s=y(i,"DIV",{class:!0});var a=$(s);t=y(a,"DIV",{class:!0});var p=$(t);e=y(p,"BUTTON",{class:!0});var I=$(e);N(l.$$.fragment,I),r=q(I),c=y(I,"P",{class:!0});var z=$(c);m=R(z,"Content beyond the Establishing Phase is currently locked."),z.forEach(h),I.forEach(h),n=q(p),d&&d.l(p),p.forEach(h),o=q(a),u=y(a,"DIV",{class:!0});var F=$(u);for(let V=0;V<_.length;V+=1)_[V].l(F);F.forEach(h),a.forEach(h),this.h()},h(){w(c,"class","bg-white text-sm p-2 rounded-lg mt-2"),w(e,"class","flex flex-col items-center"),w(t,"class","absolute top-12 self-center items-center z-20 w-64 flex flex-col items-center"),w(u,"class",D=f[0]?"blur group-hover:bg-red50 group-hover:-ml-4 group-hover:pl-4":""),w(s,"class","relative flex flex-col group")},m(i,a){E(i,s,a),v(s,t),v(t,e),U(l,e,null),v(e,r),v(e,c),v(c,m),v(t,n),d&&d.m(t,null),v(s,o),v(s,u);for(let p=0;p<_.length;p+=1)_[p].m(u,null);x=!0,A||(S=oe(e,"click",f[3]),A=!0)},p(i,a){i[2]?d?a&4&&g(d,1):(d=G(),d.c(),g(d,1),d.m(t,null)):d&&(C(),b(d,1,1,()=>{d=null}),H()),a&2&&(P=Array(i[1]),C(),_=re(_,a,T,1,i,P,O,u,ne,J,null,j),H()),(!x||a&1&&D!==(D=i[0]?"blur group-hover:bg-red50 group-hover:-ml-4 group-hover:pl-4":""))&&w(u,"class",D)},i(i){if(!x){g(l.$$.fragment,i),g(d);for(let a=0;a<P.length;a+=1)g(_[a]);x=!0}},o(i){b(l.$$.fragment,i),b(d);for(let a=0;a<_.length;a+=1)b(_[a]);x=!1},d(i){i&&h(s),B(l),d&&d.d();for(let a=0;a<_.length;a+=1)_[a].d();A=!1,S()}}}function G(f){let s,t,e;return t=new ce({props:{title:"Unlock"}}),{c(){s=k("div"),M(t.$$.fragment),this.h()},l(l){s=y(l,"DIV",{class:!0});var r=$(s);N(t.$$.fragment,r),r.forEach(h),this.h()},h(){w(s,"class","mt-2")},m(l,r){E(l,s,r),U(t,s,null),e=!0},i(l){e||(g(t.$$.fragment,l),e=!0)},o(l){b(t.$$.fragment,l),e=!1},d(l){l&&h(s),B(t)}}}function J(f,s){let t,e,l,r,c=K.slice(0,Math.random()*300)+"",m,n;return e=new ie({props:{level:3,text:K.slice(0,Math.random()*50)}}),{key:f,first:null,c(){t=W(),M(e.$$.fragment),l=L(),r=k("p"),m=Q(c),this.h()},l(o){t=W(),N(e.$$.fragment,o),l=q(o),r=y(o,"P",{});var u=$(r);m=R(u,c),u.forEach(h),this.h()},h(){this.first=t},m(o,u){E(o,t,u),U(e,o,u),E(o,l,u),E(o,r,u),v(r,m),n=!0},p(o,u){},i(o){n||(g(e.$$.fragment,o),n=!0)},o(o){b(e.$$.fragment,o),n=!1},d(o){o&&h(t),B(e,o),o&&h(l),o&&h(r)}}}function de(f){let s,t,e,l;const r=[fe,ue],c=[];function m(n,o){return n[0]?0:1}return t=m(f),e=c[t]=r[t](f),{c(){s=k("div"),e.c()},l(n){s=y(n,"DIV",{});var o=$(s);e.l(o),o.forEach(h)},m(n,o){E(n,s,o),c[t].m(s,null),l=!0},p(n,[o]){let u=t;t=m(n),t===u?c[t].p(n,o):(C(),b(c[u],1,1,()=>{c[u]=null}),H(),e=c[t],e?e.p(n,o):(e=c[t]=r[t](n),e.c()),g(e,1),e.m(s,null))},i(n){l||(g(e),l=!0)},o(n){b(e),l=!1},d(n){n&&h(s),c[t].d()}}}let K="Please consider a license to unlock this content. Disabling the blur is not gonna cut it. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";function me(f,s,t){let{$$slots:e={},$$scope:l}=s,{locked:r=!0}=s,{fillerLevel:c=3}=s,m=!1;const n=()=>{t(2,m=!m)};return f.$$set=o=>{"locked"in o&&t(0,r=o.locked),"fillerLevel"in o&&t(1,c=o.fillerLevel),"$$scope"in o&&t(4,l=o.$$scope)},[r,c,m,n,l,e]}class ve extends X{constructor(s){super(),Y(this,s,me,de,Z,{locked:0,fillerLevel:1})}}export{ve as L};