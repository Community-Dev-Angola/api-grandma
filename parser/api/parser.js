/* jshint esversion:8 */
const fs = require("fs");
const path_handler = require("./path");
const server_handler = require("./server");
const router_handler = require("./routes");

module.exports = (_input,path)=>{ // 2 - Parse file with specific config to replace and output
    let code = '';
    let input = String(_input).replace(/(\n|\r|\t)/g,'').replace(' ','');
    let configs = input.split(/;/);
    // clear empty 
    configs = configs.filter((item)=> String(item).length > 0 );

    function createCode() {
        code += '/* jshint esversion : 8 */\n';
        code += 'const express = require("express");\n';
        code += 'const routes = require("./app/router");\n';
        code += 'const app = express();\n';
        code += 'app.use(express.urlencoded({extended:true}));\n';
        code += 'const port = process.env.PORT || 9999;\n';
        code += 'app.use(routes);\n';
        code += `app.listen(port,()=>{console.log('Server started at 9999');});`;

        let output = fs.createWriteStream(path + 'app.js', 'utf-8');
        output.write(code);
        output.close();
        console.log(`[+] Created app.js -> ${path}app.js`);

        /*
        let dir_files = fs.readdirSync(path+'/app/');
        if(dir_files) router_handler(dir_files,path+'/app/');
        else console.log("[!] Error reading dir");
        */
    }

    configs.map((config)=>{
        let name = config.split(/=/)[0];
        switch(name){
            case 'server':{ // 3 - Create base server configuration with models, folders, and etc
                server_handler(config,path); 
                createCode();
                break;
            }

            //case 'path':{ // optional: any costum path given by user
            //    path_handler(config);
            //    break;
            
        }
    });
};