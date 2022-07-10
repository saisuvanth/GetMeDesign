const User = require('../models/User');
const AppError = require('../utils/AppError');

const tokenExists = async (req, res, next) => {
	const token = req?.cookies?.auth ? req?.cookies?.auth : req.headers?.authorization?.split(" ")[1];
	if (token) {
		try {
			const user = await User.findByToken(req.cookies.auth);
			if (user) {
				if (user.local && !user.local.email_verified) {
					next(new AppError(401, 'Please Confirm your email address'));
				}
				req.user = user;
				next();
			} else {
				next(new AppError(401, 'Please log in to access this page'))
			}
		} catch (err) {
			if (err.name === 'JsonWebTokenError') {
				try {
					const guser = await User.findByGoogleToken(token);
					if (guser) {
						req.user = guser;
						next();
					} else next(new AppError(401, 'Please log in to access to the page'))
				} catch (e) { next(new AppError(401, e)); }
			}
		}
	} else {
		next(new AppError(401, 'Please log in to access this page'));
	}
}









module.exports = { tokenExists };