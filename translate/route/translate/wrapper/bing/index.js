var Promise = require('es6-promise').Promise;
var axios=require('../axios');
var _=require('lodash');
function bingTranslate(from,to,q,extra){
    function languageTypeTrans(l){
        if(l=='zh'){
            l='zh-CHS';
        }
        return l;
    }
    from=languageTypeTrans(from);
    to=languageTypeTrans(to);
    return axios({
        method:'get',
        url:'https://www.bing.com/translator/',
    }).then(function(res){
        if(res.status==200){
            return res.headers['set-cookie'];
        }
        else{
            throw new Error('fetch https://www.bing.com/translator/ error')
        }
    }).then(function(cookies){
        var param=_.assign({
            from:from,
            to:to
        },extra);
        return axios({
            method:'post',
            url:'https://www.bing.com/translator/api/Translate/TranslateArray',
            headers:{'Cookie':cookies.map(function(cookie){return cookie.split(';')[0]}).join(';')},
            params:param,
            data:q
        }).then(function(res){
            if(res.status==200){
                return res.data;
            }
            else{
                throw new Error('fetch https://www.bing.com/translator/api/Translate/TranslateArray error')
            }
        }).then(function(data){
            if(data!=null&&Array.isArray(data.items)){
                return data.items.map(function(item){
                    return {id:item.id,text:item.text};
                });
            }
            else{
                throw new Error('result of bing api is not correct');
            }
        });
    });
}
module.exports=bingTranslate;