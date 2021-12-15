/* jshint esversion:8 */
const parser = require("./parser/api/parser");
const fs = require("fs");

module.exports = function(input,output){ // 1 - test and open the provided file
    let file = fs.readFileSync(`${input}`,'utf-8');
    if(file) parser(file,output);
    else console.log("[!!!] Error while opening archive");
};