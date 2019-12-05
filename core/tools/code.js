import { mergeAttr } from "./utils.js";



/* 
   得到执行中数据的作用域
*/
 export function getEnv (vm , vnode) {
     let result  = mergeAttr(vm._data , vnode.env);
         result =  mergeAttr(result , vm._computed);
     return result;
 }

/* 
    无法通过预编译解析代码 
    只能通过字符串拼接的方式
    let color1 = red;
*/
 export function getCode (obj) {
    let code = '';
    for(let prop in obj){
        code += 'let'+ ' '+ prop + '=' + JSON.stringify(obj[prop]) + ';';
    }
    return code;
 }

 /* 
    codestr --> obj.x > 2
    执行代码
 */
 export function isTrue (codeEnv , codestr) {
    let flag = false;
    codeEnv += 'if('+codestr+'){flag = true}';
    eval(codeEnv);
    return flag;
 }