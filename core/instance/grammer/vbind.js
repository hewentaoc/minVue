import { compare } from "../rendernode.js";
import { getEnv, getCode, isTrue } from "../../tools/code.js";
    /* 
        分析带有v-bind属性的标签
    */
    export function analysisVbind (vm , vnode) {
        if(vnode.nodeType != 1 ){
            return;
        }
        var attrlist = vnode.elem.getAttributeNames();
        for(let i = 0 ; i < attrlist.length ; i++){
             if(attrlist[i].trim().indexOf('v-bind:') == 0 || attrlist[i].indexOf(':') == 0 ){
                 vbind(vm , vnode , attrlist[i], vnode.elem.getAttribute(attrlist[i]));
             }else{
                 return;
             }
        }
    }
    /* 
      分析v-bind
      attr ---> v-bind:class
      temp ---> 属性值{red,blue}
    */
    function vbind (vm , vnode , attr , temp){
        let attrArr = attr.split(":");
        if(/{[\w\W]+}/.test(temp)){/* 检查是否带{} :class={} */
            temp = temp.trim();
            temp = temp.substring(1 , temp.length - 1).trim();/* 去{ } */
            let tempList = temp.split(',');
            let result = analysisCode(vm , vnode , tempList , attrArr[1])
            vnode.elem.setAttribute(attrArr[1] , result);
        }else{
            let k = attrArr[1];
            let v = compare(vm._data , temp);
            if(v) {
                vnode.elem.setAttribute(k , v);
            }
        }
    }
    /* 
        分析{red:obj.x > 1 }代码
    */
    function analysisCode (vm , vnode , tempList , prop){
        let env =  getEnv(vm , vnode);/* 合并data的作用域 */
        let code = getCode(env);      /* 生成作用域的代码字符串 */
        let result = '';
        for(let i = 0 ; i < tempList.length ; i++){
            /* 
             { red:obj.x > 2}
            */
            if(tempList[i].indexOf(":") > -1){
                let attr = tempList[i].split(':');
                let bool = isTrue(code,attr[1]);/* 执行代码 */
                if(bool){
                    result += attr[0] + ' ';
                }
            }else{
            /* {red} 这种形式直接添加class = 'red' */
               result += tempList[i];
            }
        }
        return result;
    }
