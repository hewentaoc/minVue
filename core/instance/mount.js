import Vnode from "../vnode/vnode.js";
import {prepareRender, demo, template2vnode, clearMap} from './render.js'
import { vmodel } from "./grammer/vmodel.js";
import { vfor } from "./grammer/vfor.js";
import { mergeAttr } from "../tools/utils.js";
import { analysisVbind } from "./grammer/vbind.js";
import { analysisVon } from "./grammer/von.js";
/* 
  进行dom挂载
  */

  /* 
    如果没进行el挂载数据
    可以使用app.$mount('app')进行挂载
  */
  export function initMount(Due){
      Due.prototype.$mount = function (dom) {
        let elem = document.getElementById(dom);
          mount(this , elem)
      }
  }

  export function mount(vm,dom) {
     vm._Vnode = createVnode(vm, dom, '') 
     /* 
       进行预备渲染
       将{{}}模块和虚拟节点建立联系*/
     prepareRender(vm , vm._Vnode );
  }
 
  /* 
   创建虚拟节点树
   */
  function createVnode (vm, node, parent) {
      let vnode = analysisAttr(vm , node , parent);/* 分析标签中的属性 */
      if(vnode == null){
          let elem = node;
          let children = [];
          let text = getTextValue(node);/* 得到文本节点中具体的值 */
          let nodeName = node.nodeName;
          let nodeType = node.nodeType;
          vnode = new Vnode(elem,children,text,nodeName,nodeType,parent);
          if(vnode.nodeType == 1 && vnode.elem.getAttribute('env')){
              /* 合并作用域 */
              vnode.env = mergeAttr( vnode.env, JSON.parse(elem.getAttribute('env')))
              /* 我的补充 */
              if(parent.env){
                 vnode.env = mergeAttr(vnode.env, parent.env)
              }
          }else{
              /* 文本节点继承vfor的作用域 形成自己的data作用域*/
              vnode.env = mergeAttr( vnode.env, parent ? parent.env : {});
          }
      }
        analysisVbind(vm, vnode);/* 分析v-bind指令 */
        analysisVon(vm , vnode);
      /* 
        为了补充虚拟节点 nodeType == 0 的节点

        如果是虚拟节点(li),
        就将虚拟节点的父级节点(ul)下面的节点(v-for新创建的li)
        都放到虚拟节点li下面
      */
      let childs = vnode.nodeType == 0 ? vnode.parent.elem.childNodes :vnode.elem.childNodes;
      let len =   vnode.nodeType == 0 ? vnode.parent.elem.childNodes.length : vnode.elem.childNodes.length;

      for(var i = 0 ; i < len ; i++){
         /* 逐级创建文本节点 */
          let childNode = createVnode(vm , childs[i] , vnode);
          if( childNode instanceof Vnode){
         /* 存储子级虚拟节点 */
              vnode.children.push(childNode)
          }else{
              vnode.children = vnode.children.concat(childNodes);
          }
      }
      return vnode;
  }
  /* 
    得到文本节点中具体的Value值 */
  function getTextValue(node){
      if(node.nodeValue){
         return node.nodeValue;
      }else{
         return '';
      }
  }

/* 
  分析标签中的属性
*/
export function analysisAttr(vm, node, parent){
  /* 
    只有标签才可以绑定v-model
  */
    if(node.nodeType == 1) {
       let attrlist = node.getAttributeNames();/* 获得标签中的所有属性 */
       if(attrlist.indexOf('v-model') != -1){
           /* 进行双向数据绑定 */
           vmodel(vm , node);
       }
       /* 
        对于带有v-for属性的标签进行渲染;
       */
       if(attrlist.indexOf('v-for') != -1){
          return vfor(vm, node, parent, node.getAttribute('v-for'));
       }
    }
}
/* 
  在数组中push值的时候,页面节点发生变化
  重构节点树
  重构索引map
*/
export function rebulid (vm , template) {
    let visualNode = template2vnode.get(template);/* 通过模板得到对应的虚拟节点 */
    for(let i = 0 ; i < visualNode.length ; i++){
        visualNode[i].parent.elem.innerHTML = '';
        visualNode[i].parent.elem.appendChild(visualNode[i].elem);
        /* 从虚拟节点的父级重构虚拟节点树 */
        let result = createVnode(vm, visualNode[i].elem, visualNode[i].parent);
        /* result是一个新的虚拟节点 
           把新创建的虚拟节点放在父级节点的children中
        */
        visualNode[i].parent.children = [result];
        clearMap();/* 清理之前存的索引 */
        prepareRender(vm , vm._Vnode);/* 重新建立索引 */
    }
}