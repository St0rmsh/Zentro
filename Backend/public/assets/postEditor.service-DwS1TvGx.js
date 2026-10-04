import{j as e,F as q,bh as B,a3 as O,ak as W,bi as X,bj as Q,bk as Y,Z as K,bl as J,bm as Z,bn as ee,bo as te,bp as ne,bq as re,br as se,bs as oe,bf as ae,ax as ie,b2 as ce,s as le,V as de,X as ue}from"./ui-CdLB2Na3.js";import{a as p}from"./core-Bn75apEb.js";import{n as z}from"./index-CGwmcIAp.js";import{a6 as I}from"./index-CqDjWm7M.js";const E=120,me=.9;function ye({value:n,onChange:m,nextFieldId:i="post-content"}){const d=p.useRef(null);p.useEffect(()=>{const g=d.current;g&&(g.style.height="auto",g.style.height=`${g.scrollHeight}px`)},[n]);const x=g=>g.replace(/\s*\n+\s*/g," ").slice(0,E),h=g=>{m(x(g.target.value))},j=g=>{var k;g.key==="Enter"&&(g.preventDefault(),(k=document.getElementById(i))==null||k.focus())},y=n.length,N=y>=E,v=y>=E*me,C=N?"text-destructive font-medium":v?"text-foreground font-medium":"text-muted-foreground";return e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsxs("label",{htmlFor:"post-title",className:"flex items-center gap-2 text-sm font-semibold text-foreground",children:[e.jsx(q,{size:16}),"Post Title"]}),e.jsxs("span",{id:"post-title-counter","aria-live":"polite",className:`text-xs tabular-nums transition-colors ${C}`,children:[y,"/",E]})]}),e.jsx("textarea",{id:"post-title",ref:d,rows:1,value:n,maxLength:E,onChange:h,onKeyDown:j,"aria-describedby":"post-title-counter post-title-hint",placeholder:"Enter a compelling title...",spellCheck:!0,autoComplete:"off",className:`
          block w-full resize-none overflow-hidden
          border-0 bg-transparent
          font-serif text-2xl font-bold leading-snug
          text-foreground caret-foreground outline-none
          placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        `}),e.jsx("p",{id:"post-title-hint",className:"mt-3 text-xs text-muted-foreground",children:N?"You've reached the title limit.":"Keep your title clear, specific, and easy to understand. Press Enter to jump to the content."})]})}const V={validateImage:n=>{if(!n.type.startsWith("image/"))return"Cover must be an image file.";const m=5*1024*1024;return n.size>m?"File size must be less than 5MB.":null},validateMedia:n=>!n.type.startsWith("image/")&&!n.type.startsWith("video/")?"File must be an image or video.":n.size>50*1024*1024?"Media must be smaller than 50MB.":null},fe=n=>n<1024*1024?`${Math.max(1,Math.round(n/1024))} KB`:`${(n/(1024*1024)).toFixed(1)} MB`;function je({value:n,onChange:m}){const i=p.useRef(null),[d,x]=p.useState(!1),[h,j]=p.useState(""),[y,N]=p.useState(!1);p.useEffect(()=>{if(N(!1),n instanceof File){const t=URL.createObjectURL(n);return j(t),()=>URL.revokeObjectURL(t)}j(typeof n=="string"?n:"")},[n]);const v=t=>{const r=V.validateImage(t);if(r){z.error(r);return}m(t)},C=t=>{var s;const r=(s=t.target.files)==null?void 0:s[0];r&&v(r),i.current&&(i.current.value="")},g=t=>{var s;t.preventDefault(),x(!1);const r=(s=t.dataTransfer.files)==null?void 0:s[0];if(r){if(!r.type.startsWith("image/")){z.error("Please drop an image file.");return}v(r)}},k=t=>{t.preventDefault(),d||x(!0)},D=t=>{t.currentTarget.contains(t.relatedTarget)||x(!1)},c=()=>{m("")},f=()=>{var t;return(t=i.current)==null?void 0:t.click()},a=!!h&&!y;return e.jsxs("div",{onDragOver:k,onDragLeave:D,onDrop:g,children:[a?e.jsxs("div",{className:`
            group relative overflow-hidden rounded-xl border bg-muted transition-colors
            ${d?"border-foreground/50":"border-border"}
          `,children:[e.jsx("img",{src:h,alt:"Post cover preview",onError:()=>N(!0),className:"aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"}),e.jsx("div",{className:`
              pointer-events-none absolute inset-0
              bg-gradient-to-t from-black/60 via-transparent to-transparent
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            `}),e.jsxs("div",{className:`
              absolute right-3 top-3 flex gap-2
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100
            `,children:[e.jsxs("button",{type:"button",onClick:f,className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-foreground transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              `,children:[e.jsx(B,{size:13}),"Change"]}),e.jsxs("button",{type:"button",onClick:c,className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-destructive transition-colors hover:bg-white
                focus:outline-none focus:ring-2 focus:ring-ring
              `,children:[e.jsx(O,{size:13}),"Remove"]})]}),e.jsxs("div",{className:`
              pointer-events-none absolute inset-x-0 bottom-0 flex items-center
              justify-between gap-3 p-4 pt-10
              opacity-100 transition-opacity
              sm:opacity-0 sm:group-hover:opacity-100
            `,children:[e.jsx("span",{className:"truncate text-xs font-medium text-white",children:n instanceof File?n.name:"Cover preview"}),n instanceof File&&e.jsx("span",{className:"shrink-0 text-xs tabular-nums text-white/80",children:fe(n.size)})]}),d&&e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/50",children:e.jsx("span",{className:"rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground",children:"Drop to replace cover"})})]}):e.jsxs("button",{type:"button",onClick:f,className:`
            group flex min-h-[190px] w-full flex-col items-center justify-center
            rounded-xl border-2 border-dashed px-6 text-center
            transition-colors focus:outline-none focus:ring-2 focus:ring-ring
            ${d?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[e.jsx("div",{className:`
              mb-4 flex h-12 w-12 items-center justify-center rounded-xl
              border border-border bg-background text-muted-foreground
              transition-colors group-hover:text-foreground
            `,children:d?e.jsx(W,{size:22,className:"animate-pulse"}):e.jsx(B,{size:22})}),e.jsx("p",{className:"text-sm font-semibold text-foreground",children:y?"Couldn't load this image. Upload a new one":d?"Drop to upload":"Upload cover image"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Drag and drop, or click to browse. PNG, JPG, WEBP up to 5MB"})]}),e.jsx("input",{ref:i,type:"file",accept:"image/*",className:"hidden",onChange:C})]})}const U=n=>n<1024*1024?`${Math.max(1,Math.round(n/1024))} KB`:`${(n/(1024*1024)).toFixed(1)} MB`,R=n=>`${n.name}-${n.size}-${n.lastModified}`;function we({value:n,onChange:m}){const i=p.useRef(null),[d,x]=p.useState(!1),[h,j]=p.useState([]);p.useEffect(()=>{const a=n.map(t=>({file:t,url:URL.createObjectURL(t),isVideo:t.type.startsWith("video/")}));return j(a),()=>{a.forEach(t=>URL.revokeObjectURL(t.url))}},[n]);const y=a=>{const t=new Set(n.map(R)),r=[];let s=0;for(const o of a){if(!o.type.startsWith("image/")&&!o.type.startsWith("video/")){z.error(`${o.name}: only images and videos are allowed.`);continue}const l=V.validateMedia(o);if(l){z.error(`${o.name}: ${l}`);continue}const u=R(o);if(t.has(u)){s+=1;continue}t.add(u),r.push(o)}s>0&&z(s===1?"1 file was already added.":`${s} files were already added.`),r.length>0&&m([...n,...r])},N=a=>{const t=Array.from(a.target.files||[]);t.length&&y(t),i.current&&(i.current.value="")},v=a=>{a.preventDefault(),d||x(!0)},C=a=>{a.currentTarget.contains(a.relatedTarget)||x(!1)},g=a=>{a.preventDefault(),x(!1);const t=Array.from(a.dataTransfer.files||[]);t.length&&y(t)},k=a=>{m(n.filter((t,r)=>r!==a))},D=()=>m([]),c=()=>{var a;return(a=i.current)==null?void 0:a.click()},f=n.reduce((a,t)=>a+t.size,0);return e.jsxs("div",{className:"space-y-3",onDragOver:v,onDragLeave:C,onDrop:g,children:[n.length>0&&e.jsxs("div",{className:"flex items-center justify-between text-xs text-muted-foreground",children:[e.jsxs("span",{className:"tabular-nums",children:[n.length," ",n.length===1?"file":"files"," ·"," ",U(f)]}),e.jsx("button",{type:"button",onClick:D,className:`\r
              rounded-md px-2 py-1 font-medium transition-colors\r
              hover:bg-muted hover:text-destructive\r
              focus:outline-none focus:ring-2 focus:ring-ring\r
            `,children:"Remove all"})]}),e.jsxs("div",{className:`
          grid grid-cols-3 gap-2 rounded-xl sm:grid-cols-4
          ${d?"bg-muted/40 ring-2 ring-foreground/30 ring-offset-4 ring-offset-background":""}
          transition-all
        `,children:[h.map(({file:a,url:t,isVideo:r},s)=>e.jsxs("div",{className:"group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted",children:[r?e.jsxs(e.Fragment,{children:[e.jsx("video",{src:t,preload:"metadata",className:"h-full w-full object-cover",muted:!0}),e.jsx("div",{className:"pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20",children:e.jsx(X,{size:22,className:"fill-white text-white"})})]}):e.jsx("img",{src:t,alt:a.name,className:"h-full w-full object-cover"}),e.jsxs("span",{className:`\r
                pointer-events-none absolute left-1.5 top-1.5 inline-flex items-center\r
                gap-1 rounded-full bg-black/60 px-1.5 py-0.5\r
                text-[10px] font-medium text-white\r
              `,children:[r&&e.jsx(Q,{size:10}),U(a.size)]}),e.jsx("div",{className:`\r
                absolute inset-0 flex items-end justify-end bg-black/0 p-1.5\r
                opacity-100 transition-all\r
                sm:opacity-0 sm:group-hover:bg-black/30 sm:group-hover:opacity-100\r
                sm:group-focus-within:bg-black/30 sm:group-focus-within:opacity-100\r
              `,children:e.jsx("button",{type:"button",onClick:()=>k(s),"aria-label":`Remove ${a.name}`,className:`\r
                  inline-flex h-7 w-7 items-center justify-center rounded-full\r
                  bg-white/90 text-destructive transition-colors hover:bg-white\r
                  focus:outline-none focus:ring-2 focus:ring-ring\r
                `,children:e.jsx(O,{size:13})})})]},`${R(a)}-${s}`)),e.jsxs("button",{type:"button",onClick:c,className:`
            group flex aspect-square flex-col items-center justify-center
            rounded-lg border-2 border-dashed text-center transition-colors
            focus:outline-none focus:ring-2 focus:ring-ring
            ${d?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[d?e.jsx(W,{size:20,className:"animate-pulse text-muted-foreground"}):e.jsx(Y,{size:20,className:"text-muted-foreground transition-colors group-hover:text-foreground"}),e.jsx("span",{className:"mt-1 text-[11px] font-medium text-muted-foreground",children:d?"Drop here":"Add media"})]})]}),e.jsx("input",{ref:i,type:"file",multiple:!0,accept:"image/*,video/*",className:"hidden",onChange:N}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Drag and drop or click to add. Images or videos up to 50MB each."})]})}const H=420;function Ne({value:n,onChange:m}){const i=p.useRef(null);p.useEffect(()=>{const t=i.current;t&&(t.style.height="auto",t.style.height=`${Math.max(t.scrollHeight,H)}px`)},[n]);const d=p.useCallback((t,r,s)=>{m(t),requestAnimationFrame(()=>{const o=i.current;o&&(o.focus(),o.setSelectionRange(r,s))})},[m]),x=(t,r=t,s="text")=>{const o=i.current;if(!o)return;const l=o.selectionStart,u=o.selectionEnd,w=n.slice(l,u);if(l>=t.length&&n.slice(l-t.length,l)===t&&n.slice(u,u+r.length)===r){const S=n.slice(0,l-t.length)+w+n.slice(u+r.length);d(S,l-t.length,u-t.length);return}const $=w||s,F=n.slice(0,l)+t+$+r+n.slice(u);d(F,l+t.length,l+t.length+$.length)},h=t=>{const r=i.current;if(!r)return;const s=r.selectionStart,o=r.selectionEnd,l=n.lastIndexOf(`
`,s-1)+1,u=n.indexOf(`
`,o),w=u===-1?n.length:u,b=n.slice(l,w).split(`
`),$=b.every((L,T)=>L.startsWith(t(T))),S=b.map((L,T)=>$?L.slice(t(T).length):t(T)+L).join(`
`),P=n.slice(0,l)+S+n.slice(w);d(P,l,l+S.length)},j=()=>x("**","**","bold text"),y=()=>x("*","*","italic text"),N=()=>{const t=i.current;(t?n.slice(t.selectionStart,t.selectionEnd):"").includes(`
`)?x("```\n","\n```","code"):x("`","`","code")},v=()=>{const t=i.current;if(!t)return;const r=t.selectionStart,s=t.selectionEnd,o=n.slice(r,s)||"link text",l="https://",u=`[${o}](${l})`,w=n.slice(0,r)+u+n.slice(s),b=r+o.length+3;d(w,b,b+l.length)},C=t=>{const r=t.ctrlKey||t.metaKey;if(r&&t.key.toLowerCase()==="b"){t.preventDefault(),j();return}if(r&&t.key.toLowerCase()==="i"){t.preventDefault(),y();return}if(r&&t.key.toLowerCase()==="k"){t.preventDefault(),v();return}const s=t.currentTarget,o=s.selectionStart,l=s.selectionEnd;if(t.key==="Tab"&&!t.shiftKey){t.preventDefault();const u=n.slice(0,o)+"  "+n.slice(l);d(u,o+2,o+2);return}if(t.key==="Enter"&&!t.shiftKey&&o===l){const u=n.lastIndexOf(`
`,o-1)+1,w=n.slice(u,o),b=w.match(/^(\s*)([-*])\s(.*)$/),$=w.match(/^(\s*)(\d+)\.\s(.*)$/);if(b||$){if(t.preventDefault(),!((b?b[3]:$[3])??"").trim()){const _=n.slice(0,u)+n.slice(o);d(_,u,u);return}const S=b?b[1]:$[1],P=b?`${b[2]} `:`${Number($[2])+1}. `,L=`
${S}${P}`,T=n.slice(0,o)+L+n.slice(l),A=o+L.length;d(T,A,A)}}},[g,k]=p.useState(!1),D=async t=>{const r=i.current;if(!r)return;const s=r.selectionStart,o=r.selectionEnd,l=n.slice(s,o);if(!l){alert("Please select some text first.");return}k(!0);try{const w=(await I.post(`/ai/writing/${t}`,{content:l})).data.data,b=n.slice(0,s)+w+n.slice(o);d(b,s,s+w.length)}catch{console.error("AI fix failed")}finally{k(!1)}},c=[[{label:"AI Grammar Fix",icon:K,action:()=>D("grammar-fix")},{label:"AI Shorten",icon:K,action:()=>D("shorten")}],[{label:"Bold",shortcut:"Ctrl+B",icon:J,action:j},{label:"Italic",shortcut:"Ctrl+I",icon:Z,action:y}],[{label:"Heading",icon:ee,action:()=>h(()=>"## ")},{label:"Quote",icon:te,action:()=>h(()=>"> ")}],[{label:"Bullet list",icon:ne,action:()=>h(()=>"- ")},{label:"Numbered list",icon:re,action:()=>h(t=>`${t+1}. `)}],[{label:"Code",icon:se,action:N},{label:"Link",shortcut:"Ctrl+K",icon:oe,action:v}]],f=p.useMemo(()=>n.trim()?n.trim().split(/\s+/).length:0,[n]),a=Math.max(1,Math.round(f/200));return e.jsxs("div",{className:`
        relative isolate overflow-hidden rounded-xl
        border border-border bg-background
        transition-colors
        focus-within:border-ring focus-within:ring-1 focus-within:ring-ring
      `,children:[e.jsx("div",{role:"toolbar","aria-label":"Text formatting",className:"relative z-10 flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 p-2",children:c.map((t,r)=>e.jsxs("div",{className:"flex items-center gap-1",children:[t.map(({label:s,shortcut:o,icon:l,action:u})=>e.jsx("button",{type:"button",onClick:u,disabled:g&&s.includes("AI"),title:o?`${s} (${o})`:s,"aria-label":s,className:`
                  inline-flex h-9 w-9 items-center justify-center rounded-md
                  text-muted-foreground transition-colors
                  hover:bg-background hover:text-foreground
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-ring
                  ${s.includes("AI")?"text-primary hover:text-primary":""}
                  ${g&&s.includes("AI")?"opacity-50 animate-pulse":""}
                `,children:e.jsx(l,{size:16})},s)),r<c.length-1&&e.jsx("span",{className:"mx-1 h-5 w-px bg-border","aria-hidden":"true"})]},r))}),e.jsx("textarea",{id:"post-content",ref:i,value:n,onChange:t=>m(t.target.value),onKeyDown:C,placeholder:"Start writing your post...",spellCheck:!0,rows:14,className:`
          relative z-0 block w-full resize-none
          border-0 bg-transparent
          p-5 font-serif text-base leading-8
          text-foreground caret-foreground
          outline-none placeholder:font-sans placeholder:text-muted-foreground
          focus:ring-0 sm:p-6
        `,style:{minHeight:H}}),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground",children:[e.jsx("span",{children:"Markdown supported · Ctrl/⌘ + B bold · I italic · K link"}),e.jsxs("span",{className:"tabular-nums",children:[f," ",f===1?"word":"words"," · ",a," min read"]})]})]})}const M=10,G=30,ge=n=>n.trim().replace(/^#+/,"").replace(/\s+/g," ").slice(0,G);function ve({isPublished:n,setIsPublished:m,tags:i,setTags:d,onPublish:x,loading:h}){const[j,y]=p.useState(""),N=c=>{const f=[...i];let a=0,t=!1;for(const r of c){const s=ge(r);if(s){if(f.some(o=>o.toLowerCase()===s.toLowerCase())){a+=1;continue}if(f.length>=M){t=!0;break}f.push(s)}}f.length!==i.length&&d(f),t?z.error(`You can add up to ${M} tags.`):a>0&&z(a===1?"That tag is already added.":"Some tags were already added."),y("")},v=()=>N([j]),C=c=>{d(i.filter(f=>f!==c))},g=c=>{if(c.key==="Enter"||c.key===","){c.preventDefault(),v();return}c.key==="Backspace"&&!j&&i.length>0&&C(i[i.length-1])},k=c=>{const f=c.clipboardData.getData("text");/[,\n]/.test(f)&&(c.preventDefault(),N(f.split(/[,\n]/)))},D=i.length>=M;return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Audience"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Choose who can see this post."})]}),e.jsxs("div",{role:"radiogroup","aria-label":"Post visibility",className:"grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1",children:[e.jsxs("button",{type:"button",role:"radio","aria-checked":!n,disabled:h,onClick:()=>m(!1),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:cursor-not-allowed disabled:opacity-60
              ${n?"text-muted-foreground hover:text-foreground":"bg-background text-foreground shadow-sm"}
            `,children:[e.jsx(ae,{size:14}),"Draft"]}),e.jsxs("button",{type:"button",role:"radio","aria-checked":n,disabled:h,onClick:()=>m(!0),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              disabled:cursor-not-allowed disabled:opacity-60
              ${n?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}
            `,children:[e.jsx(ie,{size:14}),"Published"]})]}),e.jsx("p",{className:"mt-3 text-xs text-muted-foreground","aria-live":"polite",children:n?"Visible to everyone as soon as you publish.":"Only visible to you until you publish it."}),e.jsx("button",{type:"button",onClick:x,disabled:h,className:`
            mt-5 flex w-full items-center justify-center gap-2 rounded-lg
            bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground
            transition-colors hover:bg-primary/90 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60
            focus:outline-none focus:ring-2 focus:ring-ring
          `,children:h?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Saving..."]}):n?e.jsxs(e.Fragment,{children:[e.jsx(ce,{size:16}),"Publish Post"]}):e.jsxs(e.Fragment,{children:[e.jsx(le,{size:16}),"Save Draft"]})})]}),e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-3 flex items-start justify-between gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(de,{size:17,className:"text-muted-foreground"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Tags"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Help organize your post."})]})]}),e.jsxs("span",{className:`text-xs tabular-nums ${D?"font-medium text-foreground":"text-muted-foreground"}`,children:[i.length,"/",M]})]}),e.jsxs("div",{onClick:c=>{var f;c.target===c.currentTarget&&((f=c.currentTarget.querySelector("input"))==null||f.focus())},className:`
            flex min-h-[46px] cursor-text flex-wrap items-center gap-1.5 rounded-lg
            border border-input bg-background px-2.5 py-2
            focus-within:border-ring focus-within:ring-2 focus-within:ring-ring
          `,children:[i.map(c=>e.jsxs("span",{className:`
                inline-flex max-w-full items-center gap-1 rounded-full bg-muted/70
                px-2.5 py-1 text-xs font-medium text-foreground
              `,children:[e.jsxs("span",{className:"truncate",children:["#",c]}),e.jsx("button",{type:"button",onClick:()=>C(c),"aria-label":`Remove ${c}`,className:`
                  shrink-0 rounded-full text-muted-foreground transition-colors
                  hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring
                `,children:e.jsx(ue,{size:12})})]},c)),e.jsx("input",{value:j,onChange:c=>y(c.target.value),onKeyDown:g,onPaste:k,onBlur:()=>{j.trim()&&v()},maxLength:G,disabled:D,"aria-label":"Add a tag",placeholder:D?"Tag limit reached":i.length===0?"Add a tag...":"",className:`
              min-w-[80px] flex-1 border-0 bg-transparent px-1 py-1
              text-sm text-foreground caret-foreground outline-none
              placeholder:text-muted-foreground
              disabled:cursor-not-allowed
              focus:ring-0
            `})]}),e.jsx("p",{className:"mt-2 text-xs text-muted-foreground",children:"Press Enter or comma to add. Paste a comma-separated list to add several at once."})]})]})}const ke={createPost:async n=>(await I.post("/post/create",n,{headers:void 0})).data,updatePost:async(n,m)=>(await I.patch(`/post/${n}`,m,{headers:void 0})).data,getPostForEdit:async n=>(await I.get(`/post/${n}`)).data,deletePost:async n=>(await I.delete(`/post/${n}`)).data};export{je as C,Ne as E,we as M,ve as P,ye as T,ke as p};
