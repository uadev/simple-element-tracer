const {promisify} = require('util');
const fileUrl = require('file-url');
const getUri = promisify(require('get-uri'));
const {parse: parseUrl} = require('url');

const path2Uri = function (path) {
    let hasProtocol = parseUrl(path).protocol;
    return hasProtocol ? path : fileUrl(path);
}

const originalFileUri = path2Uri(process.argv[2]);
console.log(originalFileUri);

getUri(originalFileUri)
    .then(rs => rs.pipe(process.stdout))
    .catch(console.error);
