const express = require("express");
const userRoutes = require('./userRoutes');
const articleRoutes = require ('./articlesRoutes')

const router = express.Router();

router.use("/users/", userRoutes);
router.use("/articles/", articleRoutes)

module.exports = router;
