import mongoose from 'mongoose';
import config from './environment';

export default function(cb) {
	mongoose.connect(config.mongo.uri, cb);
}
