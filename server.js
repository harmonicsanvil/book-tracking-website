const express = require("express");
const database = require("./database/db");
const gBooks = require("./api/googlebooks");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const app = express();
const db = new database();
const signup = require('./helperFunctions/signup');
const login = require('./helperFunctions/login');
const confirmEmail = require('./helperFunctions/confirmEmail');

let books;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "sss-h.quiet!..",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/test1",
    }),
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// if user is logged in user will be redirected to home
const redirectHome = (req, res, next) => {
  if (req.session.username) {
    res.redirect("/");
  } else {
    next();
  }
};

// if user is not logged in user will be redirected to login
const redirectLogin = (req, res, next) => {
  if (req.session.username) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", redirectLogin, async (req, res) => {
  const stats = await db.getStats(req.session.username);
  res.render("home.ejs", {stats, name : req.session.username});
});

app.get("/login", redirectHome, (req, res) => {
  res.render("login.ejs", { isValid: true });
});

app.get("/register", redirectHome, (req, res) => {
  res.render("signup.ejs");
});

app.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy(function (err) {
    if (err) console.log(err);
    console.log("user logged out")
    res.redirect("/");
  });
});

app.get("/search", redirectLogin, (req, res) => {
  // async cause we need to wait for gbooks to finish executing
  async function xyz() {
    books = await gBooks(req.query.query);
    //update the status of books in search result
    db.updateBookStatus(req.session.username, books, () =>
      res.render("searchRes.ejs",{books, name:req.session.username})
    );
  }

  xyz();
});

app.get("/books",redirectLogin, async (req, res) => {
    books = await db.getBooks(req.session.username);
    //books.forEach((book)=>console.log(book));
    res.render('books.ejs',{books, name:req.session.username});

});

app.post("/login", redirectHome, login);

app.post("/register", redirectHome, signup);

app.get('/confirmation/:email/:token',confirmEmail)


app.put("/status", redirectLogin, (req, res) => {
  let i = req.body.index;
  let sit = req.body.case;
  if (sit === 0) {
    books.books[i].status = req.body.bookStatus;
    db.addBook(req.session.username, books.books[i]);
  }
  else if (sit === 1) {
    books[i].status = req.body.bookStatus;
    db.addBook(req.session.username, books[i]);
  }

  res.end();
});

app.listen(process.env.PORT, ()=> console.log("server started"));
