var Promise = require('es6-promise').Promise;
var axios=require('../axios');
function getHtml(){
    return axios({
        method:'get',
        url:'https://translate.google.cn'
    }).then(function(res){
        if(res.status==200){
            return res.data;
        }
        else{
            throw new Error('fetch https://translate.google.cn error')
        }
    });
}
function getTKKGen(html){
    var reg=/TKK\s{0,}=\s{0,}eval\(\'([\s\S]*?)\'\)/g
    var result=reg.exec(html);
    if(Array.isArray(result)&&result.length>1){
        return result[1];
    }
    return null;
}
function getTKK(tkkGen){
    if(typeof tkkGen!='string'){
        throw new Error('tkk generator not legal');
    }
    try{
        var tkk=eval(eval('\''+tkkGen+'\''));
        return tkk;
    }
    catch(e){
        throw new Error('can not get tkk from tkk generator');
    }
}
module.exports=function(){
    return getHtml().then(getTKKGen).then(getTKK);
};