function help() {
    console.log(`
        API Grandma - Generate faster API, databases and base server to speed up development testing

        Arguments:
            --generate          Generate as API file
            --server            Generate base server (adaptable for anything)
            --database          Generate tables for an database. Returns two files for each table:
                                    table_name.js (express req,res) and tb_table_name.js (connection)

            Only --generate and --server can be used together, except --database since only outputs an table
            and express req,res file

        Required:
            --input             Input file to parse
            --output            Path to return all contents

        Generating an simple table (input.txt):
            user={
                id : INT~20-PK-AI,
                name : STR~20,
                surname : STR~20
            }
        
            code:
                node app.js --database --orm=sequelize --input=input.txt --output='output/tests/'

            base server example:
                node app.js --server --input=input.txt
            base api generator:
                node app.js --generate --input.txt
    `);
}
exports.help = help;
