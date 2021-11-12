const http = require('http');
const fs = require('fs');
const port = 4444;

const server = http.createServer((req, res) => {
    //router
    /*
    -html 
    -json
    -css Elég nekünk a bootstrap
    -kliens json
    -favicon
    */
    /*console.log(req.url);
    console.log(req.method);
    console.log("----");
*/
    switch (true) {
        case req.url === "/" && req.method === "GET":
            fs.readFile('./views/index.html', (err, data) => {
                res.setHeader('content-type', 'text/html; charset=UTF-8');
                res.writeHead(200);
                res.end(data);
            });
            break;
        case req.url === "/favicon.ico" && req.method === "GET":
            fs.readFile('./favicon.ico', (err, data) => {
                res.setHeader('content-type', 'image/ico');
                res.writeHead(200);
                res.end(data);
            });
            break;
        case req.url === "/script.js" && req.method === "GET":
            fs.readFile('./public/script.js', (err, data) => {
                res.setHeader('content-type', 'application/javascript');
                res.writeHead(200);
                res.end(data);
            });
            break;

            //Kérés a JSON állományra
        case req.url === "/colors" && req.method === "GET":
            fs.readFile('./datas/colors.json', (err, data) => {
                res.setHeader('content-type', 'application/json');
                res.writeHead(200);
                res.end(data);
            });
            break;

        case req.url === "/szinlista" && req.method === "GET":
            fs.readFile('./datas/colors.json', (err, data) => {
                res.setHeader('content-type', 'text/html');
                res.writeHead(200);
                let resultHTML = "<ul>";
                const colors = JSON.parse(data);

                for (color of colors) {
                    resultHTML += `<li>${color.name}: ${color.code}</li>`;
                }
                resultHTML += "</ul>";
                //console.log(resultHTML);
                res.end(resultHTML);
            })
            break;

            //Írási kérelem kiszolgálása
        case req.url === "/colors" && req.method === "POST":
            let tartalom = '';
            req.on('data', (chunk) => {
                tartalom += chunk.toString();
            });
            req.on('end', () => {
                //sanitize & validate
                //XSS - SQL injection


                //Fel kell venni a tartalmat

                let newColor = JSON.parse(tartalom);

                newColor = sanitizeColor(newColor);
                
                if( ! validate(newColor) ) {
                    console.log("Hibás adat került megadásra");
                    return;
                }
                fs.readFile('./datas/colors.json', (err, data) => {
                    const colors = JSON.parse(data);
                    colors.push(newColor);
                    fs.writeFile('./datas/colors.json', JSON.stringify(colors), () => {
                        res.end(JSON.stringify(newColor));
                    });
                })
            })
            break;

        default:
            res.setHeader('content-type', 'text/html');
            res.writeHead(404);
            res.end("404-es hiba. Oldal nem található");
    }

});

server.listen(port);

function sanitizeString(str) {
    return str.replace(/[^#a-z0-9_-\s\.,]/gim, "").trim();
    
}

function sanitizeColor(color){
    color.code = sanitizeString(color.code);
    color.name = sanitizeString(color.name);
    return color;
}

function validate(szin){
    //code alakja #AA00FF
    if(szin.code.length != 7) 
        return false;
    const codePattern = /#[0-9A-Fa-f]{6}/gm;
    const namePattern = /[^a-z]/i;    
    if( ! codePattern.test(szin.code))
        return false;    
    //name csak angol abc betű
    //console.log(szin.name+" -> "+szin.name.replace(namePattern,""));
    if( szin.name != szin.name.replace(namePattern,""))
        return false;
    return  true;
}