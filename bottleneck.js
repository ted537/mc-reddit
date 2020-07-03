let active_promise = null;
async function bottleneck(callback) {
    if(active_promise) {
        await active_promise;
    }
    active_promise = callback();
    return await active_promise;
}

module.exports = bottleneck;