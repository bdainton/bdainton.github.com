function j(){}function at(t,e){for(const n in e)t[n]=e[n];return t}function Q(t){return t()}function I(){return Object.create(null)}function $(t){t.forEach(Q)}function ut(t){return typeof t=="function"}function Tt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let N;function kt(t,e){return N||(N=document.createElement("a")),N.href=e,t===N.href}function ft(t){return Object.keys(t).length===0}function dt(t,...e){if(t==null)return j;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Mt(t,e,n){t.$$.on_destroy.push(dt(e,n))}function jt(t,e,n,i){if(t){const r=U(t,e,n,i);return t[0](r)}}function U(t,e,n,i){return t[1]&&i?at(n.ctx.slice(),t[1](i(e))):n.ctx}function Ht(t,e,n,i){if(t[2]&&i){const r=t[2](i(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const a=[],s=Math.max(e.dirty.length,r.length);for(let o=0;o<s;o+=1)a[o]=e.dirty[o]|r[o];return a}return e.dirty|r}return e.dirty}function Lt(t,e,n,i,r,a){if(r){const s=U(e,n,i,a);t.p(s,r)}}function qt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}const V=typeof window<"u";let Ct=V?()=>window.performance.now():()=>Date.now(),X=V?t=>requestAnimationFrame(t):j;const w=new Set;function Y(t){w.forEach(e=>{e.c(t)||(w.delete(e),e.f())}),w.size!==0&&X(Y)}function Bt(t){let e;return w.size===0&&X(Y),{promise:new Promise(n=>{w.add(e={c:t,f:n})}),abort(){w.delete(e)}}}let H=!1;function _t(){H=!0}function ht(){H=!1}function mt(t,e,n,i){for(;t<e;){const r=t+(e-t>>1);n(r)<=i?t=r+1:e=r}return t}function pt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const l=[];for(let c=0;c<e.length;c++){const f=e[c];f.claim_order!==void 0&&l.push(f)}e=l}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let r=0;for(let l=0;l<e.length;l++){const c=e[l].claim_order,f=(r>0&&e[n[r]].claim_order<=c?r+1:mt(1,r,d=>e[n[d]].claim_order,c))-1;i[l]=n[f]+1;const _=f+1;n[_]=l,r=Math.max(_,r)}const a=[],s=[];let o=e.length-1;for(let l=n[r]+1;l!=0;l=i[l-1]){for(a.push(e[l-1]);o>=l;o--)s.push(e[o]);o--}for(;o>=0;o--)s.push(e[o]);a.reverse(),s.sort((l,c)=>l.claim_order-c.claim_order);for(let l=0,c=0;l<s.length;l++){for(;c<a.length&&s[l].claim_order>=a[c].claim_order;)c++;const f=c<a.length?a[c]:null;t.insertBefore(s[l],f)}}function yt(t,e){if(H){for(pt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function gt(t,e,n){t.insertBefore(e,n||null)}function wt(t,e,n){H&&!n?yt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function M(t){t.parentNode.removeChild(t)}function Pt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Z(t){return document.createElement(t)}function tt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function O(t){return document.createTextNode(t)}function zt(){return O(" ")}function Dt(){return O("")}function Ot(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Ft(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function xt(t){return Array.from(t.childNodes)}function et(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function nt(t,e,n,i,r=!1){et(t);const a=(()=>{for(let s=t.claim_info.last_index;s<t.length;s++){const o=t[s];if(e(o)){const l=n(o);return l===void 0?t.splice(s,1):t[s]=l,r||(t.claim_info.last_index=s),o}}for(let s=t.claim_info.last_index-1;s>=0;s--){const o=t[s];if(e(o)){const l=n(o);return l===void 0?t.splice(s,1):t[s]=l,r?l===void 0&&t.claim_info.last_index--:t.claim_info.last_index=s,o}}return i()})();return a.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,a}function it(t,e,n,i){return nt(t,r=>r.nodeName===e,r=>{const a=[];for(let s=0;s<r.attributes.length;s++){const o=r.attributes[s];n[o.name]||a.push(o.name)}a.forEach(s=>r.removeAttribute(s))},()=>i(e))}function Gt(t,e,n){return it(t,e,n,Z)}function It(t,e,n){return it(t,e,n,tt)}function bt(t,e){return nt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>O(e),!0)}function Rt(t){return bt(t," ")}function R(t,e,n){for(let i=n;i<t.length;i+=1){const r=t[i];if(r.nodeType===8&&r.textContent.trim()===e)return i}return t.length}function Wt(t,e){const n=R(t,"HTML_TAG_START",0),i=R(t,"HTML_TAG_END",n);if(n===i)return new W(void 0,e);et(t);const r=t.splice(n,i-n+1);M(r[0]),M(r[r.length-1]);const a=r.slice(1,r.length-1);for(const s of a)s.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new W(a,e)}function Jt(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Kt(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Qt(t,e,n){t.classList[n?"add":"remove"](e)}function Ut(t,e=document.body){return Array.from(e.querySelectorAll(t))}class vt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=tt(n.nodeName):this.e=Z(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)gt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(M)}}class W extends vt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)wt(this.t,this.n[n],e)}}let v;function b(t){v=t}function rt(){if(!v)throw new Error("Function called outside component initialization");return v}function Vt(t){rt().$$.on_mount.push(t)}function Xt(t){rt().$$.after_update.push(t)}const x=[],J=[],T=[],K=[],st=Promise.resolve();let z=!1;function lt(){z||(z=!0,st.then(ct))}function Yt(){return lt(),st}function D(t){T.push(t)}const P=new Set;let S=0;function ct(){const t=v;do{for(;S<x.length;){const e=x[S];S++,b(e),$t(e.$$)}for(b(null),x.length=0,S=0;J.length;)J.pop()();for(let e=0;e<T.length;e+=1){const n=T[e];P.has(n)||(P.add(n),n())}T.length=0}while(x.length);for(;K.length;)K.pop()();z=!1,P.clear(),b(t)}function $t(t){if(t.fragment!==null){t.update(),$(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(D)}}const k=new Set;let g;function Zt(){g={r:0,c:[],p:g}}function te(){g.r||$(g.c),g=g.p}function ot(t,e){t&&t.i&&(k.delete(t),t.i(e))}function Et(t,e,n,i){if(t&&t.o){if(k.has(t))return;k.add(t),g.c.push(()=>{k.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function ee(t,e){t.d(1),e.delete(t.key)}function ne(t,e){Et(t,1,1,()=>{e.delete(t.key)})}function ie(t,e,n,i,r,a,s,o,l,c,f,_){let d=t.length,m=a.length,h=d;const L={};for(;h--;)L[t[h].key]=h;const E=[],q=new Map,C=new Map;for(h=m;h--;){const u=_(r,a,h),p=n(u);let y=s.get(p);y?i&&y.p(u,e):(y=c(p,u),y.c()),q.set(p,E[h]=y),p in L&&C.set(p,Math.abs(h-L[p]))}const F=new Set,G=new Set;function B(u){ot(u,1),u.m(o,f),s.set(u.key,u),f=u.first,m--}for(;d&&m;){const u=E[m-1],p=t[d-1],y=u.key,A=p.key;u===p?(f=u.first,d--,m--):q.has(A)?!s.has(y)||F.has(y)?B(u):G.has(A)?d--:C.get(y)>C.get(A)?(G.add(y),B(u)):(F.add(A),d--):(l(p,s),d--)}for(;d--;){const u=t[d];q.has(u.key)||l(u,s)}for(;m;)B(E[m-1]);return E}function re(t){t&&t.c()}function se(t,e){t&&t.l(e)}function At(t,e,n,i){const{fragment:r,on_mount:a,on_destroy:s,after_update:o}=t.$$;r&&r.m(e,n),i||D(()=>{const l=a.map(Q).filter(ut);s?s.push(...l):$(l),t.$$.on_mount=[]}),o.forEach(D)}function Nt(t,e){const n=t.$$;n.fragment!==null&&($(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function St(t,e){t.$$.dirty[0]===-1&&(x.push(t),lt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function le(t,e,n,i,r,a,s,o=[-1]){const l=v;b(t);const c=t.$$={fragment:null,ctx:null,props:a,update:j,not_equal:r,bound:I(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(l?l.$$.context:[])),callbacks:I(),dirty:o,skip_bound:!1,root:e.target||l.$$.root};s&&s(c.root);let f=!1;if(c.ctx=n?n(t,e.props||{},(_,d,...m)=>{const h=m.length?m[0]:d;return c.ctx&&r(c.ctx[_],c.ctx[_]=h)&&(!c.skip_bound&&c.bound[_]&&c.bound[_](h),f&&St(t,_)),d}):[],c.update(),f=!0,$(c.before_update),c.fragment=i?i(c.ctx):!1,e.target){if(e.hydrate){_t();const _=xt(e.target);c.fragment&&c.fragment.l(_),_.forEach(M)}else c.fragment&&c.fragment.c();e.intro&&ot(t.$$.fragment),At(t,e.target,e.anchor,e.customElement),ht(),ct()}b(l)}class ce{$destroy(){Nt(this,1),this.$destroy=j}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!ft(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{j as A,jt as B,Lt as C,qt as D,Ht as E,yt as F,Mt as G,Ot as H,$ as I,kt as J,tt as K,It as L,Ut as M,ie as N,ne as O,Pt as P,Qt as Q,W as R,ce as S,Wt as T,ee as U,Ct as V,Bt as W,zt as a,wt as b,Rt as c,te as d,Dt as e,ot as f,Zt as g,M as h,le as i,Xt as j,Z as k,Gt as l,xt as m,Ft as n,Vt as o,Kt as p,O as q,bt as r,Tt as s,Et as t,Jt as u,re as v,se as w,At as x,Nt as y,Yt as z};