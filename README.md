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
# Test
```sh
$ npm test
```

# Example 
```sh
$ node index.js sample-0-origin.html https://agileengine.bitbucket.io/keFivpUlPMtzhfAy/samples/sample-0-origin.html https://agileengine.bitbucket.io/keFivpUlPMtzhfAy/samples/sample-2-container-and-clone.html https://agileengine.bitbucket.io/keFivpUlPMtzhfAy/samples/sample-3-the-escape.html sample-4-class.html
```

# TODO
[x] Support both local and remote URIs as arguments  
[x] Make it easy to test with `npm test  
[x] Add support for more than one diff page  
[x] Read file data from stream  
[x] Async assign stream data to string  
[] Read target element props  
[] Add help cli usage text  
[] Add README.md description about matching rules  
[] Implement scoring algorythm  
[x] Display result as PATH  
[x] Replaceable logger  
[] Add full config module support  
[] Add support for n-th child in CSSPath
[x] Add filter for hidden elements
[x] Add matcher by Exact path
[x] Add matcher by Id
[x] Add mathcer by href
[x] Add matcher by complete class names
[] Add mathcer by partial class names match
[] Continue scoring if exactMatchers have more than one result
