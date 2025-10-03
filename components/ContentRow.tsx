import React, { useRef, useCallback } from 'react';
import { Media } from '../types.ts';
import PosterCard from './PosterCard.tsx';
import Spinner from './Spinner.tsx';

interface ContentRowProps {
  title: string;
  media: Media[];
  loading: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
}

const ContentRow: React.FC<ContentRowProps> = ({ title, media, loading, onLoadMore, hasMore, loadingMore }) => {
  const observer = useRef<IntersectionObserver>();
  // FIX: Explicitly type the node parameter to help TypeScript's type inference inside the callback.
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, onLoadMore]);

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
        {media.map((item, index) => {
          if (media.length === index + 1) {
            return (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 w-40 md:w-48" ref={lastElementRef}>
                <PosterCard media={item} />
              </div>
            );
          } else {
            return (
              <div key={`${item.id}-${index}`} className="flex-shrink-0 w-40 md:w-48">
                <PosterCard media={item} />
              </div>
            );
          }
        })}
        {loadingMore && (
          <div className="flex-shrink-0 w-40 md:w-48 flex justify-center items-center">
            <Spinner small={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentRow;