const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');
const validator = require('validator')

const LocalUser = new Schema({
	username: {
		type: String,
		required: true,
		unique: [true, 'Username already exists'],
		validate: [validator.isAlphanumeric, 'Username must contain only letters and numbers'],
	},
	email_verified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: true,
		// minlength: [8, 'Password must be at least 8 characters long'],
		// select: false,
	},
});


const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: [true, 'Email already exists'],
		validate: [validator.isEmail, '{VALUE} is not a valid email']
	},
	local: {
		type: LocalUser,
		required: false,
	},
	google: new Schema({
		googleId: String,
		exp: String,
		name: String,
	}),
	// provider: {
	// type: String,
	// enum: ['email', 'google', 'linkedin', 'twitter'],
	// default: 'email'
	// },
	tokens: [String],
})

// UserSchema.


UserSchema.methods.comparePassword = async function (password) {
	const user = this;
	console.log(user.local.password, password)
	return await bcrypt.compare(user.local.password, password);
}

UserSchema.methods.generateToken = async function () {
	const user = this;
	const token = sign({ _id: user._id.toHexString() }, process.env.JWT_SECRET, {
		expiresIn: "1d",
	}).toString();
	user.tokens.push(token);
	await user.save()
	return token;
}

UserSchema.statics.findByGoogleToken = async function (token) {
	try {
		const user = await this.findOne({ tokens: token });
		if (!user) throw 'User not found';
		const curTime = Date.now() / 1000;
		if (curTime > user.google.exp) {
			return false;
		}
		return { email: user.email, name: user.google.name };
	} catch (err) {
		console.log(err);
		throw err;
	}
}

UserSchema.statics.findByToken = async function (token) {
	let payload;
	try {
		payload = verify(token, process.env.JWT_SECRET);
	} catch (e) {
		throw e;
	}
	return await this.findOne({ tokens: token });
}

UserSchema.methods.removeToken = async function (token) {
	const user = this;
	console.log(user.token);
	return await user.update({
		$pull: {
			tokens: token,
		},
	});
};

UserSchema.pre("save", async function (next) {
	console.log('in pre');
	if (!this.isModified("local.password")) return;
	this.local.password = await bcrypt.hash(this.local.password, 10);
	next();
})

module.exports = model('User', UserSchema);