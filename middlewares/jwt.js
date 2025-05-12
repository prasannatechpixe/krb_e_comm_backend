const jwt = require('jsonwebtoken');

// Generate access token (short-lived)
exports.generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate refresh token (long-lived)
exports.generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify access token
exports.verifyAccessToken = (token) => {
  console.log('Verifying access token', req.body.token);
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Verify refresh token
exports.verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
