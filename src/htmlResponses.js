const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);
const doc = fs.readFileSync(`${__dirname}/../client/apiDoc.html`);
const docCss = fs.readFileSync(`${__dirname}/../client/apiDoc.css`);
const pdf = fs.readFileSync(`${__dirname}/../client/hortonb-proj1-doc.pdf`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getDoc = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(doc);
  response.end();
};

const getCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

const getDocCSS = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(docCss);
  response.end();
};

const getPDF = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/pdf' });
  response.write(pdf);
  response.end();
}

module.exports = {
  getIndex,
  getCSS,
  getDoc,
  getDocCSS,
  getPDF
};
