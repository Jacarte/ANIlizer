const fs = require("fs");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class Walker{
    
    constructor(instrumentor /* Instrumentor class */, outDir, throwOnFail = false){
        this.instrumentor = instrumentor;
        this.outDir = outDir;
        this.throwOnFail = throwOnFail;
        this.index = 0;
    }

    walkAux(path, outPath, exclude){
        if(!fs.existsSync(outPath))
            fs.mkdirSync(outPath)
        
        
        
        const list = fs.readdirSync(path);

        for(var f of list){
            try{
                if(fs.statSync(path + '/' + f).isDirectory()){
                    this.walkAux(path + '/' + f, outPath + '/' +  f);
                }
                else{
                    if(/.js$/.test(f) ){
                        const newCode = this.instrumentor.instrummentCode(path + '/' + f)
                        fs.writeFileSync(outPath + '/' + f, newCode);

                        process.stdout.write(`\r${this.index++}/${this.total}`)
                    }
                    else{
                        fs.copyFileSync(path + '/' + f, outPath + '/' + f);
                    }
                }
            }
            catch(e){
                if(this.throwOnFail)
                    throw e;

                console.warn(e.message);
            }
        }
    }

    async walk(path, exclude = []){
        let total = 0;
        try{
            const command = `ls -lR ${path} | grep "\.js$" |  wc -l`;
            console.log(command);

            const { stdout, stderr } = await exec(command);
            
            total = parseInt(stdout);
        }
        catch(e){

        }
        console.log("Instrumenting", total, "files")
        this.total = total;

        this.walkAux(path, this.outDir, exclude)

        console.log("\nDONE")
    }
}

module.exports = {
    Walker
}