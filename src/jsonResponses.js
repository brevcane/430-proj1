const fs = require('fs');

// Loads and parses the books.json file
const loadBooks = () => {
  try {
    const jsonBooks = fs.readFileSync(`${__dirname}/../assets/books.json`, 'utf-8');
    return JSON.parse(jsonBooks);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
    return null;
  }
};

const books = loadBooks();

const respond = (request, response, status, object) => {
  const content = JSON.stringify(object);
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });

  if (request.method !== 'HEAD' && status !== 204) {
    response.write(content);
  }

  response.end();
};

// getBooks
// returns all books
const getBooks = (request, response) => {
  const responseJSON = {
    books,
  };
  return respond(request, response, 200, responseJSON);
};

// addBook
// adds a book to books.json, requires a title and author
const addBook = (request, response) => {
  const responseJSON = {
    message: 'Title and author are both required.',
  };

  const { title, author } = request.body;

  if (!title || !author) {
    responseJSON.id = 'addUserMissingParams';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!books[title]) {
    responseCode = 201;
    books[title] = {
      title,
    };
  }

  books[title].author = author;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, responseJSON);
  }

  return respond(request, response, responseCode, {});
};

const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  return respond(request, response, 404, responseJSON);
};

// getTitles
// returns all the book titles
const getTitles = (request, response) => {
  const titles = books.map((book) => book.title);

  const responseJSON = {
    titles,
  };

  return respond(request, response, 200, responseJSON);
};

// getAuthor
// returns all books by a specific author
const getAuthor = (request, response) => {
  const responseJSON = {};
  let responseCode = 400;

  // Extract the author from the query parameters
  const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
  const author = searchParams.get('author'); // Use searchParams to get the author

  if (!author) {
    responseJSON.message = 'Author name required.';
    responseJSON.id = 'addUserMissingParams';
    return respond(request, response, responseCode, responseJSON);
  }

  const authorBooks = books.filter((book) => book.author.toLowerCase() === author.toLowerCase());

  if (authorBooks.length === 0) {
    responseJSON.message = 'Author not found.';
    return respond(request, response, responseCode, responseJSON);
  }

  responseCode = 200;
  responseJSON.books = authorBooks;
  return respond(request, response, responseCode, responseJSON);
};


// getBook
// returns a book by title
// const getBook = (request, response) => {

// };

// // rateBook
// // adds a rating to a book
// const rateBook = (request, response) => {

// };

module.exports = {
  getBooks,
  // getBook,
  // rateBook,
  getAuthor,
  addBook,
  getTitles,
  notFound,
};
