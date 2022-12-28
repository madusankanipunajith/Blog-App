import Blog from "../model/Blog";
import mongoose from "mongoose";
import User from "../model/User";

export const getAllBlogs = async(req, res, next) =>{
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (error) {
        return console.log(error);
    }

    if (!blogs){
        return res.status(404).json({message: "No Blogs Found"})
    }

    return res.status(200).json({blogs})

}

export const addBlog = async (req, res, next) =>{
    const {title, description, user, image} = req.body;
    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (error) {
        return console.log(error);
    }
    if (!existingUser){
        return res.status(400).json({message: "Unauthorized"})
    }
    const blog = new Blog({
        title,
        description,
        user,
        image
    })
    
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: error})
    }

    return res.status(200).json({blog})
}

export const updateBlog = async (req, res, next) =>{
    const {title, description, image} = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title,
            description,
            image
        }); 
    } catch (error) {
        return console.log(error);
    }

    if (!blog){
        return res.status(500).json({message : "Unable To Update The Blog"});
    }

    return res.status(200).json({blog});
}

export const getById = async (req, res, next) =>{
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(id); 
    } catch (error) {
        return console.log(error);
    }

    if (!blog){
        return res.status(404).json("Blog Is Not Found");
    }

    return res.status(200).json({blog});
}

export const deleteById = async (req, res, next) =>{
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndRemove(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (error) {
        return console.log(error);
    }

    if (!blog){
        return res.status(404).json("Unable To Delete");
    }

    return res.status(200).json("Successfully Deleted");
}

export const getByUserId = async (req, res, next) =>{
    const userId = req.params.id;
    let existingBlogs;
    try {
        //existingBlogs = await Blog.find({user: userId});
        existingBlogs = await User.findById(userId).populate('blogs');
    } catch (error) {
        return console.log(error);
    }
    if (!existingBlogs){
        return res.status(404).json({message: "No Blogs Found"});
    }
    return res.status(200).json({blogs: existingBlogs})
}