import React, { useState, useEffect, useCallback } from 'react';
import { Media, MediaType, Genre } from './types.ts';
import * as tmdbService from './services/tmdbService.ts';
import Sidebar from './components/Sidebar.tsx';
import HeroSection from './components/HeroSection.tsx';
import ContentRow from './components/ContentRow.tsx';
import DetailModal from './components/DetailModal.tsx';
import SearchBar from './components/SearchBar.tsx';
import PosterCard from './components/PosterCard.tsx';
import Spinner from './components/Spinner.tsx';
import Addons from './components/Addons.tsx';
import GenreFilter from './components/GenreFilter.tsx';

interface PaginatedMedia {
    results: Media[];
    page: number;
    totalPages: number;
    loadingMore: boolean;
}

interface MediaState {
    trending: Media[];
    popularMovies: PaginatedMedia;
    popularTV: PaginatedMedia;
    topRatedMovies: PaginatedMedia;
    topRatedTV: PaginatedMedia;
}

interface GenreState {
    movieGenres: Genre[];
    tvGenres: Genre[];
}

interface SelectedGenreState {
    movie: Genre | null;
    tv: Genre | null;
}

const initialPaginatedMedia: PaginatedMedia = {
    results: [],
    page: 0,
    totalPages: 1,
    loadingMore: false,
};

