"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const songRoutes_1 = __importDefault(require("./routes/songRoutes"));
dotenv_1.default.config();
if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined');
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Lyrix backend says hello! 😁');
});
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/songs', songRoutes_1.default);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
})
    .catch((err) => console.error('MongoDB connection error:', err));
exports.default = app;
