const { check, validationResult } = require("express-validator");


const signUpValidation = [
  check("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .custom(value => {
      const forbiddenCharacters = /[^a-zA-Z0-9@._-]/;
      if (forbiddenCharacters.test(value)) {
        throw new Error("Email contains forbidden characters");
      }
      return true;
    }),
  check("name")
    .trim()
    .notEmpty().withMessage("Name is required"),
  check("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])/)
    .withMessage("Password must contain at least one number, one special character, and one uppercase letter"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

const loginValidation = [
  check("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address")
    .custom(value => {
      const forbiddenCharacters = /[^a-zA-Z0-9@._-]/;
      if (forbiddenCharacters.test(value)) {
        throw new Error("Email contains forbidden characters");
      }
      return true;
    }),
  check("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])/)
    .withMessage("Password must contain at least one number, one special character, and one uppercase letter"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

module.exports = { signUpValidation, loginValidation };
