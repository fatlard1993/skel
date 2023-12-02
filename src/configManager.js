const fs = require('fs');
const path = require('path');

const log = new (require('log'))({ tag: 'config-manager' });

class Config {
	constructor(configPath = path.join(process.cwd(), 'config.json'), defaults = {}){
		this.path = configPath;
		this.defaults = defaults;

		this.load();
	}

	load(){
		try{
			var fileContents = fs.readFileSync(this.path);

			this.current = JSON.parse(fileContents);

			this.fillDefaults();
		}

		catch(err){
			log('Failed to parse config .. Replacing with defaults');
			log.error(err.code === 'ENOENT' ? 2 : 0)(err);

			this.current = this.defaults;

			this.save();
		}

		log(1)(`Loaded config ${this.path}`);
		log(2)(this.current);
	}

	save(config = this.current){
		config = JSON.stringify(config, null, '	', 2);

		try{
			fs.writeFileSync(this.path, config);

			log(`Saved config ${this.path}`);
			log(2)(config);
		}

		catch(err){
			log.error('Failed to save config', err);
		}
	}

	fillDefaults(){
		var defaultKeys = Object.keys(this.defaults), changed;

		for(var x = 0, count = defaultKeys.length, key; x < count; ++x){
			key = defaultKeys[x];

			if(typeof this.current[key] === 'undefined'){
				this.current[key] = this.defaults[key];

				changed = true;
			}
		}

		if(changed) this.save();
	}
}

module.exports = Config;