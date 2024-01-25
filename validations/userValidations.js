const { check } = require('express-validator')

const registrationRules = [
	check('username').trim().notEmpty().withMessage('username is required'),
	check('email')
		.trim()
		.notEmpty()
		.withMessage('Email address is required')
		.isEmail()
		.withMessage('Invalid e-mail address'),
	check('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('At least 6 characters are required'),
]


const loginRules = [
	check('email')
		.trim()
		.notEmpty()
		.withMessage('Email address is required')
		.isEmail()
		.withMessage('Invalid e-mail address'),
	check('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('At least 6 characters are required'),
]


const userValidation = {
	registrationRules,
	loginRules
}

module.exports = userValidation
