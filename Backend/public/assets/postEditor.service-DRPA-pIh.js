import{j as e,F as W,bg as R,a3 as K,ak as U,bh as V,bi as G,bj as _,bk as q,bl as X,bm as Q,bn as Y,bo as J,bp as Z,bq as ee,br as te,bs as ne,ax as re,b4 as se,s as oe,V as ae,X as ie}from"./ui-MDCPSQZv.js";import{a as x}from"./core-Bn75apEb.js";import{n as D}from"./index-CGwmcIAp.js";import{a6 as T}from"./index-BbCwzDeT.js";const L=120,le=.9;function pe({value:t,onChange:d,nextFieldId:l="post-content"}){const c=x.useRef(null);x.useEffect(()=>{const u=c.current;u&&(u.style.height="auto",u.style.height=`${u.scrollHeight}px`)},[t]);const g=u=>u.replace(/\s*\n+\s*/g," ").slice(0,L),p=u=>{d(g(u.target.value))},b=u=>{var w;u.key==="Enter"&&(u.preventDefault(),(w=document.getElementById(l))==null||w.focus())},h=t.length,y=h>=L,j=h>=L*le,N=y?"text-destructive font-medium":j?"text-foreground font-medium":"text-muted-foreground";return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsxs("label",{htmlFor:"post-title",className:"flex items-center gap-2 text-sm font-semibold text-foreground",children:[e.jsx(W,{size:16}),"Post Title"]}),e.jsxs("span",{id:"post-title-counter","aria-live":"polite",className:`text-xs tabular-nums transition-colors ${N}`,children:[h,"/",L]})]}),e.jsx("textarea",{id:"post-title",ref:c,rows:1,value:t,maxLength:L,onChange:p,onKeyDown:b,"aria-describedby":"post-title-counter post-title-hint",placeholder:"Enter a compelling title...",spellCheck:!0,autoComplete:"off",className:`
          block w-full resize-none overflow-hidden
          border-0 bg-transparent
          font-serif text-2xl font-bold leading-snug
          text-foreground caret-foreground outline-none
          placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        `}),e.jsx("p",{id:"post-title-hint",className:"mt-3 text-xs text-muted-foreground",children:y?"You've reached the title limit.":"Keep your title clear, specific, and easy to understand. Press Enter to jump to the content."})]})}const A={validateImage:t=>{if(!t.type.startsWith("image/"))return"Cover must be an image file.";const d=5*1024*1024;return t.size>d?"File size must be less than 5MB.":null},validateMedia:t=>!t.type.startsWith("image/")&&!t.type.startsWith("video/")?"File must be an image or video.":t.size>50*1024*1024?"Media must be smaller than 50MB.":null},ce=t=>t<1024*1024?`${Math.max(1,Math.round(t/1024))} KB`:`${(t/(1024*1024)).toFixed(1)} MB`;function xe({value:t,onChange:d}){const l=x.useRef(null),[c,g]=x.useState(!1),[p,b]=x.useState(""),[h,y]=x.useState(!1);x.useEffect(()=>{if(y(!1),t instanceof File){const r=URL.createObjectURL(t);return b(r),()=>URL.revokeObjectURL(r)}b(typeof t=="string"?t:"")},[t]);const j=r=>{const o=A.validateImage(r);if(o){D.error(o);return}d(r)},N=r=>{var i;const o=(i=r.target.files)==null?void 0:i[0];o&&j(o),l.current&&(l.current.value="")},u=r=>{var i;r.preventDefault(),g(!1);const o=(i=r.dataTransfer.files)==null?void 0:i[0];if(o){if(!o.type.startsWith("image/")){D.error("Please drop an image file.");return}j(o)}},w=r=>{r.preventDefault(),c||g(!0)},k=r=>{r.currentTarget.contains(r.relatedTarget)||g(!1)},n=()=>{d("")},a=()=>{var r;return(r=l.current)==null?void 0:r.click()},s=!!p&&!h;return e.jsxs("div",{onDragOver:w,onDragLeave:k,onDrop:u,children:[s?e.jsxs("div",{className:`
            group relative overflow-hidden rounded-xl border bg-muted transition-colors
            ${c?"border-foreground/50":"border-border"}
          `,children:[e.jsx("img",{src:p,alt:"Post cover preview",onError:()=>y(!0),className:"aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"}),e.jsx("div",{className:`
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/60 via-transparent to-transparent
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            `}),e.jsxs("div",{className:`
              absolute right-3 top-3 flex gap-2
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            `,children:[e.jsxs("button",{type:"button",onClick:a,className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-foreground transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              `,children:[e.jsx(R,{size:13}),"Change"]}),e.jsxs("button",{type:"button",onClick:n,className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-destructive transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              `,children:[e.jsx(K,{size:13}),"Remove"]})]}),e.jsxs("div",{className:`
              pointer-events-none absolute inset-x-0 bottom-0 flex items-center
              justify-between gap-3 p-4 pt-10
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100
            `,children:[e.jsx("span",{className:"truncate text-xs font-medium text-white",children:t instanceof File?t.name:"Cover preview"}),t instanceof File&&e.jsx("span",{className:"shrink-0 text-xs tabular-nums text-white/80",children:ce(t.size)})]}),c&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/50",children:e.jsx("span",{className:"rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground",children:"Drop to replace cover"})})]}):e.jsxs("button",{type:"button",onClick:a,className:`
            group flex min-h-[190px] w-full flex-col items-center justify-center
            rounded-xl border-2 border-dashed px-6 text-center
            transition-colors focus:outline-none focus:ring-2 focus:ring-ring
            ${c?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[e.jsx("div",{className:`
              mb-4 flex h-12 w-12 items-center justify-center rounded-xl
              border border-border bg-background text-muted-foreground
              transition-colors group-hover:text-foreground
            `,children:c?e.jsx(U,{size:22,className:"animate-pulse"}):e.jsx(R,{size:22})}),e.jsx("p",{className:"text-sm font-semibold text-foreground",children:h?"Couldn't load this image. Upload a new one":c?"Drop to upload":"Upload cover image"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Drag and drop, or click to browse. PNG, JPG, WEBP up to 5MB"})]}),e.jsx("input",{ref:l,type:"file",accept:"image/*",className:"hidden",onChange:N})]})}const B=t=>t<1024*1024?`${Math.max(1,Math.round(t/1024))} KB`:`${(t/(1024*1024)).toFixed(1)} MB`,F=t=>`${t.name}-${t.size}-${t.lastModified}`;function he({value:t,onChange:d}){const l=x.useRef(null),[c,g]=x.useState(!1),[p,b]=x.useState([]);x.useEffect(()=>{const s=t.map(r=>({file:r,url:URL.createObjectURL(r),isVideo:r.type.startsWith("video/")}));return b(s),()=>{s.forEach(r=>URL.revokeObjectURL(r.url))}},[t]);const h=s=>{const r=new Set(t.map(F)),o=[];let i=0;for(const m of s){if(!m.type.startsWith("image/")&&!m.type.startsWith("video/")){D.error(`${m.name}: only images and videos are allowed.`);continue}const f=A.validateMedia(m);if(f){D.error(`${m.name}: ${f}`);continue}const v=F(m);if(r.has(v)){i+=1;continue}r.add(v),o.push(m)}i>0&&D(i===1?"1 file was already added.":`${i} files were already added.`),o.length>0&&d([...t,...o])},y=s=>{const r=Array.from(s.target.files||[]);r.length&&h(r),l.current&&(l.current.value="")},j=s=>{s.preventDefault(),c||g(!0)},N=s=>{s.currentTarget.contains(s.relatedTarget)||g(!1)},u=s=>{s.preventDefault(),g(!1);const r=Array.from(s.dataTransfer.files||[]);r.length&&h(r)},w=s=>{d(t.filter((r,o)=>o!==s))},k=()=>d([]),n=()=>{var s;return(s=l.current)==null?void 0:s.click()},a=t.reduce((s,r)=>s+r.size,0);return e.jsxs("div",{className:"space-y-3",onDragOver:j,onDragLeave:N,onDrop:u,children:[t.length>0&&e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsxs("span",{className:"tabular-nums",children:[t.length," ",t.length===1?"file":"files"," ·"," ",B(a)]}),e.jsx("button",{type:"button",onClick:k,className:`\r
              rounded-md px-2 py-1 font-medium transition-colors\r
              hover:bg-muted hover:text-destructive\r
              focus:outline-none focus:ring-2 focus:ring-ring\r
            `,children:"Remove all"})]}),e.jsxs("div",{className:`
          grid grid-cols-3 gap-2 rounded-xl sm:grid-cols-4
          ${c?"bg-muted/40 ring-2 ring-foreground/30 ring-offset-4 ring-offset-background":""}
          transition-all
        `,children:[p.map(({file:s,url:r,isVideo:o},i)=>e.jsxs("div",{className:"group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted",children:[o?e.jsxs(e.Fragment,{children:[e.jsx("video",{src:r,preload:"metadata",className:"h-full w-full object-cover",muted:!0}),e.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20",children:e.jsx(V,{size:22,className:"fill-white text-white"})})]}):e.jsx("img",{src:r,alt:s.name,className:"h-full w-full object-cover"}),e.jsxs("span",{className:`\r
                pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center\r
                gap-1 rounded-full bg-black/60 px-1.5 py-0.5\r
                text-[10px] font-medium text-white\r
              `,children:[o&&e.jsx(G,{size:10}),B(s.size)]}),e.jsx("div",{className:`\r
                absolute inset-0 flex items-end justify-end bg-black/0 p-1.5\r
                opacity-100 transition-all\r
                sm:opacity-0 sm:group-hover:bg-black/30 sm:group-hover:opacity-100\r
                sm:group-focus-within:bg-black/30 sm:group-focus-within:opacity-100\r
              `,children:e.jsx("button",{type:"button",onClick:()=>w(i),"aria-label":`Remove ${s.name}`,className:`\r
                  inline-flex h-7 w-7 items-center justify-center rounded-full\r
                  bg-white/90 text-destructive transition-colors hover:bg-white\r
                  focus:outline-none focus:ring-2 focus:ring-ring\r
                `,children:e.jsx(K,{size:13})})})]},`${F(s)}-${i}`)),e.jsxs("button",{type:"button",onClick:n,className:`
            group flex aspect-square flex-col items-center justify-center
            rounded-lg border-2 border-dashed text-center transition-colors
            focus:outline-none focus:ring-2 focus:ring-ring
            ${c?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[c?e.jsx(U,{size:20,className:"animate-pulse text-muted-foreground"}):e.jsx(_,{size:20,className:"text-muted-foreground transition-colors group-hover:text-foreground"}),e.jsx("span",{className:"mt-1 text-[11px] font-medium text-muted-foreground",children:c?"Drop here":"Add media"})]})]}),e.jsx("input",{ref:l,type:"file",multiple:!0,accept:"image/*,video/*",className:"hidden",onChange:y}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Drag and drop or click to add. Images or videos up to 50MB each."})]})}const I=420;function be({value:t,onChange:d}){const l=x.useRef(null);x.useEffect(()=>{const n=l.current;n&&(n.style.height="auto",n.style.height=`${Math.max(n.scrollHeight,I)}px`)},[t]);const c=x.useCallback((n,a,s)=>{d(n),requestAnimationFrame(()=>{const r=l.current;r&&(r.focus(),r.setSelectionRange(a,s))})},[d]),g=(n,a=n,s="text")=>{const r=l.current;if(!r)return;const o=r.selectionStart,i=r.selectionEnd,m=t.slice(o,i);if(o>=n.length&&t.slice(o-n.length,o)===n&&t.slice(i,i+a.length)===a){const $=t.slice(0,o-n.length)+m+t.slice(i+a.length);c($,o-n.length,i-n.length);return}const v=m||s,S=t.slice(0,o)+n+v+a+t.slice(i);c(S,o+n.length,o+n.length+v.length)},p=n=>{const a=l.current;if(!a)return;const s=a.selectionStart,r=a.selectionEnd,o=t.lastIndexOf(`
`,s-1)+1,i=t.indexOf(`
`,r),m=i===-1?t.length:i,f=t.slice(o,m).split(`
`),v=f.every((C,z)=>C.startsWith(n(z))),$=f.map((C,z)=>v?C.slice(n(z).length):n(z)+C).join(`
`),M=t.slice(0,o)+$+t.slice(m);c(M,o,o+$.length)},b=()=>g("**","**","bold text"),h=()=>g("*","*","italic text"),y=()=>{const n=l.current;(n?t.slice(n.selectionStart,n.selectionEnd):"").includes(`
`)?g("```\n","\n```","code"):g("`","`","code")},j=()=>{const n=l.current;if(!n)return;const a=n.selectionStart,s=n.selectionEnd,r=t.slice(a,s)||"link text",o="https://",i=`[${r}](${o})`,m=t.slice(0,a)+i+t.slice(s),f=a+r.length+3;c(m,f,f+o.length)},N=n=>{const a=n.ctrlKey||n.metaKey;if(a&&n.key.toLowerCase()==="b"){n.preventDefault(),b();return}if(a&&n.key.toLowerCase()==="i"){n.preventDefault(),h();return}if(a&&n.key.toLowerCase()==="k"){n.preventDefault(),j();return}const s=n.currentTarget,r=s.selectionStart,o=s.selectionEnd;if(n.key==="Tab"&&!n.shiftKey){n.preventDefault();const i=t.slice(0,r)+"  "+t.slice(o);c(i,r+2,r+2);return}if(n.key==="Enter"&&!n.shiftKey&&r===o){const i=t.lastIndexOf(`
`,r-1)+1,m=t.slice(i,r),f=m.match(/^(\s*)([-*])\s(.*)$/),v=m.match(/^(\s*)(\d+)\.\s(.*)$/);if(f||v){if(n.preventDefault(),!((f?f[3]:v[3])??"").trim()){const O=t.slice(0,i)+t.slice(r);c(O,i,i);return}const $=f?f[1]:v[1],M=f?`${f[2]} `:`${Number(v[2])+1}. `,C=`
${$}${M}`,z=t.slice(0,r)+C+t.slice(o),P=r+C.length;c(z,P,P)}}},u=[[{label:"Bold",shortcut:"Ctrl+B",icon:q,action:b},{label:"Italic",shortcut:"Ctrl+I",icon:X,action:h}],[{label:"Heading",icon:Q,action:()=>p(()=>"## ")},{label:"Quote",icon:Y,action:()=>p(()=>"> ")}],[{label:"Bullet list",icon:J,action:()=>p(()=>"- ")},{label:"Numbered list",icon:Z,action:()=>p(n=>`${n+1}. `)}],[{label:"Code",icon:ee,action:y},{label:"Link",shortcut:"Ctrl+K",icon:te,action:j}]],w=x.useMemo(()=>t.trim()?t.trim().split(/\s+/).length:0,[t]),k=Math.max(1,Math.round(w/200));return e.jsxs("div",{className:`
        relative isolate overflow-hidden rounded-xl
        border border-border bg-background
        transition-colors
        focus-within:border-ring focus-within:ring-1 focus-within:ring-ring
      `,children:[e.jsx("div",{role:"toolbar","aria-label":"Text formatting",className:"relative z-10 flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 p-2",children:u.map((n,a)=>e.jsxs("div",{className:"flex items-center gap-1",children:[n.map(({label:s,shortcut:r,icon:o,action:i})=>e.jsx("button",{type:"button",onClick:i,title:r?`${s} (${r})`:s,"aria-label":s,className:`
                  inline-flex h-9 w-9 items-center justify-center rounded-md
                  text-muted-foreground transition-colors
                  hover:bg-background hover:text-foreground
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-ring
                `,children:e.jsx(o,{size:16})},s)),a<u.length-1&&e.jsx("span",{className:"mx-1 h-5 w-px bg-border","aria-hidden":"true"})]},a))}),e.jsx("textarea",{id:"post-content",ref:l,value:t,onChange:n=>d(n.target.value),onKeyDown:N,placeholder:"Start writing your post...",spellCheck:!0,rows:14,className:`
          relative z-0 block w-full resize-none
          border-0 bg-transparent
          p-5 font-serif text-base leading-8
          text-foreground caret-foreground
          outline-none placeholder:font-sans placeholder:text-muted-foreground
          focus:ring-0 sm:p-6
        `,style:{minHeight:I}}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground",children:[e.jsx("span",{children:"Markdown supported · Ctrl/⌘ + B bold · I italic · K link"}),e.jsxs("span",{className:"tabular-nums",children:[w," ",w===1?"word":"words"," · ",k," min read"]})]})]})}const E=10,H=30,de=t=>t.trim().replace(/^#+/,"").replace(/\s+/g," ").slice(0,H);function ye({isPublished:t,setIsPublished:d,tags:l,setTags:c,onPublish:g,loading:p}){const[b,h]=x.useState(""),y=n=>{const a=[...l];let s=0,r=!1;for(const o of n){const i=de(o);if(i){if(a.some(m=>m.toLowerCase()===i.toLowerCase())){s+=1;continue}if(a.length>=E){r=!0;break}a.push(i)}}a.length!==l.length&&c(a),r?D.error(`You can add up to ${E} tags.`):s>0&&D(s===1?"That tag is already added.":"Some tags were already added."),h("")},j=()=>y([b]),N=n=>{c(l.filter(a=>a!==n))},u=n=>{if(n.key==="Enter"||n.key===","){n.preventDefault(),j();return}n.key==="Backspace"&&!b&&l.length>0&&N(l[l.length-1])},w=n=>{const a=n.clipboardData.getData("text");/[,\n]/.test(a)&&(n.preventDefault(),y(a.split(/[,\n]/)))},k=l.length>=E;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Audience"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Choose who can see this post."})]}),e.jsxs("div",{role:"radiogroup","aria-label":"Post visibility",className:"grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1",children:[e.jsxs("button",{type:"button",role:"radio","aria-checked":!t,disabled:p,onClick:()=>d(!1),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:cursor-not-allowed disabled:opacity-60
              ${t?"text-muted-foreground hover:text-foreground":"bg-background text-foreground shadow-sm"}
            `,children:[e.jsx(ne,{size:14}),"Draft"]}),e.jsxs("button",{type:"button",role:"radio","aria-checked":t,disabled:p,onClick:()=>d(!0),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:cursor-not-allowed disabled:opacity-60
              ${t?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}
            `,children:[e.jsx(re,{size:14}),"Published"]})]}),e.jsx("p",{className:"mt-3 text-xs text-muted-foreground","aria-live":"polite",children:t?"Visible to everyone as soon as you publish.":"Only visible to you until you publish it."}),e.jsx("button",{type:"button",onClick:g,disabled:p,className:`
            mt-5 flex w-full items-center justify-center gap-2 rounded-lg
            bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground
            transition-colors hover:bg-primary/90 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
            focus:outline-none focus:ring-2 focus:ring-ring
          `,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Saving..."]}):t?e.jsxs(e.Fragment,{children:[e.jsx(se,{size:16}),"Publish Post"]}):e.jsxs(e.Fragment,{children:[e.jsx(oe,{size:16}),"Save Draft"]})})]}),e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-3 flex items-start justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(ae,{size:17,className:"text-muted-foreground"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Tags"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Help organize your post."})]})]}),e.jsxs("span",{className:`text-xs tabular-nums ${k?"font-medium text-foreground":"text-muted-foreground"}`,children:[l.length,"/",E]})]}),e.jsxs("div",{onClick:n=>{var a;n.target===n.currentTarget&&((a=n.currentTarget.querySelector("input"))==null||a.focus())},className:`
            flex min-h-[46px] cursor-text flex-wrap items-center gap-1.5 rounded-lg
            border border-input bg-background px-2.5 py-2
            focus-within:border-ring focus-within:ring-2 focus-within:ring-ring
          `,children:[l.map(n=>e.jsxs("span",{className:`
                inline-flex max-w-full items-center gap-1 rounded-full bg-muted/70
                px-2.5 py-1 text-xs font-medium text-foreground
              `,children:[e.jsxs("span",{className:"truncate",children:["#",n]}),e.jsx("button",{type:"button",onClick:()=>N(n),"aria-label":`Remove ${n}`,className:`
                  shrink-0 rounded-full text-muted-foreground transition-colors
                  hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring
                `,children:e.jsx(ie,{size:12})})]},n)),e.jsx("input",{value:b,onChange:n=>h(n.target.value),onKeyDown:u,onPaste:w,onBlur:()=>{b.trim()&&j()},maxLength:H,disabled:k,"aria-label":"Add a tag",placeholder:k?"Tag limit reached":l.length===0?"Add a tag...":"",className:`
              min-w-[80px] flex-1 border-0 bg-transparent px-1 py-1
              text-sm text-foreground caret-foreground outline-none
              placeholder:text-muted-foreground
              disabled:cursor-not-allowed
              focus:ring-0
            `})]}),e.jsx("p",{className:"mt-2 text-xs text-muted-foreground",children:"Press Enter or comma to add. Paste a comma-separated list to add several at once."})]})]})}const je={createPost:async t=>(await T.post("/post/create",t,{headers:void 0})).data,updatePost:async(t,d)=>(await T.patch(`/post/${t}`,d,{headers:void 0})).data,getPostForEdit:async t=>(await T.get(`/post/${t}`)).data,deletePost:async t=>(await T.delete(`/post/${t}`)).data};export{xe as C,be as E,he as M,ye as P,pe as T,je as p};
