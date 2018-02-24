# simple-element-tracer
Simple tool to track down selected elements on dynamic web pages

# Installation
```sh
$ npm i
```

# Usage
```sh
$ node index.js node index.js original.html diff1.html [diff2.html ...  diffN.html]
```
# TODO
[x] Support both local and remote URIs as arguments
[x] Make it easy to test with `npm test`
[x] Add support for more than one diff page
[x] Read file data from stream
[] Read target element props
[] Add help cli usage text
[] Add README.md description about matching rules
[] Implement scoring algorythm
[] Display result as PATH
[] Add full config module support
