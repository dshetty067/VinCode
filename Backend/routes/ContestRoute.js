const express = require('express');
const router = express.Router();

const Contest = require('../models/Contest');
const User = require('../models/User');
const Question = require('../models/Question');
const Submission=require('../models/Submission')

// Create a new contest
router.post('/contests', async (req, res) => {
  try {
    const {
      title,
      description,
      entryFee,
      maxParticipants,
      startTime,
      endTime,
      questions,
      bonusFromApp,
      status,         
      prizePool       
    } = req.body;

    const newContest = new Contest({
      title,
      description,
      entryFee,
      maxParticipants,
      startTime,
      endTime,
      questions,
      bonusFromApp,
      status,         
      prizePool       
    });

    await newContest.save();

    res.status(201).json({ success: true, contest: newContest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all contests that have not ended (endTime > now)
router.get('/contests/active', async (req, res) => {
  try {
    const now = new Date();
    const activeContests = await Contest.find({ endTime: { $gt: now } });

    res.status(200).json({ success: true, contests: activeContests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get contest by ID with selected fields and computed values
router.get('/contests/:contestId', async (req, res) => {
  try {
    const { contestId } = req.params;

     const contest = await Contest.findById(contestId).populate("participants", "_id");
     
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const now = new Date();

    // Determine dynamic status
    const computedStatus = now < contest.startTime ? 'upcoming' : 'ongoing';

    // Calculate remaining slots
    const remainingSlots = contest.maxParticipants - contest.participants.length;

    res.status(200).json({
      success: true,
      contest: {
        title: contest.title,
        description: contest.description,
        entryFee: contest.entryFee,
        maxParticipants: contest.maxParticipants,
        participants:contest.participants,
        completedUsers:contest.completedUsers,
        startTime: contest.startTime,
        endTime: contest.endTime,
        bonusFromApp: contest.bonusFromApp,
        prizePool: contest.prizePool,
        remainingSlots: remainingSlots,
        status: computedStatus
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete contest and associated questions and submissions
router.delete('/contests/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Find the contest
    const contest = await Contest.findById(id);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    // Step 2: Get all question IDs from contest
    const questionIds = contest.questions;

    // Step 3: Delete all submissions for each question in this contest
    await Submission.deleteMany({
      contest: contest._id,
      question: { $in: questionIds }
    });

    // Step 4: Delete all questions associated with this contest
    await Question.deleteMany({ _id: { $in: questionIds } });

    // Step 5: Remove contest ID from contestsRegistered array of all users
    await User.updateMany(
      { contestsRegistered: contest._id },
      { $pull: { contestsRegistered: contest._id } }
    );

    // Step 6: Delete the contest itself
    const deletedContest = await Contest.findByIdAndDelete(id);

    res.status(200).json({ success: true, contest: deletedContest });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Register user to contest after Razorpay payment & wallet balance verification
router.post('/contests/:contestId/register', async (req, res) => {
  const { contestId } = req.params;
  const { userId } = req.body;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Already registered check
    if (contest.participants.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already registered for this contest' });
    }

    // Contest full check
    if (contest.participants.length >= contest.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Contest is full' });
    }

    // Wallet balance check
    if (user.walletBalance < contest.entryFee) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance. Please top up your wallet.'
      });
    }

    // Deduct entry fee from wallet
    user.walletBalance -= contest.entryFee;

    // Register user to contest
    contest.participants.push(userId);
    contest.prizePool += contest.entryFee;

    user.contestsRegistered.push(contestId);

    await user.save();
    await contest.save();

    return res.status(200).json({
      success: true,
      message: 'User successfully registered to the contest',
      contest
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Add question to a contest
router.post('/contests/:contestId/questions', async (req, res) => {
  const { contestId } = req.params;
  const { title, description, examples, testCases, difficulty } = req.body;

  try {
    // Create new question
    const newQuestion = new Question({
      title,
      description,
      examples,
      testCases,
      difficulty,
    });

    await newQuestion.save();

    // Find contest and add question ID
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    contest.questions.push(newQuestion._id);
    await contest.save();

    res.status(201).json({ success: true, question: newQuestion, contest });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//marking user gave the contest
router.post('/mark-complete', async (req, res) => {
  const { contestId, userId } = req.body;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if already marked complete
    if (contest.completedUsers.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User already marked as completed' });
    }

    // Mark as completed
    contest.completedUsers.push(userId);
    await contest.save();

    return res.status(200).json({
      success: true,
      message: 'User marked as completed for the contest',
      completedUsers: contest.completedUsers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;