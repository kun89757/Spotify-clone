import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Route, Routes } from 'react-router-dom';
import AddSong from './pages/AddSong.jsx';
import AddAlbum from './pages/AddAlbum.jsx';
import ListSong from './pages/ListSong.jsx';
import ListAlbum from './pages/ListAlbum.jsx';
import Sidebar from './components/Sidebar.jsx';
import Navbar from './components/Navbar.jsx';
import UpdateAlbum from './pages/UpdateAlbum.jsx';
import UpdateSong from './pages/UpdateSong.jsx';

const App = () => {

  return (
    <div className={'flex items-start min-h-screen'}>
      <ToastContainer />
      <Sidebar />
      <div className={'flex-1 h-screen overflow-y-scroll bg-[#F3FFF7]'}>
        <Navbar />
        <div className={'pt-8 pl-5 sm:pt-12 sm:pl-12'}>
          <Routes>
            <Route path="/" element={<AddSong />} />
            <Route path="/listSong" element={<ListSong />} />
            <Route path="/addAlbum" element={<AddAlbum />} />
            <Route path="/listAlbum" element={<ListAlbum />} />
            <Route path="/updateAlbum/:id" element={<UpdateAlbum />} />
            <Route path="/updateSong/:id" element={<UpdateSong />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
