import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JobListings from '../components/JobListings';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
     <JobListings />
     <AppDownload />
     <Footer />
    </div>
  )
}

export default Home
