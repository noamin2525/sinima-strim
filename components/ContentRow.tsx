import React from 'react';
import { Media } from '../types.ts';
import PosterCard from './PosterCard.tsx';
import Spinner from './Spinner.tsx';

interface ContentRowProps {
  title: string;
  media: Media[];
  loading: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, media, loading }) => {
  if (loading) {
    return (
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4 px-4 md:px-8 text-gray-200">{title}</h2>
        <div className="h-64 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!media || media.length === 0) {
    return null;
  }
  
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 px-4 md:px-8 text-gray-200">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 px-4 md:px-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {media.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-40 md:w-48">
            <PosterCard media={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentRow;