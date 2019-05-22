const {Walker} = require("../core/instrumentor/walker");
const {Instrumentor} = require("../core/instrumentor/instrumentor");
const fs = require("fs");

const inst = new Instrumentor()
const w = new Walker(inst, process.argv[3])

w.walk(process.argv[2])

console.log(inst.map)

fs.writeFileSync(process.argv[3] + '/map.json' ,JSON.stringify(inst.map, undefined, 4))