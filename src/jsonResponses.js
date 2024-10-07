const fs = require('fs');
const path = require('path');

// Load and parse the books.json file once at the start
let books = {};

const loadBooks = () => {
  try {
    const jsonBooks = fs.readFileSync(
      path.join(__dirname, '../assets/books.json'),
      'utf-8',
    );
    books = JSON.parse(jsonBooks);
  } catch (error) {
    console.error('Error reading or parsing JSON file:', error);
  }
};

loadBooks();

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

// addBook
// adds a book to books.json, requires a title and author
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

  if (!books[title]) {
    responseCode = 201;
    books[title] = {
      title,
      author,
    };
  }

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, responseJSON);
  }

  return respond(request, response, responseCode, {});
};

// getBooks
// returns all books
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

// getTitles
// returns all the book titles
const getTitles = (request, response) => {
  const titles = Object.values(books).map((book) => book.title);
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

  const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
  const author = searchParams.get('author');

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

// getBook
// returns a book by title
const getBook = (request, response) => {
  const responseJSON = {};
  let responseCode = 400;

  const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
  const title = searchParams.get('title');

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

// rateBook
// adds a 1-5 rating to a book
const rateBook = (request, response) => {
  const responseJSON = {};
  let responseCode = 400;

  const { title, rating } = request.body;

  if (!title || rating === undefined) {
    responseJSON.message = 'Title and rating (1-5) are required.';
    responseJSON.id = 'rateBookMissingParams';
    return respond(request, response, responseCode, responseJSON);
  }

  if (books[title]) {
    books[title].rating = rating;
    responseCode = 204;
    responseJSON.message = 'Rating updated successfully';
  } else {
    responseJSON.message = 'Book not found.';
    return respond(request, response, 404, responseJSON);
  }

  return respond(request, response, responseCode, responseJSON);
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
