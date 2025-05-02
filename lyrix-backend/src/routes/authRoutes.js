"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => {
    (0, authController_1.signup)(req, res).catch(next);
});
router.post('/login', (req, res, next) => {
    (0, authController_1.login)(req, res).catch((err) => {
        res.status(401).json({ message: 'Invalid credentials' });
        next(err);
    });
});
exports.default = router;
