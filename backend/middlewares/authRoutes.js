import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies.jwt;
  
  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: verifiedUser.id, username: verifiedUser.username }; // Attach relevant user properties
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Debugging line
    return res.status(401).json({ message: "Invalid or expired token", error: err.message });
  }
};

export default authenticateToken;