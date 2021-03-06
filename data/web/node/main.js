const path = require('path');

const log = new (require('log'))({ tag: '${name}' });
const SocketServer = require('websocket-server');

const ${camelName} = {
	init: function(opts){
		const { app, staticServer } = require('http-server').init(opts.port, opts.rootFolder);

		this.socketServer = new SocketServer({ server: app.server });

		app.use('/resources', staticServer(path.join(opts.rootFolder, 'client/resources')));
		app.use('/fonts', staticServer(path.join(opts.rootFolder, 'client/fonts')));

		app.get('/home', (req, res, next) => { res.sendPage('index'); });

		this.socketServer.registerEndpoints(this.socketEndpoints);

		log('Initialized');
	},
	socketEndpoints: {
		client_connect: function(){
			log('Client connected');

			this.reply('init', {});
		}
	}
};

module.exports = ${camelName};