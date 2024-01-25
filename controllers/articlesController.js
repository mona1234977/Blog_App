const ArticlesModel = require("../models/articlesModel");
const apiResponse = require("../helpers/apiResponse");
const { isAuthenticated } = require("../middlewares/auth");

const createArticle = async (req, res) => {
  try {
    const { Title, description, category, slug, createdBy } = req.body;
    const newArticle = new ArticlesModel({
      Title,
      description,
      category,
      slug,
      createdBy,
    });
    await newArticle.save();

    return apiResponse.successResponseWithData(
      res,
      "Article created successfully",
      newArticle
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const getAllArticles = async (req, res) => {
  try {
    const Articles = await ArticlesModel.find();
    if (!Articles.length) {
      return apiResponse.validationErrorWithData("No Articles Found", 400);
    }
    return apiResponse.successResponseWithData(
      res,
      "Articles retrieved successfully",
      Articles
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Articles Not Found");
  }
};

const editArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const { Title, description, category, slug } = req.body;

    const decoded = await isAuthenticated(req, res);
    if (!decoded) {
      return apiResponse.unauthorizedResponse(res, "Unauthorized");
    }

    const article = await ArticlesModel.findByIdAndUpdate(
      articleId,
      { Title, description, category, slug },
      { new: true }
    );

    if (!article) {
      return apiResponse.notFoundResponse(res, "Article not found");
    }

    return apiResponse.successResponseWithData(
      res,
      "Article updated successfully",
      article
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const deleteArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const decoded = await isAuthenticated(req, res);

    if (!decoded) {
      return apiResponse.unauthorizedResponse(res, "Unauthorized");
    }
    const article = await ArticlesModel.findByIdAndDelete(articleId);
    if (!article) {
      return apiResponse.notFoundResponse(res, "Article not found");
    }

    return apiResponse.successResponse(res, "Article deleted successfully");
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const searchAndSortArticles = async (req, res) => {
  try {
    const { query, sortByDate } = req.query;
    console.log("Query:", query);
    console.log("Sort By Date:", sortByDate);

    let queryObject = {};
    if (query) {
      queryObject = { $text: { $search: query } };
    }

    let articles;
    if (sortByDate === "true") {
      articles = await ArticlesModel.find(queryObject).sort({ createdAt: -1 });
    } else {
      articles = await ArticlesModel.find(queryObject);
    }

    if (articles.length === 0) {
      return apiResponse.successResponse(res, "No data found in this category");
    }

    return apiResponse.successResponseWithData(
      res,
      "Search and sort results",
      articles
    );
  } catch (error) {
    console.error(error);
    return apiResponse.ErrorResponse(res, "Internal Server Error");
  }
};

const articlesController = {
  createArticle,
  getAllArticles,
  editArticle,
  deleteArticle,
  searchAndSortArticles,
};

module.exports = articlesController;
