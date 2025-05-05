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
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
const SongSearch_1 = __importDefault(require("./SongSearch"));
const api_1 = require("../services/api");
const playlistStorage_1 = require("../utils/playlistStorage");
// Mock the modules
jest.mock('../services/api');
jest.mock('../utils/playlistStorage');
const mockSong = {
    _id: '1',
    title: 'Test Song',
    artist: 'Test Artist',
    songLyrics: 'Test lyrics...',
};
describe('SongSearch Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('runSearch calls API and renders results', () => __awaiter(void 0, void 0, void 0, function* () {
        api_1.searchSongs.mockResolvedValueOnce({ data: [mockSong] });
        (0, react_2.render)(react_1.default.createElement(SongSearch_1.default, null));
        // Enter query
        const input = react_2.screen.getByPlaceholderText(/search by title/i);
        react_2.fireEvent.change(input, { target: { value: 'test' } });
        // Click search
        const button = react_2.screen.getByText(/search/i);
        react_2.fireEvent.click(button);
        // Wait for results to appear
        yield (0, react_2.waitFor)(() => {
            expect(react_2.screen.getByText('Test Song')).toBeInTheDocument();
            expect(react_2.screen.getByText('Test Artist')).toBeInTheDocument();
        });
        expect(api_1.searchSongs).toHaveBeenCalledWith('test');
    }));
    test('handleSave adds song to playlist when name is given', () => {
        window.alert = jest.fn(); // Mock alert
        (0, react_2.render)(react_1.default.createElement(SongSearch_1.default, { searchResults: [mockSong] }));
        // Type playlist name
        const playlistInput = react_2.screen.getByPlaceholderText(/enter playlist name/i);
        react_2.fireEvent.change(playlistInput, { target: { value: 'Favorites' } });
        // Click save
        const saveButton = react_2.screen.getByText(/save/i);
        react_2.fireEvent.click(saveButton);
        expect(playlistStorage_1.addSongToPlaylist).toHaveBeenCalledWith('Favorites', mockSong);
        expect(window.alert).toHaveBeenCalledWith('Saved to "Favorites"');
    });
    test('handleSave shows alert if playlist name is empty', () => {
        window.alert = jest.fn();
        (0, react_2.render)(react_1.default.createElement(SongSearch_1.default, { searchResults: [mockSong] }));
        const saveButton = react_2.screen.getByText(/save/i);
        react_2.fireEvent.click(saveButton);
        expect(playlistStorage_1.addSongToPlaylist).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Enter a playlist name first');
    });
});
