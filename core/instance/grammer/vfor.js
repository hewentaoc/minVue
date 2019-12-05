import Vnode from "../../vnode/vnode.js"
import { compare } from "../rendernode.js";
import { clone } from "../../tools/utils.js";

    /* 
      将绑定v-for属性的标签,创建为一个虚拟节点(nodeType == 0)
      该虚拟节点作为模板进行新的节点创建
       elem , children, text, nodeName,nodeType , parent ,data
    */
    export function vfor (vm, node, parent, instructions) {
        let vnode = new Vnode(node,[] ,'' ,node.nodeName , 0 , parent ,getVisualData(instructions)[2]);
        // vnode.env = {};                    /* 当前节点的环境变量 用于存储vfor循环每次循环的对象*/
        vnode.instructions = instructions;    /* 用于存放 key in list指令 */
        parent.elem.removeChild(node);        /* 移除页面虚拟节点的标签 */
        parent.elem.appendChild(document.createTextNode('')); /* 添加一个文本标签*/
        analysisInstructions( vm , node , instructions , parent);
        return vnode;
    }

    /* 
       分析指令,应该使(key,index) in arr
       或者 key of arr;  
    */
    function getVisualData(instructions) {
        let instuctArr = instructions.trim().split(' ');
        if(instuctArr.length !== 3 || instuctArr[1] != 'in' && instuctArr[1] == 'of'){
            throw new Error('not the format');
        }
        return instuctArr;
    }

    /* 
        分析按照格式分析指令
        无法通过编译原理进行语法解析
        只能按照特定的格式进行指令解析
    */
    function analysisInstructions( vm , node , instructions ,parent){
        var instuctArr = getVisualData(instructions);   /* instuctArr[2] == arr  */
        console.log(vm._data)
        var arrlist = compare(vm._data , instuctArr[2]);/* 比较数组中是否有此属性 */
        if(!arrlist){
            throw new Error('not the prop in data');
        }
        /* 
            返回的值只能为数组才能进行for解析
            根据数组中数据来创建新的dom
            instuctArr == [(key,index) , in , list]
        */
        for(let i = 0 ; i < arrlist.length ; i++){
            var dom = document.createElement(node.nodeName);
            dom.innerHTML = node.innerHTML;
            let env = analysisKey(instuctArr[0] , arrlist[i], i);/* 每个节点的自身数据环境变量 */
            dom.setAttribute('env', JSON.stringify(env));
            parent.elem.appendChild(dom);/* 将新创建的标签添加到页面 */
        }
    }
    /* 
        分析(key,index) in list
        得到每次for循环自己的环境变量{};
        obj:{
            key:{

            },
            index:1,
        }
    */
    function analysisKey (instructprop , value ,index ){
        if(/([a-zA-Z0-9.$_])/.test(instructprop)){/* 判断是否为(key , index) */
            instructprop = instructprop.trim().substring(1 , instructprop.length - 1);
        }
        let keys = instructprop.split(',');
        let obj = {};
        if( keys.length >= 1 ){
            obj[keys[0].trim()] = value;
        }
        if( keys.length >= 2 ){
            obj[keys[1].trim()] = index;
        }
        return obj;
    }