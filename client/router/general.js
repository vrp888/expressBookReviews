const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Promise/callback
  axios.get('http://localhost:5000')
    .then(response => {
      res.send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(500).send({ message: 'Error fetching book list', error: error.message });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  // async/await
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send({ error: 'Book not found' });
    } else {
      res.status(500).send({ message: 'Error fetching book details', error: error.message });
    }
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Promise/callback
  const author = req.params.author.toLowerCase();

  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        res.status(404).send({ error: 'No books found for this author' });
      } else {
        res.status(500).send({ message: 'Error fetching book details', error: error.message });
      }
    });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  // async/await
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.send(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).send({ error: 'No books found with this title' });
    } else {
      res.status(500).send({ message: 'Error fetching book details', error: error.message });
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.send(book.reviews);
  } else {
    res.status(404).send({ error: 'Book not found' });
  }
});

module.exports.general = public_users;
