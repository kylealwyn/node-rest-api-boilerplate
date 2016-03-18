import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let PostSchema = new Schema({
  likes: Number,
  title: String
}, {
  timestamps: true
});

export default mongoose.model('Post', PostSchema);
