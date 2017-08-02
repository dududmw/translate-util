#!/usr/bin/env node
var webpack = require('webpack');
var log = require('npmlog');
var program = require('commander');
var path = require('path');
var WebpackDevServer = require('webpack-dev-server');

program
    .option('-h, --host <host>', 'server host default localhost')
    .option('-p, --port [port]', 'server port default 8080')
    .option('-c, --config [config]', 'config factory filename default normal')
    .parse(process.argv);
var port = program.port||8080;
var host = program.host||'localhost';
var configFactoryPath=program.config?path.resolve('../config-factory',program.config):'../config-factory/standard';
var configFactory = require(configFactoryPath);
var config = configFactory({
    hotReplace: true,
    friendlyError: true,
    host: host,
    port: port,
    inlineFileLimit: 1024 * 8,
});
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
    compress: true,
    hot: true,
    quiet: true,
    stats: {
        colors: true
    },
    inline: true,
    proxy: {
    }
});
server.listen(port, host, function (err) {
    if (err) {
        log.error(err);
        return;
    }
    log.info('Listening at http://' + host + ':' + port);
})