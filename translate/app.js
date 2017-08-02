'use strict';
var winston=require('winston');
var fse=require('fs-extra');
var path=require('path');
fse.ensureFileSync(path.resolve(__dirname,'log/error.log'));
winston.add(winston.transports.File,{filename:'log/error.log',level:'error'});
var express=require('express');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
process.on('uncaughtException', function (err) {
    winston.error(err);
});
var app=express();
app.use('/static', express.static('/fe/dist'));
// app.use('/static', express.static(path.resolve(__dirname,'static')));
app.use(cookieParser());
app.use(bodyParser.json({limit:'10mb'}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Methods','get,post');
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
});
app.get('/ping',function(req,res){
	res.send({errorCode:0,data:'pong'});
})
var translate=require('./route/translate');
app.use('/',translate);
app.listen(9000,function(){
    winston.info('listening 9000');
});