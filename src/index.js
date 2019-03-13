#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const args = require('yargs').argv;

if(args.d) process.env.DBG = args.d;
if(args.dev) process.env.COLOR = 1;

const log = require('log');
const fsExtended = require('fs-extended');
const findRoot = require('find-root');
const Config = require('config-manager');

const templates = require('./templates');

const rootFolder = findRoot(process.cwd());

var config = new Config();

var opts = Object.assign(config.current, args);

function makeTemplateFile(fileName, opts){
	var fileNameSplit = /(\/?.+\/)(.*)/g.exec(fileName), fileLocation;

	if(fileNameSplit){
		opts.path = fileNameSplit[1];
		fileName = fileNameSplit[2];

		fileLocation = path.join(process.cwd(), opts.path);

		if(!fs.existsSync(fileLocation)) fsExtended.mkdir(fileLocation);
	}

	fileLocation = path.join(process.cwd(), opts.path || '', fileName);

	if(fs.existsSync(fileLocation) && !opts.force) return log.warn(`${fileLocation} already exists - to overwrite, run with --force`);

	fs.writeFileSync(fileLocation, templates[fileName](opts));
}

var files = [];

if(args.f && templates[args.f]){
	makeTemplateFile(args.f, opts);
}

if(args.nodeProject){
	opts.projectName = args.nodeProject;

	files = files.concat(['.gitignore', 'package.json', 'src/index.js']);

	if(!args.server) files = files.concat(['server/index.js']);
}

if(args.server){
	opts.projectName = args.nodeProject;

	files = files.concat(['server/index.js']);
}

if(args.client){
	opts.projectName = args.nodeProject;

	files = files.concat([`client/js/${typeof args.client === 'string' ? args.client : 'index'}.js`, `client/css/${typeof args.client === 'string' ? args.client : 'index'}.css`, `client/resources/site.webmanifest`, `client/html/${typeof args.client === 'string' ? args.client : 'index'}.html`]);
}

if(files){
	files.forEach((file) => {
		makeTemplateFile(file, opts);
	});
}