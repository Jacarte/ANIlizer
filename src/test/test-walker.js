const {Walker} = require("../core/instrumentor/walker");
const {Instrumentor} = require("../core/instrumentor/instrumentor");

const w = new Walker(new Instrumentor(), "out")

w.walk("/Users/javier/Documents/Develop/ws_chrome_debugging_example")