import Event from "../models/Event.js";

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, category, totalSeats, price } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats, // jab event banta hai, available seats = total seats
      price,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // upcoming events first

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    // agar id ka format hi galat ho (invalid ObjectId), to yeh CastError throw karta hai
    res.status(400).json({
      success: false,
      message: "Invalid event ID",
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // updated document return karo, purana nahi
      runValidators: true, // schema validation update ke time bhi chale
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid event ID",
    });
  }
};