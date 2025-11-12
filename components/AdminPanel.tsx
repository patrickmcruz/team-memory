import React from 'react';
import { TrashIcon } from './icons';
import { useTranslation } from '../App';

type SavedPage = { id: string; data: any; serialized: string; url: string; qrDataUrl?: string | null; createdAt: string; updatedAt?: string; shortId?: string };

const AdminPanel: React.FC<{
  open: boolean;
  onClose: () => void;
  savedPages: SavedPage[];
  setSavedPages: (pages: SavedPage[]) => void;
  persistSavedPages: (pages: SavedPage[]) => void;
  setToast: (toast: { message: string; type: 'success' | 'error' }) => void;
  onEditPage: (pageData: any, pageId: string) => void;
}> = ({ open, onClose, savedPages, setSavedPages, persistSavedPages, setToast, onEditPage }) => {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-8">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl z-10 overflow-auto max-h-[80vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{t('admin')}</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-slate-100 text-slate-600 text-xl font-bold">×</button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">{t('savedPages')}</h4>
            {savedPages.length === 0 ? (
              <p className="text-sm text-slate-500">{t('noSavedPages')}</p>
            ) : (
              <ul className="space-y-3">
                {savedPages.map(p => (
                  <li key={p.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-md border">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate">{p.data.recipientName || t('untitled')}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {p.updatedAt 
                          ? `${t('updated')}: ${new Date(p.updatedAt).toLocaleString()}` 
                          : `${t('created')}: ${new Date(p.createdAt).toLocaleString()}`
                        }
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" href={p.url} target="_blank" rel="noreferrer">{t('open')}</a>
                      <button onClick={() => { onEditPage(p.data, p.id); onClose(); }} className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">{t('edit')}</button>
                      <button onClick={() => { navigator.clipboard.writeText(p.url); setToast({ message: t('linkCopied'), type: 'success' }); }} className="text-sm bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-800">{t('copy')}</button>
                      <button onClick={() => { const next = savedPages.filter(s => s.id !== p.id); setSavedPages(next); persistSavedPages(next); setToast({ message: t('pageDeleted'), type: 'success' }); }} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"><TrashIcon /></button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Clear All Data Section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-semibold text-red-700 mb-2">🗑️ {t('dangerZone')}</h4>
            <p className="text-xs text-slate-600 mb-3">{t('clearAllWarning')}</p>
            <button 
              onClick={() => {
                if (confirm(t('confirmClearAll'))) {
                  try {
                    // Clear all team-memory related localStorage
                    localStorage.removeItem('team-memory:savedPages');
                    localStorage.removeItem('team-memory:urlMap');
                    localStorage.removeItem('team-memory:teamName');
                    
                    setSavedPages([]);
                    setToast({ message: t('allDataCleared'), type: 'success' });
                    
                    console.log('🗑️ All localStorage data cleared successfully');
                  } catch (e) {
                    console.error('Failed to clear localStorage', e);
                    setToast({ message: t('clearDataError'), type: 'error' });
                  }
                }
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <TrashIcon />
              {t('clearAllData')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
