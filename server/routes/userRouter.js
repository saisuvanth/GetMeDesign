const { Router } = require('express');
const { loginUsingMail, registerUsingMail, loginUsingGoogle, verifyToken, logout } = require('../controllers/userController');
const { tokenExists } = require('../middlewares/user');

const userRouter = Router();


userRouter.post('/auth/login', loginUsingMail);

userRouter.post('/auth/google', loginUsingGoogle);

userRouter.post('/auth/register', registerUsingMail);

userRouter.get('/verify/:token', verifyToken);

userRouter.get('/auth/check', tokenExists, (req, res, next) => {
	console.log(req.user);
	res.status(200).json({ message: 'User logged in', user: req.user })
})






userRouter.delete('/logout', tokenExists, logout);




module.exports = userRouter;