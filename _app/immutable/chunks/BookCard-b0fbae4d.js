import{S as v,i as w,s as p,k as d,l as f,m,h as c,n as i,H as h,b,D as _,A as g}from"./index-ed6271b7.js";function k(n){let t,a,e,o,s;return{c(){t=d("div"),a=d("a"),e=d("img"),this.h()},l(r){t=f(r,"DIV",{class:!0});var l=m(t);a=f(l,"A",{target:!0,title:!0,href:!0});var u=m(a);e=f(u,"IMG",{class:!0,alt:!0,border:!0,src:!0}),u.forEach(c),l.forEach(c),this.h()},h(){i(e,"class","w-full"),i(e,"alt",n[1]),i(e,"border","0"),h(e.src,o="/img/"+n[0]+".jpg")||i(e,"src",o),i(a,"target","_blank"),i(a,"title",n[1]),i(a,"href",s="https://www.amazon.com/gp/product/"+n[0]+"/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN="+n[0]+"&linkCode=as2&tag=briandainto0e-20&linkId=bee10213d5fe5a1da7863458e22d4d70"),i(t,"class","mx-auto rounded max-w-md flex flex-col w-full overflow-hidden shadow-lg transition ease-in-out duration-500 transform hover:-translate-y-1")},m(r,l){b(r,t,l),_(t,a),_(a,e)},p(r,[l]){l&2&&i(e,"alt",r[1]),l&1&&!h(e.src,o="/img/"+r[0]+".jpg")&&i(e,"src",o),l&2&&i(a,"title",r[1]),l&1&&s!==(s="https://www.amazon.com/gp/product/"+r[0]+"/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN="+r[0]+"&linkCode=as2&tag=briandainto0e-20&linkId=bee10213d5fe5a1da7863458e22d4d70")&&i(a,"href",s)},i:g,o:g,d(r){r&&c(t)}}}function I(n,t,a){let{asin:e}=t,{title:o}=t;return n.$$set=s=>{"asin"in s&&a(0,e=s.asin),"title"in s&&a(1,o=s.title)},[e,o]}class C extends v{constructor(t){super(),w(this,t,I,k,p,{asin:0,title:1})}}export{C as B};