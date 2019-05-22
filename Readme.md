# Almost No Instrusive Analizer (ANIlizer)

We try to instrument a complete NodeJS application (including node_modules folder recursivelly) getting the function entering traces. Basically we send the traces using the builtin function **console.debug**, these console api calls can be detected using debugger tools through the websocket channel. 

```js
function a(){
    console.debug("1:2:1:4", 'FUNCTION_ENTRANCE', 'a', 'file.js')
    //           node hash,     action,      functionName  filename    
    // Function code
}
```

### Running the instrumented code

1. Execute ```node src/scripts/instrument_application.js <application_dir_abs> <instrumentation_output_abs>```
    
    11. There is a map file (**map.json**) with the instrumented functions in the output folder root (<a href="docs/map.md">Example</a>)
2. Execute the application entrypoint with node **--inspect** option: ```node --inspect entry.js```
3. Execute the listener who writes the logs to **logs/logs.txt** file: ```node src/core/listener/listener.js <instrumentation_output_path>/map.json```

    31. The logs line by line format is **[HASH]:[file_path] [TIMESTAMP]** (<a href="docs/example.md">Example</a>)


### TODOS
- Debloat based on traces information
- Perform instrumentation to branch level