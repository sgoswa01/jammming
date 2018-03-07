import React from 'react';

let accessToken;
let clientId = '8ce0a00bc9a943a48d91fe4e6943d8a2';
let redirectUri = 'https://Sophia_Jammming12.surge.sh';
let redirectUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else {
      let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
      let urlExpirationTime = window.location.href.match(/expires_in=([^&]*)/);

      if (urlAccessToken && urlExpirationTime) {
        accessToken = urlAccessToken[1];
        let expirationTime = urlExpirationTime[1];
        window.setTimeout(() => accessToken = '', expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
        window.location = redirectUrl;
      }
    }
  },

  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`

    return fetch(searchUrl, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => response.json()).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }
      });
    });
  },

  savePlaylist(playlistName, playlistTracks) {
    if (!playlistName || !playlistTracks) {
      return
    } else {
      let userId;
      let playlistId;
      const headers = {Authorization: `Bearer ${accessToken}`};
      const accessToken = accessToken;
      let spotifyUrl = 'https://api.spotify.com/v1/me';

      return fetch(spotifyUrl, {headers: headers}).then(response => response.json()).then(jsonResponse => userId = jsonResponse.id).then(() => {
        const playlistUrl = `/v1/users/${userId}/playlists`
        fetch(playlistUrl, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({name: playlistName})
        }).then(response => response.json()).then(jsonResponse => playlistId = jsonResponse.id).then(() => {
          const trackPlaylistUrl = `/v1/users/${userId}/playlists/${playlistId}/tracks`;
          fetch(trackPlaylistUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: playlistTracks})
          })
        })
      })
    }
  }
}

export default Spotify;
