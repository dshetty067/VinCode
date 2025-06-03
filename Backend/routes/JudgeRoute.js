const express = require('express');
const router = express.Router();
const axios = require('axios');
const Submission = require('../models/Submission');
const Contest = require('../models/Contest');
const Question = require('../models/Question');
const mongoose=require('mongoose')
const User=require('../models/User')

const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_API_HOST = 'judge0-ce.p.rapidapi.com';
const JUDGE0_BASE_URL = `https://${JUDGE0_API_HOST}`;

const headers = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': JUDGE0_API_KEY,
  'X-RapidAPI-Host': JUDGE0_API_HOST,
};

// POST /judge-submissions/:contestId/:userId
router.post('/judge-submissions/:contestId/:userId', async (req, res) => {
  const { contestId, userId } = req.params;

  try {
    const contest = await Contest.findById(contestId).populate('questions');
    if (!contest) return res.status(404).json({ success: false, message: 'Contest not found' });

    const submissions = await Submission.find({ contest: contestId, user: userId });

    const verdicts = [];

    for (const submission of submissions) {
      const question = await Question.findById(submission.question);
      const testCases = question.testCases;

      let allPassed = true;
      let testCaseVerdicts = [];

      for (const testCase of testCases) {
        const encodedCode = Buffer.from(submission.code).toString('base64');
        const encodedInput = Buffer.from(testCase.input).toString('base64');
        const encodedExpectedOutput = Buffer.from(testCase.expectedOutput).toString('base64');

        const postRes = await axios.post(
          `${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=true&fields=*`,
          {
            language_id: getJudge0LangId(submission.language),
            source_code: encodedCode,
            stdin: encodedInput,
            expected_output: encodedExpectedOutput,
          },
          { headers }
        );

        const result = postRes.data;
        const passed = result.status.id === 3; // 3 = Accepted

        if (!passed) allPassed = false;

        testCaseVerdicts.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: Buffer.from(result.stdout || '', 'base64').toString('utf-8'),
          passed,
        });
      }

      // Update verdict in DB
      submission.verdict = allPassed ? 'Accepted' : 'Wrong Answer';
      await submission.save();

      verdicts.push({
        questionId: submission.question,
        finalVerdict: submission.verdict,
        details: testCaseVerdicts,
      });
    }

    res.status(200).json({ success: true, verdicts });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Utility: Convert language name to Judge0 ID
function getJudge0LangId(lang) {
  const map = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71,
    javascript: 63,
  };
  return map[lang.toLowerCase()] || 71; // default to Python
}

// GET: Fetch top 3 participants by unique questions solved
router.get('/top-participants/:contestId', async (req, res) => {
  const { contestId } = req.params;

  try {
     const contest = await Contest.findById(contestId);
    const result = await Submission.aggregate([
      {
        $match: {
          contest: new mongoose.Types.ObjectId(contestId),
          verdict: 'Accepted'
        }
      },
      {
        $group: {
          _id: { user: "$user", question: "$question" }
        }
      },
      {
        $group: {
          _id: "$_id.user",
          solvedCount: { $sum: 1 }
        }
      },
      { $sort: { solvedCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          solvedCount: 1
        }
      }
    ]);
     // Add rewards based on rank
    const prizePool = contest.prizePool;
    const rewardDistribution = [prizePool, prizePool - 100, prizePool - 200];

    const topParticipants = result.map((participant, index) => ({
      ...participant,
      reward: rewardDistribution[index] || 0
    }));

    res.status(200).json({ success: true, topParticipants });
  } catch (err) {
    console.error("Error fetching top participants:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// POST: Fetch top 3 and update wallet balances
router.post('/top-participants/update-wallet/:contestId', async (req, res) => {
  const { contestId } = req.params;

  try {
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ success: false, message: 'Contest not found' });
    }

    const result = await Submission.aggregate([
      {
        $match: {
          contest: new mongoose.Types.ObjectId(contestId),
          verdict: 'Accepted'
        }
      },
      {
        $group: {
          _id: { user: "$user", question: "$question" }
        }
      },
      {
        $group: {
          _id: "$_id.user",
          solvedCount: { $sum: 1 }
        }
      },
      { $sort: { solvedCount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          userId: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          solvedCount: 1
        }
      }
    ]);

    const prizePool = contest.prizePool;

    for (let i = 0; i < result.length; i++) {
      let reward = 0;
      if (i === 0) reward = prizePool;
      else if (i === 1) reward = prizePool - 100;
      else reward = prizePool - 200;

      await User.findByIdAndUpdate(result[i].userId, {
        $inc: { walletBalance: reward }
      });

      result[i].reward = reward;
    }

    res.status(200).json({ success: true, updatedTopParticipants: result });
  } catch (err) {
    console.error("Error updating wallets for top participants:", err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


module.exports = router;
