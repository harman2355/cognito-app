import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import OnboardingPage from './pages/OnboardingPage';
import GameDetailPage from './pages/GameDetailPage';
import WorkoutPage from './pages/WorkoutPage';
import MobileNavigation from './components/MobileNavigation';
import { UserProvider } from './contexts/UserContext';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient} data-id="tforxs56n" data-path="src/App.tsx">
      <TooltipProvider data-id="4h317oxa3" data-path="src/App.tsx">
        <UserProvider data-id="1qjayoc05" data-path="src/App.tsx">
          <Router data-id="7dok6poj7" data-path="src/App.tsx">
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" data-id="hmigxuadi" data-path="src/App.tsx">
              <main className="pb-20" data-id="bxs2uexy0" data-path="src/App.tsx">
                <Routes data-id="5fzevx5g5" data-path="src/App.tsx">
                  <Route path="/" element={<HomePage data-id="828r6ao4s" data-path="src/App.tsx" />} data-id="j7rxzgku0" data-path="src/App.tsx" />
                  <Route path="/onboarding" element={<OnboardingPage data-id="j80h4sw9k" data-path="src/App.tsx" />} data-id="arw3e1gyp" data-path="src/App.tsx" />
                  <Route path="/games" element={<GamesPage data-id="ujydw25ix" data-path="src/App.tsx" />} data-id="3c8zxs3gd" data-path="src/App.tsx" />
                  <Route path="/games/:category" element={<GameDetailPage data-id="16cgke8rm" data-path="src/App.tsx" />} data-id="iuk9qc4w7" data-path="src/App.tsx" />
                  <Route path="/workout" element={<WorkoutPage data-id="r0liysrev" data-path="src/App.tsx" />} data-id="qr3xn42ci" data-path="src/App.tsx" />
                  <Route path="/progress" element={<ProgressPage data-id="pibxoym62" data-path="src/App.tsx" />} data-id="r36q7gizp" data-path="src/App.tsx" />
                  <Route path="/profile" element={<ProfilePage data-id="icpvb5cgi" data-path="src/App.tsx" />} data-id="mjvzbrzr4" data-path="src/App.tsx" />
                  <Route path="*" element={<HomePage data-id="5vwl0fhkc" data-path="src/App.tsx" />} data-id="z2jxa5c8s" data-path="src/App.tsx" />
                </Routes>
              </main>
              <MobileNavigation data-id="wa3yj3svj" data-path="src/App.tsx" />
            </div>
          </Router>
        </UserProvider>
        <Toaster data-id="6cqrqjeyi" data-path="src/App.tsx" />
      </TooltipProvider>
    </QueryClientProvider>);

}

export default App;