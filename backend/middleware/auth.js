// Basic middleware to check if user claims to be an Admin
const requireAdmin = (req, res, next) => {
    const role = req.headers['x-user-role'];
    
    if (role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};

module.exports = { requireAdmin };
