import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DateProvider } from './contexts/DateContext';
import { LanguageProvider } from './contexts/LanguageContext';
import LoadingState from './components/common/LoadingState';
import Layout from './components/Layout';
import ChatWidget from './components/ChatWidget/ChatWidget';
import OnboardingTutorial from './components/Onboarding/OnboardingTutorial';
import { useOnboarding } from './hooks/useOnboarding';
import useZoom from './hooks/useZoom';

// Lazy loading des pages pour optimiser le bundle
const Targets = React.lazy(() => import('./pages/Targets'));
const Revenue = React.lazy(() => import('./pages/Revenue'));
const Hours = React.lazy(() => import('./pages/Hours'));
const Productivity = React.lazy(() => import('./pages/Productivity'));
const Crescendo = React.lazy(() => import('./pages/Crescendo'));
const Entries = React.lazy(() => import('./pages/Entries'));
const Quality = React.lazy(() => import('./pages/Quality'));
const Help = React.lazy(() => import('./pages/Help'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Synthesis = React.lazy(() => import('./pages/Synthesis'));
const PrintView = React.lazy(() => import('./pages/PrintView'));
const TutorielsVideo = React.lazy(() => import('./pages/TutorielsVideo'));
const Rent = React.lazy(() => import('./pages/Rent'));
const CommercialGestures = React.lazy(() => import('./pages/CommercialGestures'));
const Parts = React.lazy(() => import('./pages/Parts'));

function App() {
  const { showOnboarding, completeOnboarding } = useOnboarding();
    const zoomLevel = useZoom();

  return (
    <>
      <LanguageProvider>
        <DateProvider>
          <Router>
            <div
              className="fixed top-0 left-0 origin-top-left overflow-visible bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
              style={{
                width: `${100 / zoomLevel}%`,
                height: `${100 / zoomLevel}%`,
                transform: `scale(${zoomLevel})`
              }}
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/targets" element={<Suspense fallback={<LoadingState />}><Targets /></Suspense>} />
                    <Route path="/" element={<Navigate to="/synthesis" replace />} />
                    <Route path="/synthesis" element={<Suspense fallback={<LoadingState />}><Synthesis /></Suspense>} />
                    <Route path="/revenue" element={<Suspense fallback={<LoadingState />}><Revenue /></Suspense>} />
                    <Route path="/hours" element={<Suspense fallback={<LoadingState />}><Hours /></Suspense>} />
                    <Route path="/productivity" element={<Suspense fallback={<LoadingState />}><Productivity /></Suspense>} />
                    <Route path="/crescendo" element={<Suspense fallback={<LoadingState />}><Crescendo /></Suspense>} />
                    <Route path="/entries" element={<Suspense fallback={<LoadingState />}><Entries /></Suspense>} />
                    <Route path="/quality" element={<Suspense fallback={<LoadingState />}><Quality /></Suspense>} />
                    <Route path="/rent" element={<Suspense fallback={<LoadingState />}><Rent /></Suspense>} />
                    <Route path="/commercial-gestures" element={<Suspense fallback={<LoadingState />}><CommercialGestures /></Suspense>} />
                    <Route path="/parts" element={<Suspense fallback={<LoadingState />}><Parts /></Suspense>} />
                    <Route path="/help" element={<Suspense fallback={<LoadingState />}><Help /></Suspense>} />
                    <Route path="/profile" element={<Suspense fallback={<LoadingState />}><Profile /></Suspense>} />
                    <Route path="/print-view" element={<Suspense fallback={<LoadingState />}><PrintView /></Suspense>} />
                    <Route path="/tutoriels-video" element={<Suspense fallback={<LoadingState />}><TutorielsVideo /></Suspense>} />
                  </Route>

                  <Route path="*" element={<Navigate to="/synthesis" replace />} />
                </Routes>
                <ChatWidget />
              </div>
            </div>

            {/* Tutoriel d'accueil */}
            {showOnboarding && (
              <OnboardingTutorial onComplete={completeOnboarding} />
            )}
          </Router>
        </DateProvider>
      </LanguageProvider>
    </>
  );
}

export default App;