var fs = require('fs');
var xml2js = require('xml2js');
var http = require('http');

var parser = new xml2js.Parser();
var templates = [];
var url = "http://www.500d.me/resources/500d/cvresume/css/";
fs.readFile('generate_tools/templates.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        //console.dir(result);
        if(err){
            console.error(err);
        }
        var list = result.root.div;
        list.forEach(element => {
            var name = element.div[0].p[0].span[0].toLowerCase();
            var template = {name: name, link: url + name + ".css?v=7084"};
            templates.push(template);
        });
        let existed = {};
        fs.readdirSync('generate_tools/resume/css/').forEach(file => {
            let prefix = file.split('.')[0];
            existed[prefix] = true;
        });
        templates.forEach(template => {
            if(!existed[template.name]){
                console.log('fetch', template.name);
                var file = fs.createWriteStream("generate_tools/resume/css/"+template.name+".css");
                http.get(template.link, function(response) {
                    response.pipe(file);
                });
            }
        });

    });
});


