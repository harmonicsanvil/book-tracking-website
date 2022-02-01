const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userModel = require("../database/userModel");
const Token = require("../database/tokenModel");
const profileSchema = require("../database/profileSchema");
const mongoose = require("mongoose");
const crypto = require('crypto');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


module.exports = function (req, res) {
  userModel.findOne({ $or: [{ username: req.body.username }, { email : req.body.email }] }, async (err, user) => {
    if (err) {
      console.log(err);
    } else if (user) {
      res.redirect("/register");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      //db.addUser(req.body.username, hashedPassword, req.body.email);
      // add the user to database
      let user = new userModel({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        isVerified: false,
      });
      // create of new collection for user
        //db.createUserDB(req.body.username);

      const profileModel = mongoose.model(req.body.username, profileSchema);
      let array = [];
      let profile = new profileModel({
        books: array,
      });


      const token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });

        token.save(function (err) {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mailfortestingpurpose3@gmail.com",
          pass: "123456test",
        },
      });

      const mailOptions = {
        from: "mailfortestingpurposes3@gmail.com",
        to: user.email,
        subject: "Account verification link",
        text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + 
          req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {

          user.save(function (err) {
            if (err) return handleError(err);
          });

          console.log("User added to db");

          profile.save(function (err) {
            if (err) return handleError(err);
          });
          console.log("Email sent: " + info.response);
        }
      });

      res.redirect("/login");
    }
  });
};
