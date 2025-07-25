import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import servicesRouter from "./routes/services.js";
import bookingsRouter from "./routes/bookings.js";
import postRouter from "./routes/post.js";
import categoriesRouter from "./routes/categories.js";
import reviewRouter from "./routes/review.js";
import tagsRouter from "./routes/tags.js";
import locationRouter from './routes/location.js'

const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(cookieParser());


connectDB();

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


app.get("/", (req, res) => {
  res.status(200).send("Hello from server!");
});




// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/users', require('./routes/users'));
// app.use('/api/services', require('./routes/services'));
// app.use('/api/bookings', require('./routes/bookings'));


app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/post', postRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/review', reviewRouter);
app.use('/api/tag', tagsRouter);
app.use('/api/location', locationRouter);



app.use((err, req, res, next) => {
  console.log("LINE AT  21 INDEX", err);
  const errorStatus = err.status || 500;
  const errorStack = err.stack;
  const errorMessage = err.message || "Something broke!!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: errorStack,
  });
});

app.listen(process.env.PORT, () => {
  try {
    console.log(`Connected to Server! ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
