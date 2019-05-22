const WebSocket = require('ws');
const { exec, spawn } = require('child_process');
const req = require("request");
const fs = require("fs");

const port = 9229;
const mapPath = process.argv[2];

const logs = fs.openSync(`logs/logs.txt`, 'a');



req(`http://localhost:${port}/json`,function (error, response, body) {
    
  const tab = JSON.parse(body)[0];

  const url = tab.webSocketDebuggerUrl;

  const ws = new WebSocket(url);


  ws.on('open', function open() {

    ws.send(JSON.stringify({id: 3, method: 'Debugger.enable'}))
    ws.send(JSON.stringify({id: 1, method: 'Runtime.enable'}))

  });

  const map = JSON.parse(fs.readFileSync(mapPath).toString());

  ws.on("close", (code, reason) => {
      fs.writeFileSync(mapPath, JSON.stringify(map, undefined, 4));
  })

  ws.on('message', function incoming(data) {

    const msg = JSON.parse(data);
    if(msg.method === "Runtime.consoleAPICalled" && msg.params.type === 'debug'){

        const params = msg.params.args;
  
        if(params[0].value === 'instrumentor'){

            const hash = params[3].value;
            const file = params[4].value;

            map[`${hash}:${file}`].hitCount++;

            // write log

            fs.writeSync(logs, `${hash}:${file} ${msg.params.timestamp}\n`)
            

        }
          //fs.writeFileSync("./logs/" + Date.now() + ".profile.json",  JSON.stringify(msg.result, undefined, 4));
      }
  });
});
