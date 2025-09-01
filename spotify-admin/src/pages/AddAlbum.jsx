import React, { useEffect } from 'react';
import { assets } from '../assets/assets.js';
import { toast } from 'react-toastify';
import albumService from '../api/albumService.js';
import artistService from '../api/artistService.js';

const AddAlbum = () => {

  const [coverUrl, setCoverUrl] = React.useState('');
  const [name, setName] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [backgroundColor, setColor] = React.useState('');
  const [artistId, setArtistId] = React.useState('');
  const [artistList, setArtistList] = React.useState([]);
  const [coverName, setCoverName] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
          const artistResponse = await artistService.getAllArtists('/artist/getAllArtists');
        if (artistResponse.data.code === 200) {
          setArtistList(artistResponse.data.data);
        } else {
          toast.error(artistResponse.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData().then();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      artistId,
      description,
      backgroundColor,
      coverName
    };
    try {
      await albumService.addAlbum('/album/addAlbum', data)
        .then(response => {
          if (response.data.code === 200) {
            toast.success(response.data.message);
          } else {
            toast.error(response.data.message);
          }
        })
    } catch (error) {
      console.log(error);
      toast.error("服务端异常");
    }
  }

  const handleUploadCover = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverUrl(e.target.files[0]);
    } else {
      console.error("请上传封面");
    }
    e.target.value = '';
  }

  useEffect(() => {
    const upload = async () => {
      if (coverUrl) {
        try {
          await albumService.uploadCover('album/uploadCover', coverUrl)
            .then(response => {
              if (response.data.code === 200) {
                setCoverName(response.data.data);
                setImageUrl(URL.createObjectURL(coverUrl));
                toast.success('上传成功');
              } else {
                toast.error(response.data.message);
              }
            }).catch(error => {
              toast.error(error);
            })
        } catch (error) {
          console.error(error);
        }
      }
    }
    upload().then();
  }, [coverUrl]);

  return (
    <form onSubmit={ handleSubmit } className={ 'flex flex-col items-start gap-8 text-gray-600' }>
      <div className={ 'flex flex-col gap-4' }>
        <p>上传封面</p>
        <input onChange={ handleUploadCover } type={ 'file' } id={ 'image' } accept={ 'image/*' } hidden/>
        <label htmlFor={ 'image' }>
          <img className={ 'w-40 cursor-pointer' } src={ imageUrl ? imageUrl : assets.upload_area } alt={ '' }/>
        </label>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>专辑名</p>
        <input className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw]' } type={ 'text' } required
               placeholder={ '在此填入专辑名' } onChange={(e) => { setName(e.target.value )}} />
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>专辑描述</p>
        <input className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw]' } type={ 'text' } required
               placeholder={ '在此填入专辑描述' } onChange={(e) => { setDescription(e.target.value )}} />
      </div>
      <div className={ 'flex flex-col gap-3' }>
        <p>背景颜色</p>
        <input onChange={(e) => { setColor(e.target.value) }} type={ 'color' }/>
      </div>
      <div className={ 'flex flex-col gap-2.5' }>
        <p>艺术家</p>
        <select
          onChange={(e) => { setArtistId(e.target.value); } }
          value={ artistId }
          className={ 'bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]' }>
          <option value={ '' }>请选择艺术家</option>
          {
            artistList.map((artist) => (
              <option key={ artist.id } value={ artist.id }>
                { artist.name }
              </option>
            ))
          }
        </select>
      </div>
      <button className={ 'text-base bg-black text-white py-2.5 px-14 cursor-pointer' } type={ 'submit' }>提交</button>
    </form>
  );
};

export default AddAlbum;
