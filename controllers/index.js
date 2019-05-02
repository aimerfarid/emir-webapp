const User = require('../models/user');
const Blog = require('../models/blog');
const Travel = require('../models/travel');
const Workout = require('../models/workout');
const nodemailer = require('nodemailer');
const passport = require('passport');
const util = require('util');
const { cloudinary } = require('../cloudinary');
const { deleteProfileImage } = require('../middleware');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  /* GET /landing */
  landingPage(req, res, next) {
    res.render('landing', { title: 'EFII Website' })
  },
  /* GET /index Home */
  async indexPage(req, res, next) {
    const blogs = await Blog.find({});
    const travels = await Travel.find({});
    const workouts = await Workout.find({});
    res.render('index', {
      blogs,
      travels,
      workouts,
      mapBoxGLToken: process.env.MAPBOXGL_TOKEN,
      title: 'Emir\'s Blogs'
    });
  },
  /* GET /register */
  getRegister(req, res, next) {
    res.render('register', {title: 'Register', username: '', email: '' })
  },
  /* POST /register */
  async postRegister(req, res, next) {
    try {
      // eval(require('locus'));
      if (req.file) {
        const { secure_url, public_id } = req.file;
        req.body.image = {secure_url, public_id};
      }
      const user = await User.register(new User(req.body), req.body.password);
      req.login(user, function(err) {
        if (err) return next(err);
        req.session.success = `Welcome to Emir's Website, ${user.username}!`;
        res.redirect('/index');
      });
    } catch (err) {
      deleteProfileImage(req);
      const { username, email } = req.body;
      let error = err.message;
      if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
        error = 'A user with the given email is already registered';
      }
      res.render('register', { title: 'Register', username, email, error });
    }
  },
  /* GET /login */
  getLogin(req, res, next) {
    if(req.isAuthenticated()) return res.redirect('/');
    if (req.query.returnTo) req.session.redirectTo = req.headers.referer;
    res.render('login', {title: 'Login'})
  },
  /* POST /login */
  async postLogin(req, res, next) {
    const { username, password } = req.body;
    const { user, error } = await User.authenticate()(username, password);
    if (!user && error) return next(error);
    req.login(user, function(err) {
      if (err) return next(err);
      req.session.success = `Welcome back, ${username}!`;
      const redirectUrl = req.session.redirectTo || '/index';
      delete req.session.redirectTo;
      res.redirect(redirectUrl);
    });
  },

  /* GET /logout */
  getLogout(req, res, next) {
    req.logout();
    res.redirect('/index');
  },

  /* GET /profile */
  async getProfile(req, res, next) {
    const blogs = await Blog.find().where('author').equals(req.user._id).limit(10).exec();
    const travels = await Travel.find().where('author').equals(req.user._id).limit(10).exec();
    const workouts = await Workout.find().where('author').equals(req.user._id).limit(10).exec();
    res.render('profile', { blogs, travels, workouts });
  },

  /* UPDATE /profile */
  async updateProfile(req, res, next) {
    const {
      username,
      email
    } = req.body;
    const { user } = res.locals;
    if (username) user.username = username;
    if (email) user.email = email;
    if (req.file) {
      if (user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);
      const { secure_url, public_id } = req.file;
      user.image = { secure_url, public };
    }
    await user.save();
    const login = util.promisify(req.login.bind(req));
    await login(user);
    req.session.success = 'Profile successfully updated!';
    res.redirect('/profile');
  },

  /* GET /forgot */
  getForgotPw(req, res, next) {
	   res.render('users/forgot');
  },

  /* PUT /forgot */
  async putForgotPw(req, res, next) {
  	const token = await crypto.randomBytes(20).toString('hex');

  	const user = await User.findOne({ email: req.body.email })
  	if (!user) {
  		req.session.error = 'No account with that email address exists.';
  	  return res.redirect('/forgot-password');
  	}

  	user.resetPasswordToken = token;
  	user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const msg = {
      to: user.email,
      from: 'Emir\'s Website Admin <emirfarid8196@gmail.com>',
      subject: 'Emir\'s Website - Forgot Password / Reset',
      text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
			Please click on the following link, or copy and paste it into your browser to complete the process:
			http://${req.headers.host}/reset/${token}
			If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/				/g, '')
    };

    await sgMail.send(msg);
    req.session.success = `An e-mail has been sent to ${user.email} with further instructions.`;
    res.redirect('/forgot-password');
  },

  /* GET /reset */
  async getReset(req, res, next) {
    const { token } = req.params;
  	const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      req.session.error = 'Password reset token is invalid or has expired.';
      return res.redirect('/forgot-password');
    }
    res.render('users/reset', { token });
  },

  /* PUT /reset */
  async putReset(req, res, next) {
  	const { token } = req.params;
  	const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

  	if (!user) {
  	 req.session.error = 'Password reset token is invalid or has expired.';
  	 return res.redirect(`/reset/${ token }`);
  	}

  	if(req.body.password === req.body.confirm) {
  		await user.setPassword(req.body.password);
  		user.resetPasswordToken = null;
  		user.resetPasswordExpires = null;
  		await user.save();
  		const login = util.promisify(req.login.bind(req));
  		await login(user);
  	} else {
  		req.session.error = 'Passwords do not match.';
  		// return res.redirect(`/reset/${ token }`);
  		return res.redirect('/forgot-password');
  	}

    const msg = {
      to: user.email,
      from: 'Emir\'s Website Admin <emirfarid8196@gmail.com>',
      subject: 'Emir\'s Website - Password Changed',
      text: `
      Hello,
	  	This email is to confirm that the password for your account has just been changed.
	  	If you did not make this change, please hit reply and notify us at once.`.replace(/		  	/g, '')
    };

    await sgMail.send(msg);

    req.session.success = 'Password successfully updated!';
    res.redirect('/index');
  },

  /* PUT /send */
  async postInfo(req, res, next) {
    const transporter = await nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'emirfaridtm@gmail.com',
        pass: process.env.PWD_TM_GMAIL
      }
    });

    const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>${req.body.subject}</h3>
      <p>${req.body.message}</p>
    `

    const mailOptions = {
      from: '"Website EFII" <emirfarid8196@gmail.com>',
      to: 'aimerfarid@icloud.com',
      subject: 'New Contacts',
      html: output
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log(err.message);
        req.session.error = "Message sending error!";
        res.redirect('/');
      } else {
        console.log('Email sent: ' + info.response);
        req.session.success = 'Contacts successfully sent!';
        res.redirect('/');
      }
    });
  }
}
