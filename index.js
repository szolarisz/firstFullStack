const http = require('http');
const fs = require('fs');
const port = 4444;

const server = http.createServer((req,res) =>{
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
   switch (true){
       case req.url === "/" && req.method === "GET":
           fs.readFile('./views/index.html', (err, data) =>{
               res.setHeader('content-type', 'text/html; charset=UTF-8');
               res.writeHead(200);
               res.end(data);
           });
           break;
        case req.url === "/favicon.ico" && req.method === "GET":
           fs.readFile('./favicon.ico', (err, data) =>{
               res.setHeader('content-type', 'image/ico');
               res.writeHead(200);
               res.end(data);
           });
           break;
           case req.url === "/script.js" && req.method === "GET":
            fs.readFile('./public/script.js', (err, data) =>{
                res.setHeader('content-type', 'application/javascript');
                res.writeHead(200);
                res.end(data);
            });
            break;
            
            //Kérés a JSON állományra
            case req.url === "/colors" && req.method === "GET":
            fs.readFile('./datas/colors.json', (err, data) =>{
                res.setHeader('content-type', 'application/json');
                res.writeHead(200);
                res.end(data);
            });
            break;

            //Írási kérelem kiszolgálása
            case req.url==="/colors" && req.method === "POST":
                let tartalom ='';
                req.on('data', (chunk) =>{
                        tartalom += chunk.toString();
                });
                req.on('end', () => {
                    //Fel kell venni a tartalmat
                    const newColor = JSON.parse(tartalom);

                    fs.readFile('./datas/colors.json', (err, data) =>{
                        const colors = JSON.parse(data);
                        colors.push(newColor);
                        fs.writeFile('./datas/colors.json', JSON.stringify(colors), ()=>{
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