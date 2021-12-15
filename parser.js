/* jshint esversion:8 */
const sequelize_parser = require("./parser/sequelize_parser");
const fs = require("fs");
const { exit } = require("process");

function convert_to_grandma(input,path,orm){
    // WAWA
    let sanitize = (data)=> { return data.replace(/(\r|\n)/g,'').replace(" ",'').replace(/(<(.*)>)/,''); };

    let obj = String(input).split(";");
    obj.map((item)=>{ 
        //if(typeof(item.split("=")[1]) === "undefined" || typeof(item.split("=")[0]) === "undefined") return;
        // test if empy or not
        try { 
            sanitize(item.split("=")[0]); 
            sanitize(item.split("=")[1]); 
        } catch(e){ return; }
        
        let new_table = [];
        let name = sanitize(item.split("=")[0]);
        let api_path = String(item.split("=")[1]).replace(/(\r|\n)/g,'').match(/<(.*)>/)[1];

        console.log(`==== Table ${name} ===`);
        item.split("=")[1].replace(/({|})/g,'').split(',').forEach((item)=>{
            let field_name = sanitize(item.split(":")[0]);
            let field_type = sanitize(item.split(":")[1]).split('-');
        
            new_table.push({field_name,field_type});
        });

        switch(orm){
            case 'sequelize':{ sequelize_parser(name,new_table,path,api_path); break; }
        }
    });
}

function parser(input,path,orm){
    console.log(`Opening ${input} as Sequelize`);
    
    let file = fs.readFileSync(input,'utf-8');
    convert_to_grandma(file,path,orm);
}

module.exports = parser;