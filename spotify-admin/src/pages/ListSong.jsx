import React, { useEffect } from 'react';
import songService from '../api/songService.js';
import { toast } from 'react-toastify';
import artistService from '../api/artistService.js';
import albumService from '../api/albumService.js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ListSong = () => {

  const [songs, setSongs] = React.useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSongs().then();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await songService.getAllSongs('/song/getList');
      if (response.data.code === 200) {
        const songsData = response.data.data;
        const updatedSongs = await Promise.all(songsData.map(async (song) => {
          const details = await fetchSongDetails(song);
          return {
            ...song,
            artist: details.artist,
            album: details.album
          };
        }));
        setSongs(updatedSongs);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("服务端异常");
    }
  }

  const fetchSongDetails = async (song) => {
    try {
      const requests = [
        await artistService.getArtistById('artist/getArtistById', song.artistId)
      ]
      if (song.albumId !== 0) {
        requests.push(await albumService.getAlbumById('album/getAlbumById', song.albumId))
      }
      const responses = await Promise.all(requests);
      const artistResponse = responses[0];
      const albumResponse = song.albumId !== 0 ? responses[1] : null;

      let details = [];

      if (artistResponse.data.code === 200) {
        details.artist = artistResponse.data.data.name;
      } else {
        toast.error(artistResponse.data.message);
      }
      if (song.albumId && albumResponse && albumResponse.data.code === 200) {
        details.album = albumResponse.data.data.name;
      } else if (song.albumId === 0) {
        details.album = song.name;
      } else {
        toast.error(albumResponse.data.message);
      }
      return details;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  const removeSong = async (id) => {
    try {
      await songService.deleteSong('song/deleteById', id)
        .then(response => {
          if (response.data.code === 200) {
            toast.success("删除成功");
            fetchSongs();
          } else {
            toast.error(response.data.message);
          }
        })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <p>所有歌曲</p>
      <br />
      <div>
        <div className={'sm:grid hidden grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr_1fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'}>
          <b>封面</b>
          <b>曲名</b>
          <b>专辑</b>
          <b>艺术家</b>
          <b>时长</b>
          <b>操作</b>
        </div>
        {
          songs.map(song => {
            return (
              <div key={ song.id }
                   className={ 'grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_1fr_1fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5' }>
                <img className={ 'w-12' } src={ song.image } alt={ '' }/>
                <p>{ song.name }</p>
                <p>{ song.album }</p>
                <p>{ song.artist }</p>
                <p>{ Math.floor(song.duration / 60) }:{ Math.floor(song.duration % 60) }</p>
                <Button className={'w-10'} type={'button'} variant={'contained'} onClick={() => removeSong(song.id)}>
                  删除
                </Button>
                <Button color='success' className={'w-10'} type={'button'} variant={'contained'} onClick={() => navigate(`/updateSong/${song.id}`)}>
                  修改
                </Button>
              </div>)
          })
        }
      </div>
    </div>
  );
};

export default ListSong;
