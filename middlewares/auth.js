const apiResponse = require("../helpers/apiResponse");
const ArticlesModel = require("../models/articlesModel");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res) => {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      var data = {
        status: 0,
        message: "Authentication token not found",
      };
      return res.status(401).json(data);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(
          new apiResponse.unauthorizedResponse(
            "Invalid authentication token",
            401
          )
        );
      }
      resolve(decoded);
    });
  });
};

const isArticleOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const article = await ArticlesModel.findById(req.params.articleId);
    console.log(req.params,"xxxx");
    console.log("Found Article:", article);

    if (!article) {
      return apiResponse.notFoundResponse(res, "Article not found");
    }
    if (article.createdBy.equals(decoded.userId)) {
      req.article = article;
      next();
    } else {
      return apiResponse.forbiddenResponse(res, "Unauthorized to perform this action");
    }
  } catch (error) {
    return apiResponse.ErrorResponse(res, "Internal Server Error.....");
  }
};

module.exports = {
  isAuthenticated,
  isArticleOwner,
};
