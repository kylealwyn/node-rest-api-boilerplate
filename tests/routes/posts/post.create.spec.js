import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Post from '../../../app/models/post';
import UserFactory from '../../factories/user.factory';
import PostFactory from '../../factories/post.factory';

const ENDPOINT = '/posts';
let testUser;
let testPost;

describe(`POST ${ENDPOINT}`, () => {
  before(() => (
    User.remove({})
    .then(() => Post.remove({}))
    .then(() => User.create(UserFactory.generate()))
    .then(u => testUser = u)
  ));

  beforeEach(() => {
    testPost = PostFactory.generate();
  });

  describe('#201', () => {
    it('should create a post', (done) => {
      server.post(ENDPOINT)
        .set('Authorization', testUser.generateToken())
        .send(testPost)
        .end((err, res) => {
          const { body } = res;

          expect(res).to.have.status(201);
          expect(body).to.be.defined;
          expect(body.text).to.eql(testPost.text);
          expect(body._user).to.eql(testUser._id.toString());

          done();
        });
    });
  });

  describe('#401', () => {
    it('should send back unauthorized if invalid token is provided', (done) => {
      server.post(ENDPOINT)
        .set('Authorization', 'notarealtokenlolol')
        .send(testPost)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});
