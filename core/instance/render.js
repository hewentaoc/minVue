    /* 
    本文件主要功能:
        遍历虚拟节点树
        建立节点树中节点和模板的关系
        建立索引关系
    */
    
    /* 
     设置由模块{{}}找到具体节点的map数据类型
     设置由具体节点找到{{}}模块的map数据类型
    */
    let template2vnode = new Map();
    let vnode2template = new Map();
    export {template2vnode };
    export {vnode2template };

    /* 
     遍历节点树 */
    export function prepareRender(vm , vnode){
        if(vnode == null){
            return;
        }
        /* 
        文本节点
        取出文本节点的中的内容 */
        if(vnode.nodeType == 3) {
            analysisTemplate(vm ,vnode , vnode.text);
        }
        if(vnode.nodeType == 0){
            /* 建立虚拟节点和vfor模板的索引关系 
               vnode.data == "list"
               代表for循环指令的最后一位
            */
            setTemplate2Vnode( vnode , vnode.data)
            setVnode2Template( vnode , vnode.data)
        }
        analysisAttr(vm , vnode);
        /* 
        通过递归遍历虚拟的节点树 */
        if(vnode.nodeType == 1){
            for(let i = 0 ; i < vnode.children.length ; i++){
                prepareRender(vm , vnode.children[i]);
            } 
        }
        /* 
          虚拟节点下面的节点也需要建立索引
        */
        if(vnode.nodeType == 0){
            for(let i = 0 ; i < vnode.children.length ; i++){
                prepareRender(vm , vnode.children[i]);
            } 
        }
    }
    /* 
        对v-model = 'obj.x' 等属性 也需要形成
        obj.x 与 vnode的一一对应
        也需要建立节点树中节点和模板的关系
    */
    function analysisAttr (vm , vnode) {
        if(vnode.nodeType != 1){
            return ;
        }
        var attrlist = vnode.elem.getAttributeNames();
        if(attrlist.indexOf('v-model') != -1){
            let attrTemplate = vnode.elem.getAttribute('v-model');
            setTemplate2Vnode( vnode , attrTemplate)
            setVnode2Template( vnode , attrTemplate)
        }
    }



    /* 
     分析文本中{{}}模板 */
    function analysisTemplate (vm , vnode , template) {
        /* 正则匹配模板{{name}} */
        var templateArr  = template.match(/{{[A-z._]+}}/g);
        if(templateArr != null){
            for(let i = 0 ;i < templateArr.length ; i++){
                setTemplate2Vnode( vnode , templateArr[i])
                setVnode2Template( vnode , templateArr[i])
            }
        }

    }
    /* 
     通过模板存储节点 */
    function setTemplate2Vnode( vnode, template) {
       let  templateValue = getTemplateStr (template);/* 得到去除{{}}的模板 */
       let  node = template2vnode.get(templateValue)
       /* 
       先判断map集合中是否有此属性 
       通过template的值判断对应的存储虚拟节点数组是否存在
       存在就在数组中进行push
       不存在就创建模板的值用数组存储
       */
       if(node){
          node.push(vnode)
       }else{
          template2vnode.set(templateValue , [vnode]);
       }
    }
    /* 
     通过节点存储模板 */
    function setVnode2Template (vnode, template) {
        let  templateValue = getTemplateStr (template);/* 得到去除{{}}的模板 */
        let  templateVal = vnode2template.get(vnode);
       
        if(templateVal){
            templateVal.push(templateValue);
        }else{/* 存储的值为模板数组 */
            vnode2template.set(vnode , [templateValue])
        }
    }

    /* 
      给模板去除{{}} 
      substr 第二个参数是length长度进行字符串的裁剪
      substring 是根据索引值进行裁剪*/
   export function getTemplateStr (template) {
        template = template.trim();/* 去除空格 */
        if(template.substring(0,2) == '{{' && template.substring(template.length - 2, template.length) == '}}'){
             return template.substring(2, template.length - 2);
        }else{
            return template;
        }
    }
    /* 
        清除数据
        重新建立索引
    */
    export function clearMap() {
        template2vnode.clear();
        vnode2template.clear();
    }



    export function demo(){/* 测试demo */
        // 模板找节点
        console.log(template2vnode,'t2v')
        console.log(vnode2template);
    }
    