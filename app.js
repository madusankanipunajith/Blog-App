import express from 'express';
import mongoose from 'mongoose';
import blogRouter from './routes/blog-routes';
import userRouter from './routes/user-routes';

const app = express();

// middleware
app.use(express.json())
app.use("/api/user", userRouter) 
app.use("/api/blog", blogRouter)
app.use("/api", (req, res, next)=>{
    res.send("Hello World");
});


mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://<user>:<password>@cluster0.xqi8mha.mongodb.net/BlogApp?retryWrites=true&w=majority'
).then(()=>app.listen(5000)).then(()=>console.log('Connceted to the DB and Listening')).catch((err)=> console.log(err));

