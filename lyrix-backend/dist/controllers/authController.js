"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
async function signup(req, res) {
    const { email, password } = req.body;
    try {
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({ email, password: hashedPassword });
        const token = (0, generateToken_1.generateToken)(user._id.toString());
        res.status(201).json({ token, email: user.email });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });
        const token = (0, generateToken_1.generateToken)(user._id.toString());
        res.status(200).json({ token, email: user.email });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}
