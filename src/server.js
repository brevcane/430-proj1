const http = require('http');
const query = require('querystring');

const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

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
  if (parsedUrl.pathname === '/addBook') {
    parseBody(request, response, jsonHandler.addBook);
  } else if (parsedUrl.pathname === '/rateBook') {
    parseBody(request, response, jsonHandler.rateBook);
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getBooks') {
    jsonHandler.getBooks(request, response);
  } else if (parsedUrl.pathname === '/getTitles') {
    jsonHandler.getTitles(request, response);
  } else if (parsedUrl.pathname === '/getBook') {
    jsonHandler.getBook(request, response);
  } else if (parsedUrl.pathname === '/getAuthor') {
    jsonHandler.getAuthor(request, response);
  } else if (parsedUrl.pathname === '/notFound') {
    jsonHandler.notFound(request, response);
  } else if (parsedUrl.pathname === '/apiDoc.html') {
    htmlHandler.getDoc(request, response);
  } else if (parsedUrl.pathname === '/apiDoc.css') {
    htmlHandler.getDocCSS(request, response);
  } else if (parsedUrl.pathname === '/hortonb-proj1-doc.pdf') {
    htmlHandler.getPDF(request, response);
  } else {
    htmlHandler.getIndex(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.query = Object.fromEntries(parsedUrl.searchParams.entries());

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
