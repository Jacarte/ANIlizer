const fs = require("fs");


class Walker{
    
    constructor(instrumentor /* Instrumentor class */, outDir, throwOnFail = false){
        this.instrumentor = instrumentor;
        this.outDir = outDir;
        this.throwOnFail = throwOnFail;
    }

    walkAux(path, outPath){
        if(!fs.existsSync(outPath))
            fs.mkdirSync(outPath)
        
        const list = fs.readdirSync(path);

        for(var f of list){
            try{
                if(fs.statSync(path + '/' + f).isDirectory()){
                    this.walkAux(path + '/' + f, outPath + '/' +  f);
                }
                else{
                    if(/.js$/.test(f)){
                        const newCode = this.instrumentor.instrummentCode(path + '/' + f)
                        fs.writeFileSync(outPath + '/' + f, newCode);
                    }
                    else{
                        fs.copyFileSync(path + '/' + f, outPath + '/' + f);
                    }
                }
            }
            catch(e){
                if(this.throwOnFail)
                    throw e;

                console.log(e);
            }
        }
    }

    walk(path){
        this.walkAux(path, this.outDir)
    }
}

module.exports = {
    Walker
}