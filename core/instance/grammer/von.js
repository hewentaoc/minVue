import { compare } from "../rendernode.js";
/* 
    分析带有v-on属性的标签
*/
export function analysisVon (vm , vnode) {
        if(vnode.nodeType != 1){
            return ;
        }
        let attrlist = vnode.elem.getAttributeNames();

        for(let i = 0 ;i< attrlist.length ; i++){
            if(attrlist[i].trim().indexOf('v-on') == 0 || attrlist[i].trim().indexOf('@') == 0){
                von(vm , vnode , attrlist[i] ,vnode.elem.getAttribute(attrlist[i]))
            }
        }

}
/* 
    attrlist  --<> v-on:keydown
    proplist[1] 事件名
    解析v-on  绑定事件
*/
function von (vm , vnode , attrlist , funcname) {
    var proplist = attrlist.split(":");
    let func = compare(vm._methods , funcname);
    if(func){
        vnode.elem.addEventListener(proplist[1],proxyFunc(vm,func),false)    
    }
}
/* 
    改变this指向为Due
*/
function proxyFunc(vm,func){
    return function(){
        func.call(vm);
    }
}