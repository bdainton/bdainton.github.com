function P(){}function Z(e,t){for(const n in t)e[n]=t[n];return e}function J(e){return e()}function H(){return Object.create(null)}function $(e){e.forEach(J)}function ee(e){return typeof e=="function"}function be(e,t){return e!=e?t==t:e!==t||e&&typeof e=="object"||typeof e=="function"}let S;function xe(e,t){return S||(S=document.createElement("a")),S.href=t,e===S.href}function te(e){return Object.keys(e).length===0}function ne(e,...t){if(e==null)return P;const n=e.subscribe(...t);return n.unsubscribe?()=>n.unsubscribe():n}function we(e,t,n){e.$$.on_destroy.push(ne(t,n))}function $e(e,t,n,i){if(e){const r=K(e,t,n,i);return e[0](r)}}function K(e,t,n,i){return e[1]&&i?Z(n.ctx.slice(),e[1](i(t))):n.ctx}function ve(e,t,n,i){if(e[2]&&i){const r=e[2](i(n));if(t.dirty===void 0)return r;if(typeof r=="object"){const u=[],l=Math.max(t.dirty.length,r.length);for(let o=0;o<l;o+=1)u[o]=t.dirty[o]|r[o];return u}return t.dirty|r}return t.dirty}function Ee(e,t,n,i,r,u){if(r){const l=K(t,n,i,u);e.p(l,r)}}function Se(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let i=0;i<n;i++)t[i]=-1;return t}return-1}let M=!1;function ie(){M=!0}function re(){M=!1}function le(e,t,n,i){for(;e<t;){const r=e+(t-e>>1);n(r)<=i?e=r+1:t=r}return e}function ce(e){if(e.hydrate_init)return;e.hydrate_init=!0;let t=e.childNodes;if(e.nodeName==="HEAD"){const c=[];for(let s=0;s<t.length;s++){const f=t[s];f.claim_order!==void 0&&c.push(f)}t=c}const n=new Int32Array(t.length+1),i=new Int32Array(t.length);n[0]=-1;let r=0;for(let c=0;c<t.length;c++){const s=t[c].claim_order,f=(r>0&&t[n[r]].claim_order<=s?r+1:le(1,r,d=>t[n[d]].claim_order,s))-1;i[c]=n[f]+1;const _=f+1;n[_]=c,r=Math.max(_,r)}const u=[],l=[];let o=t.length-1;for(let c=n[r]+1;c!=0;c=i[c-1]){for(u.push(t[c-1]);o>=c;o--)l.push(t[o]);o--}for(;o>=0;o--)l.push(t[o]);u.reverse(),l.sort((c,s)=>c.claim_order-s.claim_order);for(let c=0,s=0;c<l.length;c++){for(;s<u.length&&l[c].claim_order>=u[s].claim_order;)s++;const f=s<u.length?u[s]:null;e.insertBefore(l[c],f)}}function se(e,t){if(M){for(ce(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;t!==e.actual_end_child?(t.claim_order!==void 0||t.parentNode!==e)&&e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling}else(t.parentNode!==e||t.nextSibling!==null)&&e.appendChild(t)}function Ne(e,t,n){M&&!n?se(e,t):(t.parentNode!==e||t.nextSibling!=n)&&e.insertBefore(t,n||null)}function oe(e){e.parentNode.removeChild(e)}function ue(e){return document.createElement(e)}function ae(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function z(e){return document.createTextNode(e)}function Ae(){return z(" ")}function ke(){return z("")}function Me(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function je(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function fe(e){return Array.from(e.childNodes)}function de(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function Q(e,t,n,i,r=!1){de(e);const u=(()=>{for(let l=e.claim_info.last_index;l<e.length;l++){const o=e[l];if(t(o)){const c=n(o);return c===void 0?e.splice(l,1):e[l]=c,r||(e.claim_info.last_index=l),o}}for(let l=e.claim_info.last_index-1;l>=0;l--){const o=e[l];if(t(o)){const c=n(o);return c===void 0?e.splice(l,1):e[l]=c,r?c===void 0&&e.claim_info.last_index--:e.claim_info.last_index=l,o}}return i()})();return u.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,u}function W(e,t,n,i){return Q(e,r=>r.nodeName===t,r=>{const u=[];for(let l=0;l<r.attributes.length;l++){const o=r.attributes[l];n[o.name]||u.push(o.name)}u.forEach(l=>r.removeAttribute(l))},()=>i(t))}function qe(e,t,n){return W(e,t,n,ue)}function Ce(e,t,n){return W(e,t,n,ae)}function _e(e,t){return Q(e,n=>n.nodeType===3,n=>{const i=""+t;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>z(t),!0)}function Te(e){return _e(e," ")}function Be(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function Le(e,t,n,i){n===null?e.style.removeProperty(t):e.style.setProperty(t,n,i?"important":"")}function Oe(e,t=document.body){return Array.from(t.querySelectorAll(e))}let w;function x(e){w=e}function R(){if(!w)throw new Error("Function called outside component initialization");return w}function Pe(e){R().$$.on_mount.push(e)}function ze(e){R().$$.after_update.push(e)}const b=[],I=[],A=[],G=[],U=Promise.resolve();let L=!1;function V(){L||(L=!0,U.then(X))}function De(){return V(),U}function O(e){A.push(e)}const B=new Set;let N=0;function X(){const e=w;do{for(;N<b.length;){const t=b[N];N++,x(t),he(t.$$)}for(x(null),b.length=0,N=0;I.length;)I.pop()();for(let t=0;t<A.length;t+=1){const n=A[t];B.has(n)||(B.add(n),n())}A.length=0}while(b.length);for(;G.length;)G.pop()();L=!1,B.clear(),x(e)}function he(e){if(e.fragment!==null){e.update(),$(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(O)}}const k=new Set;let g;function Fe(){g={r:0,c:[],p:g}}function He(){g.r||$(g.c),g=g.p}function Y(e,t){e&&e.i&&(k.delete(e),e.i(t))}function me(e,t,n,i){if(e&&e.o){if(k.has(e))return;k.add(e),g.c.push(()=>{k.delete(e),i&&(n&&e.d(1),i())}),e.o(t)}else i&&i()}const Ie=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;function Ge(e,t){me(e,1,1,()=>{t.delete(e.key)})}function Je(e,t,n,i,r,u,l,o,c,s,f,_){let d=e.length,m=u.length,h=d;const j={};for(;h--;)j[e[h].key]=h;const v=[],q=new Map,C=new Map;for(h=m;h--;){const a=_(r,u,h),p=n(a);let y=l.get(p);y?i&&y.p(a,t):(y=s(p,a),y.c()),q.set(p,v[h]=y),p in j&&C.set(p,Math.abs(h-j[p]))}const D=new Set,F=new Set;function T(a){Y(a,1),a.m(o,f),l.set(a.key,a),f=a.first,m--}for(;d&&m;){const a=v[m-1],p=e[d-1],y=a.key,E=p.key;a===p?(f=a.first,d--,m--):q.has(E)?!l.has(y)||D.has(y)?T(a):F.has(E)?d--:C.get(y)>C.get(E)?(F.add(y),T(a)):(D.add(E),d--):(c(p,l),d--)}for(;d--;){const a=e[d];q.has(a.key)||c(a,l)}for(;m;)T(v[m-1]);return v}function Ke(e){e&&e.c()}function Qe(e,t){e&&e.l(t)}function pe(e,t,n,i){const{fragment:r,on_mount:u,on_destroy:l,after_update:o}=e.$$;r&&r.m(t,n),i||O(()=>{const c=u.map(J).filter(ee);l?l.push(...c):$(c),e.$$.on_mount=[]}),o.forEach(O)}function ye(e,t){const n=e.$$;n.fragment!==null&&($(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function ge(e,t){e.$$.dirty[0]===-1&&(b.push(e),V(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function We(e,t,n,i,r,u,l,o=[-1]){const c=w;x(e);const s=e.$$={fragment:null,ctx:null,props:u,update:P,not_equal:r,bound:H(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(c?c.$$.context:[])),callbacks:H(),dirty:o,skip_bound:!1,root:t.target||c.$$.root};l&&l(s.root);let f=!1;if(s.ctx=n?n(e,t.props||{},(_,d,...m)=>{const h=m.length?m[0]:d;return s.ctx&&r(s.ctx[_],s.ctx[_]=h)&&(!s.skip_bound&&s.bound[_]&&s.bound[_](h),f&&ge(e,_)),d}):[],s.update(),f=!0,$(s.before_update),s.fragment=i?i(s.ctx):!1,t.target){if(t.hydrate){ie();const _=fe(t.target);s.fragment&&s.fragment.l(_),_.forEach(oe)}else s.fragment&&s.fragment.c();t.intro&&Y(e.$$.fragment),pe(e,t.target,t.anchor,t.customElement),re(),X()}x(c)}class Re{$destroy(){ye(this,1),this.$destroy=P}$on(t,n){const i=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(t){this.$$set&&!te(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}export{P as A,ae as B,Ce as C,se as D,Me as E,$ as F,$e as G,xe as H,Ee as I,Se as J,ve as K,we as L,Oe as M,ee as N,Je as O,Ie as P,Ge as Q,Re as S,Ae as a,Ne as b,Te as c,He as d,ke as e,Y as f,Fe as g,oe as h,We as i,ze as j,ue as k,qe as l,fe as m,je as n,Pe as o,Le as p,z as q,_e as r,be as s,me as t,Be as u,Ke as v,Qe as w,pe as x,ye as y,De as z};
