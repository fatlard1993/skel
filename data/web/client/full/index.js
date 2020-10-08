// includes log dom socket-client
// babel
/* global log dom socketClient */

const ${camelName} = {
	init: function(){
		socketClient.init();

		socketClient.on('init', (data) => {
			${camelName}.draw(data);
		});
	},
	draw: function(){

	}
};

dom.onLoad(${camelName}.init);