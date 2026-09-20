import{j as e,F as w,bg as h,a3 as v,ak as y,bh as k,bi as C,bj as z,bk as D,bl as M,bm as F,bn as P,bo as E,bp as $,bq as R,ax as T,b4 as L,s as S,V as I,X as B}from"./ui-DrM8-cAl.js";import{a as g}from"./core-Bn75apEb.js";import{a6 as b}from"./index-gOLYgCgg.js";const j=120;function O({value:t,onChange:a}){const s=g.useRef(null);return g.useEffect(()=>{const i=s.current;i&&(i.style.height="auto",i.style.height=`${i.scrollHeight}px`)},[t]),e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 flex items-center justify-between",children:[e.jsxs("label",{htmlFor:"post-title",className:"flex items-center gap-2 text-sm font-semibold text-foreground",children:[e.jsx(w,{size:16}),"Post Title"]}),e.jsxs("span",{className:`text-xs tabular-nums ${t.length>j?"text-destructive":"text-muted-foreground"}`,children:[t.length,"/",j]})]}),e.jsx("textarea",{id:"post-title",ref:s,rows:1,value:t,onChange:i=>a(i.target.value),placeholder:"Enter a compelling title...",className:`
          w-full resize-none
          border-0 bg-transparent
          font-serif text-2xl font-bold leading-snug
          text-foreground outline-none
          placeholder:font-sans placeholder:font-normal placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        `}),e.jsx("p",{className:"mt-3 text-xs text-muted-foreground",children:"Keep your title clear, specific, and easy to understand."})]})}const N={validateImage:t=>{if(!t.type.startsWith("image/"))return"Cover must be an image file.";const a=5*1024*1024;return t.size>a?"File size must be less than 5MB.":null},validateMedia:t=>!t.type.startsWith("image/")&&!t.type.startsWith("video/")?"File must be an image or video.":t.size>50*1024*1024?"Media must be smaller than 50MB.":null};function W({value:t,onChange:a}){const s=g.useRef(null),[i,m]=g.useState(!1),[p,l]=g.useState(!1),u=typeof t=="string"?t:t instanceof File?URL.createObjectURL(t):"",d=o=>{const c=N.validateImage(o);if(c){alert(c);return}m(!0),a(o),m(!1)},x=o=>{var f;const c=(f=o.target.files)==null?void 0:f[0];c&&d(c),s.current&&(s.current.value="")},n=o=>{var f;o.preventDefault(),l(!1);const c=(f=o.dataTransfer.files)==null?void 0:f[0];c&&d(c)},r=()=>{a("")};return e.jsxs("div",{children:[u?e.jsxs("div",{className:"group relative overflow-hidden rounded-xl border border-border bg-muted",children:[e.jsx("img",{src:u,alt:"Post cover preview",className:"aspect-[16/7] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"}),e.jsxs("div",{className:"absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100",children:[e.jsxs("button",{type:"button",onClick:()=>{var o;return(o=s.current)==null?void 0:o.click()},className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-foreground transition-colors hover:bg-white
              `,children:[e.jsx(h,{size:13}),"Change"]}),e.jsxs("button",{type:"button",onClick:r,className:`
                inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5
                text-xs font-semibold text-destructive transition-colors hover:bg-white
              `,children:[e.jsx(v,{size:13}),"Remove"]})]}),e.jsx("div",{className:"absolute inset-x-0 bottom-0 flex items-center p-4 pt-10",children:e.jsx("span",{className:"text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100",children:"Cover preview"})})]}):e.jsxs("button",{type:"button",disabled:i,onClick:()=>{var o;return(o=s.current)==null?void 0:o.click()},onDragOver:o=>{o.preventDefault(),l(!0)},onDragLeave:()=>l(!1),onDrop:n,className:`
            group flex min-h-[190px] w-full flex-col items-center justify-center
            rounded-xl border-2 border-dashed px-6 text-center
            transition-colors focus:outline-none focus:ring-2 focus:ring-ring
            ${p?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[e.jsx("div",{className:`
              mb-4 flex h-12 w-12 items-center justify-center rounded-xl
              border border-border bg-background text-muted-foreground
              transition-colors group-hover:text-foreground
            `,children:i?e.jsx(y,{size:22,className:"animate-pulse"}):e.jsx(h,{size:22})}),e.jsx("p",{className:"text-sm font-semibold text-foreground",children:i?"Preparing image...":p?"Drop to upload":"Upload cover image"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Drag and drop, or click to browse — PNG, JPG, WEBP up to 5MB"})]}),e.jsx("input",{ref:s,type:"file",accept:"image/*",className:"hidden",onChange:x})]})}function q({value:t,onChange:a}){const s=g.useRef(null),[i,m]=g.useState(!1),p=g.useMemo(()=>t.map(n=>({file:n,url:URL.createObjectURL(n),isVideo:n.type.startsWith("video/")})),[t]),l=n=>{const r=[];for(const o of n){const c=N.validateMedia(o);if(c){alert(`${o.name}

${c}`);continue}r.push(o)}r.length>0&&a([...t,...r])},u=n=>{const r=Array.from(n.target.files||[]);r.length&&l(r),s.current&&(s.current.value="")},d=n=>{n.preventDefault(),m(!1);const r=Array.from(n.dataTransfer.files||[]);r.length&&l(r)},x=n=>{a(t.filter((r,o)=>o!==n))};return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"grid grid-cols-3 gap-2 sm:grid-cols-4",children:[p.map(({file:n,url:r,isVideo:o},c)=>e.jsxs("div",{className:"group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted",children:[o?e.jsxs(e.Fragment,{children:[e.jsx("video",{src:r,className:"h-full w-full object-cover",muted:!0}),e.jsx("div",{className:"absolute inset-0 flex items-center justify-center bg-black/20",children:e.jsx(k,{size:22,className:"fill-white text-white"})})]}):e.jsx("img",{src:r,alt:n.name,className:"h-full w-full object-cover"}),e.jsx("div",{className:"absolute inset-0 flex items-end justify-end bg-black/0 p-1.5 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100",children:e.jsx("button",{type:"button",onClick:()=>x(c),"aria-label":`Remove ${n.name}`,className:`\r
                  inline-flex h-7 w-7 items-center justify-center rounded-full\r
                  bg-white/90 text-destructive transition-colors hover:bg-white\r
                `,children:e.jsx(v,{size:13})})})]},`${n.name}-${n.lastModified}-${c}`)),e.jsxs("button",{type:"button",onClick:()=>{var n;return(n=s.current)==null?void 0:n.click()},onDragOver:n=>{n.preventDefault(),m(!0)},onDragLeave:()=>m(!1),onDrop:d,className:`
            group flex aspect-square flex-col items-center justify-center
            rounded-lg border-2 border-dashed text-center transition-colors
            focus:outline-none focus:ring-2 focus:ring-ring
            ${i?"border-foreground/50 bg-muted/60":"border-border bg-muted/30 hover:border-foreground/30 hover:bg-muted/50"}
          `,children:[i?e.jsx(y,{size:20,className:"text-muted-foreground"}):e.jsx(C,{size:20,className:"text-muted-foreground transition-colors group-hover:text-foreground"}),e.jsx("span",{className:"mt-1 text-[11px] font-medium text-muted-foreground",children:"Add media"})]})]}),e.jsx("input",{ref:s,type:"file",multiple:!0,accept:"image/*,video/*",className:"hidden",onChange:u}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Images or videos up to 50MB each."})]})}function G({value:t,onChange:a}){const s=(l,u="")=>{const d=document.getElementById("post-content");if(!d)return;const x=d.selectionStart,n=d.selectionEnd,r=t.slice(x,n),o=l+r+u,c=t.slice(0,x)+o+t.slice(n);a(c),requestAnimationFrame(()=>{d.focus();const f=x+l.length+r.length+u.length;d.setSelectionRange(f,f)})},i=[[{label:"Bold",icon:z,action:()=>s("**","**")},{label:"Italic",icon:D,action:()=>s("*","*")}],[{label:"Heading",icon:M,action:()=>s("## ")},{label:"Quote",icon:F,action:()=>s("> ")}],[{label:"Bullet list",icon:P,action:()=>s("- ")},{label:"Numbered list",icon:E,action:()=>s("1. ")}],[{label:"Code",icon:$,action:()=>s("`","`")}]],m=g.useMemo(()=>t.trim()?t.trim().split(/\s+/).length:0,[t]),p=Math.max(1,Math.round(m/200));return e.jsxs("div",{className:"overflow-hidden rounded-xl border border-border bg-background transition-colors",children:[e.jsx("div",{className:"sticky top-16 z-10 flex flex-wrap items-center gap-1 border-b border-border bg-muted/60 p-2 backdrop-blur",children:i.map((l,u)=>e.jsxs("div",{className:"flex items-center gap-1",children:[l.map(({label:d,icon:x,action:n})=>e.jsx("button",{type:"button",onClick:n,title:d,"aria-label":d,className:`
                  inline-flex h-9 w-9 items-center justify-center rounded-md
                  text-muted-foreground transition-colors
                  hover:bg-background hover:text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring
                `,children:e.jsx(x,{size:16})},d)),u<i.length-1&&e.jsx("span",{className:"mx-1 h-5 w-px bg-border","aria-hidden":"true"})]},u))}),e.jsx("textarea",{id:"post-content",value:t,onChange:l=>a(l.target.value),placeholder:"Start writing your post...",spellCheck:!0,className:`
          min-h-[420px] w-full resize-y border-0 bg-background
          p-5 font-serif text-base leading-8 text-foreground
          outline-none placeholder:font-sans placeholder:text-muted-foreground
          focus:ring-0 sm:p-6
        `}),e.jsxs("div",{className:"flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground",children:[e.jsx("span",{children:"Markdown formatting is supported."}),e.jsxs("span",{className:"tabular-nums",children:[m," ",m===1?"word":"words"," · ",p," min read"]})]})]})}function V({isPublished:t,setIsPublished:a,tags:s,setTags:i,onPublish:m,loading:p}){const[l,u]=g.useState(""),d=()=>{const r=l.trim().replace(/^#/,"");if(r){if(s.some(o=>o.toLowerCase()===r.toLowerCase())){u("");return}i([...s,r]),u("")}},x=r=>{i(s.filter(o=>o!==r))},n=r=>{if(r.key==="Enter"||r.key===","){r.preventDefault(),d();return}r.key==="Backspace"&&!l&&s.length>0&&x(s[s.length-1])};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Audience"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Choose who can see this post."})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1 rounded-lg border border-border bg-muted/40 p-1",children:[e.jsxs("button",{type:"button",disabled:p,onClick:()=>a(!1),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              ${t?"text-muted-foreground hover:text-foreground":"bg-background text-foreground shadow-sm"}
            `,children:[e.jsx(R,{size:14}),"Draft"]}),e.jsxs("button",{type:"button",disabled:p,onClick:()=>a(!0),className:`
              flex items-center justify-center gap-1.5 rounded-md px-3 py-2
              text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-ring
              ${t?"bg-background text-foreground shadow-sm":"text-muted-foreground hover:text-foreground"}
            `,children:[e.jsx(T,{size:14}),"Published"]})]}),e.jsx("p",{className:"mt-3 text-xs text-muted-foreground",children:t?"Visible to everyone as soon as you publish.":"Only visible to you until you publish it."}),e.jsx("button",{type:"button",onClick:m,disabled:p,className:`
            mt-5 flex w-full items-center justify-center gap-2 rounded-lg
            bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground
            transition-colors hover:bg-primary/90
            disabled:cursor-not-allowed disabled:opacity-60
            focus:outline-none focus:ring-2 focus:ring-ring
          `,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Saving..."]}):t?e.jsxs(e.Fragment,{children:[e.jsx(L,{size:16}),"Publish Post"]}):e.jsxs(e.Fragment,{children:[e.jsx(S,{size:16}),"Save Draft"]})})]}),e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-3 flex items-center gap-2",children:[e.jsx(I,{size:17,className:"text-muted-foreground"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Tags"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Help organize your post."})]})]}),e.jsxs("div",{className:`
            flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-lg
            border border-input bg-background px-2.5 py-2
            focus-within:border-ring focus-within:ring-2 focus-within:ring-ring
          `,children:[s.map(r=>e.jsxs("span",{className:`
                inline-flex items-center gap-1 rounded-full bg-muted/70
                px-2.5 py-1 text-xs font-medium text-foreground
              `,children:["#",r,e.jsx("button",{type:"button",onClick:()=>x(r),"aria-label":`Remove ${r}`,className:"rounded-full text-muted-foreground transition-colors hover:text-destructive focus:outline-none",children:e.jsx(B,{size:12})})]},r)),e.jsx("input",{value:l,onChange:r=>u(r.target.value),onKeyDown:n,onBlur:d,placeholder:s.length===0?"Add a tag...":"",className:`
              min-w-[80px] flex-1 border-0 bg-transparent px-1 py-1
              text-sm text-foreground outline-none
              placeholder:text-muted-foreground
              focus:ring-0
            `})]}),e.jsx("p",{className:"mt-2 text-xs text-muted-foreground",children:"Press Enter or comma to add a tag."})]})]})}const K={createPost:async t=>(await b.post("/post/create",t,{headers:void 0})).data,updatePost:async(t,a)=>(await b.patch(`/post/${t}`,a,{headers:void 0})).data,getPostForEdit:async t=>(await b.get(`/post/${t}`)).data,deletePost:async t=>(await b.delete(`/post/${t}`)).data};export{W as C,G as E,q as M,V as P,O as T,K as p};
