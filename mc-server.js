const net = require('net')

function mcShortBytes(num) {
    let little = num%256;
    if (little<128) little+=128;
    const big = num/128;
    return {little,big};
}

function cleanText(text) {
    const normalized = text
        // normalize quotes
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"');
        
    let printable = ''
    for (let i=0;i<normalized.length;++i) {
        const code = normalized.charCodeAt(i);
        if (code>=32 && code<=126) printable+=normalized[i]
    }
    return printable
}

function createResponse({text,players,max_players,favicon}) {
    const json = {
        "description":{
            "text":cleanText(text)
        },
        "players":{"max":max_players,"online":players},
        "version":{
            "name":"1.16.1","protocol":736
        }
    }
    if (favicon) json.favicon = favicon;
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

    const response = Buffer.concat([header,Buffer.from(body,'ascii')]);
    return response;
}

function fakeMcServer(getServerInfo) {
    return net.createServer(
        socket=>{
            socket.on('data',async data=>{
                // 0x01 0x00 appears to be the end of the client's
                // request message for server info
                if (data[data.length-2]==0x01 || data[data.length-1]==0x00) {
                    const response = createResponse(await getServerInfo());
                    // since we're using async, the socket might have
                    // been destroyed by now
                    if (!socket.destroyed)
                        socket.write(response);
                }
                // 0x09 0x01 is the start of a message for verification
                // I'm assuming its a checksum or something
                // just echo back whatever the client sent us
                if (data[0]==0x09 && data[1]==0x01) {
                    socket.write(data);
                }
                // handle ping
                // message looks something like MC ping in UTF16
                if (String.fromCharCode(data[6]=="M") && String.fromCharCode(data[8])=="C") {
                    socket.write('');
                }
            })
        }
    )
}

module.exports = fakeMcServer;