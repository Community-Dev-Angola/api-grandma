/* jshint esversion:8 */
// path generator
module.exports = function(paths){
    (function extract(paths){
        paths = String(paths).split(/=/)[1].replace(/ /g,'').replace(/({|})/g,'').split(",");
        paths.forEach(element => {
            let type = element.split(":")[0];
            let value = element.split(":")[1].replace(/"/g,'');

            // base path definition
            switch(type){
                case 'base':{

                    break;
                }
                case 'paths':{

                    break;
                }
            }
        });
    })(paths);
};