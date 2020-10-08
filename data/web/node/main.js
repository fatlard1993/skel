const path = require('path');

const log = require('log');
const SocketServer = require('websocket-server');

const ${upperCamelName} = {
	init: function(opts){
		const { app, staticServer } = require('http-server').init(opts.port, opts.rootFolder);

		this.socketServer = new SocketServer({ server: app.server });

		app.use('/resources', staticServer(path.join(opts.rootFolder, 'client/resources')));
		app.use('/fonts', staticServer(path.join(opts.rootFolder, 'client/fonts')));

		app.get('/home', (req, res, next) => { res.sendPage('index'); });

		this.socketServer.registerEndpoints(this.socketEndpoints);
	},
	socketEndpoints: {
		client_connect: function(){
			log('Client connected');

			this.reply('init', {});
		}
	}
};

module.exports = ${upperCamelName};