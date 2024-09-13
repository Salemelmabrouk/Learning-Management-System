import bcrypt from 'bcryptjs';

const testPasswordHashing = async () => {
  const password = 'SecurePassword123';

  // Generate a new hash
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('Generated Hash:', hashedPassword);

  // Compare the password with the new hash
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Password Match:', isMatch); // Should be true
};

testPasswordHashing();
