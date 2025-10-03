import React, { useEffect, useState } from 'react';
import { Media, MediaDetails } from '../types.ts';
import { IMAGE_BASE_URL } from '../constants.ts';
import { CloseIcon, PlayIcon, StarIcon } from './icons.tsx';
import { getMediaDetails } from '../services/tmdbService.ts';
import Spinner from './Spinner.tsx';

interface DetailModalProps {
  media: Media;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ media, onClose }) => {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (media.media_type !== 'movie' && media.media_type !== 'tv') return;
      try {
        setLoading(true);
        const data = await getMediaDetails(media.media_type, media.id);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [media]);

  const backdropUrl = details?.backdrop_path ? `${IMAGE_BASE_URL}original${details.backdrop_path}` : (media.backdrop_path ? `${IMAGE_BASE_URL}original${media.backdrop_path}` : '');
  const title = details?.title || media.title || details?.name || media.name;
  const releaseYear = (details?.release_date || media.release_date || details?.first_air_date || media.first_air_date)?.substring(0, 4);
  
  // Fix: Stremio uses 'series' for TV shows, not 'tv'.
  const stremioMediaType = media.media_type === 'tv' ? 'series' : media.media_type;
  const stremioLink = `https://web.stremio.com/#/detail/${stremioMediaType}/tmdb:${media.id}`;

  const getRuntime = () => {
    if(!details) return '';
    const runtime = details.runtime || (details.episode_run_time && details.episode_run_time[0]);
    if (!runtime) return '';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m`;
  }
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gray-900 rounded-lg overflow-hidden shadow-xl w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl max-h-[90vh] relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-white z-20 bg-black/50 rounded-full p-2 hover:bg-black/80 transition-colors">
          <CloseIcon />
        </button>

        {loading ? (
            <div className="h-96"><Spinner /></div>
        ) : (
          <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <div className="relative">
              <img src={backdropUrl} alt={title} className="w-full h-48 md:h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-8">
                <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg">{title}</h1>
              </div>
            </div>

            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-6">
                <div className="flex items-center space-x-4 text-gray-300">
                    <div className="flex items-center text-lg">
                        <StarIcon className="w-5 h-5 text-yellow-400" />
                        <span className="font-bold text-white mr-2">{details?.vote_average.toFixed(1)}</span>
                    </div>
                    <span>{releaseYear}</span>
                    <span>{getRuntime()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {details?.genres.map(genre => (
                        <span key={genre.id} className="bg-gray-800 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">{genre.name}</span>
                    ))}
                </div>
              </div>

              <p className="text-gray-300 mb-6">{details?.overview || media.overview}</p>
              
              {details?.tagline && <p className="text-gray-400 italic mb-6">"{details.tagline}"</p>}

              <a 
                href={stremioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 text-lg"
              >
                <PlayIcon className="w-6 h-6 ml-2" />
                צפה עכשיו
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailModal;