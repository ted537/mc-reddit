const fetch = require('node-fetch');

const fakeMcServer = require('./mc-server');
const merge = require('./merge-promise');
const { asPngDataUrl } = require('./png-convert');

const PORT_START = 25565;
const PORT_COUNT = 5;

function ports() {
    const list = [];
    for (let i=PORT_START;i<PORT_START+PORT_COUNT;++i)
        list.push(i);
    return list;
}

let after = ''

async function getRedditJson() {
    const response = await fetch(`http://reddit.com/best.json?count=5&after=${after}`);
    const json = await response.json();
    after = json.data.after;
    return json;
}

async function getRedditInfo(row) {
    const json = await merge(getRedditJson);
    const post = json.data.children[row].data;

    const thumbnail = post.thumbnail.startsWith('http') ?
      post.thumbnail : 'reddit-logo.png'
    const info = {
        text:post.title,
        players:post.score,
        max_players:post.num_comments,
        favicon:await asPngDataUrl(thumbnail,post.title)
    }
    return info;
}

const servers = ports().map(port=>{
    const server = fakeMcServer(()=>getRedditInfo(port-PORT_START))
    server.listen(port);
    return server;
});