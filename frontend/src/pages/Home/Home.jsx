import React from 'react';
import Header from '../../components/Header/Header';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const Home = () => {
  return (
    <main>
        <Header />
        <Outlet />
        <ToastContainer/>
    </main>
  )
}

export default Home
