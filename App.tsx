import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import type { PageData } from './types';
import EditorView from './components/EditorView';
import LandingPageView from './components/LandingPageView';

// --- I18N IMPLEMENTATION ---
const translations = {
  'pt-BR': {
    "loadingMemories": "Carregando Memórias...",
    "errorCorruptedLink": "Não foi possível carregar a página de memórias. O link pode estar corrompido.",
    "appTitle": "Criador de Página de Memórias",
    "appSubtitle": "Crie uma linda página de memórias para um colega especial.",
    "error": "Erro: ",
    "pageContent": "Conteúdo da Página",
    "recipientName": "Nome do Destinatário",
    "recipientNamePlaceholder": "ex: Alex Doe",
    "mainFarewellMessage": "Mensagem Principal de Despedida",
    "mainMessagePlaceholder": "Sua jornada conosco foi incrível...",
    "messagesFromTheTeam": "Mensagens da Equipe",
    "authorName": "Nome do Autor",
    "theirMessage": "A mensagem deles...",
    "addMessage": "Adicionar Mensagem",
    "photoVideoGallery": "Galeria de Fotos e Vídeos",
    "uploadFiles": "Carregar arquivos",
    "dragAndDrop": "ou arraste e solte",
    "fileTypes": "PNG, JPG, GIF até 5MB | MP4 até 20MB",
    "processingFiles": "Processando arquivos...",
    "fileTooLarge": "é muito grande",
    "uploading": "Enviando",
    "uploadFailed": "Falha ao enviar",
    "uploadSuccess": "Arquivos enviados com sucesso!",
    "livePreview": "Pré-visualização ao Vivo",
    "shareYourCreation": "Compartilhe Sua Criação",
    "qrCodeExplanation": "Imprima este código QR em um presente. Ao ser escaneado, ele abrirá a bela página de memórias que você criou.",
    "downloadQRCode": "Baixar Código QR",
    "copySharableLink": "Copiar Link Compartilhável",
    "linkCopied": "Link copiado!",
    "addContentForQR": "Salve a página para gerar o código QR e o link compartilhável.",
    "landingHeroTitle": "Para um colega inesquecível,",
    "landingHeroTitleMale": "Para um colega inesquecível,",
    "landingHeroTitleFemale": "Para uma colega inesquecível,",
    "landingDefaultRecipient": "Nossa Amiga",
    "landingDefaultMessage": "Reunimos algumas memórias para celebrar seu tempo conosco. Obrigado por tudo!",
    "landingMessagePlaceholder": "...",
    "landingAnonymousAuthor": "Anônimo",
    "ourFavoriteMoments": "Nossos Momentos Favoritos",
    "footerMessage": "Com amor e melhores desejos para o seu próximo capítulo.",
    "footerSignature": "Sua Equipe",
    "settings": "Configurações",
    "language": "Idioma",
    "newPage": "Nova Página",
    "portuguese": "Português (BR)",
    "english": "Inglês (EUA)",
    "generateWithAI": "Gerar com IA",
    "generatingMessage": "Gerando mensagem...",
    "aiGenerationError": "Falha ao gerar mensagem. Por favor, tente novamente.",
    "saveAndGenerate": "Salvar & Compartilhar",
    "preview": "Visualização",
    "share": "Compartilhar",
    "recipientInfo": "Informações do Destinatário",
    "generatingQRCode": "Gerando código QR...",
    "recipientGender": "Gênero",
    "male": "Masculino (o colega)",
    "female": "Feminino (a colega)",
    "teamNameSetting": "Nome da Equipe",
    "teamNameSettingDescription": "Personalize o nome da equipe que aparece no rodapé da página.",
    "admin": "Admin",
    "teamName": "Nome da Equipe",
    "teamNamePlaceholder": "ex: Equipe de Tecnologia",
    "teamNameDescription": "Este nome será usado nas páginas compartilhadas e exportações.",
    "save": "Salvar",
    "savedPages": "Páginas Salvas",
    "noSavedPages": "Nenhuma página salva.",
    "untitled": "Sem título",
    "open": "Abrir",
    "edit": "Editar",
    "copy": "Copiar",
    "delete": "Excluir",
    "pageSavedSuccess": "Página salva com sucesso!",
    "pageUpdatedSuccess": "Página atualizada com sucesso!",
    "qrCodeDownloaded": "Código QR baixado!",
    "teamNameSaved": "Nome da equipe salvo!",
    "pageDeleted": "Página excluída!",
    "pageLoadedForEdit": "Página carregada para edição",
    "created": "Criada",
    "updated": "Atualizada",
    "viewPage": "Ver Página",
    "dangerZone": "Zona de Perigo",
    "clearAllWarning": "Esta ação irá apagar TODOS os dados salvos incluindo páginas, configurações e mapeamentos de URL. Esta ação não pode ser desfeita!",
    "confirmClearAll": "Tem certeza que deseja apagar TODOS os dados? Esta ação é IRREVERSÍVEL!",
    "allDataCleared": "Todos os dados foram apagados com sucesso!",
    "clearDataError": "Erro ao apagar dados. Tente novamente.",
    "clearAllData": "Apagar Todos os Dados",
  },
  'en-US': {
    "loadingMemories": "Loading Memories...",
    "errorCorruptedLink": "Could not load the memory page. The link might be corrupted.",
    "appTitle": "Memory Page Builder",
    "appSubtitle": "Create a beautiful memory page for a special colleague.",
    "error": "Error: ",
    "pageContent": "Page Content",
    "recipientName": "Recipient's Name",
    "recipientNamePlaceholder": "e.g., Alex Doe",
    "mainFarewellMessage": "Main Farewell Message",
    "mainMessagePlaceholder": "Your journey with us has been incredible...",
    "messagesFromTheTeam": "Messages from the Team",
    "authorName": "Author's Name",
    "theirMessage": "Their message...",
    "addMessage": "Add Message",
    "photoVideoGallery": "Photo & Video Gallery",
    "uploadFiles": "Upload files",
    "dragAndDrop": "or drag and drop",
    "fileTypes": "PNG, JPG, GIF up to 5MB | MP4 up to 20MB",
    "processingFiles": "Processing files...",
    "fileTooLarge": "is too large",
    "uploading": "Uploading",
    "uploadFailed": "Failed to upload",
    "uploadSuccess": "Files uploaded successfully!",
    "livePreview": "Live Preview",
    "shareYourCreation": "Share Your Creation",
    "qrCodeExplanation": "Print this QR code on a gift. When scanned, it will open the beautiful memory page you've created.",
    "downloadQRCode": "Download QR Code",
    "copySharableLink": "Copy Sharable Link",
    "linkCopied": "Link copied!",
    "addContentForQR": "Save the page to generate the QR Code and sharable link.",
    "landingHeroTitle": "To an unforgettable colleague,",
    "landingHeroTitleMale": "To an unforgettable colleague,",
    "landingHeroTitleFemale": "To an unforgettable colleague,",
    "landingDefaultRecipient": "Our Friend",
    "landingDefaultMessage": "We've put together a few memories to celebrate your time with us. Thank you for everything!",
    "landingMessagePlaceholder": "...",
    "landingAnonymousAuthor": "Anonymous",
    "ourFavoriteMoments": "Our Favorite Moments",
    "footerMessage": "With love and best wishes for your next chapter.",
    "footerSignature": "Your Team",
    "settings": "Settings",
    "language": "Language",
    "newPage": "New Page",
    "portuguese": "Portuguese (BR)",
    "english": "English (US)",
    "generateWithAI": "Generate with AI",
    "generatingMessage": "Generating message...",
    "aiGenerationError": "Failed to generate message. Please try again.",
    "saveAndGenerate": "Save & Share",
    "preview": "Preview",
    "share": "Share",
    "recipientInfo": "Recipient's Info",
    "generatingQRCode": "Generating QR code...",
    "recipientGender": "Gender",
    "male": "Male (the colleague)",
    "female": "Female (the colleague)",
    "teamNameSetting": "Team Name",
    "teamNameSettingDescription": "Customize the team name that appears in the page footer.",
    "admin": "Admin",
    "teamName": "Team Name",
    "teamNamePlaceholder": "e.g., Technology Team",
    "teamNameDescription": "This name will be used on shared pages and exports.",
    "save": "Save",
    "savedPages": "Saved Pages",
    "noSavedPages": "No saved pages.",
    "untitled": "Untitled",
    "open": "Open",
    "edit": "Edit",
    "copy": "Copy",
    "delete": "Delete",
    "pageSavedSuccess": "Page saved successfully!",
    "pageUpdatedSuccess": "Page updated successfully!",
    "qrCodeDownloaded": "QR Code downloaded!",
    "teamNameSaved": "Team name saved!",
    "pageDeleted": "Page deleted!",
    "pageLoadedForEdit": "Page loaded for editing",
    "created": "Created",
    "updated": "Updated",
    "viewPage": "View Page",
    "dangerZone": "Danger Zone",
    "clearAllWarning": "This action will DELETE ALL saved data including pages, settings, and URL mappings. This action cannot be undone!",
    "confirmClearAll": "Are you sure you want to delete ALL data? This action is IRREVERSIBLE!",
    "allDataCleared": "All data has been cleared successfully!",
    "clearDataError": "Error clearing data. Please try again.",
    "clearAllData": "Clear All Data",
  }
};

