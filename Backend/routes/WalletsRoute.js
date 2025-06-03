const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpay");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay expects amount in paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
});

router.post("/verify-payment", async (req, res) => {
  const { userId, password, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    user.walletBalance += amount;
    await user.save();

    res.json({ success: true, newBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//withdraw money from wallet

router.post("/withdraw-money", async (req, res) => {
  const { userId, password, amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid password" });

    if (user.walletBalance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    user.walletBalance -= amount;
    await user.save();

    res.json({ success: true, newBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
