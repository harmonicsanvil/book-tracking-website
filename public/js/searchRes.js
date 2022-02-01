const forms = document.querySelectorAll(".bookStatus");

forms.forEach((form) => {
  form.addEventListener("change", () => {
    fetch("status", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookStatus: form.elements[0].value,
        index: form.elements[1].value,
        case: 0,
      }),
    }).then((res) => console.log(res));
  });
});
