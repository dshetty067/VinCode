const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Contest = require('../models/Contest');
const SubmissionModel = require('../models/Submission');

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

// GET all questions of a contest with user submission status
router.get('/contest-questions/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid contest ID' });
  }

  try {
    const contest = await Contest.findById(id).populate('questions');

    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    let submittedQuestionIds = [];
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      // Find any submission by this user for questions inside this contest
      const userSubmissions = await SubmissionModel.find({ user: userId, contest: id });
      submittedQuestionIds = userSubmissions.map(sub => sub.question.toString());
    }

    const questionsWithStatus = contest.questions.map(q => {
      const qObj = q.toObject();
      qObj.isSolved = submittedQuestionIds.includes(q._id.toString());
      return qObj;
    });

    return res.status(200).json({ success: true, questions: questionsWithStatus });
  } catch (err) {
    console.error('Error fetching contest questions:', err.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;