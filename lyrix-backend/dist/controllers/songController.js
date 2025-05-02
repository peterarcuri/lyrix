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
exports.getLyrics = void 0;
const song_1 = __importDefault(require("../models/song"));
const getLyrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        let songs;
        if (query) {
            // Case-insensitive search for title or artist
            songs = yield song_1.default.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { artist: { $regex: query, $options: 'i' } },
                ],
            });
        }
        else {
            songs = yield song_1.default.find();
        }
        res.json(songs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching songs' });
    }
});
exports.getLyrics = getLyrics;
