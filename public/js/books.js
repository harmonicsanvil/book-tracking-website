const books = document.querySelector('.books');
let booksArray = books.childNodes;

const reading = document.querySelector('#reading');
reading.style = 'color:#1d1d1d';

const panel = document.querySelector('.panelParent').childNodes;

const forms = document.querySelectorAll(".bookStatus");

forms.forEach((form) => {
  form.addEventListener("change", () => {
    fetch("status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookStatus: form.elements[0].value,
        index: form.elements[1].value,
        case: 1,
      }),
    }).then((res) => console.log(res));
  });
});

panel.forEach((p) => {
    p.addEventListener('click', ()=> {
        booksArray.forEach((element) => element.style = 'display:none');
        panel.forEach((element) => element.style = 'color:585858');
    p.style = 'color:#1d1d1d';
    document.querySelectorAll('.' + p.id).forEach((book =>
        book.style = 'display:grid'));
    });
});