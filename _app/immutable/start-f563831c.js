import{S as We,i as He,s as Me,a as Xe,e as D,c as Ye,b as B,g as Z,t as N,d as x,f as V,h as q,j as Qe,o as ve,k as Ze,l as xe,m as et,n as we,p as W,q as tt,r as nt,u as rt,v as J,w as ae,x as z,y as K,z as Ne}from"./chunks/index-6ebe39d3.js";import{g as Ve,f as Ce,s as Q,a as ke,b as at,i as ot}from"./chunks/singletons-9cbc1a63.js";const st=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),it=function(r,e){return new URL(r,e).href},qe={},C=function(e,t,s){return!t||t.length===0?e():Promise.all(t.map(a=>{if(a=it(a,s),a in qe)return;qe[a]=!0;const u=a.endsWith(".css"),n=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${n}`))return;const i=document.createElement("link");if(i.rel=u?"stylesheet":st,u||(i.as="script",i.crossOrigin=""),i.href=a,document.head.appendChild(i),u)return new Promise((d,h)=>{i.addEventListener("load",d),i.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>e())};class ye{constructor(e,t){this.status=e,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}}class Be{constructor(e,t){this.status=e,this.location=t}}function lt(r,e){return r==="/"||e==="ignore"?r:e==="never"?r.endsWith("/")?r.slice(0,-1):r:e==="always"&&!r.endsWith("/")?r+"/":r}function ct(r){for(const e in r)r[e]=r[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return r}const ft=["href","pathname","search","searchParams","toString","toJSON"];function ut(r,e){const t=new URL(r);for(const s of ft){let a=t[s];Object.defineProperty(t,s,{get(){return e(),a},enumerable:!0,configurable:!0})}return t[Symbol.for("nodejs.util.inspect.custom")]=(s,a,u)=>u(r,a),dt(t),t}function dt(r){Object.defineProperty(r,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}function pt(r){let e=5381,t=r.length;if(typeof r=="string")for(;t;)e=e*33^r.charCodeAt(--t);else for(;t;)e=e*33^r[--t];return(e>>>0).toString(36)}const Re=window.fetch;window.fetch=(r,e)=>{if((r instanceof Request?r.method:(e==null?void 0:e.method)||"GET")!=="GET"){const s=new URL(r instanceof Request?r.url:r.toString(),document.baseURI).href;ce.delete(s)}return Re(r,e)};const ce=new Map;function ht(r,e,t){let a=`script[data-sveltekit-fetched][data-url=${JSON.stringify(typeof r=="string"?r:r.url)}]`;t&&typeof t.body=="string"&&(a+=`[data-hash="${pt(t.body)}"]`);const u=document.querySelector(a);if(u!=null&&u.textContent){const{body:n,...i}=JSON.parse(u.textContent),d=u.getAttribute("data-ttl");return d&&ce.set(e,{body:n,init:i,ttl:1e3*Number(d)}),Promise.resolve(new Response(n,i))}return Re(r,t)}function mt(r,e){const t=ce.get(r);if(t){if(performance.now()<t.ttl)return new Response(t.body,t.init);ce.delete(r)}return Re(r,e)}const _t=/^(\.\.\.)?(\w+)(?:=(\w+))?$/;function gt(r){const e=[],t=[];let s=!0;return{pattern:r===""?/^\/$/:new RegExp(`^${r.split(/(?:\/|$)/).filter(wt).map((u,n,i)=>{const d=decodeURIComponent(u),h=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(d);if(h)return e.push(h[1]),t.push(h[2]),"(?:/(.*))?";const y=n===i.length-1;return d&&"/"+d.split(/\[(.+?)\]/).map((L,T)=>{if(T%2){const $=_t.exec(L);if(!$)throw new Error(`Invalid param: ${L}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,I,F,H]=$;return e.push(F),t.push(H),I?"(.*?)":"([^/]+?)"}return y&&L.includes(".")&&(s=!1),L.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("")}).join("")}${s?"/?":""}$`),names:e,types:t}}function wt(r){return!/^\([^)]+\)$/.test(r)}function yt(r,e,t,s){const a={};for(let u=0;u<e.length;u+=1){const n=e[u],i=t[u],d=r[u+1]||"";if(i){const h=s[i];if(!h)throw new Error(`Missing "${i}" param matcher`);if(!h(d))return}a[n]=d}return a}function bt(r,e,t,s){const a=new Set(e);return Object.entries(t).map(([i,[d,h,y]])=>{const{pattern:L,names:T,types:$}=gt(i),I={id:i,exec:F=>{const H=L.exec(F);if(H)return yt(H,T,$,s)},errors:[1,...y||[]].map(F=>r[F]),layouts:[0,...h||[]].map(n),leaf:u(d)};return I.errors.length=I.layouts.length=Math.max(I.errors.length,I.layouts.length),I});function u(i){const d=i<0;return d&&(i=~i),[d,r[i]]}function n(i){return i===void 0?i:[a.has(i),r[i]]}}function vt(r){let e,t,s;var a=r[0][0];function u(n){return{props:{data:n[2],form:n[1]}}}return a&&(e=new a(u(r))),{c(){e&&J(e.$$.fragment),t=D()},l(n){e&&ae(e.$$.fragment,n),t=D()},m(n,i){e&&z(e,n,i),B(n,t,i),s=!0},p(n,i){const d={};if(i&4&&(d.data=n[2]),i&2&&(d.form=n[1]),a!==(a=n[0][0])){if(e){Z();const h=e;N(h.$$.fragment,1,0,()=>{K(h,1)}),x()}a?(e=new a(u(n)),J(e.$$.fragment),V(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(n){s||(e&&V(e.$$.fragment,n),s=!0)},o(n){e&&N(e.$$.fragment,n),s=!1},d(n){n&&q(t),e&&K(e,n)}}}function kt(r){let e,t,s;var a=r[0][0];function u(n){return{props:{data:n[2],$$slots:{default:[Lt]},$$scope:{ctx:n}}}}return a&&(e=new a(u(r))),{c(){e&&J(e.$$.fragment),t=D()},l(n){e&&ae(e.$$.fragment,n),t=D()},m(n,i){e&&z(e,n,i),B(n,t,i),s=!0},p(n,i){const d={};if(i&4&&(d.data=n[2]),i&1051&&(d.$$scope={dirty:i,ctx:n}),a!==(a=n[0][0])){if(e){Z();const h=e;N(h.$$.fragment,1,0,()=>{K(h,1)}),x()}a?(e=new a(u(n)),J(e.$$.fragment),V(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(n){s||(e&&V(e.$$.fragment,n),s=!0)},o(n){e&&N(e.$$.fragment,n),s=!1},d(n){n&&q(t),e&&K(e,n)}}}function Et(r){let e,t,s;var a=r[0][1];function u(n){return{props:{data:n[3],form:n[1]}}}return a&&(e=new a(u(r))),{c(){e&&J(e.$$.fragment),t=D()},l(n){e&&ae(e.$$.fragment,n),t=D()},m(n,i){e&&z(e,n,i),B(n,t,i),s=!0},p(n,i){const d={};if(i&8&&(d.data=n[3]),i&2&&(d.form=n[1]),a!==(a=n[0][1])){if(e){Z();const h=e;N(h.$$.fragment,1,0,()=>{K(h,1)}),x()}a?(e=new a(u(n)),J(e.$$.fragment),V(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(n){s||(e&&V(e.$$.fragment,n),s=!0)},o(n){e&&N(e.$$.fragment,n),s=!1},d(n){n&&q(t),e&&K(e,n)}}}function $t(r){let e,t,s;var a=r[0][1];function u(n){return{props:{data:n[3],$$slots:{default:[Rt]},$$scope:{ctx:n}}}}return a&&(e=new a(u(r))),{c(){e&&J(e.$$.fragment),t=D()},l(n){e&&ae(e.$$.fragment,n),t=D()},m(n,i){e&&z(e,n,i),B(n,t,i),s=!0},p(n,i){const d={};if(i&8&&(d.data=n[3]),i&1043&&(d.$$scope={dirty:i,ctx:n}),a!==(a=n[0][1])){if(e){Z();const h=e;N(h.$$.fragment,1,0,()=>{K(h,1)}),x()}a?(e=new a(u(n)),J(e.$$.fragment),V(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(n){s||(e&&V(e.$$.fragment,n),s=!0)},o(n){e&&N(e.$$.fragment,n),s=!1},d(n){n&&q(t),e&&K(e,n)}}}function Rt(r){let e,t,s;var a=r[0][2];function u(n){return{props:{data:n[4],form:n[1]}}}return a&&(e=new a(u(r))),{c(){e&&J(e.$$.fragment),t=D()},l(n){e&&ae(e.$$.fragment,n),t=D()},m(n,i){e&&z(e,n,i),B(n,t,i),s=!0},p(n,i){const d={};if(i&16&&(d.data=n[4]),i&2&&(d.form=n[1]),a!==(a=n[0][2])){if(e){Z();const h=e;N(h.$$.fragment,1,0,()=>{K(h,1)}),x()}a?(e=new a(u(n)),J(e.$$.fragment),V(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(n){s||(e&&V(e.$$.fragment,n),s=!0)},o(n){e&&N(e.$$.fragment,n),s=!1},d(n){n&&q(t),e&&K(e,n)}}}function Lt(r){let e,t,s,a;const u=[$t,Et],n=[];function i(d,h){return d[0][2]?0:1}return e=i(r),t=n[e]=u[e](r),{c(){t.c(),s=D()},l(d){t.l(d),s=D()},m(d,h){n[e].m(d,h),B(d,s,h),a=!0},p(d,h){let y=e;e=i(d),e===y?n[e].p(d,h):(Z(),N(n[y],1,1,()=>{n[y]=null}),x(),t=n[e],t?t.p(d,h):(t=n[e]=u[e](d),t.c()),V(t,1),t.m(s.parentNode,s))},i(d){a||(V(t),a=!0)},o(d){N(t),a=!1},d(d){n[e].d(d),d&&q(s)}}}function Je(r){let e,t=r[6]&&ze(r);return{c(){e=Ze("div"),t&&t.c(),this.h()},l(s){e=xe(s,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var a=et(e);t&&t.l(a),a.forEach(q),this.h()},h(){we(e,"id","svelte-announcer"),we(e,"aria-live","assertive"),we(e,"aria-atomic","true"),W(e,"position","absolute"),W(e,"left","0"),W(e,"top","0"),W(e,"clip","rect(0 0 0 0)"),W(e,"clip-path","inset(50%)"),W(e,"overflow","hidden"),W(e,"white-space","nowrap"),W(e,"width","1px"),W(e,"height","1px")},m(s,a){B(s,e,a),t&&t.m(e,null)},p(s,a){s[6]?t?t.p(s,a):(t=ze(s),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(s){s&&q(e),t&&t.d()}}}function ze(r){let e;return{c(){e=tt(r[7])},l(t){e=nt(t,r[7])},m(t,s){B(t,e,s)},p(t,s){s&128&&rt(e,t[7])},d(t){t&&q(e)}}}function St(r){let e,t,s,a,u;const n=[kt,vt],i=[];function d(y,L){return y[0][1]?0:1}e=d(r),t=i[e]=n[e](r);let h=r[5]&&Je(r);return{c(){t.c(),s=Xe(),h&&h.c(),a=D()},l(y){t.l(y),s=Ye(y),h&&h.l(y),a=D()},m(y,L){i[e].m(y,L),B(y,s,L),h&&h.m(y,L),B(y,a,L),u=!0},p(y,[L]){let T=e;e=d(y),e===T?i[e].p(y,L):(Z(),N(i[T],1,1,()=>{i[T]=null}),x(),t=i[e],t?t.p(y,L):(t=i[e]=n[e](y),t.c()),V(t,1),t.m(s.parentNode,s)),y[5]?h?h.p(y,L):(h=Je(y),h.c(),h.m(a.parentNode,a)):h&&(h.d(1),h=null)},i(y){u||(V(t),u=!0)},o(y){N(t),u=!1},d(y){i[e].d(y),y&&q(s),h&&h.d(y),y&&q(a)}}}function Pt(r,e,t){let{stores:s}=e,{page:a}=e,{components:u}=e,{form:n}=e,{data_0:i=null}=e,{data_1:d=null}=e,{data_2:h=null}=e;Qe(s.page.notify);let y=!1,L=!1,T=null;return ve(()=>{const $=s.page.subscribe(()=>{y&&(t(6,L=!0),t(7,T=document.title||"untitled page"))});return t(5,y=!0),$}),r.$$set=$=>{"stores"in $&&t(8,s=$.stores),"page"in $&&t(9,a=$.page),"components"in $&&t(0,u=$.components),"form"in $&&t(1,n=$.form),"data_0"in $&&t(2,i=$.data_0),"data_1"in $&&t(3,d=$.data_1),"data_2"in $&&t(4,h=$.data_2)},r.$$.update=()=>{r.$$.dirty&768&&s.page.set(a)},[u,n,i,d,h,y,L,T,s,a]}class Ot extends We{constructor(e){super(),He(this,e,Pt,St,Me,{stores:8,page:9,components:0,form:1,data_0:2,data_1:3,data_2:4})}}const It={},fe=[()=>C(()=>import("./chunks/0-645c921b.js"),["chunks/0-645c921b.js","chunks/_layout-6d08a489.js","components/pages/_layout.svelte-ec2e1aa1.js","assets/app-ebf6b2f3.css","chunks/index-6ebe39d3.js"],import.meta.url),()=>C(()=>import("./chunks/1-154401a1.js"),["chunks/1-154401a1.js","components/error.svelte-117c4bd2.js","chunks/index-6ebe39d3.js","chunks/stores-672f9c92.js","chunks/singletons-9cbc1a63.js","chunks/index-f98803fb.js"],import.meta.url),()=>C(()=>import("./chunks/2-26a59b3c.js"),["chunks/2-26a59b3c.js","components/pages/companion/_layout.svelte-322ccb07.js","assets/app-ebf6b2f3.css","chunks/index-6ebe39d3.js","chunks/Icon-ccb7d9ae.js","chunks/stores-672f9c92.js","chunks/singletons-9cbc1a63.js","chunks/index-f98803fb.js"],import.meta.url),()=>C(()=>import("./chunks/3-b4ccdc6d.js"),["chunks/3-b4ccdc6d.js","components/pages/_page.svelte-29c3d659.js","chunks/index-6ebe39d3.js"],import.meta.url),()=>C(()=>import("./chunks/4-2796ddab.js"),["chunks/4-2796ddab.js","components/pages/companion/_page.svelte-093b66a5.js","chunks/index-6ebe39d3.js","chunks/stores-8138e3cb.js","chunks/index-f98803fb.js","chunks/info-3131b84a.js"],import.meta.url),()=>C(()=>import("./chunks/5-1eb7b386.js"),["chunks/5-1eb7b386.js","components/pages/companion/books/_page.svelte-51d6b4a3.js","chunks/index-6ebe39d3.js","chunks/info-3131b84a.js"],import.meta.url),()=>C(()=>import("./chunks/6-43cab5fa.js"),["chunks/6-43cab5fa.js","components/pages/companion/coaching/_page.svelte-187fb366.js","chunks/index-6ebe39d3.js","chunks/info-3131b84a.js"],import.meta.url),()=>C(()=>import("./chunks/7-a3114ace.js"),["chunks/7-a3114ace.js","components/pages/companion/lessons/_page.svelte-44214ef9.js","chunks/index-6ebe39d3.js","chunks/lessons-c88b2d9b.js","chunks/info-3131b84a.js","chunks/stores-8138e3cb.js","chunks/index-f98803fb.js"],import.meta.url),()=>C(()=>import("./chunks/8-1740002d.js"),["chunks/8-1740002d.js","chunks/_page-9f9dcc18.js","components/pages/companion/lessons/_lesson_/_page.svelte-f34e8fb7.js","chunks/index-6ebe39d3.js","chunks/LessonNavigator-2ba11205.js","chunks/Icon-ccb7d9ae.js","chunks/lessons-c88b2d9b.js","chunks/info-3131b84a.js"],import.meta.url),()=>C(()=>import("./chunks/9-04668b4f.js"),["chunks/9-04668b4f.js","chunks/_page-22748e52.js","components/pages/companion/lessons/_lesson_/_video_/_page.svelte-69dd12d2.js","chunks/index-6ebe39d3.js","chunks/LessonNavigator-2ba11205.js","chunks/Icon-ccb7d9ae.js","chunks/lessons-c88b2d9b.js","chunks/info-3131b84a.js"],import.meta.url),()=>C(()=>import("./chunks/10-1bd292f4.js"),["chunks/10-1bd292f4.js","components/pages/companion/thanks/_page.svelte-cced3ff6.js","chunks/index-6ebe39d3.js","chunks/info-3131b84a.js"],import.meta.url)],At=[],jt={"":[3],companion:[4,[2]],"companion/books":[5,[2]],"companion/coaching":[6,[2]],"companion/lessons":[7,[2]],"companion/thanks":[10,[2]],"companion/lessons/[lesson]":[-9,[2]],"companion/lessons/[lesson]/[video]":[-10,[2]]},Ut={handleError:({error:r})=>(console.error(r),{message:"Internal Error"})},Tt="/__data.js",Ge="sveltekit:scroll",Y="sveltekit:index",se=bt(fe,At,jt,It),Ee=fe[0],$e=fe[1];Ee();$e();let re={};try{re=JSON.parse(sessionStorage[Ge])}catch{}function be(r){re[r]=ke()}function Dt({target:r,base:e,trailing_slash:t}){var Te;const s=[],a={id:null,promise:null},u={before_navigate:[],after_navigate:[]};let n={branch:[],error:null,session_id:0,url:null},i=!1,d=!0,h=!1,y=1,L=null,T=!1,$,I=(Te=history.state)==null?void 0:Te[Y];I||(I=Date.now(),history.replaceState({...history.state,[Y]:I},"",location.href));const F=re[I];F&&(history.scrollRestoration="manual",scrollTo(F.x,F.y));let H=!1,M,Le;function Se(){if(!L){const o=new URL(location.href);L=Promise.resolve().then(async()=>{const c=he(o,!0);await Oe(c,o,[]),L=null,T=!1})}return L}async function ue(o,{noscroll:c=!1,replaceState:m=!1,keepfocus:l=!1,state:f={}},_){return typeof o=="string"&&(o=new URL(o,Ve(document))),me({url:o,scroll:c?ke():null,keepfocus:l,redirect_chain:_,details:{state:f,replaceState:m},accepted:()=>{},blocked:()=>{},type:"goto"})}async function Pe(o){const c=he(o,!1);if(!c)throw new Error("Attempted to prefetch a URL that does not belong to this app");return a.promise=je(c),a.id=c.id,a.promise}async function Oe(o,c,m,l,f){var v,k;const _=Le={};let g=o&&await je(o);if(!g&&c.origin===location.origin&&c.pathname===location.pathname&&(g=await oe({status:404,error:new Error(`Not found: ${c.pathname}`),url:c,routeId:null})),!g)return await te(c),!1;if(c=(o==null?void 0:o.url)||c,Le!==_)return!1;if(s.length=0,g.type==="redirect")if(m.length>10||m.includes(c.pathname))g=await oe({status:500,error:new Error("Redirect loop"),url:c,routeId:null});else return ue(new URL(g.location,c).href,{},[...m,c.pathname]),!1;else((k=(v=g.props)==null?void 0:v.page)==null?void 0:k.status)>=400&&await Q.updated.check()&&await te(c);if(h=!0,l&&l.details){const{details:b}=l,w=b.replaceState?0:1;b.state[Y]=I+=w,history[b.replaceState?"replaceState":"pushState"](b.state,"",c)}if(i){n=g.state,g.props.page&&(g.props.page.url=c);const b=le();$.$set(g.props),b()}else Ie(g);if(l){const{scroll:b,keepfocus:w}=l;if(!w){const E=document.body,A=E.getAttribute("tabindex");E.tabIndex=-1,E.focus({preventScroll:!0}),setTimeout(()=>{var S;(S=getSelection())==null||S.removeAllRanges()}),A!==null?E.setAttribute("tabindex",A):E.removeAttribute("tabindex")}if(await Ne(),d){const E=c.hash&&document.getElementById(c.hash.slice(1));b?scrollTo(b.x,b.y):E?E.scrollIntoView():scrollTo(0,0)}}else await Ne();a.promise=null,a.id=null,d=!0,g.props.page&&(M=g.props.page),f&&f(),h=!1}function Ie(o){var f,_;n=o.state;const c=document.querySelector("style[data-sveltekit]");c&&c.remove(),M=o.props.page;const m=le();$=new Ot({target:r,props:{...o.props,stores:Q},hydrate:!0}),m();const l={from:null,to:ie("to",{params:n.params,routeId:(_=(f=n.route)==null?void 0:f.id)!=null?_:null,url:new URL(location.href)}),type:"load"};u.after_navigate.forEach(g=>g(l)),i=!0}async function ee({url:o,params:c,branch:m,status:l,error:f,route:_,form:g}){var A;const v=m.filter(Boolean),k={type:"loaded",state:{url:o,params:c,branch:m,error:f,route:_,session_id:y},props:{components:v.map(S=>S.node.component)}};g!==void 0&&(k.props.form=g);let b={},w=!M;for(let S=0;S<v.length;S+=1){const j=v[S];b={...b,...j.data},(w||!n.branch.some(U=>U===j))&&(k.props[`data_${S}`]=b,w=w||Object.keys((A=j.data)!=null?A:{}).length>0)}if(w||(w=Object.keys(M.data).length!==Object.keys(b).length),!n.url||o.href!==n.url.href||n.error!==f||w){k.props.page={error:f,params:c,routeId:_&&_.id,status:l,url:o,data:w?b:M.data};const S=(j,U)=>{Object.defineProperty(k.props.page,j,{get:()=>{throw new Error(`$page.${j} has been replaced by $page.url.${U}`)}})};S("origin","origin"),S("path","pathname"),S("query","searchParams")}return k}async function de({loader:o,parent:c,url:m,params:l,routeId:f,server_data_node:_}){var b,w,E,A,S;let g=null;const v={dependencies:new Set,params:new Set,parent:!1,url:!1},k=await o();if((b=k.shared)!=null&&b.load){let j=function(...p){for(const R of p){const{href:O}=new URL(R,m);v.dependencies.add(O)}};const U={};for(const p in l)Object.defineProperty(U,p,{get(){return v.params.add(p),l[p]},enumerable:!0});const X={routeId:f,params:U,data:(w=_==null?void 0:_.data)!=null?w:null,url:ut(m,()=>{v.url=!0}),async fetch(p,R){let O;typeof p=="string"?O=p:(O=p.url,R={body:p.method==="GET"||p.method==="HEAD"?void 0:await p.blob(),cache:p.cache,credentials:p.credentials,headers:p.headers,integrity:p.integrity,keepalive:p.keepalive,method:p.method,mode:p.mode,redirect:p.redirect,referrer:p.referrer,referrerPolicy:p.referrerPolicy,signal:p.signal,...R});const P=new URL(O,m).href;return j(P),i?mt(P,R):ht(O,P,R)},setHeaders:()=>{},depends:j,parent(){return v.parent=!0,c()}};Object.defineProperties(X,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),g=(E=await k.shared.load.call(null,X))!=null?E:null}return{node:k,loader:o,server:_,shared:(A=k.shared)!=null&&A.load?{type:"data",data:g,uses:v}:null,data:(S=g!=null?g:_==null?void 0:_.data)!=null?S:null}}function Ae(o,c,m){if(T)return!0;if(!m)return!1;if(m.parent&&c||o.url&&m.url)return!0;for(const l of o.params)if(m.params.has(l))return!0;for(const l of m.dependencies)if(s.some(f=>f(new URL(l))))return!0;return!1}function pe(o,c){var m,l;return(o==null?void 0:o.type)==="data"?{type:"data",data:o.data,uses:{dependencies:new Set((m=o.uses.dependencies)!=null?m:[]),params:new Set((l=o.uses.params)!=null?l:[]),parent:!!o.uses.parent,url:!!o.uses.url}}:(o==null?void 0:o.type)==="skip"&&c!=null?c:null}async function je({id:o,invalidating:c,url:m,params:l,route:f}){var X;if(a.id===o&&a.promise)return a.promise;const{errors:_,layouts:g,leaf:v}=f,k=n.url&&{url:o!==n.url.pathname+n.url.search,params:Object.keys(l).filter(p=>n.params[p]!==l[p])},b=[...g,v];_.forEach(p=>p==null?void 0:p().catch(()=>{})),b.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let w=null;const E=b.reduce((p,R,O)=>{var G;const P=n.branch[O],ne=!!(R!=null&&R[0])&&((P==null?void 0:P.loader)!==R[1]||Ae(k,p.some(Boolean),(G=P.server)==null?void 0:G.uses));return p.push(ne),p},[]);if(E.some(Boolean)){try{w=await Ke(m,E)}catch(p){return oe({status:500,error:p,url:m,routeId:f.id})}if(w.type==="redirect")return w}const A=w==null?void 0:w.nodes;let S=!1;const j=b.map(async(p,R)=>{var G;if(!p)return;const O=n.branch[R],P=A==null?void 0:A[R];if((!P||P.type==="skip")&&p[1]===(O==null?void 0:O.loader)&&!Ae(k,S,(G=O.shared)==null?void 0:G.uses))return O;if(S=!0,(P==null?void 0:P.type)==="error")throw P;return de({loader:p[1],url:m,params:l,routeId:f.id,parent:async()=>{var De;const _e={};for(let ge=0;ge<R;ge+=1)Object.assign(_e,(De=await j[ge])==null?void 0:De.data);return _e},server_data_node:pe(P===void 0&&p[0]?{type:"skip"}:P!=null?P:null,O==null?void 0:O.server)})});for(const p of j)p.catch(()=>{});const U=[];for(let p=0;p<b.length;p+=1)if(b[p])try{U.push(await j[p])}catch(R){if(R instanceof Be)return{type:"redirect",location:R.location};let O=500,P;for(A!=null&&A.includes(R)?(O=(X=R.status)!=null?X:O,P=R.error):R instanceof ye?(O=R.status,P=R.body):P=Fe(R,{params:l,url:m,routeId:f.id});p--;)if(_[p]){let ne,G=p;for(;!U[G];)G-=1;try{return ne={node:await _[p](),loader:_[p],data:{},server:null,shared:null},await ee({url:m,params:l,branch:U.slice(0,G+1).concat(ne),status:O,error:P,route:f})}catch{continue}}await te(m);return}else U.push(void 0);return await ee({url:m,params:l,branch:U,status:200,error:null,route:f,form:c?void 0:null})}async function oe({status:o,error:c,url:m,routeId:l}){var b;const f={},_=await Ee();let g=null;if(_.server)try{const w=await Ke(m,[!0]);if(w.type!=="data"||w.nodes[0]&&w.nodes[0].type!=="data")throw 0;g=(b=w.nodes[0])!=null?b:null}catch{await te(m);return}const v=await de({loader:Ee,url:m,params:f,routeId:l,parent:()=>Promise.resolve({}),server_data_node:pe(g)}),k={node:await $e(),loader:$e,shared:null,server:null,data:null};return await ee({url:m,params:f,branch:[v,k],status:o,error:c instanceof ye?c.body:Fe(c,{url:m,params:f,routeId:null}),route:null})}function he(o,c){if(Ue(o))return;const m=decodeURI(o.pathname.slice(e.length)||"/");for(const l of se){const f=l.exec(m);if(f){const _=new URL(o.origin+lt(o.pathname,t)+o.search+o.hash);return{id:_.pathname+_.search,invalidating:c,route:l,params:ct(f),url:_}}}}function Ue(o){return o.origin!==location.origin||!o.pathname.startsWith(e)}async function me({url:o,scroll:c,keepfocus:m,redirect_chain:l,details:f,type:_,delta:g,accepted:v,blocked:k}){var S,j,U,X;let b=!1;const w=he(o,!1),E={from:ie("from",{params:n.params,routeId:(j=(S=n.route)==null?void 0:S.id)!=null?j:null,url:n.url}),to:ie("to",{params:(U=w==null?void 0:w.params)!=null?U:null,routeId:(X=w==null?void 0:w.route.id)!=null?X:null,url:o}),type:_};g!==void 0&&(E.delta=g);const A={...E,cancel:()=>{b=!0}};if(u.before_navigate.forEach(p=>p(A)),b){k();return}be(I),v(),i&&Q.navigating.set(E),await Oe(w,o,l,{scroll:c,keepfocus:m,details:f},()=>{u.after_navigate.forEach(p=>p(E)),Q.navigating.set(null)})}function te(o){return location.href=o.href,new Promise(()=>{})}return{after_navigate:o=>{ve(()=>(u.after_navigate.push(o),()=>{const c=u.after_navigate.indexOf(o);u.after_navigate.splice(c,1)}))},before_navigate:o=>{ve(()=>(u.before_navigate.push(o),()=>{const c=u.before_navigate.indexOf(o);u.before_navigate.splice(c,1)}))},disable_scroll_handling:()=>{(h||!i)&&(d=!1)},goto:(o,c={})=>ue(o,c,[]),invalidate:o=>{if(o===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof o=="function")s.push(o);else{const{href:c}=new URL(o,location.href);s.push(m=>m.href===c)}return Se()},invalidateAll:()=>(T=!0,Se()),prefetch:async o=>{const c=new URL(o,Ve(document));await Pe(c)},prefetch_routes:async o=>{const m=(o?se.filter(l=>o.some(f=>l.exec(f))):se).map(l=>Promise.all([...l.layouts,l.leaf].map(f=>f==null?void 0:f[1]())));await Promise.all(m)},apply_action:async o=>{if(o.type==="error"){const c=new URL(location.href),{branch:m,route:l}=n;if(!l)return;let f=n.branch.length;for(;f--;)if(l.errors[f]){let _,g=f;for(;!m[g];)g-=1;try{_={node:await l.errors[f](),loader:l.errors[f],data:{},server:null,shared:null};const v=await ee({url:c,params:n.params,branch:m.slice(0,g+1).concat(_),status:500,error:o.error,route:l});n=v.state;const k=le();$.$set(v.props),k();return}catch{continue}}}else if(o.type==="redirect")ue(o.location,{},[]);else{const c={form:o.data};o.status!==M.status&&(c.page={...M,status:o.status});const m=le();$.$set(c),m()}},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",l=>{var g,v;let f=!1;const _={from:ie("from",{params:n.params,routeId:(v=(g=n.route)==null?void 0:g.id)!=null?v:null,url:n.url}),to:null,type:"unload",cancel:()=>f=!0};u.before_navigate.forEach(k=>k(_)),f?(l.preventDefault(),l.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){be(I);try{sessionStorage[Ge]=JSON.stringify(re)}catch{}}});const o=l=>{const{url:f,options:_}=Ce(l);if(f&&_.prefetch){if(Ue(f))return;Pe(f)}};let c;const m=l=>{clearTimeout(c),c=setTimeout(()=>{var f;(f=l.target)==null||f.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",o),addEventListener("mousemove",m),addEventListener("sveltekit:trigger_prefetch",o),addEventListener("click",l=>{if(l.button||l.which!==1||l.metaKey||l.ctrlKey||l.shiftKey||l.altKey||l.defaultPrevented)return;const{a:f,url:_,options:g}=Ce(l);if(!f||!_)return;const v=f instanceof SVGAElement;if(!v&&!(_.protocol==="https:"||_.protocol==="http:"))return;const k=(f.getAttribute("rel")||"").split(/\s+/);if(f.hasAttribute("download")||k.includes("external")||g.reload||(v?f.target.baseVal:f.target))return;const[b,w]=_.href.split("#");if(w!==void 0&&b===location.href.split("#")[0]){H=!0,be(I),n.url=_,Q.page.set({...M,url:_}),Q.page.notify();return}me({url:_,scroll:g.noscroll?ke():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:_.href===location.href},accepted:()=>l.preventDefault(),blocked:()=>l.preventDefault(),type:"link"})}),addEventListener("popstate",l=>{if(l.state){if(l.state[Y]===I)return;const f=l.state[Y]-I;me({url:new URL(location.href),scroll:re[l.state[Y]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{I=l.state[Y]},blocked:()=>{history.go(-f)},type:"popstate",delta:f})}}),addEventListener("hashchange",()=>{H&&(H=!1,history.replaceState({...history.state,[Y]:++I},"",location.href))});for(const l of document.querySelectorAll("link"))l.rel==="icon"&&(l.href=l.href);addEventListener("pageshow",l=>{l.persisted&&Q.navigating.set(null)})},_hydrate:async({status:o,error:c,node_ids:m,params:l,routeId:f,data:_,form:g})=>{var b;const v=new URL(location.href);let k;try{const w=m.map(async(E,A)=>{const S=_[A];return de({loader:fe[E],url:v,params:l,routeId:f,parent:async()=>{const j={};for(let U=0;U<A;U+=1)Object.assign(j,(await w[U]).data);return j},server_data_node:pe(S)})});k=await ee({url:v,params:l,branch:await Promise.all(w),status:o,error:c,form:g,route:(b=se.find(E=>E.id===f))!=null?b:null})}catch(w){const E=w;if(E instanceof Be){await te(new URL(w.location,location.href));return}k=await oe({status:E instanceof ye?E.status:500,error:E,url:v,routeId:f})}Ie(k)}}}let Nt=1;async function Ke(r,e){const t=new URL(r);t.pathname=r.pathname.replace(/\/$/,"")+Tt,t.searchParams.set("__invalid",e.map(a=>a?"y":"n").join("")),t.searchParams.set("__id",String(Nt++)),await C(()=>import(t.href),[],import.meta.url);const s=window.__sveltekit_data;return delete window.__sveltekit_data,s}function Fe(r,e){var t;return(t=Ut.handleError({error:r,event:e}))!=null?t:{message:"Internal Error"}}const Vt=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function ie(r,e){for(const t of Vt)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${r}.${t} should now be ${r}.url.${t}`)}});return e}function le(){return()=>{}}async function Bt({env:r,hydrate:e,paths:t,target:s,trailing_slash:a}){at(t);const u=Dt({target:s,base:t.base,trailing_slash:a});ot({client:u}),e?await u._hydrate(e):u.goto(location.href,{replaceState:!0}),u._start_router()}export{Bt as start};
