import{_ as K,r as c,c as h,w as d,o as s,a as u,T as O,K as L,b as M,g as T,d as I,e as U,f as k,u as w,h as j,i as H,j as b,k as D,l as S,F as P,m as A,p as J,n as W,q as x,s as Z,t as G,v as Q,x as X}from"./defaults-ed946988.js";const Y={};function ee(i,n){const l=c("router-view"),_=c("el-config-provider");return s(),h(_,{size:"large"},{default:d(()=>[u(l,null,{default:d(({Component:g})=>[u(O,{name:"fade-transverse",mode:"out-in"},{default:d(()=>[(s(),h(L,null,[(s(),h(M(g)))],1024))]),_:2},1024)]),_:1})]),_:1})}const ae=K(Y,[["render",ee]]);function F(){const{appContext:i,proxy:n}=T();return[i.config.globalProperties,n]}const oe={class:"directory"},le=I({__name:"Directory",props:{path:{},placeholder:{}},emits:["update:path"],setup(i,{emit:n}){const l=i,[_,g]=F(),m=()=>{var f,a;(a=_==null?void 0:(f=_.$vscode).postMessage)==null||a.call(f,{id:"vscode:dialog",path:l==null?void 0:l.path},"*")},C=()=>{l!=null&&l.path&&n("update:path","")};return U(()=>{window.addEventListener("message",async f=>{var a;f.data.id==="changePath"&&n("update:path",(a=f.data)==null?void 0:a.path)})}),(f,a)=>{const V=c("el-icon"),v=c("el-button"),o=c("el-input");return s(),k("div",oe,[u(o,{modelValue:l.path,"onUpdate:modelValue":a[0]||(a[0]=p=>l.path=p),placeholder:l==null?void 0:l.placeholder,readonly:""},{suffix:d(()=>[u(V,{class:"hidden",onClick:C},{default:d(()=>[u(w(j))]),_:1})]),append:d(()=>[u(v,{icon:w(H),onClick:m},null,8,["icon"])]),_:1},8,["modelValue","placeholder"])])}}});const ne=K(le,[["__scopeId","data-v-573d1869"]]),te={class:"build_content"},re=I({__name:"build-config",setup(i){const[n]=F(),l=b(),_=b([]),g=b([]),m=b(""),C=D([{prop:"sdkVersion",label:"SDK版本",render:"select",placeholder:"请选择SDK版本",options:S(()=>_.value.map(o=>({value:o.version,label:o.version}))),change:o=>{v(o),a.sdkPlatForm=""}},{prop:"sdkPlatForm",label:"SDK平台",render:"select",placeholder:"请选择SDK平台",options:S(()=>g.value)},{prop:"cmakeArgs",label:"Cmake参数",render:"input",placeholder:"请输入Cmake参数，多个命令行参数可以使用空格或分号来分隔，如果命令行参数包含空格或者特殊字符，应该将整个参数用引号括起来",type:"textarea",autosize:{minRows:6,maxRows:10}},{prop:"outputPath",label:"输出目录",render:"directory",placeholder:"请选择输出目录"}]),f=D({sdkVersion:[{required:!0,message:"请选择SDK版本",trigger:"change"}],sdkPlatForm:[{required:!0,message:"请选择SDK平台",trigger:"change"}]}),a=D({label:"",sdkVersion:"",sdkPlatForm:"",cmakeArgs:"",outputPath:""}),V=()=>{var o;(o=l.value)==null||o.validate(p=>{var t,y;console.log("formData",a),p&&((y=n==null?void 0:(t=n.$vscode).postMessage)==null||y.call(t,{id:"vscode:message save-buildConfig",data:JSON.stringify(a),pageId:m.value},"*"))})},v=o=>{const p=_.value.find(t=>t.version===o);g.value=p?p.prebuilt_platform.map(t=>({value:t,label:t})):[]};return U(()=>{window.addEventListener("message",async o=>{if(o.data.id==="initdata"&&(console.log("接收到了初始化数据",o),a.sdkVersion===""&&(a.sdkVersion=o.data.data.Default_version),_.value=o.data.data.Detail.prebuilt,v(a.sdkVersion),m.value=o.data.pageId),o.data.id==="pageData"){const p=JSON.parse(o.data.data);Object.keys(p).forEach(t=>{a[t]=p[t]??""})}})}),(o,p)=>{const t=c("el-input"),y=c("el-option"),$=c("el-select"),z=c("el-form-item"),B=c("el-form"),E=c("el-icon"),N=c("el-button");return s(),k("div",te,[u(B,{model:a,rules:f,"label-width":"120px",ref_key:"formRef",ref:l},{default:d(()=>[(s(!0),k(P,null,A(C,(e,R)=>(s(),h(z,{key:"items_"+R,label:e.label,prop:e.prop},{default:d(()=>[e.render==="input"?(s(),h(t,{key:0,modelValue:a[e.prop],"onUpdate:modelValue":r=>a[e.prop]=r,type:e==null?void 0:e.type,placeholder:e==null?void 0:e.placeholder,autosize:e==null?void 0:e.autosize},null,8,["modelValue","onUpdate:modelValue","type","placeholder","autosize"])):x("",!0),e.render==="select"?(s(),h($,{key:1,modelValue:a[e.prop],"onUpdate:modelValue":r=>a[e.prop]=r,placeholder:e==null?void 0:e.placeholder,onChange:e==null?void 0:e.change},{default:d(()=>[(s(!0),k(P,null,A(e==null?void 0:e.options,(r,q)=>(s(),h(y,{key:"select_"+q,label:r==null?void 0:r.label,value:r==null?void 0:r.value},null,8,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue","placeholder","onChange"])):x("",!0),e.render==="directory"?(s(),h(ne,{key:2,path:a[e.prop],"onUpdate:path":r=>a[e.prop]=r,placeholder:e==null?void 0:e.placeholder},null,8,["path","onUpdate:path","placeholder"])):x("",!0)]),_:2},1032,["label","prop"]))),128))]),_:1},8,["model","rules"]),u(N,{type:"primary",onClick:V},{default:d(()=>[u(E,null,{default:d(()=>[u(w(J))]),_:1}),W(" 添加ZKOS SDK Build ")]),_:1})])}}});const se=K(re,[["__scopeId","data-v-1ce020cd"]]),ce=[{path:"/",name:"buildConfig",component:se}],de=Z({routes:ce,history:G()});async function pe(){var i;try{const n=Q(ae);n.use(de),n.use(X),n.mount("#app"),n.config.globalProperties.$vscode=(i=window==null?void 0:window.acquireVsCodeApi)==null?void 0:i.call(window)}catch(n){console.log(n)}}pe();