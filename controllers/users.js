const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User registered successfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", "User already registered with this account");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome To WanderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logOut = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
}