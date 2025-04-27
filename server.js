import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db";
dotenv.config();
import authRouter from "./routes/auth.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// mongoose.connect(process.env.MONGO_URI).then(()=>(console.log("Connected to Database!"))).catch(()=>("Not Connected to Database!"));

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Hello from server!");
});



// app.use("/api/auth" , authRouter);
// app.use("/api/user" , userRouter);
// app.use("/api/movie" , movieRouter);
// app.use("/api/payment" , paymentRouter);
// app.get("/token" , verifyToken)

app.use('/api/auth', authRouter);


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
