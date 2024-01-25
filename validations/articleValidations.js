const { check } = require('express-validator')

const createArticleRules = [
	check('Title').trim().notEmpty().withMessage('Title is required'),
  check('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['Food', 'Education', 'Businessmen', 'Positions'])
    .withMessage('Invalid category'),
  check('description').trim().notEmpty().withMessage('Description is required'),
  check('slug').trim().notEmpty().withMessage('Slug is required'),
  check('createdBy')
    .notEmpty()
    .withMessage('Created by is required')
    .isMongoId()
    .withMessage('Invalid user ID format'),
]

const articleValidation = {
	createArticleRules
}

module.exports = articleValidation
