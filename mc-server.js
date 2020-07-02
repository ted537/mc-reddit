const net = require('net')

function mcShortBytes(num) {
    let little = num%256;
    if (little<128) little+=128;
    const big = num/128;
    return {little,big};
}

function createResponse({text,players,max_players}) {
    const json = {
        "description":{
            "text":text
        },
        "players":{"max":max_players,"online":players},
        "version":{
            "name":"1.16.1","protocol":736
        }
    }
    const body = JSON.stringify(json);

    // byte representations for body length
    const inner_len_bytes = mcShortBytes(body.length);
    // padded length includes the len bytes
    const outer_len_bytes = mcShortBytes(body.length+3);

    const header = new Uint8Array([
        outer_len_bytes.little,
        outer_len_bytes.big, 
        0x00,
        inner_len_bytes.little,
        inner_len_bytes.big
    ]);

    const response = Buffer.concat([header,Buffer.from(body)]);
    return response;
}

function fakeMcServer(getServerInfo) {
    return net.createServer(
        socket=>{
            socket.on('data',data=>{
                if (data[data.length-2]==0x01 || data[data.length-1]==0x00) {
                    console.log('responding');
                    const response = createResponse(getServerInfo());
                    socket.write(response);
                }
                if (data[0]==0x09 && data[1]==0x01) {
                    console.log('verifying')
                    socket.write(data);
                }
                if (String.fromCharCode(data[6]=="M") && String.fromCharCode(data[8])=="C") {
                    console.log('got ping!')
                    socket.write('');
                }
            })
        }
    )
}

module.exports = fakeMcServer;