import '../database'
import User from '../models/user'

User
  .remove({})
  .then(() => {
    return User.create({
      username: 'admin',
      email: 'admin@admin.com',
      firstname: 'admin',
      lastname: 'admin',
      password: 'password1',
      role: 'admin'
    })
  })
  .then(() => {
    process.exit(0)
  })
