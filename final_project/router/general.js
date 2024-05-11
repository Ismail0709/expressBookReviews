const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username && !password){
    return res.status(404).json({message: "Username and Password not provided"});
  }
  if(!isValid){
    return res.status(404).json({message: "User already exists"});
  }
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
  return res.status(501).json({message: "Error, Try again"});
});

//promise
public_users.get("/", (req, res)=>{
  axios.get("http://localhost:5000/books")
  .then(response=> {
    res.send(JSON.stringify(response.data, null, 4));
  })
  .catch(error=>{
    res.status(501).json({message: `${error}, try again`});
  });
});

//async 
public_users.get("/", async(req, res)=>{
 try{
  const response = await axios.get("http://localhost:5000/books");
  const books = response.data;
  res.send(JSON.stringify(books, null, 4));
  return res.status(200).json({message: "Successfull"})
 } catch (error){
  return res.status(501).json({message: "Try again"})
 }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
//promise
public_users.get("/isbn/:isbn", (req, res)=>{
  const isbn = req.params.isbn;
  new Promise((resolve, reject)=> {
    const book = books[isbn];
    if(book){
      resolve(book);
    } else{
      reject(`The book ${book} is not available`);
    }
  })
  .then(book => res.send(book))
  .catch(error => res.status(404).json({message: `Error: ${error.message}`}));
});

//async 
public_users.get("isbn/:isbn", async (req, res)=>{
  const isbn = req.params.isbn;
  try{
    const response = await books[isbn];
    res.send(response);
  }catch (error){
    console.log(error);
    res.status(404).json({message: error.message});
  }
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let authorBooks = [];

  for(let book in books){
    if(books[book].author === author){
      authorBooks.push(books[book]);
    }
    }
    if(authorBooks.length > 0){
      return res.send(authorBooks);
    }else{
      res.status(404).json({message: `No book is found for an author, ${author}`});
    }
 
  //return res.status(300).json({message: "Yet to be implemented"});
});

//promise
// public_users.get("/author/:author", (req, res)=>{
//   const author = req.params.author;
//   let authorBooks = [];
//   new Promise((resolve, reject)=>{
//     for(let book in books){
//       if(books[book].author === author){
//         authorBooks.push(books[book]);
//       }
//       if(authorBooks.length > 0){
//         resolve(authorBooks);
//       }else{
//         reject(`The book of author ${author} is not found`);
//       }
//     }
//   })
//   .then(authorBooks => res.send(authorBooks))
//   .catch(error => {
//     return res.status(404).json({message: error.message});
//   });
// });

//async 

// public_users("/author/:author", async (req, res)=> {
//   const author = req.params.author;
//   let authorBooks = [];

//   try{
//     for(let book in books){
//       if(books[book].author === author){
//         authorBooks.push(books[book]);
//       }

//       if(authorBooks.length > 0){
//         res.send(authorBooks);
//       }else{
//         throw new Error(`The book with author ${author} not found`);
//       }
//     }
//   } catch (error){
//     return res.status(404).json({message: error.message});
//   }
// });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let authorBooks = [];

  for(let book in books){
    if(books[book].title === title){
      authorBooks.push(books[book]);
    }
  }
  if(authorBooks.length > 0){
    res.send(authorBooks);
  }else{
    res.status(404).json({message: `No book is found with a title ${title}`});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//promise

// public_users.get("/title/:title", (req, res)=>{
//   const title = req.params.title;
//   authorBooks = [];
//   new Promise((resolve, reject)=> {
//     for(let book in books){
//       if(books[book].title === title){
//         authorBooks.push(books[book]);
//       }
//       if(authorBooks.length > 0){
//         resolve(authorBooks);
//       }else{
//         reject(`The book with title ${title} is not found`);
//       }
//     }
//   })
//   .then(authorBooks=> res.send(authorBooks))
//   .catch(error=> {
//     return res.status(404).json({message: error.message});
//   });
// });

//async
// public_users.get("/title/:title", async (req, res)=>{
//   const title = req.params.title;
//   authorBooks = [];
//   try{
//     for(let book in books){
//       if(books[book].title === title){
//         authorBooks.push(books[book]);
//       }
//       if(authorBooks.length > 0){
//         res.send(authorBooks);
//       }else{
//         throw new Error(`The book with title ${title} is not found`);
//       }
//     }
//   }catch(error){
//     return res.status(404).json({message: error.message});
//   }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(!books[isbn]){
    res.status(404).json({message: "This book doesn't exist"})
  }
 
  const review = books[isbn].reviews;
  return res.status(200).json({reviews: review});
  //res.send(books[isbn].reviews)
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
