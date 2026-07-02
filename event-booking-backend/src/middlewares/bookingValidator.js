import { body, validationResult } from "express-validator";

export const bookingValidationRules = [
  body("eventId").notEmpty().withMessage("Event ID is required"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("seats")
    .notEmpty()
    .withMessage("Number of seats is required")
    .isInt({ min: 1 })
    .withMessage("Seats must be at least 1"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  next();
};
