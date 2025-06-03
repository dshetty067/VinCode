const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const UserModel = require('../models/User'); 
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

// Get all users (excluding password)
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get user
router.get('/users/:id', async (req, res) => {
    const {id}=req.params;
    try {
        const user = await UserModel.findById(id)
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Create new user (register)
router.post('/users', async (req, res) => {
    console.log("Received POST request");
    try {
        const { name, email, password, phoneNumber, role } = req.body;

        const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email or phone number already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            role: role === 'admin' ? 'admin' : 'client',
        });

        await newUser.save();
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json({ success: true, user: userWithoutPassword });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


// Login route to generate JWT
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        // User authenticated, create JWT payload
        const payload = {
            userId: user._id,
            role: user.role,
            email: user.email,
            phoneNumber:user.phoneNumber
        };

        // Sign token (expires in 1 hour, adjust as needed)
        const token = jwt.sign(payload, JWT_SECRET);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});


// Update user (must provide old password to change password)
router.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, phoneNumber, oldPassword, newPassword } = req.body;

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (newPassword) {
            // User wants to change password
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Old password is incorrect' });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        // Update other fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;

        await user.save();

        const { password, ...userWithoutPassword } = user.toObject();
        res.status(200).json({ success: true, user: userWithoutPassword });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete user (must provide old password)
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { oldPassword } = req.body;

    try {
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);

        const { password, ...userWithoutPassword } = deletedUser.toObject();
        res.status(200).json({ success: true, user: userWithoutPassword });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

//get all contests of a user
router.get("/users/:userId/contests", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user and populate only contestsRegistered
    const user = await UserModel.findById(userId).populate("contestsRegistered");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Return contestsRegistered array as is
    res.json({ contests: user.contestsRegistered });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;