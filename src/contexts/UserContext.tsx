import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  goals: string[];
  level: number;
  streak: number;
  totalGamesPlayed: number;
  isPremium: boolean;
  baselineCompleted: boolean;
  onboardingCompleted: boolean;
  lastActive: string;
}

interface UserStats {
  memoryLevel: number;
  attentionLevel: number;
  problemSolvingLevel: number;
  flexibilityLevel: number;
  speedLevel: number;
  totalScore: number;
  weeklyProgress: number;
}

interface UserContextType {
  user: UserProfile | null;
  userStats: UserStats;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  incrementStreak: () => void;
  addGamePlayed: () => void;
}

const defaultUserStats: UserStats = {
  memoryLevel: 1,
  attentionLevel: 1,
  problemSolvingLevel: 1,
  flexibilityLevel: 1,
  speedLevel: 1,
  totalScore: 0,
  weeklyProgress: 0
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user data from localStorage on app start
    const savedUser = localStorage.getItem('impulse_user');
    const savedStats = localStorage.getItem('impulse_stats');

    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }

    if (savedStats) {
      setUserStats(JSON.parse(savedStats));
    }
  }, []);

  const saveUserToStorage = (userData: UserProfile) => {
    localStorage.setItem('impulse_user', JSON.stringify(userData));
  };

  const saveStatsToStorage = (stats: UserStats) => {
    localStorage.setItem('impulse_stats', JSON.stringify(stats));
  };

  const login = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    const userData: UserProfile = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      age: 25,
      goals: [],
      level: 1,
      streak: 0,
      totalGamesPlayed: 0,
      isPremium: false,
      baselineCompleted: false,
      onboardingCompleted: false,
      lastActive: new Date().toISOString()
    };

    setUser(userData);
    setIsAuthenticated(true);
    saveUserToStorage(userData);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('impulse_user');
    localStorage.removeItem('impulse_stats');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  const updateStats = (updates: Partial<UserStats>) => {
    const updatedStats = { ...userStats, ...updates };
    setUserStats(updatedStats);
    saveStatsToStorage(updatedStats);
  };

  const completeOnboarding = (profile: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...profile, onboardingCompleted: true };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  const incrementStreak = () => {
    if (user) {
      const updatedUser = { ...user, streak: user.streak + 1 };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  const addGamePlayed = () => {
    if (user) {
      const updatedUser = { ...user, totalGamesPlayed: user.totalGamesPlayed + 1 };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userStats,
        isAuthenticated,
        login,
        logout,
        updateProfile,
        updateStats,
        completeOnboarding,
        incrementStreak,
        addGamePlayed
      }} data-id="n2oellnjc" data-path="src/contexts/UserContext.tsx">

      {children}
    </UserContext.Provider>);

};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};