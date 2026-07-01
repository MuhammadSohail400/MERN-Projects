import Event from "../models/Event.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, category, totalSeats, price } = req.body;

  const event = await Event.create({
    title,
    description,
    date,
    location,
    category,
    totalSeats,
    availableSeats: totalSeats,
    price,
  });

  res.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
});

// @desc    Get all events
// @route   GET /api/events
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ date: 1 });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

// @desc    Get single event by ID
// @route   GET /api/events/:id
export const getEventById = asyncHandler(async (req, res, next) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

// @desc    Update an event
// @route   PUT /api/events/:id
export const updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: event,
  });
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(new AppError("Event not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});