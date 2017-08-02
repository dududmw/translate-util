#!/usr/bin/env node
var webpack = require('webpack');
var log = require('npmlog');
var rimraf = require('rimraf');
var program = require('commander');
var path = require('path');
program
    .option('-c, --config [config]', 'config factory filename default normal')
    .parse(process.argv);
var configFactoryPath=program.config?path.resolve('../config-factory',program.config):'../config-factory/standard';
var configFactory = require(configFactoryPath);
var config = configFactory({
    uglify: true,
    productionEnv: true,
    inlineFileLimit: 1024 * 8,
});
rimraf(config.output.path, function (err) {
    if (err) {
        log.error(err);
        return;
    }
    webpack(config, function (err) {
        if (err) {
            log.error(err);
            return;
        }
        log.info('Build success');
    });
});