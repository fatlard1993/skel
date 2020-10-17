import Log from 'log';
import dom from 'dom';
import socketClient from 'socket-client';

const log = new Log();

const ${camelName} = {
	init: function(){
		socketClient.init();

		socketClient.on('init', (data) => {
			${camelCase}.log()('Initialized', opts);

			${camelName}.draw(data);
		});
	},
	draw: function(){
		log()('draw');
	}
};

dom.onLoad(${camelName}.init);