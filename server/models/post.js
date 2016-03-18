import mongoose from 'mongoose';

let PostSchema = new mongoose.Schema({
  likes: Number,
  title: String
}, {
  timestamps: true
});

export default mongoose.model('Post', PostSchema);
