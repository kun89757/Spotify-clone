import React, { useContext, useEffect } from 'react';
import Navbar from './Navbar.jsx';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets.js';
import { PlayerContext } from '../context/PlayerContext.jsx';
import songService from '../api/songService.js';
import artistService from '../api/artistService.js';
import playlistService from '../api/playlistService.js';
import { toast } from 'react-toastify';

const DisplayAlbum = () => {

  const { id } = useParams();
  const [albumData, setAlbumData] = React.useState('');
  const { playWithId, albumsData, playlistData, getPlaylistData, getAlbumsData } = useContext(PlayerContext);
  const [tracksData, setTracksData] = React.useState([]);
  const [artistData, setArtistData] = React.useState('');
  const [albumDuration, setAlbumDuration] = React.useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('zh-CN', options);
  }

  const handleLike = async (song) => {
    const userId = localStorage.getItem('userId');
    const playlistId = playlistData.id;
    const songId = song.id;
    const data = {
      userId,
      playlistId,
      songId
    }
    const response = await playlistService.addToPlaylist('/playlist/addToPlaylist', data);
    if (response.data.code === 200) {
      console.log(response.data);
      getPlaylistData();
      getAlbumsData();
    } else {
      toast.error(response.data.message);
    }
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
      getAlbumsData();
    } else {
      toast.error(response.data.message);
    }
  }

  const fetchTrackData = async () => {
    try {
      // 确保 albumData 不为空
      if (!albumData) {
        return;
      }
      const response = await songService.getSongsByAlbumId('/song/getSongsByAlbum', id);
      if (response.data.code === 200) {
        const likedSongs = playlistData.songs;
        const updatedTracks = response.data.data.map((track) => ({
          ...track,
          liked: likedSongs.some(liked => Number(liked.id) === Number(track.id))
        }));
        setTracksData(updatedTracks);
        console.log(updatedTracks);
        const totalDuration = response.data.data.reduce((acc, curr) => acc + curr.duration, 0);
        setAlbumDuration(totalDuration);
        const artistResponse = await artistService.getArtistById('/artist/getArtistById', albumData.artistId);
        if (artistResponse.data.code === 200) {
          setArtistData(artistResponse.data.data);
        } else {
          console.error(artistResponse.data.message);
        }
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    albumsData.map((album) => {
      if (album.id === Number(id)) {
        setAlbumData(album);
      }
    });
  }, [albumsData, id]);

  useEffect(() => {
    // 调用 fetchTrackData 只有在 albumData 发生变化时
    if (albumData && id) {
      fetchTrackData();
    }
  }, [albumData, id, playlistData.songs]);

  return albumData ? (
    <>
      <Navbar />
      <div className={'mt-10 flex gap-8 flex-col md:flex-row md:items-end'}>
        <img className={'w-48 rounded'} src={albumData.image} alt={''}/>
        <div className={'flex flex-col'}>
          <p>Playlist</p>
          <h2 className={'text-5xl font-bold mb-4 md:text-7xl'}>{albumData.name}</h2>
          <h4>{albumData.description}</h4>
          <p className={'mt-1'}>
            <img className={'inline-block'} src={assets.spotify_logo} alt={''}/>
            <b> {artistData.name} </b>
            2024
            <b> {albumData.trackCount} 首歌,</b>
            {
              Math.floor(albumDuration / 3600) > 0
                ? <b>{ Math.floor(albumDuration / 3600) } 小时 { Math.floor(albumDuration % 3600 / 60) }分钟</b>
                : <b>{Math.floor(albumDuration / 60) } 分钟 {Math.floor(albumDuration % 60)} 秒</b>
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
          <div onClick={ () => playWithId(song.id, tracksData) } key={index} className={'grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-white hover:bg-[#ffffff2b] cursor-pointer'}>
            <p className={'text-white text-nowrap flex-nowrap overflow-hidden'}>
              <b className={'mr-4 text-[#a7a7a7]'}>{index + 1}</b>
              <img className={'inline w-10 mr-5'} src={song.image} alt={''}/>
              <b className={'overflow-hidden'}>{song.name}</b>
            </p>
            <p className={'text-[15px]'}>{albumData.name}</p>
            <p className={'text-[15px] hidden sm:block'}>{ formatDate(song.createTime) }</p>
            { song.liked
              ? <img onClick={ (event) => { event.stopPropagation(); handleUnlike(song)} } alt={ '' } className={ 'm-auto w-5' } src={ assets.liked_icon }/>
              : <img onClick={ (event) => { event.stopPropagation(); handleLike(song)} } alt={ '' } className={ 'm-auto w-5' } src={ assets.add_icon }/>
            }
            <p className={ 'text-[15px] text-center' }>{ Math.floor(song.duration / 60) } : { Math.floor(song.duration % 60) }</p>
          </div>
        ))
      }
    </>
  ) : null;
};

export default DisplayAlbum;
