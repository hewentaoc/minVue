import { template2vnode, vnode2template, getTemplateStr } from "./render.js";

/*  
    本文件的主要功能:
        进行页面节点的渲染
        进行页面节点的更新
*/


/* 
    在data数据进行更新的时候
    进行页面文本节点进行更新
*/
 export function updateNode (vm , template) {
    let vnodeList = template2vnode.get(template);
     if(vnodeList != null){
         for(var i = 0; i < vnodeList.length ; i++){
          /* 
            调用renderNode对节点进行重新的渲染 */
            renderNode( vm , vnodeList[i]);
         }
     }
 }
 
 export function renderMixn(Due) {
     Due.prototype._render = function(vm , vnode){
        renderNode( vm , vnode);
     }
 }
 /* 
    进行节点的渲染
   */
 export function renderNode (vm , vnode) {
    /* 找到文本节点 */
    if(vnode.nodeType == 3){

        let templatelist = vnode2template.get(vnode);/* 找到节点对应的模板*/
        if(templatelist){
            let text = vnode.text;/* 文本节点的nodeValue */
            for(var i = 0 ; i < templatelist.length ;i++){
                  /* 分析模板是否是data中的属性 */
              let templateValue = analysisDate([vm._data ,vnode.env] , templatelist[i])
              if(templateValue != null){
                  /* 用模板的值替换原模板 */
                  text = text.replace('{{'+ templatelist[i]+ '}}',templateValue)
              }
            }
            /* 
              改变文本节点里面的内容 */
            vnode.elem.nodeValue = text;
        }
        /* 对于绑定v-model属性的input标签进行值的渲染 */
    }else if(vnode.nodeType == 1 && vnode.nodeName == 'INPUT') {
        let templatelist = vnode2template.get(vnode);
        if(templatelist){
            for(let i = 0 ; i< templatelist.length ; i++){
                let templateValue = analysisDate([vm._data , vnode.env] , templatelist[i])
                if(templateValue != null) {
                    vnode.elem.value = templateValue;
                }
            }
        }
    }else{
        /* 递归遍历节点树 
           标签和虚拟节点
        */
        for(let i = 0; i < vnode.children.length ; i++){
            renderNode(vm , vnode.children[i])
        }
    }
 }

 /* 
    分析data数据是否有此数据
 */
 function analysisDate(data , template ){
     for(var i = 0 ; i < data.length ; i++){
         /* 进行比较template 和 data */
        let tempValue = compare(data[i]  , template);
        if(tempValue != null) {
            return tempValue;
        }
     }
    return null;
 }
 /* 
    判断模板是否在data中
    通过obj.a转化为数组
    然后进行递归判断模板是否在data数据中
    如果在data中 , 就返回模板具体的值
    反之就返回undefined
 */
 export function compare( obj , template) { /* obj.a  将该种形式的模板转化为数组*/
    /*  
       
      vfor的作用域  {index:0,key:{a:"hwt"}}    
      key.a
        
    */
    if(!obj){
        return;
    }
    
    let templateList = template.split('.');
    let temp = obj;
    for(let i = 0 ;i < templateList.length ;i++){
        /* 递归的方式判断template是否是data属性
           如果是data属性
           在判断下一级是否为data[i]的属性
           只要不符合条件,就返回undefined
           反之返回具体的值
        */
        if(temp[templateList[i]] != null){
            temp = temp[templateList[i]];
        }else{
            return undefined;
        }
    }
    return temp;
 }