type Language = 'pt-BR' | 'en-US';
export type TranslationKey = keyof typeof translations['en-US'];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang && translations[savedLang] ? savedLang : 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: TranslationKey): string => {
    return translations[language][key] || key;
  }, [language]);

  const value = { language, setLanguage, t };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
// --- END I18N IMPLEMENTATION ---

const AppContent: React.FC = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [view, setView] = useState<'editor' | 'viewer' | 'loading'>('loading');
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/view/')) {
        try {
          setError(null);
          setView('loading');
          const hashData = hash.substring(7);
          
          let parsedData: PageData | null = null;
          
          // Try short ID first (8 characters, only letters and numbers)
          if (hashData.length === 8 && /^[a-zA-Z0-9]+$/.test(hashData)) {
            try {
              const urlMapRaw = localStorage.getItem('team-memory:urlMap');
              console.log('🔍 Short ID detected:', hashData);
              console.log('📦 URL Map from localStorage:', urlMapRaw ? 'exists' : 'null');
              
              if (urlMapRaw) {
                const urlMap = JSON.parse(urlMapRaw);
                const pageId = urlMap[hashData]; // shortId → pageId
                
                console.log('� Mapped to pageId:', pageId);
                
                if (pageId) {
                  // Buscar dados completos no savedPages
                  const savedPagesRaw = localStorage.getItem('team-memory:savedPages');
                  console.log('📚 savedPages exists:', savedPagesRaw ? 'yes' : 'no');
                  
                  if (savedPagesRaw) {
                    const savedPages = JSON.parse(savedPagesRaw);
                    console.log('📊 Total pages in localStorage:', savedPages.length);
                    console.log('🔍 Available page IDs:', savedPages.map((p: any) => p.id));
                    
                    const page = savedPages.find((p: any) => p.id === pageId);
                    
                    if (page && page.data) {
                      parsedData = page.data;
                      console.log('✅ Page data loaded successfully!');
                    } else {
                      console.warn('⚠️ Page not found in savedPages:', pageId);
                      console.log('Available pages:', savedPages.map((p: any) => ({ id: p.id, shortId: p.shortId })));
                    }
                  } else {
                    console.error('❌ savedPages not found in localStorage');
                  }
                } else {
                  console.warn('⚠️ Short ID not mapped:', hashData);
                }
              } else {
                console.error('❌ URL map is empty in localStorage');
              }
            } catch (e) {
              console.warn('Failed to load from short URL', e);
            }
          }
          
          // Fallback to base64 decode (for backward compatibility or long URLs)
          if (!parsedData && hashData.length > 8) {
            try {
              const jsonData = decodeURIComponent(escape(atob(hashData)));
              parsedData = JSON.parse(jsonData);
              console.log('Loaded from base64 fallback');
            } catch (e) {
              console.warn('Failed to decode base64 data', e);
            }
          }
          
          if (parsedData) {
            setPageData(parsedData);
            setView('viewer');
          } else {
            console.error('No page data found for hash:', hashData);
            throw new Error('Could not load page data');
          }
        } catch (e) {
          console.error("Failed to parse data from URL hash", e);
          setError(t('errorCorruptedLink'));
          setView('editor');
          window.location.hash = '';
        }
      } else {
        setPageData(null);
        setView('editor');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check on load

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [t]);

  if (view === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-semibold text-slate-600">{t('loadingMemories')}</p>
        </div>
      </div>
    );
  }

  if (view === 'viewer' && pageData) {
    return <LandingPageView data={pageData} />;
  }
  
  return <EditorView error={error} />;
};


const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;