const App: React.FC = () => {
    const [media, setMedia] = useState<MediaState>({
        trending: [],
        popularMovies: { ...initialPaginatedMedia },
        popularTV: { ...initialPaginatedMedia },
        topRatedMovies: { ...initialPaginatedMedia },
        topRatedTV: { ...initialPaginatedMedia },
    });
    const [genres, setGenres] = useState<GenreState>({ movieGenres: [], tvGenres: [] });
    const [selectedGenre, setSelectedGenre] = useState<SelectedGenreState>({ movie: null, tv: null });
    
    const [loading, setLoading] = useState(true);
    const [viewLoading, setViewLoading] = useState(false);
    
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Media[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [currentView, setCurrentView] = useState('home');

    type MediaCategory = 'popularMovies' | 'popularTV' | 'topRatedMovies' | 'topRatedTV';

    const loadMore = useCallback(async (category: MediaCategory) => {
        const categoryState = media[category];
        if (categoryState.loadingMore || categoryState.page >= categoryState.totalPages) {
            return;
        }

        setMedia(prev => ({
            ...prev,
            [category]: { ...prev[category], loadingMore: true }
        }));

        try {
            const mediaType = category.includes('Movies') ? MediaType.Movie : MediaType.TV;
            const fetchFunction = category.includes('popular') ? tmdbService.getPopular : tmdbService.getTopRated;
            
            const genreId = mediaType === MediaType.Movie ? selectedGenre.movie?.id : selectedGenre.tv?.id;
            const nextPage = categoryState.page + 1;
            const data = await fetchFunction(mediaType, nextPage, genreId);

            setMedia(prev => ({
                ...prev,
                [category]: {
                    results: [...prev[category].results, ...data.results],
                    page: data.page,
                    totalPages: data.total_pages,
                    loadingMore: false
                }
            }));
        } catch (error) {
            console.error(`Failed to load more for ${category}`, error);
            setMedia(prev => ({
                ...prev,
                [category]: { ...prev[category], loadingMore: false }
            }));
        }
    }, [media, selectedGenre.movie, selectedGenre.tv]);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);
                const [
                    trending, popularMoviesRes, popularTVRes, 
                    topRatedMoviesRes, topRatedTVRes, movieGenresData, tvGenresData
                ] = await Promise.all([
                    tmdbService.getTrending(),
                    tmdbService.getPopular(MediaType.Movie, 1),
                    tmdbService.getPopular(MediaType.TV, 1),
                    tmdbService.getTopRated(MediaType.Movie, 1),
                    tmdbService.getTopRated(MediaType.TV, 1),
                    tmdbService.getGenres(MediaType.Movie),
                    tmdbService.getGenres(MediaType.TV)
                ]);
                setMedia({
                    trending,
                    popularMovies: { results: popularMoviesRes.results, page: popularMoviesRes.page, totalPages: popularMoviesRes.total_pages, loadingMore: false },
                    popularTV: { results: popularTVRes.results, page: popularTVRes.page, totalPages: popularTVRes.total_pages, loadingMore: false },
                    topRatedMovies: { results: topRatedMoviesRes.results, page: topRatedMoviesRes.page, totalPages: topRatedMoviesRes.total_pages, loadingMore: false },
                    topRatedTV: { results: topRatedTVRes.results, page: topRatedTVRes.page, totalPages: topRatedTVRes.total_pages, loadingMore: false },
                });
                setGenres({ movieGenres: movieGenresData.genres, tvGenres: tvGenresData.genres });
            } catch (error) {
                console.error("Failed to fetch initial data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (currentView !== 'movies' || loading) return;

        const fetchMovieData = async () => {
            setViewLoading(true);
            try {
                const genreId = selectedGenre.movie?.id;
                const [popularMoviesRes, topRatedMoviesRes] = await Promise.all([
                    tmdbService.getPopular(MediaType.Movie, 1, genreId),
                    tmdbService.getTopRated(MediaType.Movie, 1, genreId),
                ]);
                setMedia(prev => ({ 
                    ...prev, 
                    popularMovies: { results: popularMoviesRes.results, page: 1, totalPages: popularMoviesRes.total_pages, loadingMore: false },
                    topRatedMovies: { results: topRatedMoviesRes.results, page: 1, totalPages: topRatedMoviesRes.total_pages, loadingMore: false }
                }));
            } catch (error) {
                console.error("Failed to fetch movies by genre", error);
            } finally {
                setViewLoading(false);
            }
        };
        fetchMovieData();
    }, [selectedGenre.movie, currentView, loading]);

    useEffect(() => {
        if (currentView !== 'tv' || loading) return;

        const fetchTvData = async () => {
            setViewLoading(true);
            try {
                const genreId = selectedGenre.tv?.id;
                const [popularTVRes, topRatedTVRes] = await Promise.all([
                    tmdbService.getPopular(MediaType.TV, 1, genreId),
                    tmdbService.getTopRated(MediaType.TV, 1, genreId),
                ]);
                setMedia(prev => ({ 
                    ...prev, 
                    popularTV: { results: popularTVRes.results, page: 1, totalPages: popularTVRes.total_pages, loadingMore: false },
                    topRatedTV: { results: topRatedTVRes.results, page: 1, totalPages: topRatedTVRes.total_pages, loadingMore: false }
                }));
            } catch (error) {
                console.error("Failed to fetch tv shows by genre", error);
            } finally {
                setViewLoading(false);
            }
        };
        fetchTvData();
    }, [selectedGenre.tv, currentView, loading]);

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

    const handleSelectMovieGenre = (genre: Genre | null) => {
        setSelectedGenre(prev => ({ ...prev, movie: genre }));
    }
    
    const handleSelectTvGenre = (genre: Genre | null) => {
        setSelectedGenre(prev => ({ ...prev, tv: genre }));
    }

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
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                            <h1 className="text-4xl font-black text-white">סרטים</h1>
                            <GenreFilter 
                                genres={genres.movieGenres} 
                                selectedGenre={selectedGenre.movie} 
                                onSelectGenre={handleSelectMovieGenre} 
                            />
                        </div>
                        <ContentRow title="סרטים פופולריים" media={media.popularMovies.results} loading={viewLoading} hasMore={media.popularMovies.page < media.popularMovies.totalPages} loadingMore={media.popularMovies.loadingMore} onLoadMore={() => loadMore('popularMovies')} />
                        <ContentRow title="סרטים עם דירוג גבוה" media={media.topRatedMovies.results} loading={viewLoading} hasMore={media.topRatedMovies.page < media.topRatedMovies.totalPages} loadingMore={media.topRatedMovies.loadingMore} onLoadMore={() => loadMore('topRatedMovies')} />
                    </div>
                );
            case 'tv':
                 return (
                    <div className="p-4 md:p-8">
                        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                            <h1 className="text-4xl font-black text-white">סדרות</h1>
                             <GenreFilter 
                                genres={genres.tvGenres} 
                                selectedGenre={selectedGenre.tv} 
                                onSelectGenre={handleSelectTvGenre} 
                            />
                        </div>
                        <ContentRow title="סדרות פופולריות" media={media.popularTV.results} loading={viewLoading} hasMore={media.popularTV.page < media.popularTV.totalPages} loadingMore={media.popularTV.loadingMore} onLoadMore={() => loadMore('popularTV')} />
                        <ContentRow title="סדרות עם דירוג גבוה" media={media.topRatedTV.results} loading={viewLoading} hasMore={media.topRatedTV.page < media.topRatedTV.totalPages} loadingMore={media.topRatedTV.loadingMore} onLoadMore={() => loadMore('topRatedTV')} />
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
                        <ContentRow title="סרטים פופולריים" media={media.popularMovies.results} loading={loading} hasMore={media.popularMovies.page < media.popularMovies.totalPages} loadingMore={media.popularMovies.loadingMore} onLoadMore={() => loadMore('popularMovies')} />
                        <ContentRow title="סדרות פופולריות" media={media.popularTV.results} loading={loading} hasMore={media.popularTV.page < media.popularTV.totalPages} loadingMore={media.popularTV.loadingMore} onLoadMore={() => loadMore('popularTV')} />
                        <ContentRow title="סרטים עם דירוג גבוה" media={media.topRatedMovies.results} loading={loading} hasMore={media.topRatedMovies.page < media.topRatedMovies.totalPages} loadingMore={media.topRatedMovies.loadingMore} onLoadMore={() => loadMore('topRatedMovies')} />
                        <ContentRow title="סדרות עם דירוג גבוה" media={media.topRatedTV.results} loading={loading} hasMore={media.topRatedTV.page < media.topRatedTV.totalPages} loadingMore={media.topRatedTV.loadingMore} onLoadMore={() => loadMore('topRatedTV')} />
                    </>
                );
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-900">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1">
                <header className="sticky top-0 z-20 p-4 bg-gray-900/80 backdrop-blur-sm flex justify-between items-center gap-8">
                    <h1 className="text-white text-2xl font-black flex-shrink-0">
                        CineStream
                    </h1>
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
