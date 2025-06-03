const mongoose=require('mongoose')

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  examples: [{
    input: String,
    output: String,
  }],
  testCases: [testCaseSchema],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const QuestionModel= mongoose.model('Question', questionSchema);
module.exports=QuestionModel;
