const User = require('../models/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register');
};

module.exports.registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password)

        //auto login after register, this function needs an error callback
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome! ${registeredUser.username}`);
            res.redirect('/campgrounds');
        });


    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

};

module.exports.loginForm = (req, res) => {
    res.render('users/login');
};

module.exports.loginUser = async (req, res) => {
    const { username } = req.body;
    req.flash('success', `Welcome! ${username}`);
    const original = req.session.returnTo;
    if (original) {
        delete req.session.returnTo;
        res.redirect(original);
    } else {
        res.redirect('/campgrounds');
    }
};

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
};