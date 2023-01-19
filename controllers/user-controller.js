import User from "../model/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// HTTP requests are always asynchronus task. therefore we have to use async functions
// next : Allow to move onto the next available middleware
export const getAllUsers = async(req, res, next)=>{
    let users;
    try {
        users = await User.find();
    } catch (error) {
        return console.log(error);
    }

    if (!users){
        return res.status(404).json({message: "No Users Found"});
    }
    return res.status(200).json({users});
}

export const signUp = async(req, res, next)=>{
    const {name, email, password, isAdmin} = req.body; // ES6

    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error);
    }

    if (existingUser){
        return res.status(400).json({message: "User Already Exists. Login Instead"});
    }
    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password: hashedPassword,
        isAdmin,
        blogs: []
    });

    try {
        await user.save();
    } catch (error) {
        return console.log(err);
    }

    return res.status(201).json({user});
}

export const login = async(req, res, next) =>{
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email});
    } catch (error) {
        return console.log(error);
    }

    if (!existingUser){
        return res.status(404).json({message: "Couldn't find a user by this email"});
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect password"});
    }

    const accessToken = jwt.sign({id: existingUser.email, isAdmin: existingUser.isAdmin}, '#123#890#')
    return res.status(200).json({message: "Login successfull", accessToken});
}


export const deleteUser = async(req, res, next)=>{
    
}
