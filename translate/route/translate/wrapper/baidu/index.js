var Promise = require('es6-promise').Promise;
var axios=require('../axios');
var _=require('lodash');
var qs=require('qs');
function baiduTranslate(from,to,q,extra){
    var result=[];
    function once(q,id){
        var param=_.assign({
            from:from,
            to:to,
            query:q,
            transtype:'translang',
            simple_means_flag:3
        },extra);
        return axios({
            method:'post',
            url:'http://fanyi.baidu.com/v2transapi',
            data:qs.stringify(param)
        }).then(function(res){
            if(res.status==200){
                return res.data;
            }
            else{
                throw new Error('fetch http://fanyi.baidu.com/v2transapi error')
            }
        }).then(function(data){
            if(data!=null&&data.trans_result!=null&&Array.isArray(data.trans_result.data)&&data.trans_result.data.length>0){
                result.push({id:id,text:data.trans_result.data[0].dst});
            }
            else{
                throw new Error('result of baidu api is not correct');
            }
        });
    }
    return Promise.all(q.map(function(item){
        return once(item.text,item.id)
    })).then(function(){
        return result;
    });
}
module.exports=baiduTranslate;