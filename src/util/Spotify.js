import React from 'react';

let accessToken;
let clientId = '8ce0a00bc9a943a48d91fe4e6943d8a2';
let redirectUri = 'http://disastrous-flag.surge.sh';
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
        let expirationTime = Number(urlExpirationTime[1]);
        window.setTimeout(() => accessToken = '', expirationTime * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
      } else {
        window.location = redirectUrl;
      }
    }
  },

  search(term) {
    const searchUrl = `https://api.spotify.com/v1/search?type=track&q=${term}`
    const accessToken = Spotify.getAccessToken();
    console.log(`My search token: ${accessToken}`);

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

  savePlaylist(name, trackUris) {
    if (!name || !trackUris) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name})
      }).then(response => response.json()
      ).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        });
      });
    });
  }
};

export default Spotify;
