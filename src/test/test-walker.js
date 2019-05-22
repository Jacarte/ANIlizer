const {Walker} = require("../core/instrumentor/walker");
const {Instrumentor} = require("../core/instrumentor/instrumentor");


const inst = new Instrumentor()
const w = new Walker(inst, "out")

w.walk("/Users/javier/Documents/Develop/ws_chrome_debugging_example")

console.log(inst.map)