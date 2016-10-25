import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let PostSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  // media: { type: Schema.Types.ObjectId, ref: 'Media' },
  // likes : [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  // comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  // flags : [{ type: Schema.Types.ObjectId, ref: 'Flag' }]
   _user : { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default mongoose.model('Post', PostSchema);
