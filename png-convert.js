const Jimp = require('jimp');

async function asPngDataUrl(url,title) {
    const image = await Jimp.read(url);
    image.cover(64,64).quality(25)

    const buffer = await image.getBufferAsync('image/png');

    const data_url = 'data:image/png;base64,'+buffer.toString('base64')
    return data_url
}

module.exports = {asPngDataUrl};