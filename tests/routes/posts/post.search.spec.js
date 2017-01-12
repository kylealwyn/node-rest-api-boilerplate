import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Post from '../../../app/models/post';
import UserFactory from '../../factories/user.factory';
import PostFactory from '../../factories/post.factory';

const ENDPOINT = '/posts';
let testUser;
let testPost;

describe(`GET ${ENDPOINT}`, () => {
  before(() => (
    User.remove({})
    .then(() => Post.remove({}))
    .then(() => User.create(UserFactory.generate()))
    .then(u => testUser = u)
    .then(() => Post.create(PostFactory.generateList(5, {_user: testUser._id})))
    .then(t => testPost = t)
  ));

  describe('#200', () => {
    it('should return an array of posts', done => {
      server.get(ENDPOINT)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf(5);
          done();
        });
    });
  });
});
