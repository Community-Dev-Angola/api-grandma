/* jshint esversion:8 */
const fs = require("fs");
const path = require("path");

module.exports = (files,path)=>{
    // generate route file
    // app/router.js

    files = files.filter((element)=> /^md_tb_(.*).js$/.test(element) );
    
    let code = '';
    code += '/* jshint esversion : 8 */';
    code += 'const express = require("express");\n';
    code += 'const router = express.Router();\n';
    code += '// tables template\n';
    files.map((file)=>{
        code += `const ${String(file).replace(/.js/,'')} = require("./${file}");\n`;
    });
    code += '// requests\n';
    files.map((file)=>{
        // try to parse API first
        var api = fs.readFileSync(path+file,'utf-8');    
        if(api) {
            api = String(api).split("\n")[0].match(/<(.*)>/)[1];
            console.log(`API -> ${api}`);
            api = '/' + api.replace(/\//g,'\\/') + '/';
        }else api = String(file).replace(".js","");

        // start request code
        // get
        code += `router.get(${api},(req,res)=>{\n`;
        // por agora passa apenas o res
        code += `\t${String(file).replace(/.js/,'')}.get(res);\n`;
        code += `});\n\n`;
        code += `router.post(${api},(req,res)=>{\n`;
        code += `\t${String(file).replace(/.js/,'')}.post(req,res);\n`;
        code += `});\n\n`;
        // end request code

    });
    code += 'module.exports = router;';

    let create = fs.createWriteStream(path+'/router.js','utf-8');
    create.write(code);
    create.close();
    console.log(`[+] Created router.js at -> ${path}`);

    console.log("[++] Creating automated database setup file");

    let insert = files.map((element)=>{
        return element.replace("md_",'');
    });
    let database_setup = '';

    insert.map((file)=>{ database_setup += `node app/${file}\n`; });
    let format = [
        '.bat',
        '.sh'
    ];

    // generate script to setup database (Windows / Linux)

    format.forEach((format)=>{
        let automated_database = fs.createWriteStream(path+`/setup_database${format}`,'utf-8');
        automated_database.write(database_setup);
        automated_database.close();
    });

    return;
};