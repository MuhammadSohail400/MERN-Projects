import express from "express";
import {
  createBooking,
  getBookings,
  getBookingById,
  cancelBooking,
} from "../controllers/bookingController.js";
import { bookingValidationRules, validate } from "../middlewares/bookingValidator.js";

const router = express.Router();

router.route("/").post(bookingValidationRules, validate, createBooking).get(getBookings);

router.route("/:id").get(getBookingById);

router.route("/:id/cancel").put(cancelBooking);

export default router;
 