import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let PostSchema = new Schema({
  _user : { type: Schema.Types.ObjectId, ref: 'User' },
  text: String,
  media: { type: Schema.Types.ObjectId, ref: 'Media' },
  likes : [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  flags : [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
}, {
  timestamps: true
});

export default mongoose.model('Post', PostSchema);
