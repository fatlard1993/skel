const fs = require('fs');
const path = require('path');

const log = require('log');
const fsExtended = require('fs-extended');

const skel = {
	config: new (require('config-manager'))(),
	init: function(opts){
		this.opts = Object.assign(this.config.current, opts);

		this.rootPath = function rootPath(){ return path.join(opts.rootFolder, ...arguments); };

		if(!this.opts.type) return log.error('No type defined ... Provide one with --type <type>');
		if(!this.opts.name) this.opts.name = this.opts.type;
		if(!this.opts.templates.includes(this.opts.type)) return log.error(`Type "${this.opts.type}" is not a defined template type ... Try: ${this.opts.templates.join(' | ')}`);
		if(fs.existsSync(path.join(this.opts.folder, this.opts.name))) return log.warn(`${path.join(this.opts.folder, this.opts.name)} already exists!`);

		this.create(require(this.rootPath('templates', this.opts.type)));
	},
	create: function(template, folder = process.cwd()){
		log(1)(template);

		Object.keys(template).forEach((name) => {
			const subTemplate = template[name];

			name = this.fillOpts(name);

			if(typeof subTemplate === 'string') return this.writeFile(name, folder, subTemplate);

			else if(subTemplate._jsonFile){
				delete subTemplate._jsonFile;

				return this.writeFile(name, folder, JSON.stringify(subTemplate, null, 2));
			}

			log('mkdir', path.join(folder, name));

			fsExtended.mkdir(path.join(folder, name));

			this.create(subTemplate, path.join(folder, name));
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