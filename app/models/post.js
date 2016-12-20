import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  // media: { type: Schema.Types.ObjectId, ref: 'Media' },
  // likes : [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  // comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  // flags : [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
   _user: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
