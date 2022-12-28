import express from 'express';
import { getAllUsers, login, signUp } from './../controllers/user-controller';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signUp);
userRouter.post("/login", login);

export default userRouter;