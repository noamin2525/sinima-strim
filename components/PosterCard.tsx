import React from 'react';
import { Media } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import { StarIcon } from './icons';

interface PosterCardProps {
  media: Media;
}

const PosterCard: React.FC<PosterCardProps> = ({ media }) => {
  const imageUrl = media.poster_path
    ? `${IMAGE_BASE_URL}w500${media.poster_path}`
    : 'https://picsum.photos/500/750';

  // Construct the Stremio deep link
  const stremioLink = `https://web.stremio.com/#/detail/${media.media_type}/tmdb:${media.id}`;

  return (
    <a 
      href={stremioLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 block"
    >
      <img src={imageUrl} alt={media.title || media.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-bold text-lg text-white drop-shadow-md">{media.title || media.name}</h3>
        <div className="flex items-center mt-1">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-white text-sm ml-1">{media.vote_average.toFixed(1)}</span>
        </div>
      </div>
    </a>
  );
};

export default PosterCard;