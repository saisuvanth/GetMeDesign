const User = require('../models/User');
const { setCookie, sendMail } = require('../utils');
const AppError = require('../utils/AppError');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client({ clientId: '25271568058-3olmjkgn2o92cb6fpd0dfplpk8f2apo4.apps.googleusercontent.com' });

const loginUsingMail = async (req, res, next) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return next(new AppError(400, 'Please fill all the fields'));
	}
	try {
		let user = await User.findOne({ 'local.username': username });
		if (!user || (await user.comparePassword(password))) {
			return next(new AppError(401, 'Incorrect username or password'));
		} else {
			const token = await user.generateToken();
			setCookie(res, token);
			res.status(200).json({ message: 'Login successful' });
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
}

const loginUsingGoogle = async (req, res, next) => {
	const response = await client.verifyIdToken({ idToken: req.body.credential, audience: '25271568058-3olmjkgn2o92cb6fpd0dfplpk8f2apo4.apps.googleusercontent.com' });
	const { email, email_verified, name, sub, jti, exp } = response.getPayload();
	let user = await User.findOne({ email });
	if (user) {
		if (user.google) {
			user.google.exp = exp;
			user.tokens.push(jti);
			user = await user.save();
			setCookie(res, jti);
			return res.status(200).json({ message: 'Login Successful' })
		}
		return next(new AppError(400, 'Email is already in use'));
	}
	try {
		user = new User({ email, google: { googleId: sub, exp, name: name }, tokens: [jti] });
		user = await user.save();
		setCookie(res, jti);
		return res.status(200).json({ message: 'Login Successful' })
	} catch (err) {
		console.log(err);
		next();
	}
}

const registerUsingMail = async (req, res, next) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return next(new AppError(400, 'Please fill all the fields'));
	}
	let user = new User({ email, local: { username, password } });
	try {
		user = await user.save();
		res.status(200).json({ message: 'User created successfully' });
		await sendMail(user);
	} catch (err) {
		console.error(err);
		next(err);
	}
}

const verifyToken = async (req, res, next) => {
	const user = await User.findByToken(req.params.token);
	if (!user) return next(new AppError(400, 'User not found'));
	user.local.email_verified = true;
	user.tokens = [];
	try {
		const savedUser = await user.save();
		console.log(savedUser);
		res.redirect(`${process.env.FRONT_END}`);
	} catch (err) {
		console.log(err);
		next(new AppError(500, 'Internal Server Error'));
	}
}

const logout = async (req, res, next) => {
	console.log(req.user);
	let { user } = req;
	user = await user.removeToken(req.cookies.auth);
	console.log(user);
	res.clearCookie('auth')
		.status(200).json({ message: 'User Logged Out' });
}



module.exports = { loginUsingMail, registerUsingMail, loginUsingGoogle, verifyToken, logout };