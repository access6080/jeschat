import User from '../models/User.js'

export const loginController = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) return res.status(400).json({success: false, message: "Please Provide Login Details" });

    try {
        const user = await User.findOne({ username: username }).select("+password")
        
        if (!user) return res.status(401).json({success: false, message: "Invalid Credentials" });
        
        const isMatched = await user.matchPassword(password)

        if (!isMatched) return res.status(401).json({success: false, message: "Invalid Credentials" });

        res.status(200).json({ success: true, response: user });
        
    } catch (error) {
        console.log(error.message);
    }
};

export const signupController = async (req, res, next) => {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword) return res.status(400).json({ success: false, message: "Please Provide Login Details" });

    if (password !== confirmPassword) return res.status(400).json({ success: false, message: "Passwords Do not Match" });

    try {
        // Create a new user
        const user = await  User.create({
            username,
            password
        });

        res.status(200).json({ success: true, response: user });
        
    } catch (error) {
        console.log(error.message);
    }
};

export const getUserController = (req, res) => {
    const { id } = req.body;
    try {
        const user = User.findById(id);
        res.status(200).json({success: true, response: user});
    } catch (error) {
        console.log(error.message);
    }
}