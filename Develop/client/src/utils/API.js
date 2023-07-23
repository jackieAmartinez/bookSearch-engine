// route to get logged in user's info (needs the token)
// export const getMe = (token) => {
//   return fetch('/api/users/me', {
//     headers: {
//       'Content-Type': 'application/json',
//       authorization: `Bearer ${token}`,
//     },
//   });
// };
export const getMe = (token) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `query {
        me {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`
    }),
  });
};

export const createUser = (userData) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutation: `mutation createUser($username: String!, $email: String!, $password: String!) {
        createUser(username: $username, email: $email, password: $password) {
          token
          user {
            _id
            username
          }
        }
      }`,
      variables: userData,
    }),
  });
};

// export const loginUser = (userData) => {
//   return fetch('/api/users/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(userData),
//   });
// };
export const loginUser = (userData) => {
  return fetch('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutation: `mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            _id
            username
          }
        }
      }`,
      variables: userData,
    }),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/graphql', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutation: `mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`,
      variables: { input: bookData },
    }),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch(`/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mutation: `mutation deleteBook($bookId: ID!) {
        deleteBook(bookId: $bookId) {
          _id
          username
          email
          savedBooks {
            _id
            authors
            description
            title
            image
            link
          }
        }
      }`,
      variables: { bookId },
    }),
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};