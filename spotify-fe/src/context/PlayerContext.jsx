import { createContext, useEffect, useRef, useState } from 'react';
import songService from '../api/songService.js';
import albumService from '../api/albumService.js';
import spotifyRequest from '../api/spotifyRequest.js';
import playlistService from '../api/playlistService.js';
import { toast } from 'react-toastify';
import * as response from 'autoprefixer';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [songsData, setSongData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [track, setTrack] = useState(null);
  const [tracksData, setTracksData] = useState('');
  const [playlistData, setPlaylistData] = useState([]);

  const [playerState, setPlayerState] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0
    },
    totalTime: {
      second: 0,
      minute: 0
    }
  });

  const fetchPlayList = async () => {
    try {
      const response = await spotifyRequest.getCurrentUserPlayList('https://api.spotify.com/v1/me/playlists');
      console.log(response);
      if (response) {
        response.data.items.forEach(item => {
          spotifyRequest.getAlbumTracks(`https://api.spotify.com/v1/playlists/${item.id}/tracks/`);
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getSongData = async () => {
    try {
      const response = await songService.getAllSongs('/song/getList');
      if (response.data.code === 200) {
        setSongData(response.data.data);
        setTrack(response.data.data[0]);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAlbumsData = async () => {
    try {
      const response = await albumService.getAllAlbums('/album/getAllAlbums');
      if (response.data.code === 200) {
        setAlbumsData(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getPlaylistData = async () => {
    try {
      const response = await playlistService.getPlaylist('/playlist/getPlaylist', { userId: localStorage.getItem("userId")});
      if (response.data.code === 200) {
        setPlaylistData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(response.data.message);
    }
  }

  const play = () => {
    audioRef.current.play();
    setPlayerState(true);
  }

  const pause = () => {
    audioRef.current.pause();
    setPlayerState(false);
  }

  const playWithId = async (id, tracksData) => {
    await songsData.map((song) => {
      if (song.id === Number(id)) {
        setTrack(song);
      }
    })
    setTracksData(tracksData);
    await audioRef.current.play();
    setPlayerState(true);
  }

  const previous = async () => {
    tracksData.map(async (item, index) => {
      if (item.id === track.id && index > 0) {
        await setTrack(tracksData[index - 1]);
        await audioRef.current.play();
        setPlayerState(true);
      }
    })
  }

  const next = async () => {
    tracksData.map(async (item, index) => {
      if (item.id === track.id && index < tracksData.length) {
        await setTrack(tracksData[index + 1]);
        await audioRef.current.play();
        setPlayerState(true);
      }
    })
  }

  const seekSong = async (e) => {
    audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration);

  }

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60)
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60)
          }
        })
      }
    }, 1000)
  }, [audioRef]);

  useEffect(() => {
    getSongData();
    getAlbumsData();
    getPlaylistData();
    // fetchPlayList();
  }, []);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track, setTrack,
    playerState, setPlayerState,
    time, setTime,
    play, pause,
    playWithId,
    previous, next,
    seekSong,
    getPlaylistData,
    getAlbumsData,
    songsData, albumsData, playlistData
  }

  return (
    <PlayerContext.Provider value={ contextValue }>
      { props.children }
    </PlayerContext.Provider>
  )
}

export default PlayerContextProvider;
