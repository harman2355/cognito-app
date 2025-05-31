import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, Settings, Brain } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Badge } from '@/components/ui/badge';

interface MobileLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, showNavigation = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' }];


  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center p-4" data-id="k93ka4t47" data-path="src/components/MobileLayout.tsx">
      <div className="w-full max-w-sm bg-white rounded-[25px] overflow-hidden shadow-2xl min-h-[700px] relative" data-id="d3f8fptqg" data-path="src/components/MobileLayout.tsx">
        {/* Status Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-5 py-2 flex justify-between items-center text-sm font-semibold" data-id="o0tvtsvhs" data-path="src/components/MobileLayout.tsx">
          <div className="flex items-center gap-3" data-id="qgad1musk" data-path="src/components/MobileLayout.tsx">
            <span data-id="whs9aopab" data-path="src/components/MobileLayout.tsx">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {user?.streak && user.streak > 0 &&
            <Badge className="bg-red-500 text-white text-xs px-2 py-1" data-id="809m1nuvm" data-path="src/components/MobileLayout.tsx">
                🧠 Streak: {user.streak}
              </Badge>
            }
          </div>
          <div className="flex items-center gap-1" data-id="dp9xdtqma" data-path="src/components/MobileLayout.tsx">
            <span data-id="7n3elmse6" data-path="src/components/MobileLayout.tsx">5G</span>
            <span data-id="h3j7s2gny" data-path="src/components/MobileLayout.tsx">📶</span>
            <span data-id="iwvy8ae7d" data-path="src/components/MobileLayout.tsx">72%</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-gray-50 px-5 py-4 flex justify-between items-center" data-id="248s8i5uf" data-path="src/components/MobileLayout.tsx">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2" data-id="pbaei6fqk" data-path="src/components/MobileLayout.tsx">
            <Brain className="w-8 h-8 text-purple-600" data-id="nrhp412y8" data-path="src/components/MobileLayout.tsx" />
            Impulse
          </h1>
          <div className="flex items-center gap-3" data-id="u3ribs98o" data-path="src/components/MobileLayout.tsx">
            <div className="relative" data-id="2noqcp8nx" data-path="src/components/MobileLayout.tsx">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center" data-id="y9rbv3ou7" data-path="src/components/MobileLayout.tsx">
                <span className="text-white text-xs" data-id="wgk0imed4" data-path="src/components/MobileLayout.tsx">🔔</span>
              </div>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center" data-id="ds452r5up" data-path="src/components/MobileLayout.tsx">
                <span className="text-white text-xs" data-id="rw59fudz5" data-path="src/components/MobileLayout.tsx">2</span>
              </div>
            </div>
            <Settings
              className="w-6 h-6 text-gray-600 cursor-pointer"
              onClick={() => navigate('/profile')} data-id="qnbrwa09f" data-path="src/components/MobileLayout.tsx" />

          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20" data-id="8s6rmv47l" data-path="src/components/MobileLayout.tsx">
          {children}
        </div>

        {/* Bottom Navigation */}
        {showNavigation &&
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3" data-id="rzpu2966b" data-path="src/components/MobileLayout.tsx">
            {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path) ?
                'text-purple-600 bg-purple-50' :
                'text-gray-500'}`
                } data-id="0c7yzhcw5" data-path="src/components/MobileLayout.tsx">

                  <Icon className="w-5 h-5" data-id="lgf3w42nw" data-path="src/components/MobileLayout.tsx" />
                  <span className="text-xs font-medium" data-id="o70lfkkjs" data-path="src/components/MobileLayout.tsx">{item.label}</span>
                </button>);

          })}
          </div>
        }
      </div>
    </div>);

};

export default MobileLayout;