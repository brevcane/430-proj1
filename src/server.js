const http = require('http');
const query = require('querystring');
const fs = require('fs');
const path = rquire('path');

const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const booksPath = path.join(__dirname, './assets/books.json');

// loads and parses the books.json file
const loadBooks = () => {
    try {
        const jsonBooks = fs.readFileSync(booksPath, 'utf-8');
        return JSON.parse(jsonBooks);
    } catch(error) {
        console.error('Error reading or parsing JSON file:', error);
        return null;
    }
}

// stores parsed books into an object
const books = loadData;

// returns the parsed books object
const getBooks = () => {
    return books;
}

const parseBody = (request, response, handler) => {
    const body = [];
  
    request.on('error', (err) => {
      console.dir(err);
      response.statusCode = 400;
      response.end();
    });
  
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      request.body = query.parse(bodyString);
      handler(request, response);
    });
  };

  const handlePost = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/addUser') {
      parseBody(request, response, jsonHandler.addUser);
    }
  };
  

  const handleGet = (request, response, parsedUrl) => {
    if (parsedUrl.pathname === '/style.css') {
      htmlHandler.getCSS(request, response);
    } else if (parsedUrl.pathname === '/getUsers') {
      jsonHandler.getUsers(request, response);
    } else if (parsedUrl.pathname === '/notReal') { 
      jsonHandler.notReal(request, response);
    } else {
      htmlHandler.getIndex(request, response);
    }
  };
  
const onRequest = (request, response) => {
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    if (request.method === 'POST') {
      handlePost(request, response, parsedUrl);
    } else {
      handleGet(request, response, parsedUrl);
    }
  };
  
  http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
  });

module.exports = {
    getBooks
}