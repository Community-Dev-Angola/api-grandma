/* jshint esversion : 8 */
/** @ Server handler */
const _sequelize = require("./orm/sequelize");
const fs = require("fs");

module.exports = function(config,path){
    let template = {
        ip : '',
        port : 3306,
        user : '',
        password : '',
        orm : '',
        dialect : '',
        database : ''
    };

    const server_dirs = [
        "/database/",
        "/public/",
        "/static/",
        "/views/",
        "/app/",
        "/app/controllers/",
        "/config/"
    ];

    let code = ''; // final code to output

    // temporario, usar JSON para fazer parsing das coisas
    config = JSON.parse(String(config).split("=")[1].replace(/ /g,''));

    // set-up server base config
    if(!config.ip) console.log("No 'ip' provided, setting '127.0.0.1' as default");
        template.ip = config.ip || "127.0.0.1";
    if(!config.port) console.log("No express 'port' value provided, setting 8080 as default");
        template.port = config.port || 3306;
    if(!config.user) console.log("No 'user' provided, setting 'root' as default");
        template.user = config.user || 'root';
    if(!config.password) console.log("No 'password' provided, setting '' as default");
        template.password = config.password || '';
    if(!config.orm) console.log("No 'orm' provided, using 'sequelize'");
        template.orm = config.orm || 'sequelize';
    if(!config.dialect) console.log("No 'dialect' provided, setting 'mysql' as default");
        template.dialect = config.dialect || 'mysql';
    if(!config.database) console.log("No 'database' provided, setting 'grandma' as default");
        template.database = config.database || 'grandma';

    server_dirs.forEach((dir)=>{
        let mk_path = (path+dir).replace(/\/\//g,'/');
        try{
            fs.accessSync(mk_path);
            console.log(`Folder ${mk_path} already exists, skipping`);
        }catch(err){
            switch(err.code){
                case "ENOENT": {
                    fs.mkdirSync(mk_path,{recursive:true});
                    console.log(`[+] ${mk_path}`);
                }
            }
        }
    });

    switch(template.orm){
        case 'sequelize':{
            console.log(`Generating template for ${template.orm}`);
            console.log("============================================");
            code = _sequelize(template,path); // arquivo nem sequer foi criado ainda
            console.log(`Creating database to ${(path+'database/database.js')}...`);

            // set-up database finally
            let create_database = fs.createWriteStream(path+'database/database.js','utf-8');
            create_database.write(code);
            create_database.close();
            console.log("Done");
            break;
        }
    }
};