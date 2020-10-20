#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const util = require('js-util');
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

yargs.parserConfiguration({
	'camel-case-expansion': false
});

yargs.alias({
	h: 'help',
	ver: 'version',
	v: 'verbosity',
	s: 'simulate',
	S: 'strict',
	f: 'folder',
	F: 'force',
	t: 'type',
	n: 'name',
	c: 'configure'
});

yargs.boolean(['h', 'ver', 'c']);

yargs.default({
	v: 1,
	f: process.cwd()
});

yargs.describe({
	h: 'This',
	v: '<level>',
	s: 'See what would happen, without making changes',
	S: 'Exit on unmatched options',
	f: '<folder>',
	F: 'Force (for now just forces an unsanitary name)',
	t: `<type> (${templates.join(' | ')})`,
	n: '<name>',
	c: 'Save all options to config'
});

var args = yargs.argv;

['_', '$0', 'v', 'f', 't', 'n', 'c'].forEach((item) => { delete args[item]; });

var opts = Object.assign(args, { args: Object.assign({}, args), rootFolder, templates, verbosity: Number(args.verbosity) });

const log = new (require('log'))({ tag: 'skel', color: true, verbosity: opts.verbosity });

log(1)('Options', opts);

if(!templates.length) return log.error(`No templates exist yet! Put your templates in ${rootPath('templates')}`);

if(!opts.name) return log.error(`No name was provided, you must supply a name with -n or --name`);

var cleanName = util.fromCamelCase(opts.name.replace(/[\s_]/gi, '-')).toLowerCase();

if(cleanName !== opts.name){
	if(opts.force) log.warn(`The name "${opts.name}" is unsanitary`);
	else{
		log.warn(`Cleaned name from "${opts.name}" to "${cleanName}"`);

		opts.name = cleanName;
	}
}

(require('./skel')).init(opts);