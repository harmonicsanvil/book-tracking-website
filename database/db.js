const mongoose = require("mongoose");
const url = 'mongodb+srv://admin:whywhywhy3@cluster0.fc2ha.mongodb.net/book-tracking-website?retryWrites=true&w=majority'
//const userModel = require("./userModel");


const profileSchema = require("./profileSchema")
class database {
  constructor() {
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    console.log("connected to db");
  }

  getModel(username) {
    return mongoose.model(username, profileSchema);
  }

  async getStats(username) {
    const model = this.getModel(username);
    let totalBooks = 0;
    let reading = 0;
    let toRead = 0;
    let read = 0;
    let dropped = 0;
    let stats;
    let res = model.findOne({}, "books", (err, data) => {
      if (err) console.log(err);
      totalBooks = data.books.length || 0;
      data.books.forEach((book => {
        if(book.status == "reading") reading++;
        else if(book.status == "to-read") toRead++;
        else if(book.status == "read") read++;
        else dropped++;
      }));
      stats = {
        totalBooks,
        reading,
        read,
        dropped,
        toRead,
      };
    });

    await res;
    return stats;

  }

  async getBooks(username) {
    const model = this.getModel(username);
    let books;
    let res = model.findOne({}, "books", async (err, data) => {
      if (err) console.log(err);
      books = data.books;
    });
    await res;
    return books;
  }

  addBook(username, book) {
    const model = this.getModel(username);
    let flag = true;

    model.findOne({}, "books", (err, data) => {
      if (err) conole.log(err);
      const readDB = data.books;
      for (let i = 0; i < readDB.length; i++) {
        if (readDB[i].id === book.id) {
          flag = false;
          if (book.status === " ") readDB.splice(i, 1);
          else readDB[i].status = book.status;
          break;
        }
      }

      if (flag) {
        readDB.push(book);
      }

      data.markModified("books");
      data.save((err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  updateBookStatus(username, books, callback) {
    const model = this.getModel(username);

    model.findOne({}, "books", (err, data) => {
      if (err) conole.log(err);

      books.books.forEach((book) => {
        let dbBook = data.books.find((b) => b.id === book.id);
        if (dbBook) book.status = dbBook.status;
      });
      callback();
    });
  }

  // addUser(username, password, email) {
  //   let user = new userModel({
  //     username,
  //     password,
  //     email,
  //     isVerified: false,
  //   });
  //   user.save(function (err) {
  //     if (err) return handleError(err);
  //   });
  //   console.log("User added to db");
  // }

  // searchUser(username, callback) {
  //   userModel.findOne({username}, (err, user) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       callback(user);
  //     }
  //   });
  // }
}

module.exports = database;
