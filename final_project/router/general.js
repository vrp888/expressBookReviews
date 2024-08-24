const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const result = books[req.params.isbn];
  if (result) {
    res.send(result);
  } else {
    res.status(404).send({ error: 'Book not found' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const bookKeys = Object.keys(books);
  const results = [];

  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      results.push(books[key]);
    }
  });

  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).send({ error: 'No books found for this author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const bookKeys = Object.keys(books);
  const results = [];

  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      results.push(books[key]);
    }
  });

  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).send({ error: 'No books found with this title' });
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
