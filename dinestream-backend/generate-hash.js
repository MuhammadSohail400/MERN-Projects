const bcrypt = require('bcryptjs')

const password = 'Soh@123...'  // ← apna naya password yahan likho

bcrypt.hash(password, 12).then(hash => {
  console.log('Hashed password:', hash)
})