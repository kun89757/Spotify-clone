import React, { useEffect } from 'react';
import albumService from '../api/albumService.js';
import artistService from '../api/artistService.js';
import { Bounce, toast } from 'react-toastify';
import songService from '../api/songService.js';
import { assets } from '../assets/assets.js';
import { useParams } from 'react-router-dom';

const UpdateSong = () => {
  const { id } = useParams();
  const [image, setImage] = React.useState('');
  const [song, setSong] = React.useState('');
  const [audioUrl, setAudioUrl] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [albumList, setAlbumList] = React.useState([]);
  const [artistList, setArtistList] = React.useState([]);
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [artistId, setArtistId] = React.useState(-1);
  const [albumId, setAlbumId] = React.useState(-1);
  const [audioName, setAudioName] = React.useState('');
  const [imageName, setImageName] = React.useState('');
  const [isSingle, setIsSingle] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumResponse, artistResponse, songResponse] = await Promise.all([
          albumService.getAllAlbums('/album/getAllAlbums'),
          artistService.getAllArtists('/artist/getAllArtists'),
          songService.getSongById('/song/getSongById', id)
        ])
        if (artistResponse.data.code === 200) {
          setArtistList(artistResponse.data.data);
        } else {
          toast.error(artistResponse.data.message);
        }
        if (albumResponse.data.code === 200) {
          setIsSingle(false);
          setAlbumList(albumResponse.data.data);
        } else {
          setIsSingle(true);
          toast.error(albumResponse.data.message);
        }
        if (songResponse.data.code === 200) {
          setAlbumId(songResponse.data.data.albumId);
          setArtistId(songResponse.data.data.artistId);
          setDescription(songResponse.data.data.description);
          setName(songResponse.data.data.name);
          setImageUrl(songResponse.data.data.image);
        } else {
          toast.error(albumResponse.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData().then();
  }, []);

  const handleSongNameChange = (e) => {
    setName(e.target.value);
  }

  const handleSongDescChange = (e) => {
    setDescription(e.target.value);
  }

  const handleAlbumChange = (e) => {
    setAlbumId(e.target.value);
  }

  const handleArtistChange = (e) => {
    setArtistId(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (albumId > 0) {
      setIsSingle(false);
    }
    let data = {
      id,
      name,
      description,
      albumId,
      artistId,
      isSingle
    };
    if (image) {
      data.imageName = imageName;
    }
    if (song) {
      data.audioName = audioName;
    }
    try {
      await songService.addSong('/song/updateSong', data)
        .then(response => {
          if (response.data.code === 200) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        })
    } catch (error) {
      toast.error('服务端异常');
    }
  }

  const handleUploadAudio = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setSong(e.target.files[0]);
    } else {
      errorMsg("请上传音频");
    }
    e.target.value = '';
  }

  useEffect(() => {
    const upload = async () => {
      if (song) {
        try {
          await songService.uploadFile('song/uploadAudio', song)
            .then(response => {
              if (response.data.code === 200) {
                succeedMsg("上传成功");
                setAudioUrl(URL.createObjectURL(song));
                setAudioName(response.data.data);
              } else {
                errorMsg("请重新上传视频");
              }
            });
        } catch (error) {
          errorMsg("上传超时");
          console.error(error);
        }
      }
    }
    upload().then();
  }, [song]);

  const handleUploadImage = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      console.error("请上传图像");
    }
    e.target.value = '';
  }

  useEffect(() => {
    const upload = async () => {
      if (image) {
        try {
          await songService.uploadFile('song/uploadImage', image)
            .then(response => {
              if (response.data.code === 200) {
                setImageName(response.data.data);
                setImageUrl(URL.createObjectURL(image));
                succeedMsg("上传成功");
              } else {
                errorMsg("请重新上传视频");
              }
            })
        } catch (error) {
          toast.error("服务端异常")
          console.error(error);
        }
      }
    }
    upload().then();
  }, [image]);

  const succeedMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  const errorMsg = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    })
  }

  return (
    <form onSubmit={ handleSubmit } className={ 'flex flex-col items-start gap-8 text-gray-600' }>
      <div className={ 'flex gap-8' }>
        <div className={ 'flex flex-col gap-4' }>
          <p>上传歌曲</p>
          <input onChange={ handleUploadAudio } type={ 'file' } id={ 'song' } accept={ 'audio/*' } hidden/>
          <label htmlFor={ 'song' }>
            {
              audioUrl
                ? <audio controls>
                  <source src={ audioUrl } type="audio/mpeg"/>
                </audio>
                : <img className={ 'w-40 cursor-pointer' } src={ assets.upload_song } alt={ '' }/>
            }
          </label>
        </div>
        <div className={ 'flex flex-col gap-4' }>
          <p>Upload image</p>
          <input onChange={ handleUploadImage } type={ 'file' } id={ 'image' } accept={ 'image/*' } hidden/>
          <label htmlFor={ 'image' }>
            {
              imageUrl
                ? <img className={ 'w-40 cursor-pointer' } src={ imageUrl } alt={ '' }/>
                : <img className={ 'w-40 cursor-pointer' } src={ assets.upload_area } alt={ '' }/>
            }
          </label>
        </div>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>曲名</p>
        <input className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw]' }
               placeholder={ 'Type here' } type={ 'text' } required value={name}
               onChange={ handleSongNameChange }/>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>歌曲描述</p>
        <input className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw]' }
               placeholder={ 'Type here' } type={ 'text' } required value={description}
               onChange={ handleSongDescChange }/>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>艺术家</p>
        <select
          onChange={ handleArtistChange }
          value={ artistId }
          className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]' }>
          <option value={''}>请选择艺术家</option>
          {
            artistList.map((artist) => (
              <option key={ artist.id } value={ artist.id }>
                { artist.name }
              </option>
            ))
          }
        </select>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>专辑</p>
        <select
          onChange={ handleAlbumChange }
          value={ albumId }
          className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]' }>
          <option value={''} >请选择专辑</option>
          {
            albumList.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))
          }
        </select>
      </div>
      <button type={ 'submit' } className={ 'text-base bg-black text-white py-2.5 px-14 cursor-pointer' }>
        Submit
      </button>
    </form>
  )
};

export default UpdateSong;
