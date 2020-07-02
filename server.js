const fetch = require('node-fetch');

const fakeMcServer = require('./mc-server');

let after = ''

async function getRedditInfo() {
    const response = await fetch(`http://reddit.com/best.json?after=${after}`);
    const json = await response.json();
    after = json.data.after;
    console.log(after)

    const post = json.data.children[0].data;

    return {
        text:post.title,
        players:post.score,
        max_players:post.num_comments
    }
}

const server = fakeMcServer(getRedditInfo);
server.listen(25566);