import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SongSearch } from './SongSearch';
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
    test('runSearch calls API and renders results', async () => {
        searchSongs.mockResolvedValueOnce({ data: [mockSong] });
        render(_jsx(SongSearch, {}));
        // Enter query
        const input = screen.getByPlaceholderText(/search by title/i);
        fireEvent.change(input, { target: { value: 'test' } });
        // Click search
        const button = screen.getByText(/search/i);
        fireEvent.click(button);
        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Test Song')).toBeInTheDocument();
            expect(screen.getByText('Test Artist')).toBeInTheDocument();
        });
        expect(searchSongs).toHaveBeenCalledWith('test');
    });
    test('handleSave adds song to playlist when name is given', () => {
        window.alert = jest.fn(); // Mock alert
        render(_jsx(SongSearch, { searchResults: [mockSong] }));
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
        render(_jsx(SongSearch, { searchResults: [mockSong] }));
        const saveButton = screen.getByText(/save/i);
        fireEvent.click(saveButton);
        expect(addSongToPlaylist).not.toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalledWith('Enter a playlist name first');
    });
});
