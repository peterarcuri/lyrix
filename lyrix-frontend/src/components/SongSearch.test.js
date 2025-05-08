var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SongSearch from './SongSearch';
import { searchSongs } from '../services/api';
import { addSongToPlaylist } from '../utils/playlistStorage';
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
        searchSongs.mockResolvedValueOnce({ data: [mockSong] });
        render(React.createElement(SongSearch, null));
        // Enter query
        const input = screen.getByPlaceholderText(/search by title/i);
        fireEvent.change(input, { target: { value: 'test' } });
        // Click search
        const button = screen.getByText(/search/i);
        fireEvent.click(button);
        // Wait for results to appear
        yield waitFor(() => {
            expect(screen.getByText('Test Song')).toBeInTheDocument();
            expect(screen.getByText('Test Artist')).toBeInTheDocument();
        });
        expect(searchSongs).toHaveBeenCalledWith('test');
    }));
    test('handleSave adds song to playlist when name is given', () => {
        window.alert = jest.fn(); // Mock alert
        render(React.createElement(SongSearch, { searchResults: [mockSong] }));
        // Type playlist name
        const playlistInput = screen.getByPlaceholderText(/enter playlist name/i);
        fireEvent.change(playlistInput, { target: { value: 'Favorites' } });
        // Click save
        const saveButton = screen.getByText(/save/i);
        fireEvent.click(saveButton);
        expect(addSongToPlaylist).toHaveBeenCalledWith('Favorites', mockSong);
        expect(window.alert).toHaveBeenCalledWith('Saved to "Favorites"');
    });
    test('handleSave shows alert if playlist name is empty', () => {
        window.alert = jest.fn();
        render(React.createElement(SongSearch, { searchResults: [mockSong] }));
        const saveButton = screen.getByText(/save/i);
        fireEvent.click(saveButton);
        expect(addSongToPlaylist).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Enter a playlist name first');
    });
});
