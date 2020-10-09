const ${camelName} = {

};

if(typeof window === 'undefined'){
	${camelName}.isNode = true;

	module.exports = ${camelName};
}