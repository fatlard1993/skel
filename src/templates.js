module.exports = {
	'README.md': (opts) => {
		return `# ${opts.projectName}`;
	},
	'.gitignore': () => {
		return '**/node_modules';
	},
	'index.js': () => {
		return '#!/usr/bin/env node';
	},
	'package.json': (opts) => {
		return JSON.stringify({
			name: `${opts.projectName}`,
			version: '1.0.0',
			description: '',
			main: 'src/index.js',
			author: `${opts.username}`,
			license: 'ISC',
			scripts: {
				test: 'echo "Error: no test specified" && exit 1'
			},
			repository: {
				type: 'git',
				url: `git+https://github.com/${opts.username}/${opts.projectName}.git`
			},
			bugs: {
				url: `https://github.com/${opts.username}/${opts.projectName}/issues`
			},
			homepage: `https://github.com/${opts.username}/${opts.projectName}#readme`,
			eslintConfig: {
				extends: 'rules'
			},
			devDependencies: {
				'eslint-config-rules': `github:${opts.username}/eslint-config-rules`,
				'babel-eslint': '^10.0.1',
				eslint: '^5.15.1'
			}
		}, null, '	');
	},
	'SETUP': () => {
		return `
			#!/bin/bash

			echo " - Untracked files to be removed -"

			git clean -xdn

			echo -e "\n - Packages that can be updated -"

			ncu

			echo -e "\n[enter] to continue. [y + enter] to update package versions and continue."

			read -p "" answer

			if [ "$answer" == "y" ]; then
				echo -e "\nUpdating package.json\n"

				ncu -u
			fi

			if [ "$1" == "dev" ]; then
				echo -e "Removing package-lock.json\n"

				rm -f ./package-lock.json
			fi

			git clean -xdf

			echo -e "\nInstalling packages"

			if [ "$1" == "dev" ]; then
				zelda -i -p $HOME/Projects -f $HOME/Projects/symetrix -f $HOME/Projects/lib
			else
				npm i --only=prod
			fi
		`;
	}
};