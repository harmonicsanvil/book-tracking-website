const authenticate = require("./authenticate");
const userModel = require('../database/userModel');


module.exports = function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
  userModel.findOne({ username }, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      let isValid = authenticate(user, password);
      if (isValid == 1) {
        req.session.username = username;
        console.log("user logged in");
        res.redirect("/");
      } else{
        res.render("login.ejs", { isValid });
      }
    }
  });
};
