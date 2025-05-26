import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  goals: string[];
  level: number;
  streak: number;
  totalGames: number;
  isPremium: boolean;
  cognitiveScores: {
    memory: number;
    attention: number;
    problemSolving: number;
    flexibility: number;
    speed: number;
  };
  preferences: {
    difficulty: 'easy' | 'medium' | 'hard';
    sessionLength: number;
    reminderTime: string;
  };
}

interface GameSession {
  gameId: string;
  category: string;
  score: number;
  accuracy: number;
  timeSpent: number;
  difficulty: string;
  date: Date;
}

interface UserContextType {
  user: UserProfile | null;
  isOnboarded: boolean;
  gameHistory: GameSession[];
  updateUser: (updates: Partial<UserProfile>) => void;
  addGameSession: (session: GameSession) => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  calculateProgress: () => any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{children: React.ReactNode;}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('cognito_user');
    const savedHistory = localStorage.getItem('cognito_history');
    const savedOnboarded = localStorage.getItem('cognito_onboarded');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Create demo user for testing
      const demoUser: UserProfile = {
        id: 'demo-user',
        name: 'Alex',
        age: 28,
        goals: ['Improve focus', 'Better memory'],
        level: 5,
        streak: 7,
        totalGames: 42,
        isPremium: false,
        cognitiveScores: {
          memory: 75,
          attention: 68,
          problemSolving: 82,
          flexibility: 71,
          speed: 79
        },
        preferences: {
          difficulty: 'medium',
          sessionLength: 15,
          reminderTime: '18:00'
        }
      };
      setUser(demoUser);
      setIsOnboarded(true);
    }

    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }
    if (savedOnboarded) {
      setIsOnboarded(JSON.parse(savedOnboarded));
    }
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('cognito_user', JSON.stringify(updatedUser));
    }
  };

  const addGameSession = (session: GameSession) => {
    const newHistory = [...gameHistory, session];
    setGameHistory(newHistory);
    localStorage.setItem('cognito_history', JSON.stringify(newHistory));

    // Update user stats
    if (user) {
      const categoryMap: {[key: string]: keyof UserProfile['cognitiveScores'];} = {
        memory: 'memory',
        attention: 'attention',
        'problem-solving': 'problemSolving',
        flexibility: 'flexibility',
        speed: 'speed'
      };

      const cognitiveKey = categoryMap[session.category];
      if (cognitiveKey) {
        const currentScore = user.cognitiveScores[cognitiveKey];
        const newScore = Math.min(100, currentScore + session.accuracy * 0.1);

        updateUser({
          totalGames: user.totalGames + 1,
          cognitiveScores: {
            ...user.cognitiveScores,
            [cognitiveKey]: newScore
          }
        });
      }
    }
  };

  const completeOnboarding = (profile: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name: profile.name || 'User',
      age: profile.age || 25,
      goals: profile.goals || [],
      level: 1,
      streak: 0,
      totalGames: 0,
      isPremium: false,
      cognitiveScores: {
        memory: 50,
        attention: 50,
        problemSolving: 50,
        flexibility: 50,
        speed: 50
      },
      preferences: {
        difficulty: 'medium',
        sessionLength: 15,
        reminderTime: '18:00'
      },
      ...profile
    };

    setUser(newUser);
    setIsOnboarded(true);
    localStorage.setItem('cognito_user', JSON.stringify(newUser));
    localStorage.setItem('cognito_onboarded', JSON.stringify(true));
  };

  const calculateProgress = () => {
    if (!gameHistory.length) return null;

    const last7Days = gameHistory.filter((session) =>
    new Date(session.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    );

    const averageAccuracy = last7Days.reduce((sum, session) => sum + session.accuracy, 0) / last7Days.length;
    const totalTimeSpent = last7Days.reduce((sum, session) => sum + session.timeSpent, 0);

    return {
      gamesPlayed: last7Days.length,
      averageAccuracy: Math.round(averageAccuracy),
      totalTime: Math.round(totalTimeSpent / 60), // in minutes
      improvement: Math.max(0, averageAccuracy - 70) // relative to baseline
    };
  };

  return (
    <UserContext.Provider value={{
      user,
      isOnboarded,
      gameHistory,
      updateUser,
      addGameSession,
      completeOnboarding,
      calculateProgress
    }} data-id="5mclc96vc" data-path="src/contexts/UserContext.tsx">
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