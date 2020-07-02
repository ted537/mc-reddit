const net = require('net');
const fakeMcServer = require('./mc-server');

const server = fakeMcServer(()=>{
    return {
        text:'hi there',
        players:10,
        max_players:20
    }
})
server.listen(25566);