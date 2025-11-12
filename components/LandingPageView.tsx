import React, { useState, useEffect } from 'react';
import type { PageData } from '../types';
import { QuoteIcon } from './icons';
import { useTranslation } from '../App';

const PhotoAlbum: React.FC<{ items: any[] }> = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const itemsPerPage = 6; // 3x2 grid per page
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const getCurrentPageItems = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const prevPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <style>{`
        @keyframes page-flip-forward {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        @keyframes page-flip-backward {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(90deg); }
          100% { transform: rotateY(0deg); }
        }
        
        .page-flipping-forward {
          animation: page-flip-forward 0.6s ease-in-out;
        }
        
        .page-flipping-backward {
          animation: page-flip-backward 0.6s ease-in-out;
        }
        
        /* Paper texture */
        .paper-texture {
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.03) 2px,
              rgba(0,0,0,0.03) 4px
            );
        }
        
        /* Book shadow effect */
        .book-shadow {
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.3),
            inset 0 0 0 1px rgba(255,255,255,0.2),
            inset 40px 0 80px rgba(0,0,0,0.1);
        }
        
        /* Photo polaroid effect */
        .photo-polaroid {
          background: linear-gradient(to bottom, #fff 0%, #fff 85%, #f5f5f5 85%, #f5f5f5 100%);
          box-shadow: 
            0 4px 8px rgba(0,0,0,0.15),
            0 0 0 1px rgba(0,0,0,0.05);
        }
        
        .photo-polaroid:hover {
          transform: translateY(-4px) rotate(2deg);
          box-shadow: 
            0 12px 24px rgba(0,0,0,0.25),
            0 0 0 1px rgba(0,0,0,0.05);
        }
      `}</style>

      {/* Album Book with 3D effect */}
      <div 
        className="relative book-shadow rounded-r-xl overflow-hidden"
        style={{ 
          perspective: '3000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Book Cover - Left Side (Spine) */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-16 z-20"
          style={{
            background: 'linear-gradient(90deg, #064e3b 0%, #065f46 20%, #047857 50%, #065f46 80%, #064e3b 100%)',
            boxShadow: 'inset -5px 0 15px rgba(0,0,0,0.4), inset 5px 0 15px rgba(255,255,255,0.1)',
          }}
        >
          {/* Spine decorative lines */}
          <div className="absolute top-0 bottom-0 left-2 w-0.5 bg-emerald-300 opacity-30"></div>
          <div className="absolute top-0 bottom-0 right-2 w-0.5 bg-emerald-900 opacity-50"></div>
          
          {/* Book binding holes */}
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-950 shadow-inner"
              style={{ 
                top: `${10 + i * 12}%`,
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.8)'
              }}
            />
          ))}
        </div>

        {/* Book Pages - Fixed height with proper spacing */}
        <div 
          className={`ml-16 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-50 p-8 paper-texture ${
            isFlipping ? (currentPage > 0 ? 'page-flipping-backward' : 'page-flipping-forward') : ''
          }`}
          style={{
            height: '850px',
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(234, 179, 8, 0.05) 0%, transparent 50%)
            `,
          }}
        >
          {/* Page corner fold effect */}
          <div 
            className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1) 100%)',
            }}
          />
          
          {/* Page number decoration */}
          <div className="text-center pt-2 pb-4 text-emerald-800 opacity-40 font-serif text-sm">
            ~ Página {currentPage + 1} ~
          </div>
          
          {/* Photos Grid - Fixed height for consistency - 3x2 layout */}
          <div className="grid grid-cols-3 gap-6 min-h-[580px]">
            {getCurrentPageItems().map((item, index) => (
              <div 
                key={item.id} 
                className="photo-polaroid p-3 rounded-sm transition-all duration-300 cursor-pointer h-fit"
                style={{
                  transform: `rotate(${[-1.5, 1, -1, 1.5, -1, 1][index % 6]}deg)`,
                }}
              >
                {item.type === 'image' ? (
                  <img 
                    src={item.dataUrl} 
                    alt={item.name} 
                    className="w-full h-56 object-cover rounded-sm shadow-inner"
                    style={{ 
                      border: '1px solid rgba(0,0,0,0.1)',
                      filter: 'contrast(1.05) brightness(0.98)'
                    }}
                  />
                ) : (
                  <video 
                    src={item.dataUrl} 
                    controls 
                    className="w-full h-56 object-cover rounded-sm shadow-inner"
                    style={{ border: '1px solid rgba(0,0,0,0.1)' }}
                  />
                )}
                <div className="mt-2 text-center">
                  <p className="text-xs text-slate-600 font-handwriting italic leading-tight">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Empty slots with decorative pattern - Fixed height */}
            {getCurrentPageItems().length < itemsPerPage && 
              Array.from({ length: itemsPerPage - getCurrentPageItems().length }).map((_, i) => (
                <div 
                  key={`empty-${i}`} 
                  className="border-2 border-dashed border-emerald-200 rounded-sm bg-white/30 backdrop-blur-sm h-72"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(16, 185, 129, 0.05) 10px, rgba(16, 185, 129, 0.05) 20px)'
                  }}
                />
              ))
            }
          </div>

          {/* Page Navigation */}
          <div className="mt-12 flex items-center justify-between pt-6 border-t border-emerald-200/50">
            <button
              onClick={prevPage}
              disabled={currentPage === 0 || isFlipping}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg font-semibold disabled:from-emerald-300 disabled:to-emerald-300 disabled:cursor-not-allowed hover:from-emerald-800 hover:to-emerald-900 transition-all shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Anterior
            </button>

            <div className="text-center">
              <div className="inline-block px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-md border border-emerald-200">
                <p className="text-sm text-emerald-900 font-bold">
                  {currentPage + 1} / {totalPages}
                </p>
              </div>
              <div className="flex gap-2 mt-3 justify-center">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (!isFlipping && i !== currentPage) {
                        setIsFlipping(true);
                        setTimeout(() => {
                          setCurrentPage(i);
                          setIsFlipping(false);
                        }, 600);
                      }
                    }}
                    disabled={isFlipping}
                    className={`h-2 rounded-full transition-all ${
                      i === currentPage 
                        ? 'bg-emerald-800 w-8 shadow-lg' 
                        : 'bg-emerald-300 w-2 hover:bg-emerald-600 hover:w-4'
                    }`}
                    aria-label={`Ir para página ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1 || isFlipping}
              className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-lg font-semibold disabled:from-emerald-300 disabled:to-emerald-300 disabled:cursor-not-allowed hover:from-emerald-800 hover:to-emerald-900 transition-all shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
            >
              Próxima
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right page edge shadow */}
        <div 
          className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1))',
          }}
        />
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