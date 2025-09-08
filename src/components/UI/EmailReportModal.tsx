import React, { useState, useRef } from 'react';
import { XMarkIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Button from './Button';
import { useTranslation } from 'react-i18next';

interface ReportData {
  text: string;
  html: string;
  subject: string;
}

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
}

export default function EmailReportModal({ isOpen, onClose, reportData }: EmailReportModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'text' | 'html'>('text');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const htmlPreviewRef = useRef<HTMLDivElement>(null);
  const [showCopySuccess, setShowCopySuccess] = useState<boolean>(false);
  
  if (!isOpen || !reportData) return null;
  
  const { text, html, subject } = reportData;
  
  const handleCopy = (): void => {
    try {
      if (activeTab === 'text') {
        navigator.clipboard.writeText(text)
          .then(() => {
            setShowCopySuccess(true);
            setTimeout(() => setShowCopySuccess(false), 2000);
          })
          .catch(err => {
            throw err;
          });
      } else {
        // Pour le HTML, utiliser un élément textarea
        const textarea = document.createElement('textarea');
        textarea.value = html;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (!success) throw new Error('Échec de la copie');
        
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('Erreur lors de la copie. Essayez la copie manuelle.');
    }
  };
  
  const handleDownload = (): void => {
    const content = activeTab === 'html' ? html : text;
    const type = activeTab === 'html' ? 'text/html' : 'text/plain';
    const extension = activeTab === 'html' ? 'html' : 'txt';
    
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rapport_${format(new Date(), 'yyyy-MM-dd', { locale: fr })}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="modal-backdrop absolute inset-0" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="modal-modern inline-block align-bottom text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full animate-scale-in">
          <div className="px-6 pt-6 pb-4 sm:p-8 sm:pb-6">
            <div className="flex justify-between items-start">
              <h3 className="text-2xl leading-6 font-bold text-gray-900 heading-modern">
                {t('common.emailReport', 'Rapport pour email')}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
              >
                <XMarkIcon className="h-7 w-7" />
              </button>
            </div>
            
            <div className="mt-6">
              <div className="mb-6">
                <label className="block text-base font-semibold text-gray-700 mb-2">
                  {t('common.subject', 'Sujet')}
                </label>
                <input
                  type="text"
                  value={subject}
                  readOnly
                  className="input-modern w-full px-4 py-3 font-medium"
                />
              </div>
              
              <div className="mb-6">
                <div className="nav-tabs-modern flex p-1">
                  <button
                    onClick={() => setActiveTab('text')}
                    className={`nav-tab-modern py-3 px-6 text-sm font-bold transition-all duration-300 ${
                      activeTab === 'text'
                        ? 'active'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    📝 Texte brut
                  </button>
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`nav-tab-modern py-3 px-6 text-sm font-bold transition-all duration-300 ${
                      activeTab === 'html'
                        ? 'active'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🎨 Aperçu HTML
                  </button>
                </div>
              </div>
              
              {activeTab === 'text' ? (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    readOnly
                    className="w-full h-96 p-6 font-mono text-sm resize-none focus:outline-none whitespace-pre bg-gradient-to-br from-gray-50 to-white"
                  />
                </div>
              ) : (
                <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div 
                    ref={htmlPreviewRef}
                    className="w-full h-96 p-6 overflow-auto bg-gradient-to-br from-white to-gray-50"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                </div>
              )}
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  {activeTab === 'text' 
                    ? 'Copiez ce texte et collez-le directement dans votre email.'
                    : 'Aperçu du rapport HTML. Utilisez l\'onglet "Texte brut" pour copier le contenu.'
                  }
                </div>
                <div className="flex gap-3">
                  {showCopySuccess && (
                    <span className="status-success flex items-center text-sm animate-fade-in">
                      ✓ Copié!
                    </span>
                  )}
                  <Button 
                    onClick={() => {
                      try {
                        // Copier selon l'onglet actif
                        const contentToCopy = activeTab === 'text' ? text : html;
                        navigator.clipboard.writeText(contentToCopy)
                          .then(() => {
                            setShowCopySuccess(true);
                            setTimeout(() => setShowCopySuccess(false), 2000);
                          })
                          .catch(err => {
                            throw err;
                          });
                      } catch (err) {
                        console.error('Erreur lors de la copie:', err);
                        
                        // Essayer la méthode moderne en cas d'échec
                        try {
                          // Méthode de secours avec textarea
                          const textarea = document.createElement('textarea');
                          textarea.value = activeTab === 'text' ? text : html;
                          textarea.style.position = 'fixed';
                          textarea.style.opacity = '0';
                          document.body.appendChild(textarea);
                          textarea.focus();
                          textarea.select();
                          document.execCommand('copy');
                          document.body.removeChild(textarea);
                          setShowCopySuccess(true);
                          setTimeout(() => setShowCopySuccess(false), 2000);
                        } catch (fallbackErr) {
                          console.error('Erreur lors de la copie (méthode alternative):', fallbackErr);
                          alert('Erreur lors de la copie. Essayez de sélectionner manuellement le contenu et de le copier.');
                        }
                      }
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                    {t('common.copy', 'Copier')}
                  </Button>
                  <Button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    {t('common.download', 'Télécharger')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse border-t border-gray-100">
            <Button
              onClick={onClose}
              variant="primary"
              className="w-full sm:ml-3 sm:w-auto"
            >
              {t('common.close', 'Fermer')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}