import mongoose from 'mongoose';

const intakeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Intake = mongoose.models.Intake || mongoose.model('Intake', intakeSchema);
export default Intake;
