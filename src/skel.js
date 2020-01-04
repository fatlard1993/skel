const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const log = require('log');
const fsExtended = require('fs-extended');

const skel = {
	init: function(opts){
		this.rootPath = function rootPath(){ return path.join(opts.rootFolder, ...arguments); };
		this.config = new (require('config-manager'))(this.rootPath('config.json'));
		this.opts = Object.assign(this.config.current, opts);

		if(!this.opts.type) return log.error('No type defined ... Provide one with --type <type>');
		if(!this.opts.name) this.opts.name = this.opts.type;
		if(!this.opts.templates.includes(this.opts.type)) return log.error(`Type "${this.opts.type}" is not a defined template type ... Try: ${this.opts.templates.join(' | ')}`);
		if(fs.existsSync(path.join(this.opts.folder, this.opts.name))) return log.warn(`${path.join(this.opts.folder, this.opts.name)} already exists!`);

		this.create(require(this.rootPath('templates', this.opts.type)));
	},
	create: function(template, folder = process.cwd()){
		log(1)(template);

		var scripts = [];

		if(template._scripts){
			scripts = template._scripts;

			delete template._scripts;
		}

		Object.keys(template).forEach((name) => {
			const subTemplate = template[name];

			name = this.fillOpts(name);

			if(typeof subTemplate === 'string') return this.writeFile(name, folder, subTemplate);

			else if(subTemplate._jsonFile){
				delete subTemplate._jsonFile;

				return this.writeFile(name, folder, JSON.stringify(subTemplate, null, 2));
			}

			else if(subTemplate._data){
				if(fs.existsSync(this.rootPath('data', subTemplate._data))) fsExtended.copySync(this.rootPath('data', subTemplate._data), path.join(folder, name));

				else log.error(`Missing ${this.rootPath('data', subTemplate._data)}`);

				return;
			}

			else if(Array.isArray(subTemplate)){
				var templateFile = '';

				subTemplate.forEach((file) => {
					if(fs.existsSync(this.rootPath('data', file))) templateFile += fsExtended.catSync(this.rootPath('data', file));

					else log.error(`Missing ${this.rootPath('data', file)}`);
				});

				return this.writeFile(name, folder, templateFile);
			}

			log(1)('mkdir', path.join(folder, name));

			fsExtended.mkdir(path.join(folder, name));

			this.create(subTemplate, path.join(folder, name));
		});

		scripts.forEach((script) => {
			log.info(script);

			if((!this.opts.platform || this.opts.platform === 'linux') && fs.existsSync(this.rootPath('scripts', script +'.sh'))) exec(this.rootPath('scripts', `${script}.sh ${this.opts.rootFolder} ${path.join(folder, this.opts.name)}`), log.info());

			if((!this.opts.platform || this.opts.platform === 'windows') && fs.existsSync(this.rootPath('scripts', script +'.bat'))) exec(this.rootPath('scripts', `${script}.bat ${this.opts.rootFolder} ${path.join(folder, this.opts.name)}`), log.info());

			if(fs.existsSync(this.rootPath('scripts', script +'.js'))) require(this.rootPath('scripts', script))(this.opts.rootFolder, path.join(folder, this.opts.name));
		});
	},
	fillOpts: function(text){
		Object.keys(this.opts).forEach((option) => { text = text.replace(new RegExp('\\${'+ option +'}', 'g'), this.opts[option]); });

		return text;
	},
	writeFile: function(name, dir, text = ''){
		name = path.join(dir, name);
		text = this.fillOpts(text);

		log(this.opts.simulate ? 0 : 1)('CREATE FILE - Filename: '+ name, '\n', text);

		if(!this.opts.simulate)	fs.writeFileSync(name, text);
	}
};

module.exports = skel;