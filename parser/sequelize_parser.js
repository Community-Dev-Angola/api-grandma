/* jshint esversion:8 */
const fs = require("fs");
const dict_field = require("../dictionary/fields");

function sequelize_controller(fields,name, path, api_path){
    let sanitize = function(input){ return input.replace(/ /g,'').replace(/(\n|\r|\t)/g,''); };
    let code = '';
    code += `// API-PATH: <${api_path}>\n`; // save the api to parse later at routers.js
    code += `const ${name} = require("./${name}.js");\n`;
    code += "module.exports = {";
        code += `
        "get" : (res)=>{
            ${name}.findAll().then((result)=>{
                res.json(result);
                return;
            }).catch((err)=>{
                res.json({
                    "error" : "Ocorreu um erro"
                })
            });
        },
        `;

        code += '"post" : (req,res)=>{ \n\t\t';
            // 1 - Request all fields from the form
            let required_fields = 'if(';
            /*
            for(let a = 1; a < fields.length; a++){
                fields[a-1] = fields[a];
            }
            fields = Array(fields.pop());*/
            let a = 0;
            fields.map((element)=>{
                if(a == 0){
                    a++;
                }else{
                    let data = String(element.field_name).replace(/ /g,'').replace(/(\n|\r|\t)/g,''); // due to spaces, \n\t and many other symbols, remove those items and send back
                    required_fields += `!req.body.${data} || `;
                }
            });
            required_fields = required_fields.substr(0,required_fields.length-4) + ')';
            code += required_fields;
            code += `{ 
                        res.json({ 
                            "error" : "Porfavor preencha todos os campos" 
                        }); 
                        return; `;
            code += '}\n';

            code += `${name}.create({\n`;

            // 2 - Insert evething
            fields.map((element)=>{
                code += `${sanitize(element.field_name)} : req.body.${sanitize(element.field_name)},\n`;
            });
            code += '}).then(()=>{ \nres.json({ "ok" : "Acao executada com sucesso" }); \n})';
            code += '.catch((err)=>{ \nconsole.log(`Erro : ${err}`); \nres.json({ \n"error" : "Ocorreu um erro" \n}); \n});';

        code += '}';
    code += "}";

    let file = fs.createWriteStream(`${path}md_${name}.js`,'utf-8');
    file.write(code);
    file.close();

    console.log(`[+] Done generating model for ${name} to file ./${path}md_${name}.js`);
}

// should be separed, since it separates a lot of fields and can be reused
// among others ORM
// TODO

function sequelize_parser(table_name, fields, path, api_path){ // code specialized to generate tables for sequelize
    let code = '';
    code += 'const Sequelize = require("sequelize");\n';
    code += `const sequelize = require('../database/database.js');\n`;
    code += `let ${table_name} = sequelize.define("${table_name}",{\n`;
        fields.forEach(element => { // parse ever field provided and construct an object for him
                                    // should be extracted to be reused among more ORMs :)
            if(String(element.field_name).length > 0){
                code += `${element.field_name} : {\n`;
                
                String(element.field_type).split("-").map((index)=>{
                    
                    let field = index.split("~");
                    let final = `Sequelize.${dict_field[field[0]]}`; // default datatype
                    // is there any provided size?                
                    
                    if(field[1]){
                        // final += `(${String(field[1]).replace(/[a-zA-Z|,]/g,'')})`;
                        let ff = String(field[1]).replace(/[a-zA-Z|,]/g,'');
                        final += (ff.length > 0) ? `(${ff})` : '';
                    }
                    code += `\t\ttype : ${final},\n`;
                    
                    String(index).split(",").map((special)=>{
                        switch(special){ // special attributes
                            case "PK": {
                                code += "\t\tprimaryKey: true,\n";
                                break; 
                            }
                            case "AI" : {
                                code += "\t\tautoIncrement: true,\n";
                                break;
                            }
                            case "REQ" : {
                                code += "\t\tallowNull: false,\n";
                                break;
                            }
                            default: break;
                        }
                    });
                });
                code += "\t},\n";
            }
        });
    code += "});\n\n";
    code += `${table_name}.sync().then((data)=>{\n`;
    code += `\tconsole.log("[Grandma] table ${table_name} created sucefully");})\n`;
    code += `.catch((err)=>{\n`;
    code += `\tconsole.log("Grandma error : $\{err}");\n});\n\n`;
    code += `module.exports = ${table_name};`;

    let file = fs.createWriteStream(`${path}tb_${table_name}.js`, 'utf-8');
    file.write(code);
    file.close();

    sequelize_controller(fields, 'tb_' + table_name, path, api_path);
    console.log(`[+] Done generating ${table_name} to file ${path}grandma_${table_name}.js`);

}

module.exports = sequelize_parser;