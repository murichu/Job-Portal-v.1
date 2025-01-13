import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/userModel.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({success: false , message: "Missing Details"});
    }

    try {
        const isExistingUser = await UserModel.findOne({email});

        if (isExistingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({name, email, password: hashedPassword});

        await user.save();
       
        // Generate JWT
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: new Date(Date.now() + 60 * 60 * 1000)  // Expires in 1 hour
        });

        return res.status(201).json({success: true, message: "User registered successfully", token});

    } catch (error) {
        return res.status(500).json({success: false , message: error.message});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: "Email and Password are required"});
    }

    try {
        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password"});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: new Date(Date.now() + 60 * 60 * 1000), // Expires in 1 hour
        });

        return res.json({success: true, message: "Logged in successfully", token});

    } catch (error) {
        return res.status(500).json({success: false , message: error.message});
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: "Logged Out"});

    } catch (error) {
        return res.status(500).json({success: false , message: error.message});
    }
};
