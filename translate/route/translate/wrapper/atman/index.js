var Promise = require('es6-promise').Promise;
var axios=require('../axios');
var _=require('lodash');
function atmanTranslate(from,to,q,extra){
    var result=[];
    function once(q,id){
        var param=_.assign({
            source:from,
            target:to,
            q:q,
            domain:'medical'
        },extra);
        return axios({
            method:'get',
            url:'http://translate.atman360.com/translate',
            params:param,
        }).then(function(res){
            if(res.status==200){
                return res.data;
            }
            else{
                throw new Error('invoke atman api error');
            }
        }).then(function(data){
            if(data&&data.data&&Array.isArray(data.data.translation)&&data.data.translation.length>0){
                result.push({id:id,text:data.data.translation.map(function(tran){return tran.translatedText}).join('')})
            }
            else{
                throw new Error('result of atman api is not correct');
            }
        });
    }
    return Promise.all(q.map(function(item){
        return once(item.text,item.id)
    })).then(function(){
        return result;
    });
}
module.exports=atmanTranslate;