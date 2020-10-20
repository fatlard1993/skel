import Log from 'log';
import dom from 'dom';

const ${camelName} = {
	log: new Log({ tag: '${name}', verbosity: parseInt(dom.storage.get('logVerbosity') || 0) }),
	init: function(opts){
		${camelCase}.log()('Initialized', opts);
	}
};