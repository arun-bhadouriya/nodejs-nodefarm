const http = require('http');
const PORT = process.env.PORT||3050;
const fs = require('fs');
const url = require('url');

let data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const productsData = JSON.parse(data);

let tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
let tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');
let tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');

let replaceHtml = (el,temp)=>{
    let output = temp.replace(/{%PRODUCTNAME%}/g,el.productName);
    output = output.replace(/{%IMAGE%}/g,el.image);
    output = output.replace(/{%FROM%}/g,el.from);
    output = output.replace(/{%NUTRIENTS%}/g,el.nutrients);
    output = output.replace(/{%QUANTITY%}/g,el.quantity);
    output = output.replace(/{%PRICE%}/g,el.price);
    output = output.replace(/{%DESCRIPTION%}/g,el.description);
    
    output = output.replace(/{%ID%}/g,el.id);

    if(!el.organic) output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}

const server = http.createServer((req,res)=>{
    let {query , pathname} = url.parse(req.url,true);
    // console.log(query);
    // const pathname = req.url;

    //OVERVIEW
    if(pathname=='/overview' || pathname=='/'){
        res.writeHead(200,{'Content-type':'text/html'});

        let data = productsData.map(el=>replaceHtml(el,tempCard)).join('');
        const output = tempOverview.replace('{%CARDS%}',data);
        res.end(output);
    }
    //PRODUCTS
    else if(pathname=='/product'){
        console.log(query);
        
        res.writeHead(200,{'Content-type':'text/html'})
        const product = productsData[query.id];

        const output = replaceHtml(product,tempProduct)

        res.end(output);
    }
    //
    else if(pathname=='/api'){
        res.writeHead(200,{ 'Content-type':'application/json'})
        res.end(data);
        // res.end('/api')
    }
    //NOT FOUND
    else{
        res.writeHead(404,{
          'Content-type':'text/html'  
        })
        res.end("<h1>Page Not Found</h1>");
    }

})

server.listen(PORT,'127.0.0.1',()=>{
    console.log(`http://localhost:${PORT}`);
})