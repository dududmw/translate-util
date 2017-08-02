var Promise = require('es6-promise').Promise;
var getTKK=require('./getTKK');
var getTK=require('./getTK');
var axios=require('../axios');
var _=require('lodash');
function googleTranslate(from,to,q,extra){
    function languageTypeTrans(l){
        if(l=='zh'){
            l='zh-CN';
        }
        return l;
    }
    from=languageTypeTrans(from);
    to=languageTypeTrans(to);

    return getTKK().then(function(tkk){
        var result=[];
        function once(q,id){
            var param=_.assign({
                client:'t',
                ie:'UTF-8',
                oe:'UTF-8',
                dt:'t',
                sl:from,
                tl:to,
                hl:to,
                otf:1,
                ssel:1,
                tsel:1,
                kc:0,
                tk:getTK(tkk,q),
                q:q
            },extra);
            return axios({
                method:'get',
                url:'https://translate.google.cn/translate_a/single',
                params:param
            }).then(function(res){
                if(res.status==200){
                    return res.data;
                }
                else{
                    throw new Error('invoke google api error');
                }
            }).then(function(data){
                if(Array.isArray(data)&&data.length>0&&Array.isArray(data[0])&&data[0].length>0&&Array.isArray(data[0][0])){
                    result.push({id:id,text:data[0][0][0]})
                }
                else{
                    throw new Error('result of google api is not correct');
                }
            });
        }
        return Promise.all(q.map(function(item){
            return once(item.text,item.id)
        })).then(function(){
            return result;
        });

    });
}
module.exports=googleTranslate;