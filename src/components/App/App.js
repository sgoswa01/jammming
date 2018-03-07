import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: [],
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let currentPlaylistTracks = this.state.playlistTracks.concat(track);
    this.setState({playlistTracks: currentPlaylistTracks});
  }

  removeTrack(track) {
    let currentPlaylistTracks = this.state.playlistTracks;
    this.setState({playlistTracks: currentPlaylistTracks.filter(newTrack => newTrack.id !== track.id)});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let playlistArray = this.state.playlistTracks;
    let uriArray = playlistArray.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, uriArray);
    this.setState({ searchResults: [], playlistName: 'New Playlist' });
  }

  search(term) {
    Spotify.search(term).then(results => Array.from(results)).then(trackArray => {this.setState({ searchResults: trackArray })});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack} />
            <Playlist
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onAdd={this.addTrack}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
