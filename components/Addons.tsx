import React from 'react';
import { AddonIcon } from './icons';

const addons = [
    {
        name: 'Torrentio + RealDebrid',
        description: 'The most popular addon for streaming from torrents with RealDebrid.',
        url: 'stremio://torrentio.strem.fun/easydebrid=n3cgfuzhg9ptzbss/manifest.json'
    },
    {
        name: 'Wizdom Subtitles',
        description: 'Get subtitles in multiple languages.',
        url: 'stremio://4b139a4b7f94-wizdom-stremio-v2.baby-beamup.club/manifest.json'
    },
    {
        name: 'Ktuvit Subtitles',
        description: 'Hebrew subtitles from Ktuvit.',
        url: 'stremio://4b139a4b7f94-ktuvit-stremio.baby-beamup.club/manifest.json'
    },
    {
        name: 'Movie Release Dates',
        description: 'Get notified when new high-quality movie releases are available.',
        url: 'stremio://stremio7rd-movies-online-dates.vercel.app/manifest.json'
    },
    {
        name: 'Hebrew Posters & Info (TMDB)',
        description: 'Adds Hebrew posters and enables searching for content in Hebrew.',
        url: 'stremio://94c8cb9f702d-tmdb-addon.baby-beamup.club/N4IgNghgdg5grhGBTEAuEALJBaAkgGRABoQBnAFwCckIBbAS1jQG0BdEgYwnIjAHsYpFqHoATNCHK1RAIwB05PgAdikgJ5KU6WnwBu9FCSh0tIAArK4kSqtIY+Ad1xQAEn1paqcJAF8iI8XQpWQVlVXINU1IkSgMhIxMJCyUrCBsSO0dnNw80L19-EDEJYPk1GnT1TQkdfUMQY1z0AE0K23snV3dPSm8-AJLpMraSCOr0aNikeIbElpGyDuzuvN6CgaChuUhYBGRwyJq9A1VG03xoeER6zM6cnr7C4s2Qnav90cOJmLjTuZALrtru0sl0mvl+kVApItlQkFBRIwYAdxiBaicEk0QAAVagIpEgu4rVAQp7Q0oKPGIpifVGTX6Y0y4+HU5EZJZgh6+dggLgUADCfDgUHIaAArD4gA/manifest.json'
    }
];

const Addons: React.FC = () => {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-black mb-8 text-white">Install Addons</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {addons.map((addon) => (
                    <div key={addon.name} className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 flex flex-col justify-between transform transition-all duration-300 hover:scale-105 hover:border-purple-500">
                        <div>
                            <div className="flex items-center mb-3">
                                <AddonIcon className="w-8 h-8 text-purple-400 mr-4 flex-shrink-0" />
                                <h2 className="text-xl font-bold text-white">{addon.name}</h2>
                            </div>
                            <p className="text-gray-400 mb-6 min-h-[3rem]">{addon.description}</p>
                        </div>
                        <a 
                            href={addon.url}
                            className="mt-auto block text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                        >
                            Install
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Addons;