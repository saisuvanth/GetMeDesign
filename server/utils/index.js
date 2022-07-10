const nodemailer = require('nodemailer');

const setCookie = (res, token) => {
	res.cookie('auth', token, {
		httpOnly: true,
		expires: new Date(
			Date.now() + 24 * 60 * 60 * 1000
		),
		secure: false,
	});
}


const sendMail = async (user) => {
	const mailServer = nodemailer.createTransport({
		service: "gmail",
		host: 'smtp.gmail.com',
		secure: true,
		auth: {
			user: "rookievesper@gmail.com",
			pass: "owzgbldliemugoru",
		},
	});
	const token = await user.generateToken();
	html =
		"<h2>Please click the link below to verify your email</h2>" +
		'<a href="http://localhost:8080/verify/' +
		token +
		'">Verify Here</a>';
	const mailOptions = {
		from: "rookievesper@gmail.com",
		to: user.email,
		subject: "Please confirm your Email account",
		html: html,
	};
	mailServer.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log(info);
		}
	});
}

module.exports = { setCookie, sendMail };