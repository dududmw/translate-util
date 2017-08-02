'use strict';
var winston=require('winston');
var express = require('express');
var router=express.Router();
var wrapper=require('./wrapper');
var qs=require('qs');

router.post('/translate',function(req,res,next){
    var body=req.body?req.body:{};

    if(typeof body.type!='string'){
        res.send({errorCode:400,errorMessage:'type must be a string'});
        return;
    }
    if(typeof body.from!='string'){
        res.send({errorCode:400,errorMessage:'from must be a string'});
        return;
    }
    if(typeof body.to!='string'){
        res.send({errorCode:400,errorMessage:'to must be a string'});
        return;
    }
    if(!Array.isArray(body.q)){
        res.send({errorCode:400,errorMessage:'q must be an array'});
        return;
    }

    var process=null;
    if(body.type=='baidu'){
        process=wrapper.baidu;
    }
    else if(body.type=='google'){
        process=wrapper.google;
    }
    else if(body.type=='bing'){
        process=wrapper.bing;
    }
    else if(body.type=='youdao'){
        process=wrapper.youdao;
    }
    if(typeof process=='function'){
        process(body.from,body.to,body.q,body.extra).then(function(data){
            res.send({errorCode:0,data:data});
        }).catch(function(e){
            winston.error(e);
            res.send({errorCode:500,errorMessage:e.message});
        });
    }
    else{
        res.send({errorCode:400,errorMessage:'type is not legal'})
    }

});
module.exports=router;