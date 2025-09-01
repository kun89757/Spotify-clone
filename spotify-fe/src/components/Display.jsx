import React, { useContext, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome.jsx';
import DisplayAlbum from './DisplayAlbum.jsx';
import { PlayerContext } from '../context/PlayerContext.jsx';
import DisplayPlaylist from './DisplayPlaylist.jsx';

const Display = () => {

  const { albumsData } = useContext(PlayerContext);
  const displayRef = React.useRef();
  const location = useLocation();
  const isAlbum = location.pathname.includes('album');
  const albumId = isAlbum ? location.pathname.split('/').pop() : '';
  const bgColor = isAlbum && albumsData.length > 0 ? albumsData.find(album => album.id === Number(albumId)).backgroundColor : '#121212';

  useEffect(() => {
    if (isAlbum) {
      displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
    } else {
      displayRef.current.style.background = `#121212`
    }
  });

  return (
    <div ref={displayRef} className={'w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'}>
      {
        albumsData.length > 0
        ? (
            <Routes>
              <Route path='/' element={<DisplayHome />} />
              <Route path='/album/:id' element={<DisplayAlbum album={albumsData.find(album => album.id === albumId)} />} />
              <Route path='/playlist/:id' element={<DisplayPlaylist />} />
            </Routes>
          ) : null
      }
    </div>
  );
};

export default Display;
