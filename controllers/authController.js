const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
exports.signup = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //   Check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        "Password does not match or incorrect login credentials.",
        401,
      ),
    );
  }

  // If everything ok, send token to client
  const token = signToken(user._id);
  // console.log(token);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync((req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in. Please login to get access.", 401),
    );
  }
  // 2) Verification token

  // 3) Check if user still exists

  // 4) Check if user changes password after jwt-token issued

  next();
});
