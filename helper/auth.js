const jwt = require('jsonwebtoken');

const generateAccessToken = (data) => {
    return jwt.sign(data, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}

module.exports = { generateAccessToken }