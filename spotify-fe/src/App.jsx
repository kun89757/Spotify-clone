import './App.css'
import Sidebar from './components/Sidebar.jsx';
import Player from './components/Player.jsx';
import Display from './components/Display.jsx';
import React, { useContext, useEffect } from 'react';
import { PlayerContext } from './context/PlayerContext.jsx';
import Login from './pages/Login.jsx';

function App() {

  const { audioRef, track, songsData } = useContext(PlayerContext);
  const [ isLogged, setLoggedIn ] = React.useState(false);

  useEffect(() => {
    if (localStorage.getItem('token') || localStorage.getItem('accessToken')) {
      setLoggedIn(true);
    }
  }, [])


  return (
    <>
      <div className={'h-screen  bg-gradient-to-b from-gray-800 to-black'}>
        {
          !isLogged ? (
            <Login />
          ) : (
            <>
              {
                songsData.length > 0
                  ? <>
                    <div className={ 'h-[90%] flex' }>
                      <Sidebar/>
                      <Display/>
                    </div>
                    <Player/>
                    {/*<SpotifyPlayer />*/}
                  </>
                  : null
              }
            </>
          )
        }

        <audio ref={ audioRef } src={ track ? track.playUrl : null } preload={ 'auto' }></audio>
      </div>
    </>
  )
}

export default App
