const fs = require('fs');
const path = require('path');

// Load and parse the books.json file once at the start
const jsonBooks = fs.readFileSync(
  path.join(__dirname, '../assets/books.json'),
  'utf-8',
);
const books = JSON.parse(jsonBooks);

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

// function to find a book by its title
const findBookByTitle = (title) => {
  books.find((book) => book.title.toLowerCase() === title.toLowerCase());
};

// AddBook function
const addBook = (request, response) => {
  const responseJSON = {
    message: 'Title and author are both required.',
  };

  const { title, author } = request.body;

  if (!title || !author) {
    responseJSON.id = 'addBookMissingParams';
    return respond(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!findBookByTitle(title)) {
    responseCode = 201;
    const book = {
      title,
      author,
    };
    books.push(book);
  } else {
    // did some research and learned the status code for something already existing is 409
    responseJSON.message = 'Book already exists.';
    return respond(request, response, 409, responseJSON);
  }

  return respond(request, response, responseCode, {});
};

// GetBooks function
const getBooks = (request, response) => {
  const responseJSON = {
    books: Object.values(books),
  };
  return respond(request, response, 200, responseJSON);
};

const notFound = (request, response) => {
  const responseJSON = {
    id: 'notFound',
    message: 'The page you are looking for was not found.',
  };

  return respond(request, response, 404, responseJSON);
};

// GetTitles function
const getTitles = (request, response) => {
  const titles = Object.values(books).map((book) => book.title);
  const responseJSON = {
    books: titles,
  };

  return respond(request, response, 200, responseJSON);
};

// GetAuthor function
const getAuthor = (request, response) => {
  const responseJSON = {};
  let responseCode = 400;

  const { author } = request.query;

  if (!author) {
    responseJSON.message = 'Author name required.';
    responseJSON.id = 'addBookMissingParams';
    return respond(request, response, responseCode, responseJSON);
  }

  const authorBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase(),
  );

  if (authorBooks.length === 0) {
    responseJSON.message = 'Author not found.';
    return respond(request, response, responseCode, responseJSON);
  }

  responseCode = 200;
  responseJSON.books = authorBooks;
  return respond(request, response, responseCode, responseJSON);
};

// GetBook function
const getBook = (request, response) => {
  const responseJSON = {};
  let responseCode = 400;

  const { title } = request.query;

  if (!title) {
    responseJSON.message = 'Book title required.';
    responseJSON.id = 'addBookMissingParams';
    return respond(request, response, responseCode, responseJSON);
  }

  const bookFilter = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase(),
  );

  if (bookFilter.length === 0) {
    responseJSON.message = 'Book not found.';
    return respond(request, response, responseCode, responseJSON);
  }

  responseCode = 200;

  const [book] = bookFilter;
  responseJSON.book = book;

  return respond(request, response, responseCode, responseJSON);
};

// RateBook function
const rateBook = (request, response) => {
  const responseJSON = {};

  const { title, rating } = request.body;

  if (!title || !rating) {
    responseJSON.message = 'Title and rating (1-5) are required.';
    responseJSON.id = 'rateBookMissingParams';
    return respond(request, response, 400, responseJSON);
  }

  const book = findBookByTitle(title);

  if (!book) {
    responseJSON.message = 'Book not found.';
    return respond(request, response, 404, responseJSON);
  }

  book.rating = rating;

  return respond(request, response, 204, {});
};

module.exports = {
  getBooks,
  getBook,
  rateBook,
  getAuthor,
  addBook,
  getTitles,
  notFound,
};
