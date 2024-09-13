
//usercontroller.js
import jwt from 'jsonwebtoken';
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, generateTokenAndSetCookie } from '../utils/helpers/generateTokenAndSetCookie.js';
import mongoose from 'mongoose';
import Formation from '../models/formation.js';


 


async function signupUser(req, res) {
  try {
    const { username, email, password, role, participants_institution } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
        return res.status(400).json({ error: 'Username or Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'participant', 
        participants_institution,
    });

    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
        { id: savedUser._id, username: savedUser.username, role: savedUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Respond with the user details and token
    res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        role: savedUser.role,
        participants_institution: savedUser.participants_institution,
        token,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: 'Error creating user' });
  }
}

//
/*const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
    });
    console.log("User:", user);
console.log("Password Match:", isMatch);
} catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: 'Server error' });
}
}*/
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Compare provided password with hashed password from database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token with a longer expiration time (e.g., 1 day)
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' } // expires in 1 day
    );

    // Send response with token
    res.header("auth-token", token).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const getUserFormations = async (req, res) => {
  try {
    const userId = req.params.id;
    const formations = await Formation.find({ participants: userId });
    if (!formations || formations.length === 0) {
      return res.status(404).json({ message: "No formations found for this user." });
    }
    res.status(200).json({
      success: true,
      message: "Formations fetched successfully",
      data: formations,
    });
  } catch (error) {
    console.error("Error fetching formations:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (err) {
    console.error("Error in logoutUser:", err.message);
    res.status(500).json({ error: "Failed to log out user" });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
  const { username, email, password, role, participants_institution } = req.body;
  const userId = req.params.id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.participants_institution = participants_institution || user.participants_institution;

    await user.save();

    // Remove password from response
    user.password = undefined;

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in updateUser: ", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getUserByRole = async (req, res) => {
  try {
    const role = req.params.role;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const users = await User.find({ role });

    if (users.length === 0) {
      return res.status(404).json({ message: `No users found with role ${role}` });
    }

    res.status(200).json({
      success: true,
      message: `Users with role ${role} fetched successfully`,
      data: users,
    });
  } catch (error) {
    console.error(`Error fetching users by role: ${error.message}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export {
  signupUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
  getUserFormations,
  getUserByRole,
};
