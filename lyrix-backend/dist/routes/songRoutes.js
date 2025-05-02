"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const songController_1 = require("../controllers/songController");
const router = express_1.default.Router();
// Just use the controller to handle the GET request
router.get('/lyrics', songController_1.getLyrics);
exports.default = router;
