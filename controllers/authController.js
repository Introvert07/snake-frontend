const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, role } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) user = await User.create({ username, role });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user });
    } catch (err) { res.status(500).json({ error: err.message }); }
};