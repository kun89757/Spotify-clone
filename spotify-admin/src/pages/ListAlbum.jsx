import React, { useEffect } from 'react';
import albumService from '../api/albumService.js';
import { toast } from 'react-toastify';
import artistService from '../api/artistService.js';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ListAlbum = () => {

  const [albums, setAlbums] = React.useState([]);
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    try {
      const response = await albumService.getAllAlbums('/album/getAllAlbums');
      if (response.data.code === 200) {
        const albumsData = response.data.data;
        const updatedAlbums = await Promise.all(albumsData.map(async (album) => {
          const details = await fetchAlbumDetails(album);
          return {
            ...album,
            artist: details.artist,
          }
        }));
        setAlbums(updatedAlbums);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("服务端异常");
    }
  }

  const fetchAlbumDetails = async (album) => {
    try {
      const artistResponse = await artistService.getArtistById('artist/getArtistById', album.artistId);
      let details = [];
      if (artistResponse.data.code === 200) {
        details.artist = artistResponse.data.data.name;
      } else {
        toast.error(artistResponse.data.message);
      }
      return details;
    } catch (error) {
      toast.error("服务端异常");
      return {};
    }
  }

  const removeAlbum = async (id) => {
    try {
      await albumService.deleteAlbum('album/removeById', id)
        .then(response => {
          if (response.data.code === 200) {
            toast.success("删除成功");
            fetchAlbums();
          } else {
            toast.error(response.data.message);
          }
        }).catch(error => {
          toast.error(error);
        })
    } catch (error) {
      toast.error("服务端异常")
    }
  }

  useEffect(() => {
    fetchAlbums().then();
  }, []);


  return (
    <div>
      <p>所有专辑</p>
      <br />
      <div>
        <div className={'sm:grid hidden grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_1fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-300'}>
          <b>封面</b>
          <b>专辑名</b>
          <b>专辑描述</b>
          <b>专辑背景色</b>
          <b>专辑艺术家</b>
          <b>专辑曲目数量</b>
          <b>操作</b>
        </div>
        {
          albums.map((album) => {
            return (
              <div key={album.id} className={'grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_1.5fr_0.5fr_0.5fr_0.5fr_0.5fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'}>
                <img className={'w-12'} src={album.image} alt={''} />
                <p>{album.name}</p>
                <p>{album.description}</p>
                <input type={'color'} value={album.backgroundColor}/>
                <p>{album.artist}</p>
                <p className={'text-center'}>{album.trackCount}</p>
                <Button className={'w-10'} type={'button'} variant={'contained'} onClick={() => removeAlbum(album.id)}>
                  删除
                </Button>
                <Button color='success' className={'w-10'} type={'button'} variant={'contained'} onClick={() => navigate(`/updateAlbum/${album.id}`)}>
                  修改
                </Button>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default ListAlbum;
