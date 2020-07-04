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

const servers = ports().map(port=>{
    let refresh_count=0;
    const server = fakeMcServer(
        ()=>server_infos[refresh_count++%server_infos.length]
    )
    server.listen(port);
    return server;
});