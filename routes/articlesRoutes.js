const express = require("express");
const articlesController = require("../controllers/articlesController");
const { isArticleOwner } = require("../middlewares/auth");
const articleValidation = require('../validations/articleValidations')
const router = express.Router();

router.post("/", articleValidation.createArticleRules,articlesController.createArticle);
router.get("/getAllArticles", articlesController.getAllArticles);
router.put(
  "/:articleId",isArticleOwner,
  articlesController.editArticle);

router.delete(
    "/:articleId",isArticleOwner,
    articlesController.deleteArticle
  );

router.get("/searchAndSort", articlesController.searchAndSortArticles);

module.exports = router;
