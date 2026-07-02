# Event Booking Backend

This project is a Node.js + Express + MongoDB backend for managing events. It follows the MVC architecture (Model-View-Controller) in a simple and clean way.

## What is MVC?

MVC stands for:

- Model: Handles database data and schema
- View: In this project, there is no frontend view layer; the "view" is the JSON response returned to the client
- Controller: Contains the logic for handling requests and sending responses

In short:

- Route receives the request
- Controller processes it
- Model talks to the database
- Response is sent back to the client

---

## Project Structure

src/

- app.js: Main Express app setup
- config/db.js: Database connection
- controllers/eventController.js: Request handling logic
- middlewares/eventValidator.js: Input validation
- middlewares/errorHandler.js: Central error handling
- models/Event.js: Event database schema
- routes/eventRoutes.js: API endpoints
- utils/asyncHandler.js: Cleaner async error handling
- utils/AppError.js: Custom error class

---

## 1. app.js - Main Entry Point

The file src/app.js is the heart of the application.

It does these things:

- Creates the Express application
- Adds middleware like CORS, JSON parsing, and logging
- Registers routes
- Handles 404 errors
- Uses a global error handler

### Important middlewares in app.js

- cors(): Allows frontend apps to call the API
- express.json(): Parses incoming JSON data
- express.urlencoded(): Parses form data
- morgan("dev"): Logs API requests in the terminal

---

## 2. Routes - URL Handling

The file src/routes/eventRoutes.js defines API endpoints.

It tells the app which controller function should run for which URL.

Example:

- POST /api/events -> createEvent
- GET /api/events -> getEvents
- GET /api/events/:id -> getEventById
- PUT /api/events/:id -> updateEvent
- DELETE /api/events/:id -> deleteEvent

### Why routes are important

Routes act like traffic police. They receive the request and send it to the correct controller.

---

## 3. Controllers - Business Logic

The file src/controllers/eventController.js contains the logic for each request.

A controller is responsible for:

- Reading request data from req
- Calling the model if database work is needed
- Sending responses with res
- Handling errors with next

### Example: createEvent

When a client sends a POST request:

1. Route receives the request
2. Validator checks input
3. Controller receives valid data
4. Controller creates a new event in MongoDB using the model
5. Controller sends a success response

---

## 4. Models - Database Layer

The file src/models/Event.js defines the Event model.

A model represents a database collection and its structure.

It tells MongoDB:

- what fields an event should have
- what data types each field should use
- whether a field is required
- what validation rules apply

### Example fields in Event model

- title
- description
- date
- location
- category
- totalSeats
- availableSeats
- price

This model is used by the controller to create, read, update, and delete event data.

---

## 5. Middleware - Request Processing

Middleware is code that runs before the request reaches the controller.

### A. Validation Middleware

The file src/middlewares/eventValidator.js checks whether incoming data is correct.

It validates fields like:

- title should not be empty
- date should be valid
- totalSeats should be a positive number
- price should not be negative

If validation fails, the request stops and a 400 response is sent.

### B. Error Middleware

The file src/middlewares/errorHandler.js handles errors in one central place.

It catches issues such as:

- invalid ID format
- validation error
- duplicate field error
- server error

---

## 6. Database Connection

The file src/config/db.js connects the backend to MongoDB.

It uses process.env.MONGODB_URI to connect.

If the connection fails, the app stops because the database is required for the app to work.

---

## 7. Utility Files

### asyncHandler.js

This helper makes controller functions cleaner.

Instead of writing try/catch repeatedly, it wraps async code and forwards errors to the error handler automatically.

### AppError.js

This creates custom errors with a status code.

Example:

- 404 for "Event not found"

---

## Full Request Flow in This MVC App

### Example: Creating an Event

1. Client sends a POST request to /api/events
2. app.js receives the request
3. Middleware runs:
   - CORS
   - JSON parser
   - validation middleware
4. Route matches /api/events and calls createEvent
5. Controller reads request body data
6. Controller uses the Event model to save the data into MongoDB
7. MongoDB returns the created event
8. Controller sends a JSON response back to the client
9. If an error happens, the error middleware handles it

### Example: Getting All Events

1. Client sends GET /api/events
2. Route sends the request to getEvents
3. Controller calls Event.find()
4. Model fetches event documents from MongoDB
5. Controller sends the list as JSON response

### Example: Getting One Event by ID

1. Client sends GET /api/events/:id
2. Route calls getEventById
3. Controller finds the event by ID in MongoDB
4. If not found, it throws an AppError with 404
5. If found, it sends the event details as JSON

---

## How MVC Works in This Project

### Request Flow Summary

- Route: decides which endpoint is called
- Controller: performs business logic
- Model: interacts with database
- Middleware: checks request and handles errors
- Response: sends result back to the client

This separation makes the project easier to maintain.

---

## Why This Structure Is Good

- Easy to understand
- Easy to extend
- Cleaner code organization
- Better for team collaboration
- Errors are handled in one place

---

## Simple Analogy

Think of the backend like a restaurant:

- Route = waiter who receives your order
- Controller = chef who prepares the food
- Model = kitchen storage/database where ingredients are kept
- Middleware = security/checker before food is served
- Error handler = manager who fixes problems

---

## Conclusion

This project follows a simple MVC pattern:

- Routes receive requests
- Controllers process them
- Models store and retrieve data
- Middleware validates and handles errors

That is how the backend works end to end.
