const {promisify} = require('util');
const fileUrl = require('file-url');
const getUri = promisify(require('get-uri'));
const {parse: parseUrl} = require('url');

const sampleElementCSSPath = '#make-everything-ok-button';

const path2Uri = function (path) {
    const hasProtocol = parseUrl(path).protocol;
    return hasProtocol ? path : fileUrl(path);
}

function getFileList() {
  return process.argv.slice(2);
}


async function readFromStream(rs) {
    let data = '';
    return new Promise(function(resolve, reject) {
        rs.on('data', chunk => data += chunk);
        rs.on('end', () => resolve(data));
        rs.on("error", reject);
    })
}

function getOriginalElementSigns() {

}

function readDataFromUri(uri) {
    return getUri(uri)
        .then(readFromStream);
}

(async () => {
    const files = getFileList().map(path2Uri);
    const originalFileUri = files.shift();

    console.log('Original file:', originalFileUri, "\ndiffs:", files);

    const originalFileData = await readDataFromUri(originalFileUri);
    console.log(originalFileData);
})();

