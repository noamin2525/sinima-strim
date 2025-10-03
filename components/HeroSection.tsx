import React from 'react';
import { Media } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import { PlayIcon, StarIcon } from './icons';

interface HeroSectionProps {
  media: Media | null;
  onSelect: (media: Media) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ media, onSelect }) => {
  if (!media) {
    return <div className="h-[60vh] bg-gray-800 animate-pulse"></div>;
  }

  const backdropUrl = media.backdrop_path ? `${IMAGE_BASE_URL}original${media.backdrop_path}` : '';
  const stremioLink = `https://web.stremio.com/#/detail/${media.media_type}/tmdb:${media.id}`;

  return (
    <div 
      className="h-[60vh] md:h-[80vh] bg-cover bg-center relative" 
      style={{ backgroundImage: `url(${backdropUrl})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent"></div>
      
      <div className="relative z-10 flex flex-col justify-end h-full p-4 md:p-12 text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-lg">{media.title || media.name}</h1>
        <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="mr-2 font-semibold">{media.vote_average.toFixed(1)}</span>
            </div>
            <span className="text-gray-300">{(media.release_date || media.first_air_date)?.substring(0, 4)}</span>
        </div>
        <p className="max-w-xl text-gray-200 mb-6 drop-shadow-md hidden md:block">{media.overview}</p>
        <div className="flex space-x-4">
          <a
            href={stremioLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            <PlayIcon className="w-6 h-6 mr-2" />
            צפה עכשיו
          </a>
          <button 
            onClick={() => onSelect(media)}
            className="flex items-center justify-center bg-gray-700/50 hover:bg-gray-600/70 backdrop-blur-sm text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
          >
            מידע נוסף
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;