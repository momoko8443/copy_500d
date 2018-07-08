var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// fs.readFile(__dirname + '/resume/template/bg0019.html', 'utf8', function(err, html){
//     const dom = new JSDOM( html,
//         { includeNodeLocations: true }
//       );
//       const document = dom.window.document;

// });
let list = [];
fs.readdirSync(__dirname +"/resume/template/").forEach(file => {
    list.push(file);
});
generateAll();
async function generateAll(){
    for(var i=0;i<list.length;i++){
        let file = list[i];
        await generate(file);
    }
}

function generate(file){
    return new Promise( (resolve, reject) => {
        JSDOM.fromFile(__dirname +"/resume/template/"+file,{ includeNodeLocations: true }).then(dom => {
            //console.log(dom.serialize());
            const document = dom.window.document;
            var div = document.getElementById('resume_base');
            var component = document.createElement('uku-component');
            var template = document.createElement('template');
            component.appendChild(template);
            template.innerHTML = div.outerHTML;
            console.log(component.outerHTML);
            fs.writeFileSync('templates/'+file,component.outerHTML);
            resolve();
        }).catch( err => {
            reject();
        });
    });
}
