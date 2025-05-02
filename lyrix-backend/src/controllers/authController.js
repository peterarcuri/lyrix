"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = require("../utils/generateToken");
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser)
                return res.status(400).json({ message: 'User already exists' });
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = yield User_1.default.create({ email, password: hashedPassword });
            const token = (0, generateToken_1.generateToken)(user._id.toString());
            res.status(201).json({ token, email: user.email });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield User_1.default.findOne({ email });
            if (!user)
                return res.status(400).json({ message: 'Invalid credentials' });
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ message: 'Invalid credentials' });
            const token = (0, generateToken_1.generateToken)(user._id.toString());
            res.status(200).json({ token, email: user.email });
        }
        catch (err) {
            res.status(500).json({ message: 'Server error' });
        }
    });
}
