// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext.jsx';

const Sidebar = () => {

  const { playlistData } = useContext(PlayerContext);

  const navigate = useNavigate()

  return (
    <div className={ 'w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex' }>
      <div className={ 'bg-[#121212] h-[15%] rounded flex flex-col justify-around' }>
        <div onClick={ () => navigate('/') } className={ 'flex items-center gap-3 pl-8 cursor-pointer' }>
          <img className={ 'w-6' } src={ assets.home_icon } alt=''/>
          <p className={ 'font-bold' }>Home</p>
        </div>
        <div className={ 'flex items-center gap-3 pl-8 cursor-pointer' }>
          <img className={ 'w-6' } src={ assets.search_icon } alt=''/>
          <p className={ 'font-bold' }>Search</p>
        </div>
      </div>
      <div className={ 'bg-[#121212] h-[85%] rounded' }>
        <div className={ 'p-4 flex items-center justify-between' }>
          <div className={ 'flex items-center gap-3' }>
            <img className={ 'w-8' } src={ assets.stack_icon } alt=''/>
            <p className={ 'font-semibold' }>Your Library</p>
          </div>
          <div className={ 'flex items-center gap-3' }>
            <img className={ 'w-5' } src={ assets.arrow_icon } alt=''/>
            <img className={ 'w-5' } src={ assets.plus_icon } alt=''/>
          </div>
        </div>
        <div
          onClick={() => navigate(`/playlist/${playlistData.id}`)}
          className={ 'p-4 m-2 rounded font-semibold flex flex-row items-start justify-start gap-1 pl-4 h-[15%] cursor-pointer' }>
          <img className={ 'rounded object-contain h-full' } alt={ '' } src={ playlistData.cover }/>
          <div className={'ml-4'}>
            <p >{ playlistData.name }</p>
            <p className={'mt-5'}>歌单 Nuwanda</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
