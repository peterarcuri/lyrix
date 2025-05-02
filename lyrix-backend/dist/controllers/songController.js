"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyrics = void 0;
const song_1 = __importDefault(require("../models/song"));
const getLyrics = async (req, res) => {
    try {
        const { query } = req.query;
        let songs;
        if (query) {
            // Case-insensitive search for title or artist
            songs = await song_1.default.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { artist: { $regex: query, $options: 'i' } },
                ],
            });
        }
        else {
            songs = await song_1.default.find();
        }
        res.json(songs);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching songs' });
    }
};
exports.getLyrics = getLyrics;
