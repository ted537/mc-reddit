const fetch = require('node-fetch');

let post_list = null;
let post_index = 0;

function needToFetch() {
    return !post_list || post_index>=post_list.data.children.length;
}

async function getRedditJson() {
    const after = '' || (post_list && post_list.data.after);
    const response = await fetch(`http://reddit.com/best.json?count=100&after=${after}`);
    const json = await response.json();
    return json;
}

async function getRedditPost() {
    if (needToFetch()) {
        post_list = await getRedditJson();
        post_index = 0;
    }
    return post_list.data.children[post_index++].data;
}

module.exports = {getRedditPost};