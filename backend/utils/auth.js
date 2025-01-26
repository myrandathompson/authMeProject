const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: "Lax", // Always use Lax for security
    });

    return token;
};
// Middleware to require authentication
const requireAuth = (req, _res, next) => {
    if (req.user) return next(); // Check for req.user, not req.User


    return _res.status(401).json({
        message: "Authentication required"
    });

    const err = new Error('Unauthorized');
    err.title = 'Unauthorized';
    err.errors = ['Unauthorized'];
    err.status = 401;
    return next(err);
};
// Middleware to restore user from JWT
const restoreUser = async (req, res, next) => {
    const { token } = req.cookies;
    req.user = null; // Default to null

    if (!token) {
        return next();
    }

    jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            res.clearCookie('token');
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            const user = await User.scope('currentUser').findByPk(id);

            if (user) {
                req.user = user; // Attach user to req
            } else {
                res.clearCookie('token');
            }
        } catch (e) {
            res.clearCookie('token');
        }

        return next();
    });
};



module.exports = { setTokenCookie, restoreUser, requireAuth };
