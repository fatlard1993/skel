module.exports = {
	comments: true,
	strings: true,
	identifiers: true,
	templates: true,
	lang: 'en_US',
	skipWords: [
		'ecma',
		'compat',
		'eslintrc',
		'multiline',
		'builtins',
		'cjs',
		'globals',
		'argv',
		'argi',
		'zelda',
		'fs',
		'symlink',
		'symlinks',
		'symlinked',
		'readdir',
		'os',
		'homedir',
		'lstat',
		'unlink',
		'rmdir',
		'sep',
	],
	skipIfMatch: ['\\d+v[wh]'],
	skipWordIfMatch: [],
	minLength: 1,
};