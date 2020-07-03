const Jimp = require('jimp');

async function asPngDataUrl(url) {
    const image = await Jimp.read(url);
    image.cover(64,64);

    const buffer = await image.getBufferAsync('image/png');
    // MC escapes the = sign, no idea why
    const data_url = 'data:image/png;base64,'+buffer.toString('base64').replace('==','\\u003d\\u003d')
    return data_url
}

module.exports = {asPngDataUrl};