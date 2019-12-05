/*
  本文件功能:
  分析带有v-model属性的标签
  vmodel进行双向数据绑定
*/

 export function vmodel (vm , elem ) {
    let attrValue = elem.getAttribute('v-model');
    elem.oninput = function (){/* 双向数据绑定 */
        setValue(vm._data , attrValue ,elem.value)/* 检测属性值,并且重新赋值 */
    }
 }
 /* 
    在Input框中的值进行改变的
    改变data数据中的值
    改变data就值就会触发proxy中set方法
    从而实现页面节点重新渲染
 */
 export function setValue(data ,attrTemplate , value ) {
    var attrlist = attrTemplate.split('.');
    var temp = data;
    /* 
        遍历到倒数第二个属性
        对最后一个属性进行值的改变
    */
    for(let i = 0 ; i< attrlist.length - 1 ; i++){
        if(temp[attrlist[i]]){
            temp = temp[attrlist[i]];
        }else{
            return;
        }
    }
    if( temp[attrlist[attrlist.length - 1]] != null){
    /* 
        进行数据的更新
    */  
        temp[attrlist[attrlist.length - 1]] = value;
    }
 }
