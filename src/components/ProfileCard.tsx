import React from 'react';
import Image from 'next/image';

interface ProfileCardProps {
  name: string;
  designation: string;
  mobile: string;
  imageUrl?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, designation, mobile, imageUrl }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative z-10 flex flex-col items-center">
        {imageUrl ? (
          <div className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-900">
            <Image
              src={imageUrl}
              alt={name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-3xl font-bold text-white">
            {name.charAt(0)}
          </div>
        )}
        
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-white">{name}</h3>
        <p className="mb-3 text-sm font-medium text-blue-600 dark:text-blue-400">{designation}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{mobile}</p>
        
        <button 
          className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
          onClick={() => window.location.href = `tel:${mobile}`}
        >
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default ProfileCard; 