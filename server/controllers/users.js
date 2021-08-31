import mongoose from 'mongoose';
import bcryptjs  from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Users from '../models/users.js';


export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
       const existingUser = await Users.findOne({
           email
       });
       if(!existingUser) return res.status(404).json({ message: "User doesn't exist" });

       const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password)

       if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

       const token = jwt.sign({
           email: existingUser.email,
           id:existingUser._id
       }, 'wearyou1432',{
           expiresIn: '1h'
       });

       res.status(200).json({
           result: existingUser,
           token
       });

    }catch (e){
        res.status(500).json({
            message: 'Something went wrong..'
        });
    }
}


export const signup = async (req, res) => {
    const { email, password, firstName, lastName, confirmPassword } = req.body;
    try{
        const existingUser = await Users.findOne({
            email
        });
        if(existingUser) return res.status(400).json({
            message: 'User already exist'
        })
        if(password !== confirmPassword) return res.status(400).json({
            message: 'Passwords do not match'
        });
        const hashedPassword = await bcryptjs.hash(password, 12);
        const result = await Users.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`,
        });
        const token = jwt.sign({
            email: result.email,
            id:result._id
        }, 'wearyou1432',{
            expiresIn: '1h'
        });
        res.status(200).json({
            result,
            token
        });
    }catch (error){
        res.status(500).json({
            message: 'Something went wrong..'
        })
    }
}
