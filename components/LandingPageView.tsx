import React, { useState, useEffect } from 'react';
import type { PageData } from '../types';
import { QuoteIcon } from './icons';
import { useTranslation } from '../App';

const PhotoAlbum: React.FC<{ items: any[] }> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // 2x2 grid per page
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Album Book */}
      <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-lg shadow-2xl p-8 border-4 border-emerald-200" style={{ perspective: '2000px' }}>
        {/* Book Spine Effect */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-l-lg shadow-inner"></div>
        
        {/* Page Content */}
        <div className="ml-4">
          <div className="grid grid-cols-2 gap-6 min-h-[500px]">
            {getCurrentPageItems().map((item, index) => (
              <div key={item.id} className="relative bg-white p-3 rounded shadow-lg transform hover:scale-105 transition-all duration-300" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-white transform rotate-1 rounded -z-10 opacity-30"></div>
                {item.type === 'image' ? (
                  <img src={item.dataUrl} alt={item.name} className="w-full h-56 object-cover rounded" />
                ) : (
                  <video src={item.dataUrl} controls className="w-full h-56 object-cover rounded" />
                )}
                <div className="mt-2 text-center">
                  <div className="h-px bg-emerald-300 w-3/4 mx-auto"></div>
                  <p className="text-xs text-slate-500 mt-1 font-handwriting italic">{item.name}</p>
                </div>
              </div>
            ))}
            {/* Empty slots for incomplete pages */}
            {getCurrentPageItems().length < itemsPerPage && 
              Array.from({ length: itemsPerPage - getCurrentPageItems().length }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-emerald-50/30 rounded border-2 border-dashed border-emerald-200"></div>
              ))
            }
          </div>

          {/* Page Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold disabled:bg-emerald-300 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>

            <div className="text-center">
              <p className="text-sm text-emerald-900 font-semibold">
                Página {currentPage + 1} de {totalPages}
              </p>
              <div className="flex gap-1 mt-2 justify-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentPage ? 'bg-emerald-800 w-6' : 'bg-emerald-300 hover:bg-emerald-600'
                    }`}
                    aria-label={`Ir para página ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-800 text-white rounded-lg font-semibold disabled:bg-emerald-300 disabled:cursor-not-allowed hover:bg-emerald-900 transition-colors shadow-md"
            >
              Próxima
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg opacity-50"></div>
      </div>
    </div>
  );
};

const LandingPageView: React.FC<{ data: PageData }> = ({ data }) => {
  const { t } = useTranslation();
  const [teamName, setTeamName] = useState<string>('');
  
  useEffect(() => {
    try {
      const tn = localStorage.getItem('team-memory:teamName') || '';
      setTeamName(tn);
    } catch (e) {
      /* ignore */
    }
  }, []);
  
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
      <header className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        </div>
        <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-lg">
              {data.recipientGender === 'female' ? t('landingHeroTitleFemale') : t('landingHeroTitleMale')}
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-100 to-white drop-shadow-lg">
              {data.recipientName || t('landingDefaultRecipient')}
            </h2>
            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-emerald-50 drop-shadow-md">
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
                <div key={msg.id} className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-xl shadow-md border border-emerald-100 flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex-shrink-0">
                    <QuoteIcon className="text-emerald-200" />
                  </div>
                  <p className="text-slate-600 italic mt-4 mb-4 flex-grow min-h-[50px]">
                    "{msg.text || t('landingMessagePlaceholder')}"
                  </p>
                  <p className="text-right font-semibold text-emerald-700 mt-2">
                    - {msg.author || t('landingAnonymousAuthor')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery Section - Photo Album */}
        {hasMedia && (
          <section>
            <h3 className="text-4xl font-bold text-center mb-12 text-slate-800">{t('ourFavoriteMoments')}</h3>
            <PhotoAlbum items={data.mediaItems} />
          </section>
        )}

      </main>

      <footer className="text-center py-16 mt-20 bg-gradient-to-t from-slate-100 to-white">
        <p className="text-slate-500 text-lg">{t('footerMessage')}</p>
        <p className="text-slate-700 font-semibold mt-2 text-xl">{teamName || t('footerSignature')}</p>
      </footer>
    </div>
  );
};

export default LandingPageView;