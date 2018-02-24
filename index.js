
//Logger from the snippet
//const logger = require('bunyan').createLogger({ name: require('./package.json').name });
//const log = logger.info

const logger = console;
const log = logger.log;

const config = {
    originalSelector: '#make-everything-ok-button'
}

const path2Uri = function (path) {
//You may find it's stupid to require file modules like this, but this is the
//only function that will require those modules
    const fileUrl = require('file-url');
    const {parse: parseUrl} = require('url');

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

function $findEl(html, selector) {
    if (!selector) {
        throw new Error('No selector provided');
    }
    return require('cheerio')(selector, html);
}

function readDataFromUri(uri) {
    const {promisify} = require('util');
    const getUri = promisify(require('get-uri'));
    return getUri(uri)
        .then(readFromStream)
        .catch(console.error);
}



function $renderCssPath($el) {
//Probably not the best Path representation, but it works for most cases;
//TODO think about n-th child representation
    function $renderEl($el) {
        function renderId($el) {
            return $el.attribs.id
                ? `#${$el.attribs.id}`
                :'';
        }
        function renderClass($el) {
            return $el.attribs.class
                ? `.${$el.attribs.class.split(' ').join('.')}`
                : '';
        }
        return `${$el.name}${renderId($el)}${renderClass($el)}`;
    }

    var path = [];
    path.push($renderEl($el[0]));

    $el.parents().each((i, el) => {
        path.push($renderEl(el));
    });
    return path.reverse().join(' > ');
}

(async () => {
    const files = getFileList().map(path2Uri);
    const originalFileUri = files.shift();

    logger.info('Original file:', originalFileUri, "\ndiffs:", files);

    const originalFileData = await readDataFromUri(originalFileUri);
    const $originalEl = $findEl(originalFileData, config.originalSelector);

    log($renderCssPath($originalEl));

})();

