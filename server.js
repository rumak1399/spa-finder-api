import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();

// import authRouter from "./routes/authRouter.js"
// import userRouter from "./routes/userRouter.js"
// import movieRouter from "./routes/movieRouter.js"
// import paymentRouter from "./routes/paymentRouter.js"
// import { verifyToken } from "./utils/verifyToken.js";



app.use(cors());
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI).then(()=>(console.log("Connected to Database!"))).catch(()=>("Not Connected to Database!"));

app.get("/" , (req , res)=>{
    res.status(200).send("Hello from server!");
})

// app.use("/api/auth" , authRouter);
// app.use("/api/user" , userRouter);
// app.use("/api/movie" , movieRouter);
// app.use("/api/payment" , paymentRouter);
// app.get("/token" , verifyToken)

app.use((err , req, res , next)=>{
    console.log("LINE AT  21 INDEX" , err);
    const errorStatus = err.status || 500;
    const errorStack = err.stack;
    const errorMessage = err.message || "Something broke!!";
    res.status(errorStatus).json({
        success:false , 
        status : errorStatus , 
        message : errorMessage , 
        stack : errorStack
    });
});

app.listen(process.env.PORT , ()=>{
    try {
        console.log("Connected to Server!");
    } catch (error) {
        console.log(error);
    }
})