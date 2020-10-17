const log = new (require('log'))({ tag: '${name}' });

const ${camelName} = {
	init: function(opts){
		log.info('Initialized', opts);
	}
};

module.exports = ${camelName};