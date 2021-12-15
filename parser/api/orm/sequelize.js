/* jshint esversion:8 */
module.exports = (params,path)=>{
    /*
    Base template for sequelize ORM :

    const Sequelize = require("sequelize");
    const sequelize = new Sequelize(database,user,password,{
        ip : ip,
        port : port,
        dialect : dialect
    });
    sequelize.authenticate().then(()=>{ console.log("Database conected"); })
    .catch((err)=>{ trow new err; });
    module.exports = sequelize;

    */
    let code = '';
    code += '/* jshint esversion : 8 */\n';
    code += 'const Sequelize = require("sequelize");\n';
    code += `const sequelize = new Sequelize("${params.database}","${params.user}","${params.password}",{\n`;
    code += `\tip : '${params.ip}',\n`;
    code += `\tport : ${params.port},\n`;
    code += `\tdialect : '${params.dialect}'\n`;
    code += '});\n';
    code += 'sequelize.authenticate().then(()=>{\n';
    code += '\tconsole.log("Database conected"); })\n';
    code += '.catch((err)=>{ \n\tconsole.log(err); \n})';
    code += '.finally(()=>{ return; })\n';
    code += 'module.exports = sequelize;';
    
    return code;
};