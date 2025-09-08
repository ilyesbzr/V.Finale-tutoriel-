import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/Dashboard/Card';
import { ArrowLeftIcon, PlayIcon, ClockIcon, QuestionMarkCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Button from '../components/UI/Button';
import { useTranslation } from 'react-i18next';

interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
  url: string;
}

interface TutorialCategory {
  id: number;
  category: string;
  videos: Video[];
  totalDuration?: number;
}

interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  questions: FAQQuestion[];
}

// Données simulées pour les tutoriels vidéo
const tutorialsData: TutorialCategory[] = [
  {
    id: 1,
    category: 'Introduction',
    videos: [
      { 
        id: 101, 
        title: 'Bienvenue sur AutoDashboard', 
        duration: '4:30',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 102, 
        title: 'Tour d\'horizon des fonctionnalités', 
        duration: '6:15',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 3,
    category: 'Planning',
    videos: [
      { 
        id: 301, 
        title: 'Gestion du planning', 
        duration: '5:20',
        thumbnail: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 302, 
        title: 'Optimisation des ressources', 
        duration: '4:45',
        thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 4,
    category: 'Objectifs du mois',
    videos: [
      { 
        id: 401, 
        title: 'Configuration des objectifs mensuels', 
        duration: '7:15',
        thumbnail: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 402, 
        title: 'Suivi des objectifs', 
        duration: '5:30',
        thumbnail: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 2,
    category: 'Synthèse',
    videos: [
      { 
        id: 201, 
        title: 'Vue d\'ensemble de la synthèse', 
        duration: '3:45',
        thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 202, 
        title: 'Utilisation des filtres et sélecteurs', 
        duration: '2:30',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 5,
    category: 'Chiffre d\'affaires',
    videos: [
      { 
        id: 501, 
        title: 'Analyse du chiffre d\'affaires', 
        duration: '4:15',
        thumbnail: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 502, 
        title: 'Suivi des objectifs de CA', 
        duration: '3:20',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 6,
    category: 'Gestion des heures',
    videos: [
      { 
        id: 601, 
        title: 'Suivi des heures facturées', 
        duration: '3:50',
        thumbnail: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 602, 
        title: 'Potentiel de facturation', 
        duration: '4:10',
        thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 7,
    category: 'Ventes additionnelles',
    videos: [
      { 
        id: 701, 
        title: 'Vue d\'ensemble des ventes additionnelles', 
        duration: '3:30',
        thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 702, 
        title: 'Objectifs de ventes par famille', 
        duration: '4:25',
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 8,
    category: 'Productivité',
    videos: [
      { 
        id: 801, 
        title: 'Indicateurs de productivité', 
        duration: '3:15',
        thumbnail: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 802, 
        title: 'Analyse de la productivité par service', 
        duration: '4:40',
        thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 11,
    category: 'Facturation',
    videos: [
      { 
        id: 1101, 
        title: 'Suivi des facturations', 
        duration: '3:40',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 1102, 
        title: 'Analyse des types de facturation', 
        duration: '4:15',
        thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 9,
    category: 'VideoCheck',
    videos: [
      { 
        id: 901, 
        title: 'Utilisation du module VideoCheck', 
        duration: '4:05',
        thumbnail: 'https://images.unsplash.com/photo-1574717024453-354056afd6fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 902, 
        title: 'Objectifs et taux de réalisation', 
        duration: '3:35',
        thumbnail: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 10,
    category: 'Qualité',
    videos: [
      { 
        id: 1001, 
        title: 'Suivi des indicateurs qualité', 
        duration: '5:10',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 1002, 
        title: 'Amélioration des processus qualité', 
        duration: '4:55',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  },
  {
    id: 12,
    category: 'Historique des résultats',
    videos: [
      { 
        id: 1201, 
        title: 'Analyse des tendances historiques', 
        duration: '5:25',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      { 
        id: 1202, 
        title: 'Comparaison des performances', 
        duration: '4:50',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]
  }
];

// Données pour la FAQ
const faqData: FAQCategory[] = [
  {
    category: 'Général',
    questions: [
      {
        id: 'faq-1',
        question: "Comment changer la période d'analyse ?",
        answer: "Utilisez le sélecteur de date en haut à gauche de chaque page pour choisir la période que vous souhaitez analyser."
      },
      {
        id: 'faq-2',
        question: "Comment changer de concession ?",
        answer: "Utilisez le sélecteur de site en haut à droite pour basculer entre les différentes concessions auxquelles vous avez accès."
      },
      {
        id: 'faq-3',
        question: "Que signifient les couleurs dans les graphiques ?",
        answer: "Vert : objectif atteint ou dépassé. Orange : progression acceptable mais à surveiller. Rouge : objectif non atteint, nécessite une attention particulière."
      }
    ]
  },
  {
    category: 'Synthèse',
    questions: [
      {
        id: 'faq-4',
        question: "Que signifie HEC ?",
        answer: "HEC signifie 'Heures Externes Clients'. Ce sont les heures facturées aux clients externes, par opposition aux heures internes ou sous garantie."
      },
      {
        id: 'faq-5',
        question: "Comment est calculée la projection ?",
        answer: "La projection est calculée en divisant la valeur actuelle par le pourcentage d'avancement du mois, ce qui donne une estimation de la valeur finale si la tendance actuelle se maintient."
      }
    ]
  },
  {
    category: 'Productivité',
    questions: [
      {
        id: 'faq-6',
        question: "Comment est calculée la productivité ?",
        answer: "La productivité est calculée en divisant les heures facturées par les heures disponibles, puis en multipliant par 100 pour obtenir un pourcentage."
      },
      {
        id: 'faq-7',
        question: "Quelle est la différence entre productivité au prorata et productivité sur objectif complet ?",
        answer: "La productivité au prorata tient compte de l'avancement du mois, tandis que la productivité sur objectif complet compare les heures facturées à l'objectif mensuel total."
      }
    ]
  },
  {
    category: 'Ventes additionnelles',
    questions: [
      {
        id: 'faq-8',
        question: "Comment sont définis les objectifs de ventes additionnelles ?",
        answer: "Les objectifs sont définis mensuellement dans l'onglet 'Objectifs du mois' et peuvent être ajustés par les administrateurs."
      },
      {
        id: 'faq-9',
        question: "Comment voir les ventes par conseiller ?",
        answer: "Dans l'onglet 'Ventes additionnelles', cliquez sur le bouton 'Détails/CCS' pour afficher la répartition des ventes par conseiller."
      }
    ]
  },
  {
    category: 'VideoCheck',
    questions: [
      {
        id: 'faq-10',
        question: "Comment est calculé le taux de réalisation ?",
        answer: "Le taux de réalisation est calculé en divisant le nombre de vidéos réalisées par le nombre total d'entrées, puis en multipliant par 100 pour obtenir un pourcentage."
      },
      {
        id: 'faq-11',
        question: "Que signifie CA par vidéo ?",
        answer: "Le CA par vidéo représente le chiffre d'affaires moyen généré par chaque vidéo réalisée. Il est calculé en divisant le CA total généré par les vidéos par le nombre de vidéos réalisées."
      }
    ]
  }
];

export default function TutorielsVideo(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'videos' | 'faq'>('videos');
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Calculer la durée totale des vidéos pour chaque catégorie
  const calculateTotalDuration = (videos: Video[]): number => {
    return videos.reduce((total, video) => {
      const [minutes, seconds] = video.duration.split(':').map(Number);
      return total + minutes;
    }, 0);
  };

  // Filtrer les tutoriels en fonction du terme de recherche
  const filteredTutorials: TutorialCategory[] = tutorialsData.map(category => ({
    ...category,
    videos: category.videos.filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    totalDuration: calculateTotalDuration(category.videos)
  })).filter(category => category.videos.length > 0);

  // Filtrer les questions FAQ en fonction du terme de recherche
  const filteredFaq: FAQCategory[] = searchTerm 
    ? faqData.map(category => ({
        ...category,
        questions: category.questions.filter(q => 
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqData;

  // Trouver la catégorie et la vidéo sélectionnées
  const currentCategory = selectedCategory 
    ? tutorialsData.find(cat => cat.id === selectedCategory) 
    : null;
  
  const currentVideo = selectedVideo 
    ? (currentCategory?.videos.find(vid => vid.id === selectedVideo) || 
       tutorialsData.flatMap(cat => cat.videos).find(vid => vid.id === selectedVideo))
    : null;

  // Retour à la liste des catégories
  const handleBackToCategories = (): void => {
    setSelectedCategory(null);
    setSelectedVideo(null);
  };

  // Retour à la liste des vidéos de la catégorie
  const handleBackToVideos = (): void => {
    setSelectedVideo(null);
  };

  // Toggle pour les questions FAQ
  const toggleQuestion = (questionId: string): void => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t('tutorials.title')}</h1>
        <p className="mt-2 text-gray-600">
          {t('tutorials.description', 'Découvrez nos tutoriels pour vous aider à utiliser efficacement l\'application.')}
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`relative py-5 px-10 border-b-2 font-semibold text-xl overflow-hidden ${
              activeTab === 'videos'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="text-xl font-semibold">Tutoriels vidéo</span>
            {activeTab === 'videos' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`relative py-5 px-10 border-b-2 font-semibold text-xl overflow-hidden ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="text-xl font-semibold">Questions fréquentes</span>
            {activeTab === 'faq' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-t-full"></div>
            )}
          </button>
        </nav>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={activeTab === 'videos' ? t('tutorials.search') : "Rechercher une question..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      {activeTab === 'videos' ? (
        // SECTION TUTORIELS VIDÉO
        <>
          {/* Navigation */}
          {(selectedCategory || selectedVideo) && (
            <div className="mb-6">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <button 
                      onClick={handleBackToCategories}
                      className={`inline-flex items-center text-sm font-medium ${
                        !selectedCategory ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                      }`}
                    >
                      {t('tutorials.categories')}
                    </button>
                  </li>
                  
                  {selectedCategory && (
                    <li>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <button 
                          onClick={handleBackToVideos}
                          className={`ml-1 text-sm font-medium ${
                            selectedVideo ? 'text-gray-700 hover:text-indigo-600' : 'text-indigo-600'
                          }`}
                        >
                          {currentCategory?.category}
                        </button>
                      </div>
                    </li>
                  )}
                  
                  {selectedVideo && (
                    <li>
                      <div className="flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                        </svg>
                        <span className="ml-1 text-sm font-medium text-indigo-600">
                          {currentVideo?.title}
                        </span>
                      </div>
                    </li>
                  )}
                </ol>
              </nav>
            </div>
          )}

          {/* Contenu principal */}
          <div className="space-y-6">
            {!selectedCategory && !selectedVideo ? (
              // Vue des catégories
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map(category => (
                  <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader title={category.category} />
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">{category.videos.length} {t('tutorials.available')}</p>
                          <p className="text-sm text-gray-600">{category.totalDuration} min</p>
                        </div>
                        <Button 
                          onClick={() => setSelectedCategory(category.id)}
                          className="w-full"
                        >
                          {t('tutorials.view')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedCategory && !selectedVideo ? (
              // Vue des vidéos d'une catégorie
              <div>
                <div className="mb-4">
                  <Button 
                    onClick={handleBackToCategories}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    {t('common.back')} {t('tutorials.categories')}
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentCategory?.videos.map(video => (
                    <div 
                      key={video.id} 
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col"
                      onClick={() => setSelectedVideo(video.id)}
                    >
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-white bg-opacity-90 rounded-full p-3">
                            <PlayIcon className="h-8 w-8 text-indigo-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{video.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-1">{t('tutorials.clickToWatch')}</p>
                        <div className="flex justify-end mt-auto">
                          <button className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                            <PlayIcon className="h-4 w-4 mr-1" />
                            {t('tutorials.watch')}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Vue d'une vidéo spécifique
              <div>
                <div className="mb-4">
                  <Button 
                    onClick={handleBackToVideos}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    {t('common.back')} {t('tutorials.videos')}
                  </Button>
                </div>
                
                <Card>
                  <CardHeader title={currentVideo?.title || ''} />
                  <CardContent>
                    <div className="aspect-w-16 aspect-h-9 mb-4">
                      <div className="w-full h-0 pb-[56.25%] relative">
                        <iframe
                          src={currentVideo?.url}
                          title={currentVideo?.title}
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tutorials.description')}</h3>
                      <p className="text-gray-600">
                        {t('tutorials.tutorialExplanation', {
                          feature: currentVideo?.title.toLowerCase()
                        })}
                      </p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tutorials.relatedVideos')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentCategory?.videos
                          .filter(v => v.id !== currentVideo?.id)
                          .slice(0, 2)
                          .map(video => (
                            <div 
                              key={video.id} 
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                              onClick={() => setSelectedVideo(video.id)}
                            >
                              <PlayIcon className="h-8 w-8 text-indigo-600 flex-shrink-0" />
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{video.title}</h4>
                                <p className="text-xs text-gray-500">{video.duration}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </>
      ) : (
        // SECTION FAQ
        <div className="space-y-6">
          {filteredFaq.length > 0 ? (
            filteredFaq.map(category => (
              <Card key={category.category} className="overflow-hidden">
                <CardHeader title={category.category} />
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200">
                    {category.questions.map(item => (
                      <div key={item.id} className="border-b border-gray-200 last:border-b-0">
                        <button
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                          onClick={() => toggleQuestion(item.id)}
                        >
                          <span className="text-base font-medium text-gray-900">{item.question}</span>
                          {expandedQuestions[item.id] ? (
                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        {expandedQuestions[item.id] && (
                          <div className="px-6 py-4 bg-gray-50">
                            <p className="text-gray-700">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">Aucune question ne correspond à votre recherche.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 hover:text-indigo-800"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}