import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {

    const currentYear = new Date().getFullYear();

  return (
    <div className='container px-4 2xl:px-20 mx-auto gap-4 py-3 flex justify-between mt-20 items-center mb-5'>
        <img width={160} src={assets.logo} alt="" />
        <p className='flex-1 border-1 border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden text-center'>Copyright © {currentYear} | All right reserved</p>
        <div className='flex gap-4'>
            <img width={38} src={assets.facebook_icon} alt="" />
            <img width={38} src={assets.twitter_icon} alt="" />
            <img width={38} src={assets.instagram_icon} alt="" />
        </div>
    </div>
  )
}

export default Footer