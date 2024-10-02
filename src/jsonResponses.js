const users = {};

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
const getUsers = (request, response) => {
    const responseJSON = {
        users
    };

    return respond(request, response, 200, responseJSON);
}

//addBook
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  const { name, age } = request.body;


  if (!name || !age) {
    responseJSON.id = 'addUserMissingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name: name,
    };
  }

  users[name].age = age;

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

module.exports = {
    getUsers,
    addUser,
    notFound,
};