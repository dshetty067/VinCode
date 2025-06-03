const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Submission = require('../models/Submission');

router.post('/submit-code', async (req, res) => {
  const { user, contest, question, code, language } = req.body;
  console.log('Received submission data:', { user, contest, question, code, language });

  try {
    if (!user || !contest || !question || !code || !language) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(user) ||
        !mongoose.Types.ObjectId.isValid(contest) ||
        !mongoose.Types.ObjectId.isValid(question)) {
      return res.status(400).json({ success: false, message: 'Invalid IDs provided.' });
    }

    let existingSubmission = await Submission.findOne({ user, contest, question });

    if (existingSubmission) {
      existingSubmission.code = code;
      existingSubmission.language = language;
      existingSubmission.verdict = 'Pending';
      await existingSubmission.save();
      return res.status(200).json({ success: true, message: 'Submission updated successfully.', submission: existingSubmission });
    }

    const newSubmission = new Submission({
      user,
      contest,
      question,
      code,
      language,
      verdict: 'Pending'
    });

    await newSubmission.save();
    return res.status(201).json({ success: true, message: 'Submission created successfully.', submission: newSubmission });

  } catch (error) {
    console.error('Error creating submission:', error.message, error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
