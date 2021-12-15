/* jshint esversion:8 */
const { help } = require("./help");
const parser = require("./parser");
const server_parser = require("./server");
const fs = require("fs");
const router_handler = require("./parser/api/routes");

function parse_arguments(argv){
    argv.map((item)=>{
        let input = String(argv.find((value)=> /^--input=(.*)/.test(value))).split(/=/)[1];
        let path = String(argv.find(value => /^--output=(.*)$/.test(value))).split(/=/)[1];
        let orm = String(argv.find(value => /^--orm=(.*)$/.test(value))).split(/=/)[1];

        let data = {
            input : item.split(/=/)[0],
            value : item.split(/=/)[1] || ''
        };
        
        console.log("[!] Note: databases will be reseted if changes occors on the table setup file");
        switch(data.input){
            case '--server':{
                let pred = String(argv.find((value)=>/--tables(.*)/.test(value))).split(/=/)[1];
                
                console.log("Creating base server for API");
                server_parser(input,path);
                
                if(pred){
                    console.log("Exporting to "+(path+'app/'));
                    parser(pred,path+'app/',orm);
                }

                setTimeout(()=>{ // wait for file creation a while
                    fs.readdir(path+'app/',(err,files)=>{
                        if(err) console.log("[!] Error reading dir");
                        router_handler(files,path+'/app/');
                    });
                },100);

                // generate setup file to start project
                let setup = [
                    "./app/setup_database.sh; node app.js",
                    "app/setup_database.bat; node app.js"
                ];
                // generate start file
                let start = [
                    ".sh",
                    ".bat"
                ];
                for(var x = 0; x < setup.length; x++){
                    let automate = fs.createWriteStream(path+`/start${start[x]}`,'utf-8');
                    automate.write(setup[x]);
                    automate.close();
                }
                console.log("[SUCCESS] Project created");
                break;
            }
            case '--database':{
                console.log(`Output to: `+path);
                parser(input,path,orm);
                break;
            }
            case '--generate':{
                console.log("Generating API template files");
                break;
            }
        }

    });
}
function main() {
    let arguments = process.argv.slice(2);
    if(!arguments.length){
        help(); return;
    }
    parse_arguments(arguments);
}
main();