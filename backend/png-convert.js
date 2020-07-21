const Jimp = require('jimp');

async function asPngDataUrl(url) {
    const image = await Jimp.read(url);
    image.cover(64,64).quality(25)
    
    const buffer = await image.getBufferAsync('image/png');
    
    const data_url = 'data:image/png;base64,'+buffer.toString('base64')
    return data_url
}

const cached_data_urls = {};
async function asPngDataUrlCached(url,fallback) {
    if (!cached_data_urls.hasOwnProperty(url)) {
        try {
            cached_data_urls[url] = await asPngDataUrl(url);
        }
        catch(err) {
            console.warn(`error when loading thumbnail: ${err}`);
            cached_data_urls[url] = await asPngDataUrlCached(fallback);
            return cached_data_urls[url];
        }
    }
    return cached_data_urls[url];
}

module.exports = {asPngDataUrlCached};