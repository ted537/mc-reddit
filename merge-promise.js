let active_promise = null;
function merge(callback) {
    if(!active_promise) {
        active_promise = callback()
        active_promise.then(()=>active_promise=null)
    }
    return active_promise;
}

module.exports = merge;