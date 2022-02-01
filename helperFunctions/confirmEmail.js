const Token = require("../database/tokenModel");
const User = require("../database/userModel");

module.exports = function (req, res) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (err) console.log(err);
    User.findOne(
      { _id: token._userId, email: req.params.email },
      function (err, user) {
        if (err) console.log(err);
        if (!user) {
          return res.render("login.ejs", { isValid: false });
        } else if (user.isVerified) {
          return res
            .status(200)
            .send("User has been already verified. Please Login");
        } else {
          user.isVerified = true;
          user.save(function (err) {
            if (err) return handleError(err);
            console.log("user verified");
            //req.session.username = null;
            return res.redirect("/login");
          });
        }
      }
    );
  });
};
