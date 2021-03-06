'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     * 缓存频道信息
     * @returns {Promise}
     */
    async get_channel_cache(){
        let channel=await think.cache('get_channel_cache',()=>{
            return this.get_channel(0);
         }, {timeout: 365 * 24 * 3600});
        return channel;
    }
    /**
     * 获取分类树，指定分类则返回指定分类及其子分类，不指定则返回所有分类树
     *
     */
    async get_channel(id){
        id = id||0;
        /*获取当前分类信息*/

        //if(id){
        //    console.log(id);
        //    let ids = id;
        //    let info = await this.info(ids);
        //    console.log(info);
        //    let id   = info.id;
        //}

        //获取所有分类

        let map = {"status":{">":-1}}
        let list = await this.where(map).order('sort').select();
        //console.log(list);
        list = get_children(list,id);
        let info = list;

        return info;
    }

    /**
     * 更新或者编辑信息
     * @param data
     * @returns {*}
     */
    async updates(data){
        if(think.isEmpty(data)){
            return false;
        }
        let res;
        let obj;
        /* 添加或更新数据 */
        if(think.isEmpty(data.id)){
          data.create_time=new Date().getTime();
            res = this.add(data);
            if(res){
              obj={id:res,err:1};//添加成功
            }else {
              obj={err:2};//新增失败
            }
        }else{
            data.update_time=new Date().getTime();
            res = this.update(data);
            if(res){
              obj={id:res,err:3};//更新成功
            }else {
              obj = {err:4};//更新失败
            }
        }
        think.cache("get_channel_cache",null);//更新频道缓存信息
        return obj;

    }
}
