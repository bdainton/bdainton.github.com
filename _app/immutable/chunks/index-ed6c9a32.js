function P(){}function rt(t,e){for(const n in e)t[n]=e[n];return t}function K(t){return t()}function F(){return Object.create(null)}function v(t){t.forEach(K)}function lt(t){return typeof t=="function"}function Tt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let E;function Et(t,e){return E||(E=document.createElement("a")),E.href=e,t===E.href}function ct(t){return Object.keys(t).length===0}function ot(t,...e){if(t==null)return P;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Nt(t,e,n){t.$$.on_destroy.push(ot(e,n))}function At(t,e,n,i){if(t){const s=Q(t,e,n,i);return t[0](s)}}function Q(t,e,n,i){return t[1]&&i?rt(n.ctx.slice(),t[1](i(e))):n.ctx}function St(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const a=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)a[o]=e.dirty[o]|s[o];return a}return e.dirty|s}return e.dirty}function Mt(t,e,n,i,s,a){if(s){const r=Q(e,n,i,a);t.p(r,s)}}function kt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}let k=!1;function at(){k=!0}function ut(){k=!1}function ft(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function dt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let c=0;c<e.length;c++){const f=e[c];f.claim_order!==void 0&&l.push(f)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let l=0;l<e.length;l++){const c=e[l].claim_order,f=(s>0&&e[n[s]].claim_order<=c?s+1:ft(1,s,d=>e[n[d]].claim_order,c))-1;i[l]=n[f]+1;const _=f+1;n[_]=l,s=Math.max(_,s)}const a=[],r=[];let o=e.length-1;for(let l=n[s]+1;l!=0;l=i[l-1]){for(a.push(e[l-1]);o>=l;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);a.reverse(),r.sort((l,c)=>l.claim_order-c.claim_order);for(let l=0,c=0;l<r.length;l++){for(;c<a.length&&r[l].claim_order>=a[c].claim_order;)c++;const f=c<a.length?a[c]:null;t.insertBefore(r[l],f)}}function _t(t,e){if(k){for(dt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function ht(t,e,n){t.insertBefore(e,n||null)}function mt(t,e,n){k&&!n?_t(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function M(t){t.parentNode.removeChild(t)}function jt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function U(t){return document.createElement(t)}function V(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function D(t){return document.createTextNode(t)}function Ht(){return D(" ")}function Lt(){return D("")}function Ct(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function qt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function pt(t){return Array.from(t.childNodes)}function X(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function Y(t,e,n,i,s=!1){X(t);const a=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const l=n(o);return l===void 0?t.splice(r,1):t[r]=l,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const l=n(o);return l===void 0?t.splice(r,1):t[r]=l,s?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return a.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,a}function Z(t,e,n,i){return Y(t,s=>s.nodeName===e,s=>{const a=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||a.push(o.name)}a.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Bt(t,e,n){return Z(t,e,n,U)}function Ot(t,e,n){return Z(t,e,n,V)}function yt(t,e){return Y(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>D(e),!0)}function Pt(t){return yt(t," ")}function I(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function Dt(t,e){const n=I(t,"HTML_TAG_START",0),i=I(t,"HTML_TAG_END",n);if(n===i)return new R(void 0,e);X(t);const s=t.splice(n,i-n+1);M(s[0]),M(s[s.length-1]);const a=s.slice(1,s.length-1);for(const r of a)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new R(a,e)}function Gt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function zt(t,e){t.value=e==null?"":e}function Ft(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function It(t,e,n){t.classList[n?"add":"remove"](e)}function Rt(t,e=document.body){return Array.from(e.querySelectorAll(t))}class gt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=V(n.nodeName):this.e=U(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)ht(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(M)}}class R extends gt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)mt(this.t,this.n[n],e)}}let w;function b(t){w=t}function tt(){if(!w)throw new Error("Function called outside component initialization");return w}function Wt(t){tt().$$.on_mount.push(t)}function Jt(t){tt().$$.after_update.push(t)}const x=[],W=[],A=[],J=[],et=Promise.resolve();let B=!1;function nt(){B||(B=!0,et.then(it))}function Kt(){return nt(),et}function O(t){A.push(t)}const q=new Set;let N=0;function it(){const t=w;do{for(;N<x.length;){const e=x[N];N++,b(e),xt(e.$$)}for(b(null),x.length=0,N=0;W.length;)W.pop()();for(let e=0;e<A.length;e+=1){const n=A[e];q.has(n)||(q.add(n),n())}A.length=0}while(x.length);for(;J.length;)J.pop()();B=!1,q.clear(),b(t)}function xt(t){if(t.fragment!==null){t.update(),v(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(O)}}const S=new Set;let g;function Qt(){g={r:0,c:[],p:g}}function Ut(){g.r||v(g.c),g=g.p}function st(t,e){t&&t.i&&(S.delete(t),t.i(e))}function bt(t,e,n,i){if(t&&t.o){if(S.has(t))return;S.add(t),g.c.push(()=>{S.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Vt=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function Xt(t,e){t.d(1),e.delete(t.key)}function Yt(t,e){bt(t,1,1,()=>{e.delete(t.key)})}function Zt(t,e,n,i,s,a,r,o,l,c,f,_){let d=t.length,m=a.length,h=d;const j={};for(;h--;)j[t[h].key]=h;const $=[],H=new Map,L=new Map;for(h=m;h--;){const u=_(s,a,h),p=n(u);let y=r.get(p);y?i&&y.p(u,e):(y=c(p,u),y.c()),H.set(p,$[h]=y),p in j&&L.set(p,Math.abs(h-j[p]))}const G=new Set,z=new Set;function C(u){st(u,1),u.m(o,f),r.set(u.key,u),f=u.first,m--}for(;d&&m;){const u=$[m-1],p=t[d-1],y=u.key,T=p.key;u===p?(f=u.first,d--,m--):H.has(T)?!r.has(y)||G.has(y)?C(u):z.has(T)?d--:L.get(y)>L.get(T)?(z.add(y),C(u)):(G.add(T),d--):(l(p,r),d--)}for(;d--;){const u=t[d];H.has(u.key)||l(u,r)}for(;m;)C($[m-1]);return $}function te(t){t&&t.c()}function ee(t,e){t&&t.l(e)}function wt(t,e,n,i){const{fragment:s,on_mount:a,on_destroy:r,after_update:o}=t.$$;s&&s.m(e,n),i||O(()=>{const l=a.map(K).filter(lt);r?r.push(...l):v(l),t.$$.on_mount=[]}),o.forEach(O)}function vt(t,e){const n=t.$$;n.fragment!==null&&(v(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function $t(t,e){t.$$.dirty[0]===-1&&(x.push(t),nt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ne(t,e,n,i,s,a,r,o=[-1]){const l=w;b(t);const c=t.$$={fragment:null,ctx:null,props:a,update:P,not_equal:s,bound:F(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:F(),dirty:o,skip_bound:!1,root:e.target||l.$$.root};r&&r(c.root);let f=!1;if(c.ctx=n?n(t,e.props||{},(_,d,...m)=>{const h=m.length?m[0]:d;return c.ctx&&s(c.ctx[_],c.ctx[_]=h)&&(!c.skip_bound&&c.bound[_]&&c.bound[_](h),f&&$t(t,_)),d}):[],c.update(),f=!0,v(c.before_update),c.fragment=i?i(c.ctx):!1,e.target){if(e.hydrate){at();const _=pt(e.target);c.fragment&&c.fragment.l(_),_.forEach(M)}else c.fragment&&c.fragment.c();e.intro&&st(t.$$.fragment),wt(t,e.target,e.anchor,e.customElement),ut(),it()}b(l)}class ie{$destroy(){vt(this,1),this.$destroy=P}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!ct(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{P as A,V as B,Ot as C,_t as D,Ct as E,v as F,At as G,Et as H,Mt as I,kt as J,St as K,Nt as L,Rt as M,Zt as N,Yt as O,jt as P,It as Q,Xt as R,ie as S,zt as T,R as U,Dt as V,lt as W,Vt as X,Ht as a,mt as b,Pt as c,Ut as d,Lt as e,st as f,Qt as g,M as h,ne as i,Jt as j,U as k,Bt as l,pt as m,qt as n,Wt as o,Ft as p,D as q,yt as r,Tt as s,bt as t,Gt as u,te as v,ee as w,wt as x,vt as y,Kt as z};
