var Promise = require('es6-promise').Promise;
var axios=require('../axios');
var _=require('lodash');
var qs=require('qs');
var md5=require('md5');
function deEight(e) {
    var t, n = new Array, r = e.split("\\");
    if (1 == r.length)
        return r[0];
    for (t = 1; t < r.length; t++)
        n += String.fromCharCode(parseInt(r[t], 8));
    return e = n
}
function youdaoTranslate(from,to,q,extra){
    function languageTypeTrans(l){
        if(l=='zh'){
            l='zh-CHS';
        }
        return l;
    }
    from=languageTypeTrans(from);
    to=languageTypeTrans(to);

    var result=[];
    function once(q,id){
        var client='fanyideskweb';
        var salt=''+((new Date).getTime() + parseInt(10 * Math.random(), 10));
        var c=deEight("rY0D^0'nM0}g5Mm1z%1G4");
        var sign=md5(client+q+salt+c);
        var param=_.assign({
            from:from,
            to:to,
            i:q,
            smartresult:'dict',
            client:client,
            salt:salt,
            sign:sign,
            doctype:'json',
            version:'2.1',
            keyfrom:'fanyi.web',
            action:'FY_BY_CLICKBUTTON',
            typoResult:true
        },extra);
        return axios({
            method:'post',
            url:'http://fanyi.youdao.com/translate_o',
            data:qs.stringify(param),
            headers:{
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin':'fanyi.youdao.com',
                'Host':'fanyi.youdao.com',
                'Referer':'fanyi.youdao.com',
            },
        }).then(function(res){
            if(res.status==200){
                return res.data;
            }
            else{
                throw new Error('http://fanyi.youdao.com/translate_o error')
            }
        }).then(function(data){
            console.log(JSON.stringify(data));
            if(data!=null&&Array.isArray(data.translateResult)&&data.translateResult.length>0&&Array.isArray(data.translateResult[0])&&data.translateResult[0].length>0){
                result.push({id:id,text:data.translateResult[0][0].tgt});
            }
            else{
                throw new Error('result of youdao api is not correct');
            }
        });
    }
    return Promise.all(q.map(function(item){
        return once(item.text,item.id)
    })).then(function(){
        return result;
    });

}
module.exports=youdaoTranslate;