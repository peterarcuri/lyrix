export interface Song {
  _id: string;
  title: string;
  artist: string;
  songLyrics: string;
}

export interface Playlist {
  name: string;
  songs: Song[];
}

export interface SongSearchProps {
  handleSearch?: (query: string) => void;
  searchResults?: Song[];
}
