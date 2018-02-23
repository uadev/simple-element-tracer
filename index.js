const {promisify} = require('util');
const fileUrl = require('file-url');
const getUri = promisify(require('get-uri'));
const {parse: parseUrl} = require('url');

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

//getUri(originalFileUri)
//    .then(rs => rs.pipe(process.stdout))
//    .catch(console.error);
