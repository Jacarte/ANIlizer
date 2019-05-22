const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");

class Instrumentor{

    instrummentCode(path){
        
        const content = fs.readFileSync(path);

        const ast = parser.parse(content.toString(), {
            // parse in strict mode and allow module declarations
            sourceType: "module",
          
            plugins: [
              // enable jsx and flow syntax
              //"jsx",
              "flow"
            ]
          });

        return generator.default(ast).code;
    }

}

module.exports = {
    Instrumentor
}