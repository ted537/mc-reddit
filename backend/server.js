const fakeMcServer = require('./mc-server');
const { fakeServerInfos } = require('./reddit');

const PORT_START = 25565;
const PORT_COUNT = 10;

function ports() {
    const list = [];
    for (let i=PORT_START;i<PORT_START+PORT_COUNT;++i)
        list.push(i);
    return list;
}

let server_infos = [];
fakeServerInfos().then(infos=>server_infos=infos);

const refresh_counts={};
const servers = ports().map(port=>{
    const server = fakeMcServer(client=>{
        refresh_counts[client] = refresh_counts[client] || 0;
        const refresh_count = refresh_counts[client];
        const index = refresh_count%server_infos.length
        const server_info = server_infos[index]
        ++refresh_counts[client];
        return server_info
    })
    server.listen(port);
    return server;
});