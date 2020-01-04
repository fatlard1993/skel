#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const rootFolder = require('find-root')(__dirname);

function rootPath(){ return path.join(rootFolder, ...arguments); }

var templates = [];

function registerTemplate(name){ templates.push(name); }

function registerTemplateFolder(folder){
	var folderPath = folder ? rootPath('templates', folder) : rootPath('templates');

	fs.readdirSync(folderPath).forEach((name) => {
		var file = path.join(folderPath, name);

		if(fs.lstatSync(file).isDirectory()) return registerTemplateFolder(name);

		registerTemplate(`${folder ? folder +'/' : ''}${name.replace('.json', '')}`);
	});
}

registerTemplateFolder();

yargs.alias({
	h: 'help',
	ver: 'version',
	v: 'verbosity',
	s: 'simulate',
	f: 'folder',
	t: 'type',
	n: 'name'
});

yargs.boolean(['h', 'ver']);

yargs.default({
	v: 1,
	f: process.cwd()
});

yargs.describe({
	h: 'This',
	v: '<level>',
	s: 'See what would happen, without making changes',
	f: '<folder>',
	t: `<type> (${templates.join(' | ')})`,
	n: '<name>'
});

var opts = yargs.argv;

opts.rootFolder = rootFolder;
opts.templates = templates;

delete opts._;
delete opts.$0;
delete opts.v;
delete opts.f;
delete opts.t;
delete opts.n;

opts.verbosity = Number(opts.verbosity);

//log args polyfill
process.env.DBG = opts.verbosity;
process.env.COLOR = true;

const log = require('log');

log(1)(opts);

if(!templates.length) return log.error(`No templates exist yet! Put your templates in ${rootPath('templates')}`);

(require('./skel')).init(opts);