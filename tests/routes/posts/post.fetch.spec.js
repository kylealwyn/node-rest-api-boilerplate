import { expect } from 'chai';
import server from '../../utils/server.mock';
import User from '../../../app/models/user';
import Post from '../../../app/models/post';
import UserFactory from '../../factories/user.factory';
import PostFactory from '../../factories/post.factory';

const ENDPOINT = '/posts';
let testUser;
let testPost;

describe(`GET ${ENDPOINT}/:id`, () => {
  before(() => (
    User.remove({})
    .then(() => Post.remove({}))
    .then(() => User.create(UserFactory.generate()))
    .then(u => testUser = u)
    .then(() => Post.create(PostFactory.generate({_user: testUser._id})))
    .then(t => testPost = t)
  ));

  describe('#200', () => {
    it('should return the post with the supplied id', (done) => {
      server.get(`${ENDPOINT}/${testPost._id}`)
        .end((err, res) => {
          const { body } = res;

          expect(res).to.have.status(200);
          expect(body.text).to.eql(testPost.text);

          done();
        });
    });
  });

  describe('#404', () => {
    it('should send back unauthorized if invalid token is provided', (done) => {
      server.get(`${ENDPOINT}/TheresNoPostHere`)
        .end((err, res) => {
          // console.log(err, res.body);
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
