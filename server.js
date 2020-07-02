const fetch = require('node-fetch');

const fakeMcServer = require('./mc-server');

async function getRedditInfo() {
    const response = await fetch('http://reddit.com/best.json');
    const json = await response.json();
    const post = json.data.children[0].data;

    return {
        text:post.title,
        players:post.score,
        max_players:post.num_comments
    }
}

const server = fakeMcServer(getRedditInfo);
server.listen(25566);