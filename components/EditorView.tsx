import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import type { PageData, ColleagueMessage, MediaItem } from '../types';
import LandingPageView from './LandingPageView';
import AdminPanel from './AdminPanel';
import { PlusIcon, TrashIcon, UploadIcon, DownloadIcon, LinkIcon, LoadingIcon, SettingsIcon, MagicIcon, SaveIcon, ChevronDownIcon, EyeIcon, ShareIcon } from './icons';
import { useTranslation } from '../App';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';


const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const CollapsibleSection: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-200 rounded-lg bg-white shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-slate-200 space-y-6">
                    {children}
                </div>
            )}
        </div>
    );
};


type QRReadyCallback = (dataUrl: string) => void;

const QRCodeDisplay: React.FC<{ url: string | null; setToast: (toast: {message: string, type: 'success' | 'error'}) => void; onQrReady?: QRReadyCallback }> = ({ url, setToast, onQrReady }) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();
  const [isQrRendered, setIsQrRendered] = useState(false);

  useEffect(() => {
    if (!url || !qrCanvasRef.current) {
      setIsQrRendered(false);
      return;
    }

    const canvas = qrCanvasRef.current;
    const context = canvas.getContext('2d');
    context?.clearRect(0, 0, canvas.width, canvas.height);
    setIsQrRendered(false);

    (async () => {
      try {
        await QRCode.toCanvas(canvas, url, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });
        setIsQrRendered(true);
        try {
          const dataUrl = canvas.toDataURL('image/png');
          if (onQrReady) onQrReady(dataUrl);
        } catch (err) {
          // non-fatal if canvas.toDataURL fails (CORS or other)
          console.warn('Could not extract QR data URL', err);
        }
      } catch (error) {
        console.error('QR Code generation error: ', error);
        setIsQrRendered(false);
      }
    })();
  }, [url]);

  const handleDownload = () => {
    if (qrCanvasRef.current) {
      const link = document.createElement('a');
      link.download = 'memory-page-qr-code.png';
      link.href = qrCanvasRef.current.toDataURL('image/png');
      link.click();
      setToast({ message: t('qrCodeDownloaded'), type: 'success' });
    }
  };
  
  const copyUrlToClipboard = () => {
    if(url) {
        navigator.clipboard.writeText(url).then(() => {
            setToast({ message: t('linkCopied'), type: 'success' });
        });
    }
  }

  if (!url) {
    return (
      <div className="bg-white p-6 rounded-lg flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="p-4 bg-indigo-50 rounded-full">
            <ShareIcon />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mt-4">{t('shareYourCreation')}</h3>
        <p className="text-slate-500 mt-2 max-w-xs">{t('addContentForQR')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg text-center relative">
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{t('shareYourCreation')}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
        {t('qrCodeExplanation')}
      </p>
      <div className="flex justify-center items-center p-4 bg-slate-100 rounded-lg shadow-inner border border-slate-200 min-h-[288px] w-[288px] mx-auto relative">
        {/* Canvas is always rendered so the ref exists for QR generation */}
        <canvas
          ref={qrCanvasRef}
          width={256}
          height={256}
          className={`rounded-md transition-opacity duration-500 ${isQrRendered ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={!isQrRendered}
        />

        {/* Loading overlay shown while QR is being generated */}
        {!isQrRendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" role="status" aria-live="polite">
              <LoadingIcon />
              <p className="mt-2 text-sm text-slate-500">{t('generatingQRCode')}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={handleDownload}
          disabled={!isQrRendered}
          className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-base disabled:bg-slate-400 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
        >
          <DownloadIcon />
          {t('downloadQRCode')}
        </button>

        <button
          onClick={copyUrlToClipboard}
          className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-base transform hover:scale-105 active:scale-100"
        >
          <LinkIcon />
          {t('copySharableLink')}
        </button>

        <button
          onClick={() => url && window.open(url, '_blank')}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-base transform hover:scale-105 active:scale-100"
        >
          <EyeIcon />
          {t('viewPage')}
        </button>
      </div>
    </div>
  );
};

type ToastMessage = { message: string; type: 'success' | 'error' };

const EditorView: React.FC<{ error: string | null }> = ({ error }) => {
  const [data, setData] = useState<PageData>({
    recipientName: '',
    recipientGender: 'female',
    mainMessage: '',
    colleagueMessages: [],
    mediaItems: [],
  });
  const [savedData, setSavedData] = useState<PageData | null>(null);
  const [savedPages, setSavedPages] = useState<Array<{ id: string; data: PageData; serialized: string; url: string; qrDataUrl?: string | null; createdAt: string; updatedAt?: string; shortId?: string }>>([]);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [teamName, setTeamName] = useState<string>('');
  const [mediaUploading, setMediaUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t, setLanguage, language } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'share'>('preview');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    if (toast) {
      const timerId = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timerId);
    }
  }, [toast]);

  const updateData = <K extends keyof PageData>(key: K, value: PageData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const addMessage = () => {
    const newMessage: ColleagueMessage = { id: Date.now().toString(), author: '', text: '' };
    updateData('colleagueMessages', [...data.colleagueMessages, newMessage]);
  };

  const updateMessage = (id: string, field: 'author' | 'text', value: string) => {
    const updatedMessages = data.colleagueMessages.map(msg => 
      msg.id === id ? { ...msg, [field]: value } : msg
    );
    updateData('colleagueMessages', updatedMessages);
  };

  const removeMessage = (id: string) => {
    updateData('colleagueMessages', data.colleagueMessages.filter(msg => msg.id !== id));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaUploading(true);
      const files = Array.from(event.target.files);
      const newMediaItems: MediaItem[] = [];

      for (const file of files as File[]) {
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        const maxSize = type === 'image' ? 5 * 1024 * 1024 : 20 * 1024 * 1024; // 5MB for images, 20MB for videos
        const maxSizeLabel = type === 'image' ? '5MB' : '20MB';
        
        if (file.size > maxSize) {
            setToast({ message: `${file.name} ${t('fileTooLarge')} (max ${maxSizeLabel})`, type: 'error' });
            continue;
        }

        try {
          setToast({ message: `${t('uploading')} ${file.name}...`, type: 'success' });
          const dataUrl = await fileToBase64(file);
          newMediaItems.push({ id: `${Date.now()}-${file.name}`, type, dataUrl, name: file.name });
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          setToast({ message: `${t('uploadFailed')} ${file.name}`, type: 'error' });
        }
      }
      
      updateData('mediaItems', [...data.mediaItems, ...newMediaItems]);
      setMediaUploading(false);
      
      if (newMediaItems.length > 0) {
        setToast({ message: t('uploadSuccess'), type: 'success' });
      }
    }
  };

  const removeMedia = (id: string) => {
    updateData('mediaItems', data.mediaItems.filter(item => item.id !== id));
  };

  const handleGenerateMessage = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const recipient = data.recipientName || 'a colleague';
        let prompt = '';
        if (language === 'pt-BR') {
            prompt = `Escreva uma mensagem de despedida calorosa, sincera e profissional para um colega que está de partida chamado ${recipient}. A mensagem deve expressar apreço por suas contribuições e desejar-lhe felicidades. Mantenha-a com menos de 70 palavras e retorne apenas o texto da mensagem.`;
        } else {
            prompt = `Write a warm, heartfelt, and professional farewell message for a departing colleague named ${recipient}. The message should express appreciation for their contributions and wish them well. Keep it under 70 words and return only the message text.`;
        }
        
        const generationPromise = ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const timeoutPromise = new Promise<GenerateContentResponse>((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 15000)
        );

        const response = await Promise.race([generationPromise, timeoutPromise]);

        const generatedText = response.text;
        if (generatedText) {
            updateData('mainMessage', generatedText.trim());
        } else {
            throw new Error("No text was generated.");
        }
    } catch (e) {
        console.error("AI message generation failed", e);
        setGenerationError(t('aiGenerationError'));
    } finally {
        setIsGenerating(false);
    }
  };

  // Safe base64 encoder to support Unicode
  const safeBase64Encode = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // Generate short 8-character base62 ID
  const generateShortId = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const STORAGE_KEY = 'team-memory:savedPages';
  const URL_MAP_KEY = 'team-memory:urlMap';

  const saveUrlMapping = (shortId: string, data: PageData) => {
    try {
      const urlMap = JSON.parse(localStorage.getItem(URL_MAP_KEY) || '{}');
      urlMap[shortId] = data;
      localStorage.setItem(URL_MAP_KEY, JSON.stringify(urlMap));
    } catch (e) {
      console.warn('Failed to save URL mapping', e);
    }
  };

  const getDataFromShortId = (shortId: string): PageData | null => {
    try {
      const urlMap = JSON.parse(localStorage.getItem(URL_MAP_KEY) || '{}');
      return urlMap[shortId] || null;
    } catch (e) {
      console.warn('Failed to get URL mapping', e);
      return null;
    }
  };

  const loadSavedPages = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Array<any>;
    } catch (e) {
      console.warn('Failed to load saved pages', e);
      return [];
    }
  }, []);

  useEffect(() => {
    const pages = loadSavedPages();
    setSavedPages(pages);
    try {
      const tn = localStorage.getItem('team-memory:teamName') || '';
      setTeamName(tn);
    } catch (e) {
      /* ignore */
    }
  }, [loadSavedPages]);

  const persistSavedPages = (pages: Array<any>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    } catch (e) {
      console.warn('Failed to persist saved pages', e);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('team-memory:teamName', teamName || '');
    } catch (e) {
      console.warn('Failed to persist teamName', e);
    }
  }, [teamName]);

  const handleSave = async () => {
    setSavedData(data);
    setActiveTab('share');

    let next: Array<{ id: string; data: PageData; serialized: string; url: string; qrDataUrl?: string | null; createdAt: string; updatedAt?: string; shortId?: string }>;
    let currentId: string;
    let shortId: string;

    if (editingPageId) {
      // Atualizando página existente
      const existingPage = savedPages.find(p => p.id === editingPageId);
      shortId = existingPage?.shortId || generateShortId();
      const updatedAt = new Date().toISOString();
      
      // Save mapping
      saveUrlMapping(shortId, data);
      
      const url = `${window.location.origin}${window.location.pathname}#/view/${shortId}`;
      const serialized = safeBase64Encode(JSON.stringify(data));
      
      next = savedPages.map(p => 
        p.id === editingPageId 
          ? { ...p, data, serialized, url, updatedAt, qrDataUrl: null, shortId }
          : p
      );
      currentId = editingPageId;
      setToast({ message: t('pageUpdatedSuccess'), type: 'success' });
    } else {
      // Criando nova página
      const id = Date.now().toString();
      shortId = generateShortId();
      const createdAt = new Date().toISOString();
      
      // Save mapping
      saveUrlMapping(shortId, data);
      
      const url = `${window.location.origin}${window.location.pathname}#/view/${shortId}`;
      const serialized = safeBase64Encode(JSON.stringify(data));
      const entry = { id, data, serialized, url, qrDataUrl: null as string | null, createdAt, shortId };
      next = [entry, ...savedPages];
      currentId = id;
      setToast({ message: t('pageSavedSuccess'), type: 'success' });
    }

    setSavedPages(next);
    persistSavedPages(next);

    // Try to pre-generate QR data URL using the library (fallback will be handled by QRCodeDisplay)
    try {
      const url = next.find(p => p.id === currentId)?.url;
      if (url) {
        const qrDataUrl = await QRCode.toDataURL(url, { width: 256, margin: 2, errorCorrectionLevel: 'M' });
        // update entry with qrDataUrl
        const updated = next.map(p => p.id === currentId ? { ...p, qrDataUrl } : p);
        setSavedPages(updated);
        persistSavedPages(updated);
      }
    } catch (e) {
      // ignore — QR will be generated in the canvas and stored via onQrReady
      console.warn('Pre-generate QR failed', e);
    }
  };

  const handleEditPage = (pageData: PageData, pageId: string) => {
    setData(pageData);
    setEditingPageId(pageId);
    setActiveTab('preview');
    setToast({ message: t('pageLoadedForEdit'), type: 'success' });
  };

  const handleNewPage = () => {
    setData({
      recipientName: '',
      recipientGender: 'female',
      mainMessage: '',
      colleagueMessages: [],
      mediaItems: [],
    });
    setEditingPageId(null);
    setActiveTab('preview');
  };

  const hasContent = useMemo(() => {
    const hasColleagueMessageContent = data.colleagueMessages.some(msg => msg.author.trim() !== '' || msg.text.trim() !== '');
    return data.recipientName.trim() !== '' || data.mainMessage.trim() !== '' || hasColleagueMessageContent || data.mediaItems.length > 0;
  }, [data]);

  const shareableUrl = useMemo(() => {
    // Get the most recent saved page URL (which uses short ID)
    if (savedPages.length > 0) {
      // If editing, find the edited page's URL
      if (editingPageId) {
        const editedPage = savedPages.find(p => p.id === editingPageId);
        if (editedPage) return editedPage.url;
      }
      // Otherwise, return the first (most recent) page URL
      return savedPages[0].url;
    }
    return null;
  }, [savedPages, editingPageId]);
  
  const formInputStyle = "mt-1 block w-full rounded-lg border-slate-300 bg-white py-2 px-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm transition";
  const formSelectStyle = formInputStyle + " pr-8";

  return (
    <div className="min-h-screen relative">
      {toast && (
        <div className={`fixed top-20 right-8 z-50 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-lg animate-bounce ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
        </div>
      )}
      <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t('appTitle')}</h1>
            <p className="text-slate-500 text-sm mt-1">{t('appSubtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            {editingPageId && (
              <button 
                onClick={handleNewPage} 
                className="flex items-center gap-2 rounded-md border border-indigo-600 bg-white text-indigo-600 py-2 px-3 text-sm font-medium hover:bg-indigo-50 transition-all"
              >
                <PlusIcon />
                <span>{t('newPage')}</span>
              </button>
            )}
            <button 
              onClick={() => setAdminOpen(true)} 
              className="rounded-md border border-slate-300 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all"
            >
              {t('admin')}
            </button>
            <div className="relative">
              <button onClick={() => setSettingsOpen(!settingsOpen)} className="flex items-center gap-2 rounded-md border border-slate-300 py-2 px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all">
                <SettingsIcon />
                <span>{t('settings')}</span>
              </button>
              {settingsOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-slate-200 origin-top-right transition-all duration-200 ease-out transform opacity-100 scale-100">
                  <div className="p-3">
                    <label className="block text-sm font-medium text-slate-700">{t('language')}</label>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value as 'pt-BR' | 'en-US');
                        setSettingsOpen(false);
                      }}
                      className={formSelectStyle}
                    >
                      <option value="pt-BR">{t('portuguese')}</option>
                      <option value="en-US">{t('english')}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {error && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">{t('error')}</strong>
                <span className="block sm:inline">{error}</span>
            </div>
        </div>
      )}

      <main className="max-w-screen-2xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <CollapsibleSection title={t('recipientInfo')} defaultOpen={true}>
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-slate-700">{t('recipientName')}</label>
                <input type="text" id="recipientName" value={data.recipientName} onChange={e => updateData('recipientName', e.target.value)} className={formInputStyle} placeholder={t('recipientNamePlaceholder')} />
              </div>

              <div>
                <label htmlFor="recipientGender" className="block text-sm font-medium text-slate-700">{t('recipientGender')}</label>
                <select
                  id="recipientGender"
                  value={data.recipientGender || 'female'}
                  onChange={e => updateData('recipientGender', e.target.value as 'male' | 'female')}
                  className={formSelectStyle}
                >
                  <option value="male">{t('male')}</option>
                  <option value="female">{t('female')}</option>
                </select>
              </div>

              <div>
                <label htmlFor="teamNameInput" className="block text-sm font-medium text-slate-700">{t('teamNameSetting')}</label>
                <input
                  type="text"
                  id="teamNameInput"
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className={formInputStyle}
                  placeholder={t('teamNamePlaceholder')}
                />
                <p className="text-xs text-slate-500 mt-1">{t('teamNameSettingDescription')}</p>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label htmlFor="mainMessage" className="block text-sm font-medium text-slate-700">{t('mainFarewellMessage')}</label>
                  <button onClick={handleGenerateMessage} disabled={isGenerating} title={isGenerating ? t('generatingMessage') : t('generateWithAI')} className="p-1.5 rounded-full text-indigo-600 hover:bg-indigo-100 disabled:text-slate-400 disabled:cursor-wait transition-colors" aria-label={isGenerating ? t('generatingMessage') : t('generateWithAI')}>
                    {isGenerating ? <LoadingIcon /> : <MagicIcon />}
                  </button>
                </div>
                <textarea id="mainMessage" rows={4} value={data.mainMessage} onChange={e => updateData('mainMessage', e.target.value)} className={formInputStyle} placeholder={t('mainMessagePlaceholder')}></textarea>
                {generationError && <p className="text-sm text-red-500 mt-1">{generationError}</p>}
              </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('messagesFromTheTeam')}>
              <div className="space-y-4">
                {data.colleagueMessages.map((msg, index) => (
                  <div key={msg.id} className="p-4 border border-slate-200 rounded-md bg-slate-50 relative">
                    <button onClick={() => removeMessage(msg.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500" aria-label={`Remove message ${index + 1}`}><TrashIcon /></button>
                    <div className="grid grid-cols-1 gap-4">
                      <input type="text" value={msg.author} onChange={e => updateMessage(msg.id, 'author', e.target.value)} placeholder={t('authorName')} className={formInputStyle}/>
                      <textarea value={msg.text} onChange={e => updateMessage(msg.id, 'text', e.target.value)} placeholder={t('theirMessage')} rows={2} className={formInputStyle}></textarea>
                    </div>
                  </div>
                ))}
                <button onClick={addMessage} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-md transition-colors">
                  <PlusIcon /> {t('addMessage')}
                </button>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title={t('photoVideoGallery')}>
              <div>
                <div className="flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-indigo-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadIcon />
                    <div className="flex text-sm text-slate-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500">
                        <span>{t('uploadFiles')}</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,video/*" onChange={handleFileChange} ref={fileInputRef} />
                      </label>
                      <p className="pl-1">{t('dragAndDrop')}</p>
                    </div>
                    <p className="text-xs text-slate-500">{t('fileTypes')}</p>
                  </div>
                </div>
                {mediaUploading && <div className="mt-4 flex items-center justify-center gap-2 text-slate-600"><LoadingIcon /><span>{t('processingFiles')}</span></div>}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {data.mediaItems.map(item => (
                    <div key={item.id} className="relative group aspect-square">
                      {item.type === 'image' ? (
                        <img src={item.dataUrl} alt={item.name} className="h-full w-full object-cover rounded-md" />
                      ) : (
                        <video src={item.dataUrl} className="h-full w-full object-cover rounded-md" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center rounded-md">
                        <button onClick={() => removeMedia(item.id)} className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100" aria-label={`Remove ${item.name}`}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={!hasContent}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-100"
              >
                <SaveIcon />
                <span>{t('saveAndGenerate')}</span>
              </button>
            </div>
          </div>

          <div className="sticky top-24">
             <div className="flex border-b border-slate-200">
                <button onClick={() => setActiveTab('preview')} className={`flex items-center gap-2 py-3 px-6 font-semibold transition-colors ${activeTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}> <EyeIcon /> {t('preview')} </button>
                <button onClick={() => setActiveTab('share')} className={`flex items-center gap-2 py-3 px-6 font-semibold transition-colors ${activeTab === 'share' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}> <ShareIcon /> {t('share')} </button>
            </div>
             <div className="bg-white rounded-b-lg shadow-lg border border-slate-200 border-t-0">
                {activeTab === 'preview' ? (
                    <div className="p-2 bg-slate-200">
                        <div className="h-[70vh] max-h-[800px] overflow-y-auto rounded-lg shadow-inner bg-white">
                        <LandingPageView data={data} />
                        </div>
                    </div>
                ) : (
                    <>
                      <QRCodeDisplay url={shareableUrl} setToast={setToast} onQrReady={(dataUrl) => {
                      // store generated QR data URL for the current saved page
                      try {
                        if (!shareableUrl) return;
                        const updated = savedPages.map(p => p.url === shareableUrl ? { ...p, qrDataUrl: dataUrl } : p);
                        setSavedPages(updated);
                        persistSavedPages(updated);
                      } catch (e) {
                        console.warn('Failed to save QR data to savedPages', e);
                      }
                      }} />

                    </>
                )}
            </div>
          </div>
        </div>
      </main>
      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        savedPages={savedPages}
        setSavedPages={setSavedPages}
        persistSavedPages={persistSavedPages}
        setToast={setToast}
        onEditPage={handleEditPage}
      />
    </div>
  );
};

export default EditorView;