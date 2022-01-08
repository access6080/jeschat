import User from '../models/User.js'
import jwt from 'jsonwebtoken'

export const loginController = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({success: false, message: "Please Provide Login Details" });

    try {
        const user = await User.findOne({ username: username }).select("+password")
        
        if (!user) return res.status(401).json({success: false, message: "Invalid Credentials" });
        
        const isMatched = await user.matchPassword(password)

        if (!isMatched) return res.status(401).json({success: false, message: "Invalid Credentials" });

        sendToken(user, 200, res);
        
    } catch (error) {
        console.log(error);
    }
};

export const signupController = async (req, res, next) => {
    const { username, password, confirmPassword, avatar } = req.body;

    if (!username || !password || !confirmPassword) return res.status(400).json({ success: false, message: "Please Provide Sign Up Details" });

    if (password !== confirmPassword) return res.status(400).json({ success: false, message: "Passwords Do not Match" });

    try {
        // Create a new user
        const user = await  User.create({
            username,
            password,
            avatar
        });

        sendToken(user, 200, res);
        
    } catch (error) {
        console.log(error.message);
    }
};

export const getUserController = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username: username});
        if (!user) return res.status(401).json({ success: false, message: error.message });
        
        res.status(200).json({success: true, response: user});
    } catch (error) {
        console.log(error.message);
    }
}

export const refreshTokenController = async (req, res) => {
    const { jestok } = req.cookies;

    if (!jestok) return res.status(200).json({ success: false, message: "Please Login or Sign Up"})

    const decoded = jwt.decode(jestok, process.env.JWT_REFRESH_SECRET);

    try {
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ success: false });
        
        sendAccessToken(user, 200, res);

    } catch (error) {
        console.log(error.message)
    }
}

export const avatarController = async (req, res) => {
    const { id, avatar } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ success: false });
        user.avatar = avatar;
        user.save();

        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
    }
}

const sendToken = (user, statusCode, res) => {
    const token = user.getAccessJwtToken();
    const refrshToken  = user.getRefreshJwtToken();
    res
        .status(statusCode)
        .cookie('jestok', refrshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
        })
        .json({ sucess: true, user:user.username, token});
};

const sendAccessToken = (user, statusCode, res) => {
  const token = user.getAccessJwtToken();
  res.status(statusCode).json({ sucess: true, user:user.username, token});
};