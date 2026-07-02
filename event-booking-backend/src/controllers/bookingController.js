import Booking from "../models/Booking.js";
import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";


export const createBooking = asyncHandler(async (req, res, next) => {
  const { eventId, name, email, seats } = req.body;

  const event = await Event.findById(eventId);
  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  if (event.availableSeats < seats) {
    return next(
      new AppError(
        `Only ${event.availableSeats} seats available for this event`,
        400
      )
    );
  }

  // Total booking cost is based on the event price and requested seat count
  const totalPrice = event.price * seats;

  const booking = await Booking.create({
    event: eventId,
    name,
    email,
    seats,
    totalPrice,
  });

  // Reduce available seats after booking to keep inventory accurate
  event.availableSeats -= seats;
  await event.save();

  res.status(201).json({
    success: true,
    message: "Booking confirmed successfully",
    data: booking,
  });
});

// @desc    Get all bookings
// @route   GET /api/bookings
export const getBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("event", "title date location price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
export const getBookingById = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate(
    "event",
    "title date location price"
  );

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError("Booking not found", 404));
  }

  if (booking.status === "cancelled") {
    return next(new AppError("Booking is already cancelled", 400));
  }

  // Restore seats to event availability when cancelling a booking
  const event = await Event.findById(booking.event);
  if (event) {
    event.availableSeats += booking.seats;
    await event.save();
  }

  // Mark booking as cancelled
  booking.status = "cancelled";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully",
    data: booking,
  });
});