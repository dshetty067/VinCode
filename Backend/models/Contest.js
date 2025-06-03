const mongoose=require('mongoose')

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  entryFee: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  prizePool: { type: Number, default: 0 },
  bonusFromApp: { type: Number, default: 0 },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  createdAt: { type: Date, default: Date.now },
});

const ContestModel= mongoose.model('Contest', contestSchema);
module.exports = ContestModel;
