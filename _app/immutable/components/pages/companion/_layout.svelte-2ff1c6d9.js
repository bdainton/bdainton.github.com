import{S as se,i as ae,s as ne,k as g,v as G,a as y,q as oe,l as w,m as b,w as H,c as A,r as le,h as _,n as c,b as re,F as i,x as L,H as ee,u as ce,f as q,t as B,y as R,I as fe,B as me,J as ue,C as he,D as de,E as _e,G as ve}from"../../../chunks/index-6ebe39d3.js";/* empty css                          */import{I as ie}from"../../../chunks/Icon-ccb7d9ae.js";import{p as pe}from"../../../chunks/stores-68433f7f.js";function ge(s){let e,t,o,h,u,l,d,k,f,N,v;return o=new ie({props:{name:s[0],classNames:"",stroke:s[4],strokeWidth:"2"}}),{c(){e=g("div"),t=g("a"),G(o.$$.fragment),h=y(),u=g("p"),l=oe(s[1]),this.h()},l(r){e=w(r,"DIV",{class:!0});var m=b(e);t=w(m,"A",{href:!0,class:!0});var n=b(t);H(o.$$.fragment,n),h=A(n),u=w(n,"P",{class:!0});var I=b(u);l=le(I,s[1]),I.forEach(_),n.forEach(_),m.forEach(_),this.h()},h(){c(u,"class","p-0 pl-2 small-caps"),c(t,"href",s[2]),c(t,"class",d="flex flex-row justify-items-start items-center p-0 text-lg text-"+s[5]+" hover:text-red100"),c(e,"class",k="flex flex-row justify-items-start items-center mx-3 "+s[3])},m(r,m){re(r,e,m),i(e,t),L(o,t,null),i(t,h),i(t,u),i(u,l),f=!0,N||(v=[ee(e,"mouseover",s[9]),ee(e,"mouseout",s[10])],N=!0)},p(r,[m]){const n={};m&1&&(n.name=r[0]),m&16&&(n.stroke=r[4]),o.$set(n),(!f||m&2)&&ce(l,r[1]),(!f||m&4)&&c(t,"href",r[2]),(!f||m&32&&d!==(d="flex flex-row justify-items-start items-center p-0 text-lg text-"+r[5]+" hover:text-red100"))&&c(t,"class",d),(!f||m&8&&k!==(k="flex flex-row justify-items-start items-center mx-3 "+r[3]))&&c(e,"class",k)},i(r){f||(q(o.$$.fragment,r),f=!0)},o(r){B(o.$$.fragment,r),f=!1},d(r){r&&_(e),R(o),N=!1,fe(v)}}}let te="#575757",we="charcoal",P="#D20000",Ee="red100";function be(s,e,t){let o,h,{active:u}=e,{iconName:l}=e,{title:d}=e,{path:k}=e,{classes:f}=e;function N(n){t(4,o=P)}function v(n){t(4,o=u?P:te)}const r=()=>N(),m=()=>v();return s.$$set=n=>{"active"in n&&t(8,u=n.active),"iconName"in n&&t(0,l=n.iconName),"title"in n&&t(1,d=n.title),"path"in n&&t(2,k=n.path),"classes"in n&&t(3,f=n.classes)},s.$$.update=()=>{s.$$.dirty&256&&t(4,o=u?P:te),s.$$.dirty&256&&t(5,h=u?Ee:we)},[l,d,k,f,o,h,N,v,u,r,m]}class T extends se{constructor(e){super(),ae(this,e,be,ge,ne,{active:8,iconName:0,title:1,path:2,classes:3})}}function ke(s){let e,t,o,h,u,l,d,k,f,N,v,r,m,n,I,j,C,V,K,W,M,x,z,O;h=new ie({props:{name:"framework",classNames:"w-12 h-12",stroke:"#000000",strokeWidth:.5}}),d=new T({props:{path:"/companion/lessons",iconName:"lessons",title:"Lessons",active:s[0].url.pathname.includes("/companion/lessons")}}),f=new T({props:{path:"/companion/coaching",iconName:"coaching",title:"Coaching",active:s[0].url.pathname.includes("/companion/coaching")}}),v=new T({props:{path:"/companion/books",classes:"",iconName:"books",title:"Books",active:s[0].url.pathname.includes("/companion/books")}});const J=s[2].default,E=me(J,s,s[1],null);return{c(){e=g("div"),t=g("header"),o=g("a"),G(h.$$.fragment),u=y(),l=g("div"),G(d.$$.fragment),k=y(),G(f.$$.fragment),N=y(),G(v.$$.fragment),r=y(),m=g("main"),E&&E.c(),n=y(),I=g("footer"),j=g("div"),C=g("a"),V=g("img"),W=y(),M=g("div"),x=g("a"),z=oe("\u{1F64F}"),this.h()},l(a){e=w(a,"DIV",{class:!0});var p=b(e);t=w(p,"HEADER",{class:!0});var D=b(t);o=w(D,"A",{href:!0});var F=b(o);H(h.$$.fragment,F),F.forEach(_),u=A(D),l=w(D,"DIV",{class:!0});var $=b(l);H(d.$$.fragment,$),k=A($),H(f.$$.fragment,$),N=A($),H(v.$$.fragment,$),$.forEach(_),D.forEach(_),r=A(p),m=w(p,"MAIN",{class:!0});var Q=b(m);E&&E.l(Q),Q.forEach(_),n=A(p),I=w(p,"FOOTER",{class:!0});var S=b(I);j=w(S,"DIV",{class:!0});var U=b(j);C=w(U,"A",{class:!0,href:!0});var X=b(C);V=w(X,"IMG",{class:!0,src:!0}),X.forEach(_),U.forEach(_),W=A(S),M=w(S,"DIV",{class:!0});var Y=b(M);x=w(Y,"A",{class:!0,href:!0});var Z=b(x);z=le(Z,"\u{1F64F}"),Z.forEach(_),Y.forEach(_),S.forEach(_),p.forEach(_),this.h()},h(){c(o,"href","/companion"),c(l,"class","mx-auto flex flex-row"),c(t,"class","sticky top-0 min-w-fit z-50 flex flex-row bg-white p-4 shadow-xl"),c(m,"class","relative"),c(V,"class","h-8"),ue(V.src,K="/img/bd-logo.png")||c(V,"src",K),c(C,"class","rounded-full p-4 bg-offwhite hover:bg-white hover:shadow-xl"),c(C,"href","/"),c(j,"class","mx-auto flex justify-center"),c(x,"class","rounded p-2 bg-offwhite hover:bg-white hover:shadow-xl"),c(x,"href","/companion/thanks"),c(M,"class","fixed bottom-0 right-0"),c(I,"class","w-full my-12"),c(e,"class","min-w-fit")},m(a,p){re(a,e,p),i(e,t),i(t,o),L(h,o,null),i(t,u),i(t,l),L(d,l,null),i(l,k),L(f,l,null),i(l,N),L(v,l,null),i(e,r),i(e,m),E&&E.m(m,null),i(e,n),i(e,I),i(I,j),i(j,C),i(C,V),i(I,W),i(I,M),i(M,x),i(x,z),O=!0},p(a,[p]){const D={};p&1&&(D.active=a[0].url.pathname.includes("/companion/lessons")),d.$set(D);const F={};p&1&&(F.active=a[0].url.pathname.includes("/companion/coaching")),f.$set(F);const $={};p&1&&($.active=a[0].url.pathname.includes("/companion/books")),v.$set($),E&&E.p&&(!O||p&2)&&he(E,J,a,a[1],O?_e(J,a[1],p,null):de(a[1]),null)},i(a){O||(q(h.$$.fragment,a),q(d.$$.fragment,a),q(f.$$.fragment,a),q(v.$$.fragment,a),q(E,a),O=!0)},o(a){B(h.$$.fragment,a),B(d.$$.fragment,a),B(f.$$.fragment,a),B(v.$$.fragment,a),B(E,a),O=!1},d(a){a&&_(e),R(h),R(d),R(f),R(v),E&&E.d(a)}}}function Ie(s,e,t){let o;ve(s,pe,l=>t(0,o=l));let{$$slots:h={},$$scope:u}=e;return s.$$set=l=>{"$$scope"in l&&t(1,u=l.$$scope)},[o,u,h]}class De extends se{constructor(e){super(),ae(this,e,Ie,ke,ne,{})}}export{De as default};
