const bcrypt = require("bcrypt");

function authenticate(user, password) {
  // if user with username not found
  if (!user) {
    return -1;
  }

  let isSame = bcrypt.compareSync(password, user.password)
  let isValid = user.isVerified;
  if (isSame && isValid) return 1;
  // if password is not correct
  else if (!isSame) return -1;
  // if account is not confirmed
  else if (isSame && !isValid) return 0;
}

module.exports = authenticate;
