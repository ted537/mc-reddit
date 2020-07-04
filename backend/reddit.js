const path = require('path');
const fetch = require('node-fetch');
const { asPngDataUrlCached } = require('./png-convert');

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

const PRELOAD_POST_COUNT = 1000;
async function fakeServerInfos() {
    console.log('started preloading posts')
    const posts = [];
    for (let i=0;i<PRELOAD_POST_COUNT;++i)
        posts.push(await getRedditPost());
    console.log('finished preloading posts')
    const safe_posts = posts.filter(post=>!post.over_18);
    console.log('fetching images');
    const post_infos = await Promise.all(
        safe_posts.map(serverInfoForRedditPost)
    );
    console.log('finished fetching images');
    return post_infos;
}

async function serverInfoForRedditPost(post) {
    const logo_fname = path.join(__dirname,'logo-small.png');
    const thumbnail = post.thumbnail.startsWith('http') ?
        post.thumbnail : logo_fname
    const info = {
        text:post.title,
        players:post.score,
        max_players:post.num_comments,
        favicon:await asPngDataUrlCached(thumbnail)
    }
    return info;
}

module.exports = {fakeServerInfos};