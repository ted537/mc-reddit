const fetch = require('node-fetch');

const fakeMcServer = require('./mc-server');

const PORT_START = 25565;
const PORT_COUNT = 5;

function ports() {
    const list = [];
    for (let i=PORT_START;i<PORT_START+PORT_COUNT;++i)
        list.push(i);
    return list;
}

let after = ''

async function getRedditInfo(index) {
    const response = await fetch(`http://reddit.com/best.json?count=5&after=${after}`);
    const json = await response.json();
    after = json.data.after;

    const post = json.data.children[index].data;
    return {
        text:post.title,
        players:post.score,
        max_players:post.num_comments
    }
}

const servers = ports().map(port=>{
    const server = fakeMcServer(()=>getRedditInfo(port-PORT_START))
    server.listen(port);
    return server;
});