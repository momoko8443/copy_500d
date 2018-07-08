var fs = require('fs');
var xml2js = require('xml2js');
var http = require('http');
const jsdom = require("jsdom");
const {
    JSDOM
} = jsdom;
var parser = new xml2js.Parser();
var templates = [];
const puppeteer = require('puppeteer');
var url = "http://www.500d.me/cvresume/edit/?itemid=";
fs.readFile('generate_tools/templates.xml', function (err, data) {
    parser.parseString(data, function (err, result) {
            //console.dir(result);
            if (err) {
                console.error(err);
            }
            var list = result.root.div;
            list.forEach(element => {
                var name = element.div[0].p[0].span[0].toLowerCase();
                var id = element.div[0].a[0]['$']['data-itemid'].toLowerCase();
                //console.log(name, id);
                var template = {
                    name: name,
                    link: url + id
                };
                templates.push(template);
            });
            let existed = {};
            fs.readdirSync('generate_tools/resume/template/').forEach(file => {
                let prefix = file.split('.')[0];
                existed[prefix] = true;
            })

            async function grabTemplates() {
                for (let i = 0; i < templates.length; i++) {
                    let template = templates[i];
                    if(!existed[template.name]){
                        try {
                            console.log('fetch', template.name);
                            const browser = await puppeteer.launch();
                            const page = await browser.newPage();
                            await page.goto(template.link);
                            // await page.waitFor(3000).then( ()=> {
                            //     return true;
                            // });
                            const domString = await page.content();
                            //console.log(domString);
                            fs.writeFileSync("generate_tools/resume/template/" + template.name + ".html", domString);
                            await browser.close();
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
            grabTemplates();
    });
});