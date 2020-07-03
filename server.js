const fakeMcServer = require('./mc-server');
const bottleneck = require('./bottleneck');
const { asPngDataUrlCached } = require('./png-convert');
const { getRedditPost } = require('./reddit');

const PORT_START = 25565;
const PORT_COUNT = 10;

function ports() {
    const list = [];
    for (let i=PORT_START;i<PORT_START+PORT_COUNT;++i)
        list.push(i);
    return list;
}

async function getRedditInfo(row) {
    const post = await bottleneck(getRedditPost);

    const thumbnail = post.thumbnail.startsWith('http') ?
        post.thumbnail : 'logo-small.png'
    const info = {
        text:post.title,
        players:post.score,
        max_players:post.num_comments,
        favicon:await asPngDataUrlCached(thumbnail)
    }
    return info;
}

const servers = ports().map(port=>{
    const server = fakeMcServer(()=>getRedditInfo(port-PORT_START))
    server.listen(port);
    return server;
});