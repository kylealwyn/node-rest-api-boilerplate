import supertest from 'supertest';
import '../../app/database';
import app from '../../app/server';

export default supertest(app);
