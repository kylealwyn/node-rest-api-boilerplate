import mongoose from 'mongoose';

// TODO get mongo url from configuration
export default function(cb) {
	mongoose.connect('mongodb://localhost/test', () => cb() );
}
