import React, { createContext, useContext, useState, ReactNode } from 'react';

export type GameType = 'memory' | 'attention' | 'problem-solving' | 'flexibility' | 'speed';

export interface GameResult {
  gameType: GameType;
  level: number;
  score: number;
  accuracy: number;
  time: number;
  date: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
}

export interface GameSession {
  gameType: GameType;
  level: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'master';
  startTime: number;
  currentRound: number;
  totalRounds: number;
  score: number;
  isActive: boolean;
}

interface GameContextType {
  currentSession: GameSession | null;
  gameHistory: GameResult[];
  dailyChallenge: {
    gameType: GameType;
    level: number;
    completed: boolean;
    date: string;
  } | null;
  startGame: (gameType: GameType, level: number, difficulty: string) => void;
  endGame: (result: Omit<GameResult, 'date'>) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  updateScore: (points: number) => void;
  nextRound: () => void;
  getGameStats: (gameType: GameType) => {
    averageScore: number;
    bestScore: number;
    gamesPlayed: number;
    currentLevel: number;
  };
  completeDailyChallenge: () => void;
  generateDailyChallenge: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{children: ReactNode;}> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<{
    gameType: GameType;
    level: number;
    completed: boolean;
    date: string;
  } | null>(null);

  React.useEffect(() => {
    // Load game data from localStorage
    const savedHistory = localStorage.getItem('impulse_game_history');
    const savedChallenge = localStorage.getItem('impulse_daily_challenge');

    if (savedHistory) {
      setGameHistory(JSON.parse(savedHistory));
    }

    if (savedChallenge) {
      const challenge = JSON.parse(savedChallenge);
      const today = new Date().toDateString();
      if (challenge.date === today) {
        setDailyChallenge(challenge);
      } else {
        generateDailyChallenge();
      }
    } else {
      generateDailyChallenge();
    }
  }, []);

  const startGame = (gameType: GameType, level: number, difficulty: string) => {
    const session: GameSession = {
      gameType,
      level,
      difficulty: difficulty as any,
      startTime: Date.now(),
      currentRound: 1,
      totalRounds: 10,
      score: 0,
      isActive: true
    };
    setCurrentSession(session);
  };

  const endGame = (result: Omit<GameResult, 'date'>) => {
    const gameResult: GameResult = {
      ...result,
      date: new Date().toISOString()
    };

    const updatedHistory = [...gameHistory, gameResult];
    setGameHistory(updatedHistory);
    localStorage.setItem('impulse_game_history', JSON.stringify(updatedHistory));

    setCurrentSession(null);
  };

  const pauseGame = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, isActive: false });
    }
  };

  const resumeGame = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, isActive: true });
    }
  };

  const updateScore = (points: number) => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, score: currentSession.score + points });
    }
  };

  const nextRound = () => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        currentRound: currentSession.currentRound + 1
      });
    }
  };

  const getGameStats = (gameType: GameType) => {
    const typeHistory = gameHistory.filter((game) => game.gameType === gameType);

    if (typeHistory.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        gamesPlayed: 0,
        currentLevel: 1
      };
    }

    const averageScore = typeHistory.reduce((sum, game) => sum + game.score, 0) / typeHistory.length;
    const bestScore = Math.max(...typeHistory.map((game) => game.score));
    const currentLevel = Math.max(...typeHistory.map((game) => game.level), 1);

    return {
      averageScore: Math.round(averageScore),
      bestScore,
      gamesPlayed: typeHistory.length,
      currentLevel
    };
  };

  const completeDailyChallenge = () => {
    if (dailyChallenge) {
      const updatedChallenge = { ...dailyChallenge, completed: true };
      setDailyChallenge(updatedChallenge);
      localStorage.setItem('impulse_daily_challenge', JSON.stringify(updatedChallenge));
    }
  };

  const generateDailyChallenge = () => {
    const gameTypes: GameType[] = ['memory', 'attention', 'problem-solving', 'flexibility', 'speed'];
    const randomGameType = gameTypes[Math.floor(Math.random() * gameTypes.length)];
    const randomLevel = Math.floor(Math.random() * 5) + 1;

    const challenge = {
      gameType: randomGameType,
      level: randomLevel,
      completed: false,
      date: new Date().toDateString()
    };

    setDailyChallenge(challenge);
    localStorage.setItem('impulse_daily_challenge', JSON.stringify(challenge));
  };

  return (
    <GameContext.Provider
      value={{
        currentSession,
        gameHistory,
        dailyChallenge,
        startGame,
        endGame,
        pauseGame,
        resumeGame,
        updateScore,
        nextRound,
        getGameStats,
        completeDailyChallenge,
        generateDailyChallenge
      }} data-id="cw9qkqz1g" data-path="src/contexts/GameContext.tsx">

      {children}
    </GameContext.Provider>);

};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};