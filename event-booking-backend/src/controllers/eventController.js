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

// @desc    Get all events with pagination + filtering
// @route   GET /api/events?page=1&limit=10&category=tech
export const getEvents = asyncHandler(async (req, res) => {
  // --- Pagination ---
  const page = parseInt(req.query.page) || 1;    // default page 1
  const limit = parseInt(req.query.limit) || 10; // default 10 per page
  const skip = (page - 1) * limit;               // formula: skip = (page-1) * limit

  // --- Filtering ---
  const filter = {};
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.location) {
    filter.location = { $regex: req.query.location, $options: "i" }; // case-insensitive
  }

  // --- DB Query ---
  const totalEvents = await Event.countDocuments(filter);
  const events = await Event.find(filter)
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: events.length,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
      hasNextPage: page < Math.ceil(totalEvents / limit),
      hasPrevPage: page > 1,
    },
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