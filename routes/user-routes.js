import express from 'express';
import { verify } from '../middleware/auth';
import { getAllUsers, login, signUp, deleteUser } from './../controllers/user-controller';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.delete("/delete/:id", verify , deleteUser);

export default userRouter;