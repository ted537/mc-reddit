const Jimp = require('jimp');

async function asPngDataUrl(url) {
    const image = await Jimp.read(url);
    image.cover(64,64).quality(25)
    
    const buffer = await image.getBufferAsync('image/png');
    
    const data_url = 'data:image/png;base64,'+buffer.toString('base64')
    return data_url
}

const cached_data_urls = {};
async function asPngDataUrlCached(url) {
    if (!cached_data_urls.hasOwnProperty(url)) {
        cached_data_urls[url] = await asPngDataUrl(url);
    }
    return cached_data_urls[url];
}

module.exports = {asPngDataUrlCached};