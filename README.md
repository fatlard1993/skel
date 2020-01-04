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
  --ver, --version  Show version number                                [boolean]
```

### Example

`skel -t template -f ~/code -n cool-new-project`

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