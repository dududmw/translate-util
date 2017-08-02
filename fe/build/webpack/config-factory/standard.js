var path=require('path');
var webpack=require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
var fs=require('fs');

module.exports=function(option){
    var projectPath=path.resolve(__dirname,'../../..');
    var codePath=path.resolve(projectPath,'code');
    var distPath=path.resolve(projectPath,'dist');
    var entryPath=path.resolve(codePath,'entry');
    var viewPath=path.resolve(codePath,'view');
    var storePath=path.resolve(codePath,'store');
    var actionPath=path.resolve(codePath,'action');
    var reducerPath=path.resolve(codePath,'reducer');
    var wrapperPath=path.resolve(codePath,'wrapper');

    var babelLoaderConf={
        loader:'babel-loader',
        options:{
            presets:['es2015','react','stage-0','stage-1'],
            plugins:['transform-decorators-legacy']
        }
    };
    var entries=(function (extra){
        var entries={
            js:{},
            html:[]
        };
        try{
            fs.readdirSync(entryPath).forEach(function(entry){
                var dir=path.resolve(entryPath,entry);
                var stat=fs.lstatSync(dir);
                if(stat.isDirectory()){
                    var js=path.resolve(dir,'index.js');
                    var html=path.resolve(dir,'index.html');
                    var favicon=path.resolve(dir,'favicon.ico');
                    try{
                        fs.lstatSync(js);
                        fs.lstatSync(html);
                        var htmlOption={};
                        entries.js[entry]=extra.concat(js);

                        if(option.hotReplace){
                            entries.js[entry].push(`!file-loader!${html}`);
                        }

                        htmlOption={
                            filename:path.basename(html),
                            template:html,
                            inject:false
                        };
                        try{
                            fs.lstatSync(favicon);
                            htmlOption.favicon=favicon;
                        }
                        catch(e){}
                        entries.html.push(new HtmlWebpackPlugin(htmlOption));

                    }
                    catch(e){}
                }
            });
        }
        catch(e){}
        return entries;
    })(['babel-polyfill']);
    var result={
        context:codePath,
        entry:entries.js,
        output:{
            path:distPath,
            filename:'[name].[chunkhash:8].js',
            chunkFilename:'[name].[chunkhash:8].chunk.js'
        },
        plugins:[new webpack.HashedModuleIdsPlugin()].concat(entries.html),
        resolve:{
            extensions:['.js', '.vue', '.json'],
            alias:{
                'project':projectPath,
                'action':actionPath,
                'reducer':reducerPath,
                'store':storePath,
                'view':viewPath,
                'wrapper':wrapperPath
            }
        },
        module:{
            rules:[
                {
                    test: /\.(gif|jpg|png|woff|woff2|svg|eot|ttf)\??.*$/,
                    include:[codePath],
                    use:[{
                        loader:'url-loader',
                        options:{
                            limit:option.inlineFileLimit?option.inlineFileLimit:(1024*8),
                            name:'assets/[path][name]-[hash].[ext]',
                        }
                    }]
                },{
                    test:/\.css$/,
                    use:['style-loader','css-loader']
                },{
                    test:/\.less$/,
                    include:[codePath],
                    use:['style-loader',{
                        loader:'css-loader',
                        options:{
                            modules:true
                        }
                    },{
                        loader:'postcss-loader',
                        options:{
                            plugins:[require('autoprefixer')()]
                        }
                    },'less-loader']
                },{
                    test: /\.js$/,
                    include:[codePath],
                    use: [babelLoaderConf]
                }
            ],
        }
    };
    if(option.hotReplace){
        result.plugins.push(new webpack.HotModuleReplacementPlugin());
        var host=option.host;
        var port=option.port;
        var extra=['webpack/hot/dev-server','webpack-dev-server/client?http://'+host+':'+port+'/'];
        Object.keys(result.entry).map(function (key) {
            result.entry[key] = extra.concat(result.entry[key])
        });
        result.output.filename='[name].[hash:8].js';
    }
    if(option.uglify){
        result.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
    }
    if(option.friendlyError){
        result.plugins.push(new FriendlyErrorsPlugin());
    }
    if(option.productionEnv){
        result.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }));
    }
    return result;
};