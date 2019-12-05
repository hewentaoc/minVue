import initMix from './init.js'
import { initMount } from './mount.js';
import { renderMixn } from './rendernode.js';
import { vmodel } from './grammer/vmodel.js';

function Due(options){
    /* 
      进行Due文件的初始化 */
    this._init(options);
    if(this._created) { 
        this._created.call(this);
    }
    /* 
      进行虚拟节点渲染 */
    this._render(this, this._Vnode);
}
    initMix(Due);
    initMount(Due);
    renderMixn(Due);
export default Due;