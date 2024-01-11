const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"));
}
// Middlewares for the apis
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhandled routes- send directly to error hanl=dling middleware from the stack
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server. Sorry! 404...:p`,
  // });
  // const err = new Error(
  //   `Can't find ${req.originalUrl} on this server. Sorry! 404...:p`,
  // );
  // err.status = "fail- by error object created";
  // err.statusCode = 404;
  // next(err);

  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server. Sorry! 404...:p`,
      404,
    ),
  );
});

// Error handling middleware
app.use(globalErrorHandler);
module.exports = app;
