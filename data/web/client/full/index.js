// includes log dom socket-client
// babel
/* global log dom socketClient */

const ${upperCamelName} = {
	init: function(){
		socketClient.init();

		socketClient.on('init', (data) => {
			${upperCamelName}.draw(data);
		});
	},
	draw: function(){

	}
};

dom.onLoad(${upperCamelName}.init);