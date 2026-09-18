import{j as e,F as N,a3 as h,ak as j,bg as y,bh as w,bi as k,bj as C,bk as z,bl as F,bm as M,bn as $,bo as P,bp as E,b4 as p,bq as I,s as b,ax as R,V as S,br as B,X as T}from"./ui-CEV99eLA.js";import{a as f}from"./core-Bn75apEb.js";import{a6 as g}from"./index-qHK6baOn.js";function D({value:n,onChange:o}){return e.jsxs("div",{children:[e.jsxs("label",{htmlFor:"post-title",className:`
          mb-3 flex items-center gap-2
          text-sm font-semibold
          text-foreground
        `,children:[e.jsx(N,{size:16}),"Post Title"]}),e.jsx("input",{id:"post-title",type:"text",value:n,onChange:t=>o(t.target.value),placeholder:"Enter a compelling title...",className:`
          w-full
          border-0
          bg-transparent
          text-2xl
          font-bold
          text-foreground
          outline-none
          placeholder:text-muted-foreground
          focus:ring-0
          sm:text-3xl
        `}),e.jsx("p",{className:"mt-3 text-xs text-muted-foreground",children:"Keep your title clear, specific, and easy to understand."})]})}const v={validateImage:n=>{if(!n.type.startsWith("image/"))return"Cover must be an image file.";const o=5*1024*1024;return n.size>o?"File size must be less than 5MB.":null},validateMedia:n=>!n.type.startsWith("image/")&&!n.type.startsWith("video/")?"File must be an image or video.":n.size>50*1024*1024?"Media must be smaller than 50MB.":null};function W({value:n,onChange:o}){const t=f.useRef(null),[u,a]=f.useState(!1),r=typeof n=="string"?n:n instanceof File?URL.createObjectURL(n):"",i=async l=>{var s;const c=(s=l.target.files)==null?void 0:s[0];if(!c)return;const x=v.validateImage(c);if(x){alert(x),t.current&&(t.current.value="");return}try{a(!0),o(c)}catch(m){console.error("Cover upload error:",m),alert("Failed to prepare cover image.")}finally{a(!1),t.current&&(t.current.value="")}},d=()=>{o("")};return e.jsxs("div",{children:[r?e.jsxs("div",{className:"relative overflow-hidden rounded-xl border border-border bg-muted",children:[e.jsx("img",{src:r,alt:"Post cover preview",className:"aspect-[16/7] w-full object-cover"}),e.jsxs("div",{className:"absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-4 pt-10",children:[e.jsx("span",{className:"text-xs font-medium text-white",children:"Cover preview"}),e.jsxs("button",{type:"button",onClick:d,className:`
                inline-flex items-center gap-2
                rounded-md
                bg-white/90
                px-3 py-2
                text-xs font-semibold
                text-destructive
                transition-colors
                hover:bg-white
              `,children:[e.jsx(h,{size:14}),"Remove"]})]})]}):e.jsxs("button",{type:"button",disabled:u,onClick:()=>{var l;return(l=t.current)==null?void 0:l.click()},className:`
            group flex min-h-[190px] w-full
            flex-col items-center justify-center
            rounded-xl
            border-2 border-dashed border-border
            bg-muted/30
            px-6
            text-center
            transition-colors
            hover:border-foreground/30
            hover:bg-muted/50
            focus:outline-none
            focus:ring-2
            focus:ring-ring
          `,children:[e.jsx("div",{className:`
              mb-4 flex h-12 w-12
              items-center justify-center
              rounded-xl
              border border-border
              bg-background
              text-muted-foreground
              transition-colors
              group-hover:text-foreground
            `,children:u?e.jsx(j,{size:22,className:"animate-pulse"}):e.jsx(y,{size:22})}),e.jsx("p",{className:"text-sm font-semibold text-foreground",children:u?"Preparing image...":"Upload cover image"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"PNG, JPG, WEBP up to 5MB"})]}),e.jsx("input",{ref:t,type:"file",accept:"image/*",className:"hidden",onChange:i})]})}function H({value:n,onChange:o}){const t=f.useRef(null),u=r=>{const i=Array.from(r.target.files||[]);if(!i.length)return;const d=[];for(const l of i){const c=v.validateMedia(l);if(c){alert(`${l.name}

${c}`);continue}d.push(l)}d.length>0&&o([...n,...d]),t.current&&(t.current.value="")},a=r=>{o(n.filter((i,d)=>d!==r))};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("button",{type:"button",onClick:()=>{var r;return(r=t.current)==null?void 0:r.click()},className:`\r
          group flex w-full flex-col items-center justify-center\r
          rounded-xl border-2 border-dashed border-border\r
          bg-muted/30 px-6 py-10 text-center\r
          transition-colors\r
          hover:border-foreground/30\r
          hover:bg-muted/50\r
          focus:outline-none\r
          focus:ring-2\r
          focus:ring-ring\r
        `,children:[e.jsx("div",{className:`\r
            mb-3 flex h-11 w-11 items-center justify-center\r
            rounded-lg border border-border\r
            bg-background\r
            text-muted-foreground\r
            transition-colors\r
            group-hover:text-foreground\r
          `,children:e.jsx(j,{size:21})}),e.jsx("p",{className:"text-sm font-semibold text-foreground",children:"Add media"}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Images or videos up to 50MB each"})]}),e.jsx("input",{ref:t,type:"file",multiple:!0,accept:"image/*,video/*",className:"hidden",onChange:u}),n.length>0&&e.jsx("div",{className:"space-y-2",children:n.map((r,i)=>e.jsxs("div",{className:`\r
                flex items-center justify-between\r
                rounded-lg border border-border\r
                bg-background p-3\r
              `,children:[e.jsxs("div",{className:"flex min-w-0 items-center gap-3",children:[e.jsx("div",{className:`\r
                    flex h-10 w-10 shrink-0 items-center justify-center\r
                    rounded-lg bg-muted\r
                    text-muted-foreground\r
                  `,children:r.type.startsWith("video/")?e.jsx(w,{size:18}):e.jsx(k,{size:18})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("p",{className:"truncate text-sm font-medium text-foreground",children:r.name}),e.jsxs("p",{className:"text-xs text-muted-foreground",children:[(r.size/1024/1024).toFixed(2)," MB"]})]})]}),e.jsx("button",{type:"button",onClick:()=>a(i),className:`\r
                  ml-3 inline-flex h-9 w-9 shrink-0\r
                  items-center justify-center\r
                  rounded-md\r
                  text-muted-foreground\r
                  transition-colors\r
                  hover:bg-destructive/10\r
                  hover:text-destructive\r
                  focus:outline-none\r
                  focus:ring-2\r
                  focus:ring-ring\r
                `,"aria-label":`Remove ${r.name}`,children:e.jsx(h,{size:16})})]},`${r.name}-${r.lastModified}-${i}`))})]})}function K({value:n,onChange:o}){const t=(a,r="")=>{const i=document.getElementById("post-content");if(!i)return;const d=i.selectionStart,l=i.selectionEnd,c=n.slice(d,l),x=a+c+r,s=n.slice(0,d)+x+n.slice(l);o(s),requestAnimationFrame(()=>{i.focus();const m=d+a.length+c.length+r.length;i.setSelectionRange(m,m)})},u=[{label:"Bold",icon:C,action:()=>t("**","**")},{label:"Italic",icon:z,action:()=>t("*","*")},{label:"Heading",icon:F,action:()=>t("## ")},{label:"Quote",icon:M,action:()=>t("> ")},{label:"Bullet list",icon:$,action:()=>t("- ")},{label:"Numbered list",icon:P,action:()=>t("1. ")},{label:"Code",icon:E,action:()=>t("`","`")}];return e.jsxs("div",{className:"overflow-hidden rounded-xl border border-border bg-background transition-colors",children:[e.jsx("div",{className:"flex flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-2",children:u.map(({label:a,icon:r,action:i})=>e.jsx("button",{type:"button",onClick:i,title:a,"aria-label":a,className:`
                inline-flex h-9 w-9 items-center justify-center
                rounded-md
                text-muted-foreground
                transition-colors
                hover:bg-background
                hover:text-foreground
                focus:outline-none
                focus:ring-2
                focus:ring-ring
              `,children:e.jsx(r,{size:16})},a))}),e.jsx("textarea",{id:"post-content",value:n,onChange:a=>o(a.target.value),placeholder:"Start writing your post...",spellCheck:!0,className:`
          min-h-[420px]
          w-full
          resize-y
          border-0
          bg-background
          p-5
          text-sm
          leading-7
          text-foreground
          outline-none
          placeholder:text-muted-foreground
          focus:ring-0
          sm:p-6
        `}),e.jsx("div",{className:`
          border-t border-border
          bg-muted/40
          px-4 py-2
          text-xs
          text-muted-foreground
        `,children:"Markdown formatting is supported."})]})}function O({isPublished:n,setIsPublished:o,tags:t,setTags:u,onPublish:a,loading:r}){const[i,d]=f.useState(""),l=()=>{const s=i.trim().replace(/^#/,"");if(s){if(t.some(m=>m.toLowerCase()===s.toLowerCase())){d("");return}u([...t,s]),d("")}},c=s=>{u(t.filter(m=>m!==s))},x=s=>{(s.key==="Enter"||s.key===",")&&(s.preventDefault(),l())};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-5",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(p,{size:17,className:"text-muted-foreground"}),e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Publishing"})]}),e.jsx("p",{className:"mt-1 text-xs text-muted-foreground",children:"Choose how this post should be saved."})]}),e.jsx("button",{type:"button",disabled:r,onClick:()=>o(!1),className:`
            mb-2 w-full rounded-lg border p-3 text-left
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            ${n?"border-border hover:bg-muted/40":"border-foreground/30 bg-muted/50"}
          `,children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`
                flex h-9 w-9 items-center justify-center
                rounded-md
                ${n?"bg-muted text-muted-foreground":"bg-background text-foreground"}
              `,children:e.jsx(I,{size:16})}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-foreground",children:"Draft"}),e.jsx("p",{className:"mt-0.5 text-xs text-muted-foreground",children:"Only you can access it."})]}),!n&&e.jsx(b,{size:17,className:"text-foreground"})]})}),e.jsx("button",{type:"button",disabled:r,onClick:()=>o(!0),className:`
            w-full rounded-lg border p-3 text-left
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-ring
            ${n?"border-foreground/30 bg-muted/50":"border-border hover:bg-muted/40"}
          `,children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:`
                flex h-9 w-9 items-center justify-center
                rounded-md
                ${n?"bg-background text-foreground":"bg-muted text-muted-foreground"}
              `,children:e.jsx(R,{size:16})}),e.jsxs("div",{className:"min-w-0 flex-1",children:[e.jsx("p",{className:"text-sm font-medium text-foreground",children:"Published"}),e.jsx("p",{className:"mt-0.5 text-xs text-muted-foreground",children:"Make this post visible."})]}),n&&e.jsx(b,{size:17,className:"text-foreground"})]})}),e.jsx("button",{type:"button",onClick:a,disabled:r,className:`
            mt-5 flex w-full items-center justify-center gap-2
            rounded-lg
            bg-primary
            px-4 py-3
            text-sm font-semibold
            text-primary-foreground
            transition-colors
            hover:bg-primary/90
            disabled:cursor-not-allowed
            disabled:opacity-60
            focus:outline-none
            focus:ring-2
            focus:ring-ring
          `,children:r?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"}),"Saving..."]}):n?e.jsxs(e.Fragment,{children:[e.jsx(p,{size:16}),"Publish Post"]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{size:16}),"Save Draft"]})})]}),e.jsxs("div",{className:"rounded-xl border border-border bg-card p-5",children:[e.jsxs("div",{className:"mb-4 flex items-center gap-2",children:[e.jsx(S,{size:17,className:"text-muted-foreground"}),e.jsxs("div",{children:[e.jsx("h2",{className:"text-sm font-semibold text-foreground",children:"Tags"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Help organize your post."})]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("input",{value:i,onChange:s=>d(s.target.value),onKeyDown:x,placeholder:"Add a tag...",className:`
              min-w-0 flex-1
              rounded-lg
              border border-input
              bg-background
              px-3 py-2.5
              text-sm
              text-foreground
              outline-none
              transition-colors
              placeholder:text-muted-foreground
              focus:border-ring
              focus:ring-2
              focus:ring-ring
            `}),e.jsx("button",{type:"button",onClick:l,className:`
              inline-flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-lg
              bg-primary
              text-primary-foreground
              transition-colors
              hover:bg-primary/90
              focus:outline-none
              focus:ring-2
              focus:ring-ring
            `,"aria-label":"Add tag",children:e.jsx(B,{size:17})})]}),t.length>0&&e.jsx("div",{className:"mt-4 flex flex-wrap gap-2",children:t.map(s=>e.jsxs("span",{className:`
                  inline-flex items-center gap-1.5
                  rounded-full
                  border border-border
                  bg-muted/50
                  px-3 py-1.5
                  text-xs font-medium
                  text-foreground
                `,children:["#",s,e.jsx("button",{type:"button",onClick:()=>c(s),className:`
                    rounded-full
                    text-muted-foreground
                    transition-colors
                    hover:text-destructive
                    focus:outline-none
                  `,"aria-label":`Remove ${s}`,children:e.jsx(T,{size:13})})]},s))}),t.length===0&&e.jsx("p",{className:"mt-4 text-xs text-muted-foreground",children:"No tags added yet."})]})]})}const V={createPost:async n=>(await g.post("/post/create",n,{headers:void 0})).data,updatePost:async(n,o)=>(await g.patch(`/post/${n}`,o,{headers:void 0})).data,getPostForEdit:async n=>(await g.get(`/post/${n}`)).data,deletePost:async n=>(await g.delete(`/post/${n}`)).data};export{W as C,K as E,H as M,O as P,D as T,V as p};
