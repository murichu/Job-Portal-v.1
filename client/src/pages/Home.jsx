import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import JobListings from '../components/JobListings';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
     <JobListings />
    </div>
  )
}

export default Home
