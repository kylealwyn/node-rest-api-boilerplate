import bookshelf from '../database';
import './user.model';

module.exports = bookshelf.model('Post', {
  tableName: 'posts',
  posts() {
    return this.belongsTo('User');
  },
});
