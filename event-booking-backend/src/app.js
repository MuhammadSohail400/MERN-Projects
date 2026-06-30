import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// ---- Core Middlewares ----
app.use(cors()); // allow cross-origin requests (Next.js frontend will call this)
app.use(express.json()); // parse incoming JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form-urlencoded bodies
app.use(morgan("dev")); // log each incoming request to console
import eventRoutes from "./routes/eventRoutes.js";
// ---- Test Route ----
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Booking API is running 🎟️",
  });
});
app.use("/api/events", eventRoutes);

// ---- Routes will be mounted here in later steps ----
// app.use("/api/events", eventRoutes);
// app.use("/api/bookings", bookingRoutes);

export default app;