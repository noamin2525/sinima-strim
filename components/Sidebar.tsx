import React from 'react';
import { HomeIcon, MovieIcon, TvIcon, AddonIcon } from './icons';

interface SidebarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
    return (
        <nav className="w-64 bg-gray-900/70 backdrop-blur-lg p-4 flex-shrink-0 border-l border-gray-800 h-screen sticky top-0">
            <div className="text-white text-2xl font-black mb-10 px-4 py-2">
                CineStream
            </div>
            <div className="space-y-2">
                <NavItem icon={<HomeIcon />} label="בית" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
                <NavItem icon={<MovieIcon />} label="סרטים" isActive={currentView === 'movies'} onClick={() => setCurrentView('movies')} />
                <NavItem icon={<TvIcon />} label="סדרות" isActive={currentView === 'tv'} onClick={() => setCurrentView('tv')} />
                <NavItem icon={<AddonIcon />} label="תוספים" isActive={currentView === 'addons'} onClick={() => setCurrentView('addons')} />
            </div>
        </nav>
    );
};

export default Sidebar;