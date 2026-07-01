import express from "express";
import cors from "cors";
import morgan from "morgan";
import eventRoutes from "./routes/eventRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

// ---- Core Middlewares ----
app.use(cors()); // allow cross-origin requests (Next.js frontend will call this)
app.use(express.json()); // parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form-urlencoded bodies
app.use(morgan("dev")); // log each incoming request to console

// ---- Test Route ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Booking API is running 🎟️",
  });
});

// ---- Routes ----
app.use("/api/events", eventRoutes);
// app.use("/api/bookings", bookingRoutes);

// ---- 404 Handler ---- (koi bhi route match na ho to yahan aayega)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ---- Centralized Error Handler ---- (hamesha sabse aakhir mein)
app.use(errorHandler);

export default app;