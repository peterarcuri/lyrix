"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchSongs = exports.login = exports.signup = void 0;
const axios_1 = __importDefault(require("axios"));
const API = axios_1.default.create({
    baseURL: 'https://lyrix.onrender.com//api/v1',
});
const signup = (data) => API.post('/auth/signup', data);
exports.signup = signup;
const login = (data) => API.post('/auth/login', data);
exports.login = login;
const searchSongs = (query) => API.get(`/songs/lyrics?query=${query}`);
exports.searchSongs = searchSongs;
