const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
for(let user in users){
  if(users[user].username === username){
    return true;
  }
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let authUser = users.filter(user=> {
  return user.username === username && user.password === password
});
if(authUser.length > 0){
  return true;
}else{
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username && !password){
    return res.status(404).json({message: "Username and password not provided"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({data: password}, "access", {expiresIn: 60*60});

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).json({message: "Login successfull"});
  }else{
    return res.status(404).json({message: "Invalid Login, Check username and password"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  console.log(username);
  
  if(!review){
    return res.status(400).json({message: "Review not provided"});
  }

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if(!books[isbn].reviews){
    books[review].reviews = {};
  }

  if(books[isbn].reviews[username]){
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review modified successfully"})
  }

  books[isbn].reviews[username] = review;
  return res.status(404).json({message: "Review added successfully"});

  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if(!username){
    return res.status(401).json({message: "Unauthorized"});
  }

  if(!isValid(username)){
    return res.status(401).json({message: "Invalid user"});
  }

  if(!books[isbn]){
    return res.status(404).json({message: "Book not found"});
  }

  if(!books[isbn].reviews[username]){
    return res.status(401).json({message: `Review by ${username} is not found`});
  }

  delete books[isbn].reviews[username];
  res.status(200).json({message: "Review deleted successfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
