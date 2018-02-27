const $ = require('cheerio');
//Logger from the snippet

//const logger = require('bunyan').createLogger({ name: require('./package.json').name });
//const log = logger.info

const logger = console;
const log = logger.log;
logger.result = function (...args) {
    this.log(require('colors/safe').yellow(args));
}

const config = {
    originalSelector: '#make-everything-ok-button'
}

const path2Uri = function (path) {
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
    return new Promise((resolve, reject) => {
        rs.on('data', chunk => data += chunk);
        rs.on('end', () => resolve(data));
        rs.on("error", reject);
    })
}

function findEl(html, selector) {
    if (!selector) {
        throw new Error('No selector provided');
    }
    return $(selector, html);
}

function readDataFromUri(uri) {
    const {promisify} = require('util');
    const getUri = promisify(require('get-uri'));
    return getUri(uri)
        .then(readFromStream)
        .catch(console.error);
}


function renderEl(el) {
    return `${el.name}${t$href(el)}${t$attr `#id${el}`}${t$attr `.class${el}`}`
}

function t$href({attribs = {}}) {
    if (!attribs['href'])
        return '';
    return `[href="${attribs.href}"]`
}

function t$attr(prop, {attribs = {}}) {
    const sep = prop[0].charAt(0);
    prop = prop[0].slice(1);

    if (!attribs[prop])
        return '';

    return `${sep}${attribs[prop].split(' ').join(sep)}`;
}

function renderCssPath(el) {
//Probably not the best Path representation, but it works for most cases;
//TODO think about n-th child representation

    $el = $(el);
    var path = [];
    path.push(renderEl(el));

    $el.parents().each((i, el) => {
        path.push(renderEl(el));
    });
    return path.reverse().join(' > ');
}

function selectorsFromEl(el) {
    return [
        getSelectorById(el),
        getSelectorByHref(el),
        getSelectorsByClass(el)
    ].join(',');
}

function getSelectorById(el) {
    return `${el.name}#${el.attribs.id}`
}

function getSelectorByHref(el) {
    return `${el.name}${t$href(el)}`
}

function getSelectorsByClass(el) {
    if (!el && !el.attribs.class)
        return '';
    const selectors = el.attribs.class
        .split(' ')
        .sort( (a, b) => {return b.length - a.length;})
        .map( e => el.name + '.' + e)
    selectors.unshift(el.name + t$attr `.class${el}`);

    return selectors;
}

function filterHidden() {
    return $(this).css('display') !== 'none';
}

function findAs(original, diffs, skip = []) {
    const originalPath = renderCssPath(original);
    const originalId = original.attribs.id;
    const originalEl = renderEl(original);
    const originalHref = original.attribs.href;
    const originalClass = t$attr `.class${original}`

    const exactPath = diffs.find( el => renderCssPath(el) === originalPath);
    if (exactPath) {
        return {by: 'exactPath', path: renderCssPath(exactPath)};
    }
    if (originalId) {
        const byId = diffs.find( el => originalId === el.attribs.id);
        if (byId) {
            return {by: 'id', path: renderCssPath(byId)};
        }
    }

    const exactEl = diffs.find(el => originalEl === renderEl(el));
    if (exactEl) {
        return {by: 'el', path: renderCssPath(exactPath)};
    }

    if (originalHref.length > 1 && !skip.includes('exactHref')) {
        exactHref = diffs.filter(el => originalHref === el.attribs.href);
        if (exactHref.length === 1) {
            return {by: 'href', path: renderCssPath(exactHref[0])};
        }

        if (exactHref.length > 1) {
            return findAs(original, exactHref, ['exactHref']);
        }
    }

    if (originalClass) {
        const exactClass = diffs.find(el => originalClass === t$attr `.class${el}`);
        if (exactClass) {
            return {by: 'exactClass', path: renderCssPath(exactClass)};
        }
    }

    return {by: 'default', path: renderCssPath(diffs[0])};
}

(async () => {
    const files = getFileList().map(path2Uri);
    const originalFileUri = files.shift();

    log("Original file:\n", originalFileUri, "\ndiffs:", files);

    const originalFileData = await readDataFromUri(originalFileUri);
    const originalEl = findEl(originalFileData, config.originalSelector)[0];
    const originalPath = renderCssPath(originalEl);

    const similarsSelector = selectorsFromEl(originalEl);
    if (!similarsSelector) {
        log('Original element too small amount of attributes');
        return ;
    }
    log('Selectors:', similarsSelector);
    log("OriginalPath:\n" + renderCssPath(originalEl));

    files.map(async (uri) => {
        fileData = await readDataFromUri(uri);
        const found = $(similarsSelector, fileData)
            .filter( filterHidden )
            .toArray();
        log("\n" + uri, "\nFound:", found.length);
        found.forEach(el => {log(renderCssPath(el))});

        bestMatch = findAs(originalEl, found);
        if (bestMatch) {
            logger.result(`Best match by ${bestMatch.by}: ${bestMatch.path}`);
        }
    });


})();

