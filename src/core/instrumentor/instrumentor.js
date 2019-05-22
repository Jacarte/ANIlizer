const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse");
const generator = require("@babel/generator");
const types = require("@babel/types")


class Instrumentor{

    constructor(){
        this.map = {

        };
    }

    hashNode(path, extra = ':'){
        return path.loc.start.line +
        ':' + path.loc.start.column +
        ':' + path.loc.end.line +
        ':' + path.loc.end.column
    }

    processFunctionBody(filePath, path){
        const body = path.get("body");

        const hash = this.hashNode(path.node)

        this.map[hash + ':' + filePath] = {
            name: path.node.id ? path.node.id.name : 'anonymous'
        }

        body.unshiftContainer('body',
            
            types.callExpression(
                types.identifier("console.debug"),
                [
                    /*types.objectExpression([
                        types.objectProperty(types.stringLiteral("instrumentor"), types.booleanLiteral(true)),
                        types.objectProperty(types.stringLiteral("msg"), types.stringLiteral("FUNCTION_ENTERING")),
                        types.objectProperty(types.stringLiteral("hash"), types.stringLiteral(self.hashNode(path.node))),
                        types.objectProperty(types.stringLiteral("functionName"), types.stringLiteral(path.node.id.name))
                    ])*/
                    types.stringLiteral("instrumentor"),
                    types.stringLiteral("FUNCTION_ENTERING"),
                    types.stringLiteral(path.node.id ? path.node.id.name : 'anonymous'),
                    types.stringLiteral(hash),
                    types.stringLiteral(filePath)
                ]
        ))

    }

    instrummentCode(filePath){
        
        const content = fs.readFileSync(filePath);

        const ast = parser.parse(content.toString(), {
            // parse in strict mode and allow module declarations
            sourceType: "module",
          
            plugins: [
              // enable jsx and flow syntax
              //"jsx",
              "flow"
            ]
          });

          const self = this;

            traverse.default(ast, {
                FunctionDeclaration: function(path){
                    self.processFunctionBody(filePath,path)
                    //onsole.log(body)
                },
                FunctionExpression: function(path){
                    self.processFunctionBody(filePath,path)
                }
        })

        return generator.default(ast).code;
    }


}

module.exports = {
    Instrumentor
}