#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const rootFolder = require('find-root')(__dirname);

function rootPath(){ return path.join(rootFolder, ...arguments); }

process.chdir(rootFolder);

yargs.alias({
	h: 'help',
	v: 'verbosity',
	ver: 'version'
});

yargs.boolean(['h', 'ver']);

yargs.default({
	v: 1
});

yargs.describe({
	h: 'This',
	v: '<level>'
});

const args = yargs.argv;

['_', '$0', 'v'].forEach((item) => { delete args[item]; });

const opts = Object.assign(args, { args: Object.assign({}, args), rootFolder, verbosity: Number(args.verbosity) });

const log = new (require('log'))({ tag: '${name}', color: true, verbosity: opts.verbosity });

log(1)('Options', opts);

(require('./${camelName}')).init(opts);