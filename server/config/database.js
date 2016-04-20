import mongoose from 'mongoose';
import config from './environment';
// TODO get mongo url from configuration
export default function(cb) {
	mongoose.connect(config.mongo.uri, cb);
}
