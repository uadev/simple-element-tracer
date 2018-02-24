const {promisify} = require('util');
const fileUrl = require('file-url');
const getUri = promisify(require('get-uri'));
const {parse: parseUrl} = require('url');

const sampleElementCSSPath = '#make-everything-ok-button';

const path2Uri = function (path) {
    let hasProtocol = parseUrl(path).protocol;
    return hasProtocol ? path : fileUrl(path);
}

function getFileList() {
  return process.argv.slice(2);
}

const files = getFileList().map(path2Uri);
const originalFileUri = files.shift();

console.log('Original file:', originalFileUri, 'diffs:', files);

function readFromStream(rs) {
    let data = '';
    return new Promise(function(resolve, reject) {
        // resolve with location of saved file
        rs.on('data', chunk => data += chunk);
        rs.on('end', () => resolve(data));
        rs.on("error", reject);
    })
}

getUri(originalFileUri)
    .then(readFromStream)
    .then(console.log)
    .catch(console.error);

console.log(originalFileData);
