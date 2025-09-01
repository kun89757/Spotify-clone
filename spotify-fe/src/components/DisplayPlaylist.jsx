import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext.jsx';
import Navbar from './Navbar.jsx';
import { assets } from '../assets/assets.js';
import artistService from '../api/artistService.js';
import albumService from '../api/albumService.js';
import playlistService from '../api/playlistService.js';
import { toast } from 'react-toastify';

const DisplayPlaylist = () => {

  const { id } = useParams();
  const { playWithId, playlistData, getPlaylistData } = useContext(PlayerContext);
  const [playlistDuration, setPlaylistDuration] = React.useState('');
  const [tracksData, setTracksData] = React.useState([]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
  }

  const handleUnlike = async (song) => {
    const userId = localStorage.getItem('userId');
    const playlistId = playlistData.id;
    const songId = song.id;
    const data = {
      userId,
      playlistId,
      songId
    }
    const response = await playlistService.addToPlaylist('/playlist/cancelPlaylist', data);
    if (response.data.code === 200) {
      console.log(response.data);
      getPlaylistData();
    } else {
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    const fetchTrackData = async () => {
      try {
        // 确保 playlistData 不为空
        if (!playlistData) {
          return;
        }

        const updatedSongs = await Promise.all(
          playlistData.songs.map(async (song) => {
            const artistResponse = await artistService.getArtistById('/artist/getArtistById', song.artistId);
            const albumResponse = await albumService.getAlbumById('/album/getAlbumById', song.albumId);

            if (artistResponse.data.code === 200) {
              song.artist = artistResponse.data.data.name;
            } else {
              console.error(artistResponse.data.message);
            }

            if (albumResponse.data.code === 200) {
              song.album = albumResponse.data.data.name;
            } else {
              console.error(albumResponse.data.message);
            }

            return song;
          })
        );

        setTracksData(updatedSongs);

        const totalDuration = updatedSongs.reduce((acc, curr) => acc + curr.duration, 0);
        setPlaylistDuration(totalDuration);
      } catch (error) {
        console.error('Error fetching track data:', error);
      }
    };

    // 调用 fetchTrackData 只有在 playlistData 发生变化时
    if (playlistData) {
      fetchTrackData();
    }
  }, [playlistData]); // playlistData 是依赖项


  return playlistData ? (
    <>
      <Navbar />
      <div className={'mt-10 flex gap-8 flex-col md:flex-row md:items-end'}>
        <img className={'w-48 rounded'} src={playlistData.cover} alt={''}/>
        <div className={'flex flex-col'}>
          <p>Playlist</p>
          <h2 className={'text-5xl font-bold mb-4 md:text-7xl'}>{playlistData.name}</h2>
          <h4>My fav</h4>
          <p className={'mt-1'}>
            <img className={'inline-block'} src={assets.spotify_logo} alt={''}/>
            <b> Nuwanda </b>
            2024
            <b> {tracksData.length} 首歌,</b>
            {
              Math.floor(playlistDuration / 3600) > 0
                ? <b>{ Math.floor(playlistDuration / 3600) } 小时 { Math.floor(playlistDuration % 3600 / 60) }分钟</b>
                : <b>{Math.floor(playlistDuration / 60) } 分钟 {Math.floor(playlistDuration % 60)} 秒</b>
            }
          </p>
        </div>
      </div>
      <div className={'grid grid-cols-3 sm:grid-cols-5 mt-10 mb-4 pl-2 text-[#a7a7a7]'}>
        <p><b className={'mr-4'}>#</b>Title</p>
        <p>Album</p>
        <p className={'hidden sm:block'}>Date Added</p>
        <p></p>
        <img className={'m-auto w-4'} src={assets.clock_icon} alt={''}/>
      </div>
      <hr />
      {
        tracksData.map((song, index) => (
          <div onClick={ () => playWithId(song.id, tracksData) } key={ index }
               className={ 'grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-white hover:bg-[#ffffff2b] cursor-pointer' }>
            <p className={ 'text-white text-nowrap flex-nowrap overflow-hidden' }>
              <b className={ 'mr-4 text-[#a7a7a7]' }>{ index + 1 }</b>
              <img className={ 'inline w-10 mr-5' } src={ song.image } alt={ '' }/>
              <b className={ 'overflow-hidden' }>{ song.name }</b>
            </p>
            <p className={ 'text-[15px]' }>{ song.album }</p>
            <p className={ 'text-[15px] hidden sm:block' }>{ formatDate(song.createTime) }</p>
            <img  onClick={ (event) => {
              event.stopPropagation();
              handleUnlike(song);
            } } alt={ '' } className={ 'm-auto w-5' } src={ assets.liked_icon }/>
            <p
              className={ 'text-[15px] text-center' }>{ Math.floor(song.duration / 60) } : { Math.floor(song.duration % 60) }</p>
          </div>
        ))
      }
    </>
  ) : null;
};

export default DisplayPlaylist;
