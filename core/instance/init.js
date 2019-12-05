import constructorData from './proxy.js';
import {mount} from './mount.js'
    let uid = 0;
    function initMix(Due){
        /*  
          进行初始化*/
        Due.prototype._init = function(options){
            const vm = this;
            /* 
             创造Due实例基本属性 
             _uid 、 _isDue
             _uid 每个Due实例有个唯一的id
             仿照Vue实例对象
             */
            vm._uid = uid++;
            vm._isDue = true;
            if(options && options.data ){
            /* 
                进行data数据的初始化
                constructorData */
                vm._data = constructorData(vm , options.data , '');
            }
            /* 
                created函数进行初始化
            */
            if(options && options.created){
                vm._created = options.created;
            }
          
            /* dom挂载 */
            if(options && options.el){
                var dom = document.getElementById(options.el);
                mount(vm,dom)
            }
              /*  
                进行methods函数挂载
            */
            if(options && options.methods){
                vm._methods = options.methods;
                for(let prop in options.methods){
                    vm[prop] = options.methods[prop];
                }
            }
            /* 
                进行计算属性的初始化
            */
            if(options && options.computed){
                vm._computed = options.computed;
                for(let prop in options.computed){
                    vm[prop] = options.computed[prop];
                }
            }
        }
    }




    export default initMix;