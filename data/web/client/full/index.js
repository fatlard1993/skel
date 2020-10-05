// includes log dom socket-client
// babel
/* global log dom socketClient */

const ${camelName} = {
	init: function(){
		socketClient.init();
	}
};

dom.onLoad(${camelName}.init);