# Skeleton

With `skel` you can create skeleton files and folder structures with ease!

## Usage

1. Install it globally: `npm install -g fatlard1993/skel`
2. Run `skel` from wherever

### Options

```
Options:
  -h, --help        Show help                                          [boolean]
  -v, --verbosity   <level>                                         [default: 1]
  -s, --simulate    See what would happen, without making changes
  -f, --folder      <folder>                                      [default: "/"]
  -t, --type        <type> (example | template)
  -n, --name        <name>
  -c, --configure   Save all options to config                         [boolean]
  --ver, --version  Show version number                                [boolean]
```

### Examples

Generic:
```
skel -t template -f ~/code -n cool-new-project
```

Fabric/Block:
```
skel -t fabric/block -n cool-mod --maven cool_mod
```

node:
```
skel -t node -f ./node_code -n neat-node-app
```

#### Scripts

Batch:
```
ECHO "skel %1"
ECHO "template %2"
```

Bash:
```
#!/bin/bash

echo "skel: ${1}"
echo "template: ${2}"
```

JavaScript:
```
module.exports = function(skel, template){
	console.log(skel, template);
};
```