const server = require('./server.js');
const books = server.getBooks();

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

//getBooks
// returns all books
const getBooks = (request, response) => {
    const responseJSON = {
        books
    };

    return respond(request, response, 200, responseJSON);
}

//addBook
// adds a book to books.json, requires a title and author
const addBook = (request, response) => {
  const responseJSON = {
    message: 'Title and author are both required.',
  };

  const { title, author } = request.body;


  if (!title || !author) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[title]) {
    responseCode = 201;
    users[title] = {
      title: title,
    };
  }

  users[title].author = author;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

const notFound = (request, response) => {
    const responseJSON = {
        id: 'notFound',
        message: 'The page you are looking for was not found.',
    };

    return respond(request, response, 404, responseJSON);
};

//getTitles
// returns all the book titles
const getTitles = (request, response) => {
  const titles = books.map(book => book.title);

  const responseJSON = {
    titles
  };

  return respond(request, response, 200, responseJSON);
};

//getAuthor
// returns all books by a specific author
const getAuthor = (request, response) => {
  
}

module.exports = {
    getBooks,
    addBook,
    getTitles,
    notFound,
};