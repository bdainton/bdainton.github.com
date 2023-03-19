import{S as We,i as He,s as Me,a as Xe,e as U,c as Ye,b as B,g as Z,t as N,d as x,f as C,h as q,j as Qe,o as ve,k as Ze,l as xe,m as et,n as we,p as W,q as tt,r as rt,u as nt,v as J,w as ae,x as z,y as K,z as Ue}from"./chunks/index-ccda9a55.js";import{g as Ne,f as Ce,s as Q,a as Ee,b as at,i as ot}from"./chunks/singletons-6debcf8f.js";const it=function(){const e=document.createElement("link").relList;return e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}(),st=function(n,e){return new URL(n,e).href},qe={},I=function(e,t,i){return!t||t.length===0?e():Promise.all(t.map(a=>{if(a=st(a,i),a in qe)return;qe[a]=!0;const u=a.endsWith(".css"),r=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${r}`))return;const s=document.createElement("link");if(s.rel=u?"stylesheet":it,u||(s.as="script",s.crossOrigin=""),s.href=a,document.head.appendChild(s),u)return new Promise((d,m)=>{s.addEventListener("load",d),s.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${a}`)))})})).then(()=>e())};class ye{constructor(e,t){this.status=e,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${e}`}}toString(){return JSON.stringify(this.body)}}class Be{constructor(e,t){this.status=e,this.location=t}}function lt(n,e){return n==="/"||e==="ignore"?n:e==="never"?n.endsWith("/")?n.slice(0,-1):n:e==="always"&&!n.endsWith("/")?n+"/":n}function ct(n){for(const e in n)n[e]=n[e].replace(/%23/g,"#").replace(/%3[Bb]/g,";").replace(/%2[Cc]/g,",").replace(/%2[Ff]/g,"/").replace(/%3[Ff]/g,"?").replace(/%3[Aa]/g,":").replace(/%40/g,"@").replace(/%26/g,"&").replace(/%3[Dd]/g,"=").replace(/%2[Bb]/g,"+").replace(/%24/g,"$");return n}const ft=["href","pathname","search","searchParams","toString","toJSON"];function ut(n,e){const t=new URL(n);for(const i of ft){let a=t[i];Object.defineProperty(t,i,{get(){return e(),a},enumerable:!0,configurable:!0})}return t[Symbol.for("nodejs.util.inspect.custom")]=(i,a,u)=>u(n,a),dt(t),t}function dt(n){Object.defineProperty(n,"hash",{get(){throw new Error("Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead")}})}function pt(n){let e=5381,t=n.length;if(typeof n=="string")for(;t;)e=e*33^n.charCodeAt(--t);else for(;t;)e=e*33^n[--t];return(e>>>0).toString(36)}const Re=window.fetch;window.fetch=(n,e)=>{if((n instanceof Request?n.method:(e==null?void 0:e.method)||"GET")!=="GET"){const i=new URL(n instanceof Request?n.url:n.toString(),document.baseURI).href;ce.delete(i)}return Re(n,e)};const ce=new Map;function mt(n,e,t){let a=`script[data-sveltekit-fetched][data-url=${JSON.stringify(typeof n=="string"?n:n.url)}]`;t&&typeof t.body=="string"&&(a+=`[data-hash="${pt(t.body)}"]`);const u=document.querySelector(a);if(u!=null&&u.textContent){const{body:r,...s}=JSON.parse(u.textContent),d=u.getAttribute("data-ttl");return d&&ce.set(e,{body:r,init:s,ttl:1e3*Number(d)}),Promise.resolve(new Response(r,s))}return Re(n,t)}function _t(n,e){const t=ce.get(n);if(t){if(performance.now()<t.ttl)return new Response(t.body,t.init);ce.delete(n)}return Re(n,e)}const ht=/^(\.\.\.)?(\w+)(?:=(\w+))?$/;function gt(n){const e=[],t=[];let i=!0;return{pattern:n===""?/^\/$/:new RegExp(`^${n.split(/(?:\/|$)/).filter(wt).map((u,r,s)=>{const d=decodeURIComponent(u),m=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(d);if(m)return e.push(m[1]),t.push(m[2]),"(?:/(.*))?";const y=r===s.length-1;return d&&"/"+d.split(/\[(.+?)\]/).map((L,j)=>{if(j%2){const $=ht.exec(L);if(!$)throw new Error(`Invalid param: ${L}. Params and matcher names can only have underscores and alphanumeric characters.`);const[,A,F,H]=$;return e.push(F),t.push(H),A?"(.*?)":"([^/]+?)"}return y&&L.includes(".")&&(i=!1),L.normalize().replace(/%5[Bb]/g,"[").replace(/%5[Dd]/g,"]").replace(/#/g,"%23").replace(/\?/g,"%3F").replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("")}).join("")}${i?"/?":""}$`),names:e,types:t}}function wt(n){return!/^\([^)]+\)$/.test(n)}function yt(n,e,t,i){const a={};for(let u=0;u<e.length;u+=1){const r=e[u],s=t[u],d=n[u+1]||"";if(s){const m=i[s];if(!m)throw new Error(`Missing "${s}" param matcher`);if(!m(d))return}a[r]=d}return a}function bt(n,e,t,i){const a=new Set(e);return Object.entries(t).map(([s,[d,m,y]])=>{const{pattern:L,names:j,types:$}=gt(s),A={id:s,exec:F=>{const H=L.exec(F);if(H)return yt(H,j,$,i)},errors:[1,...y||[]].map(F=>n[F]),layouts:[0,...m||[]].map(r),leaf:u(d)};return A.errors.length=A.layouts.length=Math.max(A.errors.length,A.layouts.length),A});function u(s){const d=s<0;return d&&(s=~s),[d,n[s]]}function r(s){return s===void 0?s:[a.has(s),n[s]]}}function vt(n){let e,t,i;var a=n[0][0];function u(r){return{props:{data:r[2],form:r[1]}}}return a&&(e=new a(u(n))),{c(){e&&J(e.$$.fragment),t=U()},l(r){e&&ae(e.$$.fragment,r),t=U()},m(r,s){e&&z(e,r,s),B(r,t,s),i=!0},p(r,s){const d={};if(s&4&&(d.data=r[2]),s&2&&(d.form=r[1]),a!==(a=r[0][0])){if(e){Z();const m=e;N(m.$$.fragment,1,0,()=>{K(m,1)}),x()}a?(e=new a(u(r)),J(e.$$.fragment),C(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(r){i||(e&&C(e.$$.fragment,r),i=!0)},o(r){e&&N(e.$$.fragment,r),i=!1},d(r){r&&q(t),e&&K(e,r)}}}function Et(n){let e,t,i;var a=n[0][0];function u(r){return{props:{data:r[2],$$slots:{default:[Lt]},$$scope:{ctx:r}}}}return a&&(e=new a(u(n))),{c(){e&&J(e.$$.fragment),t=U()},l(r){e&&ae(e.$$.fragment,r),t=U()},m(r,s){e&&z(e,r,s),B(r,t,s),i=!0},p(r,s){const d={};if(s&4&&(d.data=r[2]),s&1051&&(d.$$scope={dirty:s,ctx:r}),a!==(a=r[0][0])){if(e){Z();const m=e;N(m.$$.fragment,1,0,()=>{K(m,1)}),x()}a?(e=new a(u(r)),J(e.$$.fragment),C(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(r){i||(e&&C(e.$$.fragment,r),i=!0)},o(r){e&&N(e.$$.fragment,r),i=!1},d(r){r&&q(t),e&&K(e,r)}}}function kt(n){let e,t,i;var a=n[0][1];function u(r){return{props:{data:r[3],form:r[1]}}}return a&&(e=new a(u(n))),{c(){e&&J(e.$$.fragment),t=U()},l(r){e&&ae(e.$$.fragment,r),t=U()},m(r,s){e&&z(e,r,s),B(r,t,s),i=!0},p(r,s){const d={};if(s&8&&(d.data=r[3]),s&2&&(d.form=r[1]),a!==(a=r[0][1])){if(e){Z();const m=e;N(m.$$.fragment,1,0,()=>{K(m,1)}),x()}a?(e=new a(u(r)),J(e.$$.fragment),C(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(r){i||(e&&C(e.$$.fragment,r),i=!0)},o(r){e&&N(e.$$.fragment,r),i=!1},d(r){r&&q(t),e&&K(e,r)}}}function $t(n){let e,t,i;var a=n[0][1];function u(r){return{props:{data:r[3],$$slots:{default:[Rt]},$$scope:{ctx:r}}}}return a&&(e=new a(u(n))),{c(){e&&J(e.$$.fragment),t=U()},l(r){e&&ae(e.$$.fragment,r),t=U()},m(r,s){e&&z(e,r,s),B(r,t,s),i=!0},p(r,s){const d={};if(s&8&&(d.data=r[3]),s&1043&&(d.$$scope={dirty:s,ctx:r}),a!==(a=r[0][1])){if(e){Z();const m=e;N(m.$$.fragment,1,0,()=>{K(m,1)}),x()}a?(e=new a(u(r)),J(e.$$.fragment),C(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(r){i||(e&&C(e.$$.fragment,r),i=!0)},o(r){e&&N(e.$$.fragment,r),i=!1},d(r){r&&q(t),e&&K(e,r)}}}function Rt(n){let e,t,i;var a=n[0][2];function u(r){return{props:{data:r[4],form:r[1]}}}return a&&(e=new a(u(n))),{c(){e&&J(e.$$.fragment),t=U()},l(r){e&&ae(e.$$.fragment,r),t=U()},m(r,s){e&&z(e,r,s),B(r,t,s),i=!0},p(r,s){const d={};if(s&16&&(d.data=r[4]),s&2&&(d.form=r[1]),a!==(a=r[0][2])){if(e){Z();const m=e;N(m.$$.fragment,1,0,()=>{K(m,1)}),x()}a?(e=new a(u(r)),J(e.$$.fragment),C(e.$$.fragment,1),z(e,t.parentNode,t)):e=null}else a&&e.$set(d)},i(r){i||(e&&C(e.$$.fragment,r),i=!0)},o(r){e&&N(e.$$.fragment,r),i=!1},d(r){r&&q(t),e&&K(e,r)}}}function Lt(n){let e,t,i,a;const u=[$t,kt],r=[];function s(d,m){return d[0][2]?0:1}return e=s(n),t=r[e]=u[e](n),{c(){t.c(),i=U()},l(d){t.l(d),i=U()},m(d,m){r[e].m(d,m),B(d,i,m),a=!0},p(d,m){let y=e;e=s(d),e===y?r[e].p(d,m):(Z(),N(r[y],1,1,()=>{r[y]=null}),x(),t=r[e],t?t.p(d,m):(t=r[e]=u[e](d),t.c()),C(t,1),t.m(i.parentNode,i))},i(d){a||(C(t),a=!0)},o(d){N(t),a=!1},d(d){r[e].d(d),d&&q(i)}}}function Je(n){let e,t=n[6]&&ze(n);return{c(){e=Ze("div"),t&&t.c(),this.h()},l(i){e=xe(i,"DIV",{id:!0,"aria-live":!0,"aria-atomic":!0,style:!0});var a=et(e);t&&t.l(a),a.forEach(q),this.h()},h(){we(e,"id","svelte-announcer"),we(e,"aria-live","assertive"),we(e,"aria-atomic","true"),W(e,"position","absolute"),W(e,"left","0"),W(e,"top","0"),W(e,"clip","rect(0 0 0 0)"),W(e,"clip-path","inset(50%)"),W(e,"overflow","hidden"),W(e,"white-space","nowrap"),W(e,"width","1px"),W(e,"height","1px")},m(i,a){B(i,e,a),t&&t.m(e,null)},p(i,a){i[6]?t?t.p(i,a):(t=ze(i),t.c(),t.m(e,null)):t&&(t.d(1),t=null)},d(i){i&&q(e),t&&t.d()}}}function ze(n){let e;return{c(){e=tt(n[7])},l(t){e=rt(t,n[7])},m(t,i){B(t,e,i)},p(t,i){i&128&&nt(e,t[7])},d(t){t&&q(e)}}}function Pt(n){let e,t,i,a,u;const r=[Et,vt],s=[];function d(y,L){return y[0][1]?0:1}e=d(n),t=s[e]=r[e](n);let m=n[5]&&Je(n);return{c(){t.c(),i=Xe(),m&&m.c(),a=U()},l(y){t.l(y),i=Ye(y),m&&m.l(y),a=U()},m(y,L){s[e].m(y,L),B(y,i,L),m&&m.m(y,L),B(y,a,L),u=!0},p(y,[L]){let j=e;e=d(y),e===j?s[e].p(y,L):(Z(),N(s[j],1,1,()=>{s[j]=null}),x(),t=s[e],t?t.p(y,L):(t=s[e]=r[e](y),t.c()),C(t,1),t.m(i.parentNode,i)),y[5]?m?m.p(y,L):(m=Je(y),m.c(),m.m(a.parentNode,a)):m&&(m.d(1),m=null)},i(y){u||(C(t),u=!0)},o(y){N(t),u=!1},d(y){s[e].d(y),y&&q(i),m&&m.d(y),y&&q(a)}}}function Ot(n,e,t){let{stores:i}=e,{page:a}=e,{components:u}=e,{form:r}=e,{data_0:s=null}=e,{data_1:d=null}=e,{data_2:m=null}=e;Qe(i.page.notify);let y=!1,L=!1,j=null;return ve(()=>{const $=i.page.subscribe(()=>{y&&(t(6,L=!0),t(7,j=document.title||"untitled page"))});return t(5,y=!0),$}),n.$$set=$=>{"stores"in $&&t(8,i=$.stores),"page"in $&&t(9,a=$.page),"components"in $&&t(0,u=$.components),"form"in $&&t(1,r=$.form),"data_0"in $&&t(2,s=$.data_0),"data_1"in $&&t(3,d=$.data_1),"data_2"in $&&t(4,m=$.data_2)},n.$$.update=()=>{n.$$.dirty&768&&i.page.set(a)},[u,r,s,d,m,y,L,j,i,a]}class St extends We{constructor(e){super(),He(this,e,Ot,Pt,Me,{stores:8,page:9,components:0,form:1,data_0:2,data_1:3,data_2:4})}}const It={},fe=[()=>I(()=>import("./chunks/0-7e6db403.js"),["chunks/0-7e6db403.js","chunks/_layout-6d08a489.js","components/pages/_layout.svelte-3b09b69a.js","assets/_layout-2545f62a.css","chunks/index-ccda9a55.js","chunks/stores-25697d30.js","chunks/singletons-6debcf8f.js"],import.meta.url),()=>I(()=>import("./chunks/1-6ecee18b.js"),["chunks/1-6ecee18b.js","components/error.svelte-b28fc259.js","chunks/index-ccda9a55.js","chunks/stores-25697d30.js","chunks/singletons-6debcf8f.js"],import.meta.url),()=>I(()=>import("./chunks/2-34fe5229.js"),["chunks/2-34fe5229.js","components/pages/media/5-things-to-be-a-great-leader/_layout.svelte-6859e90e.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/3-7dde0145.js"),["chunks/3-7dde0145.js","components/pages/media/drunk-web-ep-45-engineering-management/_layout.svelte-e6260133.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/4-8f86ca09.js"),["chunks/4-8f86ca09.js","components/pages/media/magic-moments/_layout.svelte-bb477ffe.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/5-e44b6683.js"),["chunks/5-e44b6683.js","components/pages/media/rocks-pebbles-sand/_layout.svelte-bada949e.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/6-3217a670.js"),["chunks/6-3217a670.js","components/pages/media/should-engineering-managers-code/_layout.svelte-0255a0f0.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/7-1431ab17.js"),["chunks/7-1431ab17.js","components/pages/media/ultimate-shortcut-for-engineering-managers/_layout.svelte-c8e54a9d.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/8-d6b0166f.js"),["chunks/8-d6b0166f.js","components/pages/media/work-backwards/_layout.svelte-89460179.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/9-e221b432.js"),["chunks/9-e221b432.js","components/pages/_page.svelte-893b40dc.js","chunks/index-ccda9a55.js","chunks/info-13a7f95e.js","chunks/Heading-ad846718.js"],import.meta.url),()=>I(()=>import("./chunks/10-d8994f1f.js"),["chunks/10-d8994f1f.js","components/pages/books/_page.svelte-4366fb33.js","chunks/index-ccda9a55.js","chunks/PageHeader-fe9141c9.js","chunks/info-13a7f95e.js"],import.meta.url),()=>I(()=>import("./chunks/11-25403bb1.js"),["chunks/11-25403bb1.js","components/pages/coaching/_page.svelte-29d0958e.js","chunks/index-ccda9a55.js","chunks/PageHeader-fe9141c9.js","chunks/Heading-ad846718.js","chunks/info-13a7f95e.js"],import.meta.url),()=>I(()=>import("./chunks/12-17d322d4.js"),["chunks/12-17d322d4.js","components/pages/contact/_page.svelte-d7481a4b.js","chunks/index-ccda9a55.js","chunks/PageHeader-fe9141c9.js","chunks/Heading-ad846718.js","chunks/info-13a7f95e.js"],import.meta.url),()=>I(()=>import("./chunks/13-5647b5e7.js"),["chunks/13-5647b5e7.js","components/pages/media/_page.svelte-85b0693b.js","chunks/index-ccda9a55.js","chunks/PageHeader-fe9141c9.js","chunks/Heading-ad846718.js","chunks/info-13a7f95e.js"],import.meta.url),()=>I(()=>import("./chunks/14-650860f7.js"),["chunks/14-650860f7.js","components/pages/media/5-things-to-be-a-great-leader/_page.svelte-ecb72419.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/15-cac3036b.js"),["chunks/15-cac3036b.js","components/pages/media/drunk-web-ep-45-engineering-management/_page.svelte-09da992c.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/16-40e0fcdd.js"),["chunks/16-40e0fcdd.js","components/pages/media/magic-moments/_page.svelte-c50afaad.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/17-d3871aa4.js"),["chunks/17-d3871aa4.js","components/pages/media/rocks-pebbles-sand/_page.svelte-6d112cda.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/18-a8e6b97b.js"),["chunks/18-a8e6b97b.js","components/pages/media/should-engineering-managers-code/_page.svelte-f1b7ee0c.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/19-5d018fe3.js"),["chunks/19-5d018fe3.js","components/pages/media/ultimate-shortcut-for-engineering-managers/_page.svelte-955d1b98.js","chunks/index-ccda9a55.js"],import.meta.url),()=>I(()=>import("./chunks/20-7f943a7f.js"),["chunks/20-7f943a7f.js","components/pages/media/work-backwards/_page.svelte-0764be0b.js","chunks/index-ccda9a55.js"],import.meta.url)],At=[],Tt={"":[9],books:[10],coaching:[11],contact:[12],media:[13],"media/5-things-to-be-a-great-leader":[14,[2]],"media/drunk-web-ep-45-engineering-management":[15,[3]],"media/magic-moments":[16,[4]],"media/rocks-pebbles-sand":[17,[5]],"media/should-engineering-managers-code":[18,[6]],"media/ultimate-shortcut-for-engineering-managers":[19,[7]],"media/work-backwards":[20,[8]]},Dt={handleError:({error:n})=>(console.error(n),{message:"Internal Error"})},Vt="/__data.js",Ge="sveltekit:scroll",Y="sveltekit:index",ie=bt(fe,At,Tt,It),ke=fe[0],$e=fe[1];ke();$e();let ne={};try{ne=JSON.parse(sessionStorage[Ge])}catch{}function be(n){ne[n]=Ee()}function jt({target:n,base:e,trailing_slash:t}){var Ve;const i=[],a={id:null,promise:null},u={before_navigate:[],after_navigate:[]};let r={branch:[],error:null,session_id:0,url:null},s=!1,d=!0,m=!1,y=1,L=null,j=!1,$,A=(Ve=history.state)==null?void 0:Ve[Y];A||(A=Date.now(),history.replaceState({...history.state,[Y]:A},"",location.href));const F=ne[A];F&&(history.scrollRestoration="manual",scrollTo(F.x,F.y));let H=!1,M,Le;function Pe(){if(!L){const o=new URL(location.href);L=Promise.resolve().then(async()=>{const c=me(o,!0);await Se(c,o,[]),L=null,j=!1})}return L}async function ue(o,{noscroll:c=!1,replaceState:_=!1,keepfocus:l=!1,state:f={}},h){return typeof o=="string"&&(o=new URL(o,Ne(document))),_e({url:o,scroll:c?Ee():null,keepfocus:l,redirect_chain:h,details:{state:f,replaceState:_},accepted:()=>{},blocked:()=>{},type:"goto"})}async function Oe(o){const c=me(o,!1);if(!c)throw new Error("Attempted to prefetch a URL that does not belong to this app");return a.promise=Te(c),a.id=c.id,a.promise}async function Se(o,c,_,l,f){var v,E;const h=Le={};let g=o&&await Te(o);if(!g&&c.origin===location.origin&&c.pathname===location.pathname&&(g=await oe({status:404,error:new Error(`Not found: ${c.pathname}`),url:c,routeId:null})),!g)return await te(c),!1;if(c=(o==null?void 0:o.url)||c,Le!==h)return!1;if(i.length=0,g.type==="redirect")if(_.length>10||_.includes(c.pathname))g=await oe({status:500,error:new Error("Redirect loop"),url:c,routeId:null});else return ue(new URL(g.location,c).href,{},[..._,c.pathname]),!1;else((E=(v=g.props)==null?void 0:v.page)==null?void 0:E.status)>=400&&await Q.updated.check()&&await te(c);if(m=!0,l&&l.details){const{details:b}=l,w=b.replaceState?0:1;b.state[Y]=A+=w,history[b.replaceState?"replaceState":"pushState"](b.state,"",c)}if(s){r=g.state,g.props.page&&(g.props.page.url=c);const b=le();$.$set(g.props),b()}else Ie(g);if(l){const{scroll:b,keepfocus:w}=l;if(!w){const k=document.body,T=k.getAttribute("tabindex");k.tabIndex=-1,k.focus({preventScroll:!0}),setTimeout(()=>{var P;(P=getSelection())==null||P.removeAllRanges()}),T!==null?k.setAttribute("tabindex",T):k.removeAttribute("tabindex")}if(await Ue(),d){const k=c.hash&&document.getElementById(c.hash.slice(1));b?scrollTo(b.x,b.y):k?k.scrollIntoView():scrollTo(0,0)}}else await Ue();a.promise=null,a.id=null,d=!0,g.props.page&&(M=g.props.page),f&&f(),m=!1}function Ie(o){var f,h;r=o.state;const c=document.querySelector("style[data-sveltekit]");c&&c.remove(),M=o.props.page;const _=le();$=new St({target:n,props:{...o.props,stores:Q},hydrate:!0}),_();const l={from:null,to:se("to",{params:r.params,routeId:(h=(f=r.route)==null?void 0:f.id)!=null?h:null,url:new URL(location.href)}),type:"load"};u.after_navigate.forEach(g=>g(l)),s=!0}async function ee({url:o,params:c,branch:_,status:l,error:f,route:h,form:g}){var T;const v=_.filter(Boolean),E={type:"loaded",state:{url:o,params:c,branch:_,error:f,route:h,session_id:y},props:{components:v.map(P=>P.node.component)}};g!==void 0&&(E.props.form=g);let b={},w=!M;for(let P=0;P<v.length;P+=1){const D=v[P];b={...b,...D.data},(w||!r.branch.some(V=>V===D))&&(E.props[`data_${P}`]=b,w=w||Object.keys((T=D.data)!=null?T:{}).length>0)}if(w||(w=Object.keys(M.data).length!==Object.keys(b).length),!r.url||o.href!==r.url.href||r.error!==f||w){E.props.page={error:f,params:c,routeId:h&&h.id,status:l,url:o,data:w?b:M.data};const P=(D,V)=>{Object.defineProperty(E.props.page,D,{get:()=>{throw new Error(`$page.${D} has been replaced by $page.url.${V}`)}})};P("origin","origin"),P("path","pathname"),P("query","searchParams")}return E}async function de({loader:o,parent:c,url:_,params:l,routeId:f,server_data_node:h}){var b,w,k,T,P;let g=null;const v={dependencies:new Set,params:new Set,parent:!1,url:!1},E=await o();if((b=E.shared)!=null&&b.load){let D=function(...p){for(const R of p){const{href:S}=new URL(R,_);v.dependencies.add(S)}};const V={};for(const p in l)Object.defineProperty(V,p,{get(){return v.params.add(p),l[p]},enumerable:!0});const X={routeId:f,params:V,data:(w=h==null?void 0:h.data)!=null?w:null,url:ut(_,()=>{v.url=!0}),async fetch(p,R){let S;typeof p=="string"?S=p:(S=p.url,R={body:p.method==="GET"||p.method==="HEAD"?void 0:await p.blob(),cache:p.cache,credentials:p.credentials,headers:p.headers,integrity:p.integrity,keepalive:p.keepalive,method:p.method,mode:p.mode,redirect:p.redirect,referrer:p.referrer,referrerPolicy:p.referrerPolicy,signal:p.signal,...R});const O=new URL(S,_).href;return D(O),s?_t(O,R):mt(S,O,R)},setHeaders:()=>{},depends:D,parent(){return v.parent=!0,c()}};Object.defineProperties(X,{props:{get(){throw new Error("@migration task: Replace `props` with `data` stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1},session:{get(){throw new Error("session is no longer available. See https://github.com/sveltejs/kit/discussions/5883")},enumerable:!1},stuff:{get(){throw new Error("@migration task: Remove stuff https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693")},enumerable:!1}}),g=(k=await E.shared.load.call(null,X))!=null?k:null}return{node:E,loader:o,server:h,shared:(T=E.shared)!=null&&T.load?{type:"data",data:g,uses:v}:null,data:(P=g!=null?g:h==null?void 0:h.data)!=null?P:null}}function Ae(o,c,_){if(j)return!0;if(!_)return!1;if(_.parent&&c||o.url&&_.url)return!0;for(const l of o.params)if(_.params.has(l))return!0;for(const l of _.dependencies)if(i.some(f=>f(new URL(l))))return!0;return!1}function pe(o,c){var _,l;return(o==null?void 0:o.type)==="data"?{type:"data",data:o.data,uses:{dependencies:new Set((_=o.uses.dependencies)!=null?_:[]),params:new Set((l=o.uses.params)!=null?l:[]),parent:!!o.uses.parent,url:!!o.uses.url}}:(o==null?void 0:o.type)==="skip"&&c!=null?c:null}async function Te({id:o,invalidating:c,url:_,params:l,route:f}){var X;if(a.id===o&&a.promise)return a.promise;const{errors:h,layouts:g,leaf:v}=f,E=r.url&&{url:o!==r.url.pathname+r.url.search,params:Object.keys(l).filter(p=>r.params[p]!==l[p])},b=[...g,v];h.forEach(p=>p==null?void 0:p().catch(()=>{})),b.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let w=null;const k=b.reduce((p,R,S)=>{var G;const O=r.branch[S],re=!!(R!=null&&R[0])&&((O==null?void 0:O.loader)!==R[1]||Ae(E,p.some(Boolean),(G=O.server)==null?void 0:G.uses));return p.push(re),p},[]);if(k.some(Boolean)){try{w=await Ke(_,k)}catch(p){return oe({status:500,error:p,url:_,routeId:f.id})}if(w.type==="redirect")return w}const T=w==null?void 0:w.nodes;let P=!1;const D=b.map(async(p,R)=>{var G;if(!p)return;const S=r.branch[R],O=T==null?void 0:T[R];if((!O||O.type==="skip")&&p[1]===(S==null?void 0:S.loader)&&!Ae(E,P,(G=S.shared)==null?void 0:G.uses))return S;if(P=!0,(O==null?void 0:O.type)==="error")throw O;return de({loader:p[1],url:_,params:l,routeId:f.id,parent:async()=>{var je;const he={};for(let ge=0;ge<R;ge+=1)Object.assign(he,(je=await D[ge])==null?void 0:je.data);return he},server_data_node:pe(O===void 0&&p[0]?{type:"skip"}:O!=null?O:null,S==null?void 0:S.server)})});for(const p of D)p.catch(()=>{});const V=[];for(let p=0;p<b.length;p+=1)if(b[p])try{V.push(await D[p])}catch(R){if(R instanceof Be)return{type:"redirect",location:R.location};let S=500,O;for(T!=null&&T.includes(R)?(S=(X=R.status)!=null?X:S,O=R.error):R instanceof ye?(S=R.status,O=R.body):O=Fe(R,{params:l,url:_,routeId:f.id});p--;)if(h[p]){let re,G=p;for(;!V[G];)G-=1;try{return re={node:await h[p](),loader:h[p],data:{},server:null,shared:null},await ee({url:_,params:l,branch:V.slice(0,G+1).concat(re),status:S,error:O,route:f})}catch{continue}}await te(_);return}else V.push(void 0);return await ee({url:_,params:l,branch:V,status:200,error:null,route:f,form:c?void 0:null})}async function oe({status:o,error:c,url:_,routeId:l}){var b;const f={},h=await ke();let g=null;if(h.server)try{const w=await Ke(_,[!0]);if(w.type!=="data"||w.nodes[0]&&w.nodes[0].type!=="data")throw 0;g=(b=w.nodes[0])!=null?b:null}catch{await te(_);return}const v=await de({loader:ke,url:_,params:f,routeId:l,parent:()=>Promise.resolve({}),server_data_node:pe(g)}),E={node:await $e(),loader:$e,shared:null,server:null,data:null};return await ee({url:_,params:f,branch:[v,E],status:o,error:c instanceof ye?c.body:Fe(c,{url:_,params:f,routeId:null}),route:null})}function me(o,c){if(De(o))return;const _=decodeURI(o.pathname.slice(e.length)||"/");for(const l of ie){const f=l.exec(_);if(f){const h=new URL(o.origin+lt(o.pathname,t)+o.search+o.hash);return{id:h.pathname+h.search,invalidating:c,route:l,params:ct(f),url:h}}}}function De(o){return o.origin!==location.origin||!o.pathname.startsWith(e)}async function _e({url:o,scroll:c,keepfocus:_,redirect_chain:l,details:f,type:h,delta:g,accepted:v,blocked:E}){var P,D,V,X;let b=!1;const w=me(o,!1),k={from:se("from",{params:r.params,routeId:(D=(P=r.route)==null?void 0:P.id)!=null?D:null,url:r.url}),to:se("to",{params:(V=w==null?void 0:w.params)!=null?V:null,routeId:(X=w==null?void 0:w.route.id)!=null?X:null,url:o}),type:h};g!==void 0&&(k.delta=g);const T={...k,cancel:()=>{b=!0}};if(u.before_navigate.forEach(p=>p(T)),b){E();return}be(A),v(),s&&Q.navigating.set(k),await Se(w,o,l,{scroll:c,keepfocus:_,details:f},()=>{u.after_navigate.forEach(p=>p(k)),Q.navigating.set(null)})}function te(o){return location.href=o.href,new Promise(()=>{})}return{after_navigate:o=>{ve(()=>(u.after_navigate.push(o),()=>{const c=u.after_navigate.indexOf(o);u.after_navigate.splice(c,1)}))},before_navigate:o=>{ve(()=>(u.before_navigate.push(o),()=>{const c=u.before_navigate.indexOf(o);u.before_navigate.splice(c,1)}))},disable_scroll_handling:()=>{(m||!s)&&(d=!1)},goto:(o,c={})=>ue(o,c,[]),invalidate:o=>{if(o===void 0)throw new Error("`invalidate()` (with no arguments) has been replaced by `invalidateAll()`");if(typeof o=="function")i.push(o);else{const{href:c}=new URL(o,location.href);i.push(_=>_.href===c)}return Pe()},invalidateAll:()=>(j=!0,Pe()),prefetch:async o=>{const c=new URL(o,Ne(document));await Oe(c)},prefetch_routes:async o=>{const _=(o?ie.filter(l=>o.some(f=>l.exec(f))):ie).map(l=>Promise.all([...l.layouts,l.leaf].map(f=>f==null?void 0:f[1]())));await Promise.all(_)},apply_action:async o=>{if(o.type==="error"){const c=new URL(location.href),{branch:_,route:l}=r;if(!l)return;let f=r.branch.length;for(;f--;)if(l.errors[f]){let h,g=f;for(;!_[g];)g-=1;try{h={node:await l.errors[f](),loader:l.errors[f],data:{},server:null,shared:null};const v=await ee({url:c,params:r.params,branch:_.slice(0,g+1).concat(h),status:500,error:o.error,route:l});r=v.state;const E=le();$.$set(v.props),E();return}catch{continue}}}else if(o.type==="redirect")ue(o.location,{},[]);else{const c={form:o.data};o.status!==M.status&&(c.page={...M,status:o.status});const _=le();$.$set(c),_()}},_start_router:()=>{history.scrollRestoration="manual",addEventListener("beforeunload",l=>{var g,v;let f=!1;const h={from:se("from",{params:r.params,routeId:(v=(g=r.route)==null?void 0:g.id)!=null?v:null,url:r.url}),to:null,type:"unload",cancel:()=>f=!0};u.before_navigate.forEach(E=>E(h)),f?(l.preventDefault(),l.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){be(A);try{sessionStorage[Ge]=JSON.stringify(ne)}catch{}}});const o=l=>{const{url:f,options:h}=Ce(l);if(f&&h.prefetch){if(De(f))return;Oe(f)}};let c;const _=l=>{clearTimeout(c),c=setTimeout(()=>{var f;(f=l.target)==null||f.dispatchEvent(new CustomEvent("sveltekit:trigger_prefetch",{bubbles:!0}))},20)};addEventListener("touchstart",o),addEventListener("mousemove",_),addEventListener("sveltekit:trigger_prefetch",o),addEventListener("click",l=>{if(l.button||l.which!==1||l.metaKey||l.ctrlKey||l.shiftKey||l.altKey||l.defaultPrevented)return;const{a:f,url:h,options:g}=Ce(l);if(!f||!h)return;const v=f instanceof SVGAElement;if(!v&&!(h.protocol==="https:"||h.protocol==="http:"))return;const E=(f.getAttribute("rel")||"").split(/\s+/);if(f.hasAttribute("download")||E.includes("external")||g.reload||(v?f.target.baseVal:f.target))return;const[b,w]=h.href.split("#");if(w!==void 0&&b===location.href.split("#")[0]){H=!0,be(A),r.url=h,Q.page.set({...M,url:h}),Q.page.notify();return}_e({url:h,scroll:g.noscroll?Ee():null,keepfocus:!1,redirect_chain:[],details:{state:{},replaceState:h.href===location.href},accepted:()=>l.preventDefault(),blocked:()=>l.preventDefault(),type:"link"})}),addEventListener("popstate",l=>{if(l.state){if(l.state[Y]===A)return;const f=l.state[Y]-A;_e({url:new URL(location.href),scroll:ne[l.state[Y]],keepfocus:!1,redirect_chain:[],details:null,accepted:()=>{A=l.state[Y]},blocked:()=>{history.go(-f)},type:"popstate",delta:f})}}),addEventListener("hashchange",()=>{H&&(H=!1,history.replaceState({...history.state,[Y]:++A},"",location.href))});for(const l of document.querySelectorAll("link"))l.rel==="icon"&&(l.href=l.href);addEventListener("pageshow",l=>{l.persisted&&Q.navigating.set(null)})},_hydrate:async({status:o,error:c,node_ids:_,params:l,routeId:f,data:h,form:g})=>{var b;const v=new URL(location.href);let E;try{const w=_.map(async(k,T)=>{const P=h[T];return de({loader:fe[k],url:v,params:l,routeId:f,parent:async()=>{const D={};for(let V=0;V<T;V+=1)Object.assign(D,(await w[V]).data);return D},server_data_node:pe(P)})});E=await ee({url:v,params:l,branch:await Promise.all(w),status:o,error:c,form:g,route:(b=ie.find(k=>k.id===f))!=null?b:null})}catch(w){const k=w;if(k instanceof Be){await te(new URL(w.location,location.href));return}E=await oe({status:k instanceof ye?k.status:500,error:k,url:v,routeId:f})}Ie(E)}}}let Ut=1;async function Ke(n,e){const t=new URL(n);t.pathname=n.pathname.replace(/\/$/,"")+Vt,t.searchParams.set("__invalid",e.map(a=>a?"y":"n").join("")),t.searchParams.set("__id",String(Ut++)),await I(()=>import(t.href),[],import.meta.url);const i=window.__sveltekit_data;return delete window.__sveltekit_data,i}function Fe(n,e){var t;return(t=Dt.handleError({error:n,event:e}))!=null?t:{message:"Internal Error"}}const Nt=["hash","href","host","hostname","origin","pathname","port","protocol","search","searchParams","toString","toJSON"];function se(n,e){for(const t of Nt)Object.defineProperty(e,t,{get(){throw new Error(`The navigation shape changed - ${n}.${t} should now be ${n}.url.${t}`)}});return e}function le(){return()=>{}}async function Bt({env:n,hydrate:e,paths:t,target:i,trailing_slash:a}){at(t);const u=jt({target:i,base:t.base,trailing_slash:a});ot({client:u}),e?await u._hydrate(e):u.goto(location.href,{replaceState:!0}),u._start_router()}export{Bt as start};
