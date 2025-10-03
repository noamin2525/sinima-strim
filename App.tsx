import React, { useState, useEffect, useCallback } from 'react';
import { Media, MediaType } from './types';
import * as tmdbService from './services/tmdbService';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import ContentRow from './components/ContentRow';
import DetailModal from './components/DetailModal';
import SearchBar from './components/SearchBar';
import PosterCard from './components/PosterCard';
import Spinner from './components/Spinner';
import Addons from './components/Addons';

interface MediaState {
    trending: Media[];
    popularMovies: Media[];
    popularTV: Media[];
    topRatedMovies: Media[];
    topRatedTV: Media[];
}

const App: React.FC = () => {
    const [media, setMedia] = useState<MediaState>({
        trending: [],
        popularMovies: [],
        popularTV: [],
        topRatedMovies: [],
        topRatedTV: [],
    });
    const [loading, setLoading] = useState(true);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Media[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [currentView, setCurrentView] = useState('home');

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [trending, popularMovies, popularTV, topRatedMovies, topRatedTV] = await Promise.all([
                    tmdbService.getTrending(),
                    tmdbService.getPopular(MediaType.Movie),
                    tmdbService.getPopular(MediaType.TV),
                    tmdbService.getTopRated(MediaType.Movie),
                    tmdbService.getTopRated(MediaType.TV),
                ]);
                setMedia({ trending, popularMovies, popularTV, topRatedMovies, topRatedTV });
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleSearch = useCallback(async (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            return;
        }
        try {
            setSearchLoading(true);
            const results = await tmdbService.searchMedia(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Failed to perform search", error);
        } finally {
            setSearchLoading(false);
        }
    }, []);

    const handleSelectMedia = (mediaItem: Media) => {
        setSelectedMedia(mediaItem);
    };

    const handleCloseModal = () => {
        setSelectedMedia(null);
    };

    const heroMedia = media.trending[0] || null;

    const renderContent = () => {
        if (searchQuery) {
            return (
                <div className="p-4 md:p-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-200">
                        תוצאות חיפוש עבור "{searchQuery}"
                    </h2>
                    {searchLoading ? <div className="h-64"><Spinner/></div> :
                     searchResults.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {searchResults.map(item => (
                                <PosterCard key={item.id} media={item} />
                            ))}
                        </div>
                    ) : (
                        <p>לא נמצאו תוצאות.</p>
                    )}
                </div>
            );
        }

        switch (currentView) {
            case 'movies':
                return (
                    <div className="p-4 md:p-8">
                        <h1 className="text-4xl font-black mb-4 text-white">סרטים</h1>
                        <ContentRow title="סרטים פופולריים" media={media.popularMovies} loading={loading} />
                        <ContentRow title="סרטים עם דירוג גבוה" media={media.topRatedMovies} loading={loading} />
                    </div>
                );
            case 'tv':
                 return (
                    <div className="p-4 md:p-8">
                        <h1 className="text-4xl font-black mb-4 text-white">סדרות</h1>
                        <ContentRow title="סדרות פופולריות" media={media.popularTV} loading={loading} />
                        <ContentRow title="סדרות עם דירוג גבוה" media={media.topRatedTV} loading={loading} />
                    </div>
                );
            case 'addons':
                return <Addons />;
            case 'home':
            default:
                return (
                    <>
                        <HeroSection media={heroMedia} onSelect={handleSelectMedia}/>
                        <ContentRow title="הפופולריים השבוע" media={media.trending} loading={loading} />
                        <ContentRow title="סרטים פופולריים" media={media.popularMovies} loading={loading} />
                        <ContentRow title="סדרות פופולריות" media={media.popularTV} loading={loading} />
                        <ContentRow title="סרטים עם דירוג גבוה" media={media.topRatedMovies} loading={loading} />
                        <ContentRow title="סדרות עם דירוג גבוה" media={media.topRatedTV} loading={loading} />
                    </>
                );
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1">
                <header className="sticky top-0 z-20 p-4 bg-gray-900/80 backdrop-blur-sm flex justify-center">
                    <SearchBar onSearch={handleSearch} />
                </header>

                <div className="overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
            {selectedMedia && <DetailModal media={selectedMedia} onClose={handleCloseModal} />}
        </div>
    );
};

export default App;