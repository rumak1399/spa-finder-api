import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db";
import { resolve } from "path";
require("dotenv").config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(json({ extended: false }));
app.use(morgan("dev"));

// Define routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/services", require("./routes/services"));
app.use("/api/bookings", require("./routes/bookings"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
