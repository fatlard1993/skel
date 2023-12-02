const os = require('os');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const log = new (require('log'))({ tag: 'skel' });
const { default: util } = require('./utils');

const catSync = (filePath) =>{
	var fileData;

	try{ fileData = fs.readFileSync(filePath, 'utf8'); }

	catch(err){
		if(err.code !== 'ENOENT') return log.error(err);

		log.warn(1)(`Can't read ${filePath}, doesn't exist`);

		fileData = '';
	}

	return fileData;
}

const copySync = (source, target) => {
	log.info(1)('copy', source, target);

	if(fs.existsSync(target) && fs.lstatSync(target).isDirectory()) target = path.join(target, path.basename(source));

	fs.writeFileSync(target, fs.readFileSync(source));
}

const mkdir = (dir) => {
	if(!dir) return;

	log(4)(`Creating directory: ${dir}`);

	for(var x = dir.length - 2; x >= 0; --x){
		if(dir.charAt(x) === '/' || dir.charAt(x) === path.sep){
			mkdir(dir.slice(0, x));

			break;
		}
	}

	try{
		fs.mkdirSync(dir);

		log()(`Created directory: ${dir}`);
	}
	catch(err){
		if(err.code !== 'EEXIST') return log.error()(dir, err);

		log.warn(4)(`Can't make ${dir}, already exists`);
	}
}

const skel = {
	optTransformations: {
		regReplace: function(base, regEx, str){
			return base.replace(new RegExp(regEx), str);
		}
	},
	init: function(opts){
		this.rootPath = function rootPath(){ return path.join(opts.rootFolder, ...arguments); };
		this.config = new (require('./configManager'))(path.join(os.homedir(), '.skel.config'));

		if(opts.configure){
			this.config.current = Object.assign(this.config.current, opts.args);

			['configure', 'folder', 'verbosity'].forEach((item) => { delete this.config.current[item]; });

			return this.config.save();
		}

		this.opts = Object.assign(this.config.current, opts);

		if(!this.opts.type) return log.error('No type defined ... Provide one with --type <type>');
		if(!this.opts.name) this.opts.name = this.opts.type;
		if(!this.opts.templates.includes(this.opts.type)) return log.error(`Type "${this.opts.type}" is not a defined template type ... Try: ${this.opts.templates.join(' | ')}`);
		if(fs.existsSync(path.join(this.opts.folder, this.opts.name))) return log.warn(`${path.join(this.opts.folder, this.opts.name)} already exists!`);

		this.create(require(this.rootPath('templates', this.opts.type)));

		log.info(`Successfully built [${this.opts.type}] ${this.opts.name}`);
	},
	create: function(template, folder = process.cwd()){
		log(1)('Create template: ', template);

		var scripts = [];

		if(template._scripts){
			scripts = template._scripts;

			delete template._scripts;
		}

		if(template._opts){
			if(typeof template._opts === 'string') template._opts = require(this.rootPath('options', template._opts));

			if(typeof template._opts === 'object' && template._opts instanceof Array) util.clone(template._opts).forEach((opt, index) => { template._opts = Object.assign(index === 0 ? {} : template._opts, require(this.rootPath('options', template._opts))); });

			log(1)('Loading template._opts', template._opts);

			Object.keys(template._opts).forEach((key) => {
				if(this.opts[key]) return;

				if(typeof template._opts[key] === 'string') this.opts[key] = this.fillOpts(template._opts[key]);

				else if(typeof template._opts[key] === 'object'){
					var base = this.fillOpts(template._opts[key].base);

					template._opts[key].apply.forEach((transformation, index) => {
						var args = template._opts[key].apply[index].args ? template._opts[key].apply[index].args.map((arg) => { return typeof arg === 'string' ? this.fillOpts(arg) : arg; }) : [];

						transformation = template._opts[key].apply[index].name;

						if(typeof base[transformation] === 'function') base = base[transformation](...args);

						else if(typeof this.optTransformations[transformation] === 'function') base = this.optTransformations[transformation](base, ...args);

						else if(typeof util[transformation] === 'function') base = util[transformation](base, ...args);

						template._opts[key].base = this.opts[key] = base;
					});
				}
			});

			this.opts = Object.assign(template._opts, this.opts);

			delete template._opts;
		}

		log(2)('Loaded options', this.opts);

		Object.keys(template).forEach((name) => {
			const subTemplate = template[name];

			name = this.fillOpts(name);

			if(typeof subTemplate === 'string') return this.writeFile(name, folder, subTemplate);

			else if(subTemplate._jsonFile){
				delete subTemplate._jsonFile;

				return this.writeFile(name, folder, JSON.stringify(subTemplate, null, 2));
			}

			else if(subTemplate._data){
				if(fs.existsSync(this.rootPath('data', subTemplate._data))) copySync(this.rootPath('data', subTemplate._data), path.join(folder, name));

				else log.error(`Missing ${this.rootPath('data', subTemplate._data)}`);

				return;
			}

			else if(Array.isArray(subTemplate)){
				var templateFile = '';

				subTemplate.forEach((file) => {
					if(fs.existsSync(this.rootPath('data', file))) templateFile += catSync(this.rootPath('data', file));

					else log.error(`Missing ${this.rootPath('data', file)}`);
				});

				return this.writeFile(name, folder, templateFile);
			}

			log(1)('mkdir', path.join(folder, name));

			mkdir(path.join(folder, name));

			this.create(subTemplate, path.join(folder, name));
		});

		scripts.forEach((script) => {
			log.info('Running post script:', script);

			if(this.opts.simulate) return;

			if((!this.opts.platform || this.opts.platform === 'linux') && fs.existsSync(this.rootPath('scripts', script +'.sh'))) exec(this.rootPath('scripts', `${script}.sh ${this.opts.rootFolder} ${path.join(folder, this.opts.name)}`), log.info());

			if((!this.opts.platform || this.opts.platform === 'windows') && fs.existsSync(this.rootPath('scripts', script +'.bat'))) exec(this.rootPath('scripts', `${script}.bat ${this.opts.rootFolder} ${path.join(folder, this.opts.name)}`), log.info());

			if(fs.existsSync(this.rootPath('scripts', script +'.js'))) require(this.rootPath('scripts', script))(this.opts.rootFolder, path.join(folder, this.opts.name));
		});
	},
	fillOpts: function(text){
		Object.keys(this.opts).forEach((option) => { text = text.replace(new RegExp('\\${'+ option +'}', 'g'), this.opts[option]); });

		var unmatchedOpts = text.match(/\${\w+}/gm);

		if(unmatchedOpts && unmatchedOpts.length) log.warn(`Unmatched options: ${unmatchedOpts.join(', ')}`);

		if(unmatchedOpts && this.opts.strict) throw Error('Found unmatched options');

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