const express = require("express");
require("dotenv").config();
const apiRouter = require("./routes/api");
const apiResponse = require("./helpers/apiResponse");

const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require("mongoose");

mongoose
	.connect(MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database connected...');
	})
	.catch((error) => {
		console.log('MongoDB connection error:', error.message);
		throw new Error(error);
	});

const db = mongoose.connection;

const app = express();

const server = app.listen(3000);
app.use(express.json())
app.use("/api/", apiRouter);

// throw 404 if URL not found
app.all("*", function(req, res) {
	return apiResponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
	if (err.name == "UnauthorizedError") {
		return apiResponse.unauthorizedResponse(res, err.message);
	}
});

app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		const data = {
			status: 500,
			message: 'Invalid token...',
		};
		return res.status(401).json(data);
	}
});

console.log('Server is running on 3000');