require('dotenv').config()

const fetch = require("node-fetch");
const KEY = process.env.GOOGLE_API;

//let query = req.body.query;
//console.log(query);

async function getBooks(query) {
  let url =
    "https://www.googleapis.com/books/v1/volumes?q=" +
    query +
    // "&maxResults=5" +
    "&printType=books" + 
    "&key=" +
    KEY;

  //   let url2 =
  //     "https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&maxResults=5&key=" +
  //     KEY;
  let array = [];
  const res = fetch(url)
    .then((res) => res.json())
    .then((json) =>
      json.items.forEach((element) => {
        const book = {
          id: "",
          status: "",
          title: "",
          authors: [],
          language: "",
          publisher: "",
          description: "",
          image: "",
        };
        //console.log(element);
        book.id = element.id;
        book.status = " ";
        book.title = element.volumeInfo.title;
        book.authors = element.volumeInfo.authors ? element.volumeInfo.authors : ["Unknown"];
        book.language = element.volumeInfo.language;
        book.publisher = element.volumeInfo.publisher;
        book.description = element.volumeInfo.description;
        try {
          book.image = element.volumeInfo.imageLinks.thumbnail
        } catch (err) {
          book.image = "images/cover_not_found.png";

        }
        //console.log(book);
        array.push(book);
      })
    ).catch(err => console.log(err));
  // .then(() => {
  //   const books = { book: array };
  //   console.log(books);
  //   return books;
  // });
  let books = await res;
  books = { books : array };
  //console.log(books);
  return books;
}

// async function xyz() {
//   let books1 = await getBooks("1984");
//   console.log(books1);
// }

// xyz();
module.exports = getBooks;
