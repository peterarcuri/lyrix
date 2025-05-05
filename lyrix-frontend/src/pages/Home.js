"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = __importDefault(require("react"));
const SongSearch_1 = __importDefault(require("../components/SongSearch"));
function Home() {
    return (react_1.default.createElement("div", { className: "home-container" },
        react_1.default.createElement("div", { className: "home-content" },
            react_1.default.createElement(SongSearch_1.default, null))));
}
