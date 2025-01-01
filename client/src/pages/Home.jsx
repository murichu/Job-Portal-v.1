import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JobListings from '../components/JobListings';
import AppDownload from '../components/AppDownload';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
     <JobListings />
     <AppDownload />
    </div>
  )
}

export default Home
