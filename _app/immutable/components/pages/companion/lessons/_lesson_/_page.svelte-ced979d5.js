import{S as ee,i as te,s as ne,k as r,a as D,q as G,v as H,M as ae,l,h as s,c as F,m as R,r as J,w as O,n as e,F as a,b as Q,x as W,u as X,f as Y,t as Z,y as x}from"../../../../../chunks/index-6ebe39d3.js";import{P as se,L as oe}from"../../../../../chunks/LessonNavigator-4ebc182f.js";import{w as z,a as re}from"../../../../../chunks/info-13a7f95e.js";function le(o){let d,h,m,i,f,g,_,y,v,p,M,A,T,q,P,S,c,b,L=o[0].lesson.title+"",U,I,k,V=o[0].lesson.description+"",j,K,E,N,$,w;return document.title=d=o[3],E=new se({props:{lesson:o[0].lesson.slug,chapters:o[0].lesson.chapters}}),$=new oe({props:{lesson:o[0].lesson.slug}}),{c(){h=r("meta"),m=r("meta"),i=r("meta"),f=r("meta"),g=r("meta"),_=r("meta"),y=r("meta"),v=r("meta"),p=r("meta"),M=r("meta"),A=r("meta"),T=r("meta"),q=r("meta"),P=r("meta"),S=D(),c=r("div"),b=r("p"),U=G(L),I=D(),k=r("p"),j=G(V),K=D(),H(E.$$.fragment),N=D(),H($.$$.fragment),this.h()},l(n){const t=ae('[data-svelte="svelte-lu3u59"]',document.head);h=l(t,"META",{"http-equiv":!0,content:!0}),m=l(t,"META",{name:!0,content:!0}),i=l(t,"META",{name:!0,content:!0}),f=l(t,"META",{property:!0,content:!0}),g=l(t,"META",{property:!0,content:!0}),_=l(t,"META",{property:!0,content:!0}),y=l(t,"META",{property:!0,content:!0}),v=l(t,"META",{property:!0,content:!0}),p=l(t,"META",{name:!0,content:!0}),M=l(t,"META",{property:!0,content:!0}),A=l(t,"META",{property:!0,content:!0}),T=l(t,"META",{name:!0,content:!0}),q=l(t,"META",{name:!0,content:!0}),P=l(t,"META",{name:!0,content:!0}),t.forEach(s),S=F(n),c=l(n,"DIV",{class:!0});var u=R(c);b=l(u,"P",{class:!0});var C=R(b);U=J(C,L),C.forEach(s),I=F(u),k=l(u,"P",{class:!0});var B=R(k);j=J(B,V),B.forEach(s),K=F(u),O(E.$$.fragment,u),N=F(u),O($.$$.fragment,u),u.forEach(s),this.h()},h(){e(h,"http-equiv","refresh"),e(h,"content","0;URL='"+o[2]+"?noscroll=1'"),e(m,"name","description"),e(m,"content",o[4]),e(i,"name","author"),e(i,"content",re),e(f,"property","og:url"),e(f,"content",o[1]),e(g,"property","og:type"),e(g,"content","website"),e(_,"property","og:title"),e(_,"content",o[3]),e(y,"property","og:description"),e(y,"content",o[4]),e(v,"property","og:image"),e(v,"content",o[5]),e(p,"name","twitter:card"),e(p,"content","summary_large_image"),e(M,"property","twitter:domain"),e(M,"content",z),e(A,"property","twitter:url"),e(A,"content",o[1]),e(T,"name","twitter:title"),e(T,"content",o[3]),e(q,"name","twitter:description"),e(q,"content",o[4]),e(P,"name","twitter:image"),e(P,"content",o[5]),e(b,"class","text-3xl text-black text-center"),e(k,"class","text-darkCharcoal text-center p-4"),e(c,"class","py-8 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg")},m(n,t){a(document.head,h),a(document.head,m),a(document.head,i),a(document.head,f),a(document.head,g),a(document.head,_),a(document.head,y),a(document.head,v),a(document.head,p),a(document.head,M),a(document.head,A),a(document.head,T),a(document.head,q),a(document.head,P),Q(n,S,t),Q(n,c,t),a(c,b),a(b,U),a(c,I),a(c,k),a(k,j),a(c,K),W(E,c,null),a(c,N),W($,c,null),w=!0},p(n,[t]){(!w||t&8)&&d!==(d=n[3])&&(document.title=d),(!w||t&1)&&L!==(L=n[0].lesson.title+"")&&X(U,L),(!w||t&1)&&V!==(V=n[0].lesson.description+"")&&X(j,V);const u={};t&1&&(u.lesson=n[0].lesson.slug),t&1&&(u.chapters=n[0].lesson.chapters),E.$set(u);const C={};t&1&&(C.lesson=n[0].lesson.slug),$.$set(C)},i(n){w||(Y(E.$$.fragment,n),Y($.$$.fragment,n),w=!0)},o(n){Z(E.$$.fragment,n),Z($.$$.fragment,n),w=!1},d(n){s(h),s(m),s(i),s(f),s(g),s(_),s(y),s(v),s(p),s(M),s(A),s(T),s(q),s(P),n&&s(S),n&&s(c),x(E),x($)}}}function me(o,d,h){let{data:m}=d;const i=z+"/companion/lessons/"+m.lesson.slug,f=m.lesson.chapters[0].items[0].key,g=i+"/"+f,_=m.lesson.title,y=m.lesson.description,v=z+"/img/lesson-"+m.lesson.slug+".jpg";return o.$$set=p=>{"data"in p&&h(0,m=p.data)},[m,i,g,_,y,v]}class pe extends ee{constructor(d){super(),te(this,d,me,le,ne,{data:0})}}export{pe as default};
