const Jimp = require('jimp');

// MC escapes the = sign, no idea why
function escapeEquals(text) {
    return text.replace('==','\\u003d\\u003d')
}

async function asPngDataUrl(url,title) {
    const image = await Jimp.read(url);
    image.cover(64,64);

    const buffer = await image.getBufferAsync('image/png');
    const buffer_string = escapeEquals(buffer.toString('base64'));

    const data_url = 'data:image/png;base64,'+buffer_string
    console.log(title)
    console.log(data_url)

    return data_url
}

module.exports = {asPngDataUrl};