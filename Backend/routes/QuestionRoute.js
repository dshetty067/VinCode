const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/Question'); // Update path as needed
const Contest=require('../models/Contest')


// GET /questions/:id - fetch question by ID
router.get('/questions/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid question ID.' });
  }

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }
    res.status(200).json({ success: true, question });
  } catch (err) {
    console.error('Error fetching question:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

//get all questions of a contest
router.get('/contest-questions/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid contest ID' });
  }

  try {
    const contest = await Contest.findById(id).populate('questions');

    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    return res.status(200).json({ success: true, questions: contest.questions });
  } catch (err) {
    console.error('Error fetching contest questions:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



module.exports = router;
