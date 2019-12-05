  /* 
    创建虚拟节点的类 */

  let number = 1;
  class Vnode {
        constructor(elem , children, text, nodeName,nodeType , parent ,data){
            this.elem = elem;            /* 具体的节点 */    
            this.children = children;    /* 子节点 */
            this.text = text;            /* 文本节点的文本 */
            this.nodeType = nodeType;    /* 节点类型 */
            this.nodeName = nodeName;    /* 节点名 */
            this.parent = parent;        /* 父节点 */
            this.data = data;
            this.env = {};        /* 当前节点的环境变量 用于存储vfor循环每次循环的对象*/
            this.instructions = null;    /* 用于存放 key in list指令 */
            this.template = [];   /* 当前节点涉及到的模板 */
            this.number = number++;
        }
  }

  export default Vnode;