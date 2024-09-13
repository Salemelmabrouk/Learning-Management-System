import jwt from 'jsonwebtoken';

// Ensure you use environment variables for security
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key'; // Always prefer process.env
const JWT_EXPIRATION = '1d'; // Token expiration duration

// Function to generate JWT token
export function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
}

// Function to verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET); // JWT_SECRET used here for verification
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null; // Optionally return null or throw an error
  }
}

// Function to generate a token and set it in a cookie
export function generateTokenAndSetCookie(user, res) {
  const token = generateToken(user);

  // Set the token as an HTTP-only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure cookie only in production (https)
    sameSite: 'Strict',  // Prevent CSRF attacks
    maxAge: 24 * 60 * 60 * 1000, // Cookie expiration in milliseconds (1 day in this case)
  });

  return token; // Optionally return the token as well

 
}
