import { body, validationResult } from "express-validator";

// Validation rules array — har field ke liye conditions
export const eventValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description").trim().notEmpty().withMessage("Description is required"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date (YYYY-MM-DD)"),

  body("location").trim().notEmpty().withMessage("Location is required"),

  body("category")
    .optional()
    .isIn(["music", "tech", "sports", "art", "business", "other"])
    .withMessage("Invalid category"),

  body("totalSeats")
    .notEmpty()
    .withMessage("Total seats is required")
    .isInt({ min: 1 })
    .withMessage("Total seats must be a positive number"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),
];

// Yeh middleware rules check karne ke baad result collect karta hai
// aur agar koi error mila to request ko aage jaane se rok deta hai
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next(); // koi error nahi, to request controller tak aage jaye
};