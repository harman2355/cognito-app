import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Gamepad2, TrendingUp, User } from 'lucide-react';

const MobileNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/profile', icon: User, label: 'Profile' }];


  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" data-id="6n0i5k7ly" data-path="src/components/MobileNavigation.tsx">
      <div className="flex justify-around items-center py-2" data-id="qwtkauk5g" data-path="src/components/MobileNavigation.tsx">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              isActive ?
              'text-purple-600 bg-purple-50' :
              'text-gray-500 hover:text-purple-600'}`
              } data-id="6if07a5cm" data-path="src/components/MobileNavigation.tsx">

              <Icon size={20} className={isActive ? 'text-purple-600' : 'text-gray-500'} data-id="xundlzhqu" data-path="src/components/MobileNavigation.tsx" />
              <span className={`text-xs mt-1 font-medium ${
              isActive ? 'text-purple-600' : 'text-gray-500'}`
              } data-id="y9s7hpe40" data-path="src/components/MobileNavigation.tsx">
                {label}
              </span>
            </button>);

        })}
      </div>
    </nav>);

};

export default MobileNavigation;