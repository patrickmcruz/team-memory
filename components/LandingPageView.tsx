import React from 'react';
import type { PageData } from '../types';
import { QuoteIcon } from './icons';
import { useTranslation } from '../App';

const LandingPageView: React.FC<{ data: PageData }> = ({ data }) => {
  const { t } = useTranslation();
  
  const hasMessages = data.colleagueMessages && data.colleagueMessages.filter(m => m.text.trim() || m.author.trim()).length > 0;
  const hasMedia = data.mediaItems && data.mediaItems.length > 0;

  return (
    <div className="bg-white font-sans text-slate-800 leading-relaxed">
      <style>{`
        @keyframes blob-animation {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob-animation 8s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-blob {
            animation: none;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
            animation-delay: 4s;
        }
      `}</style>
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
              {t('landingHeroTitle')}
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100 drop-shadow-lg">
              {data.recipientName || t('landingDefaultRecipient')}
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-indigo-100 drop-shadow-md">
              {data.mainMessage || t('landingDefaultMessage')}
            </p>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Messages Section */}
        {hasMessages && (
          <section className="mb-20">
            <h3 className="text-4xl font-bold text-center mb-12 text-slate-800">{t('messagesFromTheTeam')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.colleagueMessages.filter(m => m.text.trim() || m.author.trim()).map(msg => (
                <div key={msg.id} className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-xl shadow-md border border-slate-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex-shrink-0">
                    <QuoteIcon className="text-indigo-200" />
                  </div>
                  <p className="text-slate-600 italic mt-4 mb-4 flex-grow min-h-[50px]">
                    "{msg.text || t('landingMessagePlaceholder')}"
                  </p>
                  <p className="text-right font-semibold text-indigo-600 mt-2">
                    - {msg.author || t('landingAnonymousAuthor')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {hasMedia && (
          <section>
            <h3 className="text-4xl font-bold text-center mb-12 text-slate-800">{t('ourFavoriteMoments')}</h3>
            <div className="columns-2 md:columns-3 gap-4 space-y-4">
              {data.mediaItems.map(item => (
                <div key={item.id} className="overflow-hidden rounded-lg shadow-lg break-inside-avoid transform hover:scale-105 transition-transform duration-300">
                  {item.type === 'image' ? (
                    <img src={item.dataUrl} alt={item.name} className="w-full h-auto object-cover" />
                  ) : (
                    <video src={item.dataUrl} controls className="w-full h-auto" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <footer className="text-center py-16 mt-20 bg-gradient-to-t from-slate-100 to-white">
        <p className="text-slate-500 text-lg">{t('footerMessage')}</p>
        <p className="text-slate-700 font-semibold mt-2 text-xl">{t('footerSignature')}</p>
      </footer>
    </div>
  );
};

export default LandingPageView;