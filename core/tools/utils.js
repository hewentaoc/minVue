
    /* 对象的深度克隆方式一 */
   export function clone(obj){
        if(obj instanceof Array){
            return cloneArray(obj);
        }else if(obj instanceof Object){
            return cloneObject(obj);
        }else{
            return obj;
        }
   }

    function cloneObject(obj) {
        let result = {};
        /* 得到obj中所有的属性 */
        let objprops = Object.getOwnPropertyNames(obj);
        for(let i = 0 ; i < objprops.length ; i++ ){
            result[objprops[i]] = clone(obj[objprops[i]]);
        }
        return result;
    }
    function cloneArray(obj) {
        let result = new Array(obj.length);
        console.log(result);
        for(let i = 0 ; i < obj.length ; i++ ){
            result[i] = clone(obj[i]);
        }
        return result;
    }


   

    /* 深度克隆方式二 */
    function deepClone (newObj,obj) {
        var attr = Object.prototype.toString;
        for(let prop in obj){
            if(obj.hasOwnProperty(prop)){
                if(obj[prop] != undefined && typeof obj[prop] == 'object'){
                    if(attr.call(obj[prop]) == '[object Array]'){
                        newObj[prop] = [];
                    }else{
                        newObj[prop] = {};
                    }
                    deepClone (newObj[prop],obj[prop])
                }else{
                   newObj[prop] = obj[prop];
                }
            }
        }
        return newObj;
    }

    /* 
        合并对象
    */
   export function mergeAttr(obj1 , obj2) {
            if( obj1 == null){
                return clone(obj2);
            }
            if( obj2 == null){
                return clone(obj1);
            }

            let obj = {};
            var obj1name = Object.getOwnPropertyNames(obj1);
            var obj2name = Object.getOwnPropertyNames(obj2);
            for(let i = 0 ; i < obj1name.length ; i++){
                obj[obj1name[i]] = obj1[obj1name[i]];
            }
            
            for(let i = 0 ; i < obj2name.length ; i++){
                obj[obj2name[i]] = obj2[obj2name[i]];
            }
            return obj;
    }