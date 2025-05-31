import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MobileLayout from '@/components/MobileLayout';
import { useGame, GameType } from '@/contexts/GameContext';
import { useUser } from '@/contexts/UserContext';
import {
  Play,
  Pause,
  RotateCcw,
  Home,
  Trophy,
  Timer,
  Brain,
  Target,
  Puzzle,
  Shuffle,
  Zap } from
'lucide-react';
import MemoryGame from '@/components/games/MemoryGame';
import AttentionGame from '@/components/games/AttentionGame';
import ProblemSolvingGame from '@/components/games/ProblemSolvingGame';
import FlexibilityGame from '@/components/games/FlexibilityGame';
import SpeedGame from '@/components/games/SpeedGame';
import { toast } from '@/hooks/use-toast';

const GamePage: React.FC = () => {
  const { gameType } = useParams<{gameType: string;}>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentSession, startGame, endGame, pauseGame, resumeGame } = useGame();
  const { addGamePlayed, incrementStreak } = useUser();
  const [gameState, setGameState] = useState<'setup' | 'playing' | 'paused' | 'completed'>('setup');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('easy');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [gameResult, setGameResult] = useState<{
    score: number;
    accuracy: number;
    time: number;
  } | null>(null);

  const isDailyChallenge = searchParams.get('daily') === 'true';

  const gameConfig = {
    memory: {
      title: 'Memory Palace',
      description: 'Test your working memory with pattern recall and sequence matching',
      icon: Brain,
      gradient: 'from-red-500 to-red-600',
      benefits: ['Improves working memory', 'Enhances pattern recognition', 'Strengthens recall abilities']
    },
    attention: {
      title: 'Focus Zone',
      description: 'Train your attention and filter out distractions',
      icon: Target,
      gradient: 'from-orange-500 to-yellow-500',
      benefits: ['Improves sustained attention', 'Reduces distractibility', 'Enhances focus control']
    },
    'problem-solving': {
      title: 'Logic Labs',
      description: 'Challenge your reasoning with puzzles and logic problems',
      icon: Puzzle,
      gradient: 'from-purple-500 to-purple-600',
      benefits: ['Enhances logical reasoning', 'Improves problem-solving skills', 'Strengthens analytical thinking']
    },
    flexibility: {
      title: 'Mental Shift',
      description: 'Develop cognitive flexibility and task-switching abilities',
      icon: Shuffle,
      gradient: 'from-green-500 to-emerald-500',
      benefits: ['Improves mental flexibility', 'Enhances task switching', 'Reduces cognitive rigidity']
    },
    speed: {
      title: 'Quick Think',
      description: 'Boost your processing speed and reaction time',
      icon: Zap,
      gradient: 'from-blue-500 to-blue-600',
      benefits: ['Increases processing speed', 'Improves reaction time', 'Enhances quick decision making']
    }
  };

  const difficulties = [
  { value: 'easy', label: 'Easy', description: 'Gentle introduction' },
  { value: 'medium', label: 'Medium', description: 'Moderate challenge' },
  { value: 'hard', label: 'Hard', description: 'Significant challenge' },
  { value: 'expert', label: 'Expert', description: 'For experienced users' },
  { value: 'master', label: 'Master', description: 'Ultimate challenge' }];


  const currentGameConfig = gameType ? gameConfig[gameType as keyof typeof gameConfig] : null;

  useEffect(() => {
    if (!gameType || !currentGameConfig) {
      navigate('/');
      return;
    }

    if (isDailyChallenge) {
      setSelectedLevel(3);
      setSelectedDifficulty('medium');
      handleStartGame(3, 'medium');
    }
  }, [gameType, isDailyChallenge]);

  const handleStartGame = (level: number = selectedLevel, difficulty: string = selectedDifficulty) => {
    if (!gameType) return;

    startGame(gameType as GameType, level, difficulty);
    setGameState('playing');

    toast({
      title: `${currentGameConfig?.title} Started!`,
      description: `Level ${level} - ${difficulty} difficulty`
    });
  };

  const handlePauseGame = () => {
    pauseGame();
    setGameState('paused');
  };

  const handleResumeGame = () => {
    resumeGame();
    setGameState('playing');
  };

  const handleGameComplete = (result: {score: number;accuracy: number;time: number;}) => {
    if (!gameType || !currentSession) return;

    setGameResult(result);
    setGameState('completed');

    endGame({
      gameType: gameType as GameType,
      level: currentSession.level,
      score: result.score,
      accuracy: result.accuracy,
      time: result.time,
      difficulty: currentSession.difficulty
    });

    addGamePlayed();

    if (result.accuracy > 80) {
      incrementStreak();
    }

    toast({
      title: "Game Complete!",
      description: `Score: ${result.score} | Accuracy: ${result.accuracy}%`
    });
  };

  const handleRetry = () => {
    setGameState('setup');
    setGameResult(null);
  };

  const renderGameComponent = () => {
    if (!gameType || !currentSession) return null;

    const gameProps = {
      level: currentSession.level,
      difficulty: currentSession.difficulty,
      onComplete: handleGameComplete,
      isPaused: gameState === 'paused'
    };

    switch (gameType) {
      case 'memory':
        return <MemoryGame {...gameProps} data-id="6eopkwd7a" data-path="src/pages/GamePage.tsx" />;
      case 'attention':
        return <AttentionGame {...gameProps} data-id="hu7msul0s" data-path="src/pages/GamePage.tsx" />;
      case 'problem-solving':
        return <ProblemSolvingGame {...gameProps} data-id="blcnut6jy" data-path="src/pages/GamePage.tsx" />;
      case 'flexibility':
        return <FlexibilityGame {...gameProps} data-id="alokzx4t0" data-path="src/pages/GamePage.tsx" />;
      case 'speed':
        return <SpeedGame {...gameProps} data-id="i9yy3dtqp" data-path="src/pages/GamePage.tsx" />;
      default:
        return null;
    }
  };

  const renderSetupScreen = () => {
    if (!currentGameConfig) return null;

    const Icon = currentGameConfig.icon;

    return (
      <div className="p-5 space-y-6" data-id="0xia4zs4m" data-path="src/pages/GamePage.tsx">
        {/* Game Header */}
        <Card className={`bg-gradient-to-r ${currentGameConfig.gradient} text-white`} data-id="x6678ne40" data-path="src/pages/GamePage.tsx">
          <CardContent className="p-6" data-id="bxt8taun0" data-path="src/pages/GamePage.tsx">
            <div className="flex items-center gap-4 mb-4" data-id="xj14eyayw" data-path="src/pages/GamePage.tsx">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center" data-id="ic5k7lhqa" data-path="src/pages/GamePage.tsx">
                <Icon className="w-6 h-6 text-white" data-id="zbo2jvs48" data-path="src/pages/GamePage.tsx" />
              </div>
              <div data-id="khuewsa3r" data-path="src/pages/GamePage.tsx">
                <h1 className="text-xl font-bold" data-id="xouokbr3q" data-path="src/pages/GamePage.tsx">{currentGameConfig.title}</h1>
                {isDailyChallenge &&
                <Badge className="bg-yellow-500 text-white mt-1" data-id="bovbmsba6" data-path="src/pages/GamePage.tsx">
                    Daily Challenge
                  </Badge>
                }
              </div>
            </div>
            <p className="text-white/90 text-sm" data-id="f8qj9mzjq" data-path="src/pages/GamePage.tsx">{currentGameConfig.description}</p>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card data-id="cayzdwkek" data-path="src/pages/GamePage.tsx">
          <CardContent className="p-4" data-id="ym2ikr5dj" data-path="src/pages/GamePage.tsx">
            <h3 className="font-semibold text-gray-800 mb-3" data-id="9172bozul" data-path="src/pages/GamePage.tsx">Cognitive Benefits</h3>
            <ul className="space-y-2" data-id="lr1j13atm" data-path="src/pages/GamePage.tsx">
              {currentGameConfig.benefits.map((benefit, index) =>
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600" data-id="jic232vx3" data-path="src/pages/GamePage.tsx">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" data-id="ftujn0b46" data-path="src/pages/GamePage.tsx"></div>
                  {benefit}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        {!isDailyChallenge &&
        <>
            {/* Level Selection */}
            <Card data-id="tiap82u1r" data-path="src/pages/GamePage.tsx">
              <CardContent className="p-4" data-id="9lcusplg4" data-path="src/pages/GamePage.tsx">
                <h3 className="font-semibold text-gray-800 mb-3" data-id="gpfyives5" data-path="src/pages/GamePage.tsx">Select Level</h3>
                <div className="grid grid-cols-5 gap-2" data-id="56eeom7zo" data-path="src/pages/GamePage.tsx">
                  {[1, 2, 3, 4, 5].map((level) =>
                <Button
                  key={level}
                  variant={selectedLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(level)} data-id="lgtj7mle3" data-path="src/pages/GamePage.tsx">

                      {level}
                    </Button>
                )}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty Selection */}
            <Card data-id="jr953ihiw" data-path="src/pages/GamePage.tsx">
              <CardContent className="p-4" data-id="5u5lfrrn8" data-path="src/pages/GamePage.tsx">
                <h3 className="font-semibold text-gray-800 mb-3" data-id="y63zk0c15" data-path="src/pages/GamePage.tsx">Select Difficulty</h3>
                <div className="space-y-2" data-id="ofassglmn" data-path="src/pages/GamePage.tsx">
                  {difficulties.map((diff) =>
                <Button
                  key={diff.value}
                  variant={selectedDifficulty === diff.value ? "default" : "outline"}
                  className="w-full justify-between"
                  onClick={() => setSelectedDifficulty(diff.value)} data-id="78eyca3k2" data-path="src/pages/GamePage.tsx">

                      <span data-id="rprh4p84v" data-path="src/pages/GamePage.tsx">{diff.label}</span>
                      <span className="text-xs text-gray-500" data-id="5497p2adu" data-path="src/pages/GamePage.tsx">{diff.description}</span>
                    </Button>
                )}
                </div>
              </CardContent>
            </Card>
          </>
        }

        {/* Start Button */}
        <Button
          onClick={() => handleStartGame()}
          className={`w-full bg-gradient-to-r ${currentGameConfig.gradient} hover:opacity-90 text-white`}
          size="lg" data-id="71a2e30hz" data-path="src/pages/GamePage.tsx">

          <Play className="w-5 h-5 mr-2" data-id="2p6u9pcw9" data-path="src/pages/GamePage.tsx" />
          Start Game
        </Button>
      </div>);

  };

  const renderGameScreen = () =>
  <div className="p-5 space-y-4" data-id="a0hyfil22" data-path="src/pages/GamePage.tsx">
      {/* Game Header */}
      <div className="flex justify-between items-center" data-id="evyyaipei" data-path="src/pages/GamePage.tsx">
        <div data-id="mk89dbv6o" data-path="src/pages/GamePage.tsx">
          <h2 className="text-lg font-bold text-gray-800" data-id="tijndel77" data-path="src/pages/GamePage.tsx">{currentGameConfig?.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600" data-id="bz98lwzeh" data-path="src/pages/GamePage.tsx">
            <span data-id="8ipqvmamp" data-path="src/pages/GamePage.tsx">Level {currentSession?.level}</span>
            <span data-id="i2j5hedps" data-path="src/pages/GamePage.tsx">•</span>
            <span data-id="rcmrri9sw" data-path="src/pages/GamePage.tsx">{currentSession?.difficulty}</span>
            {isDailyChallenge &&
          <>
                <span data-id="p4y2kndbh" data-path="src/pages/GamePage.tsx">•</span>
                <Badge className="bg-yellow-500 text-white text-xs" data-id="3ybnx9epm" data-path="src/pages/GamePage.tsx">Daily Challenge</Badge>
              </>
          }
          </div>
        </div>
        <div className="flex gap-2" data-id="y0igza1tb" data-path="src/pages/GamePage.tsx">
          {gameState === 'playing' ?
        <Button size="sm" variant="outline" onClick={handlePauseGame} data-id="ccft70jpi" data-path="src/pages/GamePage.tsx">
              <Pause className="w-4 h-4" data-id="nhi1hs5lf" data-path="src/pages/GamePage.tsx" />
            </Button> :

        <Button size="sm" variant="outline" onClick={handleResumeGame} data-id="28k3jxk09" data-path="src/pages/GamePage.tsx">
              <Play className="w-4 h-4" data-id="ncd1sictl" data-path="src/pages/GamePage.tsx" />
            </Button>
        }
        </div>
      </div>

      {/* Game Progress */}
      <Card data-id="aihwmwbru" data-path="src/pages/GamePage.tsx">
        <CardContent className="p-4" data-id="jdxpmcdf2" data-path="src/pages/GamePage.tsx">
          <div className="flex justify-between items-center mb-2" data-id="glkkmll65" data-path="src/pages/GamePage.tsx">
            <span className="text-sm text-gray-600" data-id="j3ptqzsj0" data-path="src/pages/GamePage.tsx">Progress</span>
            <span className="text-sm font-medium" data-id="abegmrvpv" data-path="src/pages/GamePage.tsx">
              Round {currentSession?.currentRound} of {currentSession?.totalRounds}
            </span>
          </div>
          <Progress
          value={currentSession ? currentSession.currentRound / currentSession.totalRounds * 100 : 0}
          className="h-2" data-id="jz9w1900m" data-path="src/pages/GamePage.tsx" />

        </CardContent>
      </Card>

      {/* Game Component */}
      <Card data-id="adkfrkl40" data-path="src/pages/GamePage.tsx">
        <CardContent className="p-0" data-id="v1qlg9d48" data-path="src/pages/GamePage.tsx">
          {renderGameComponent()}
        </CardContent>
      </Card>
    </div>;


  const renderCompletedScreen = () =>
  <div className="p-5 space-y-6" data-id="71yt5t18w" data-path="src/pages/GamePage.tsx">
      {/* Results Header */}
      <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white" data-id="6wxm8y28p" data-path="src/pages/GamePage.tsx">
        <CardContent className="p-6 text-center" data-id="5x620xxbt" data-path="src/pages/GamePage.tsx">
          <Trophy className="w-12 h-12 text-white mx-auto mb-4" data-id="gycng1u55" data-path="src/pages/GamePage.tsx" />
          <h2 className="text-xl font-bold mb-2" data-id="ohobkfmxq" data-path="src/pages/GamePage.tsx">Game Complete!</h2>
          <p className="text-white/90" data-id="83d42ynle" data-path="src/pages/GamePage.tsx">Great job on completing this challenge</p>
        </CardContent>
      </Card>

      {/* Results */}
      <Card data-id="3c5242bkv" data-path="src/pages/GamePage.tsx">
        <CardContent className="p-6" data-id="fuycgcadf" data-path="src/pages/GamePage.tsx">
          <h3 className="text-lg font-semibold text-gray-800 mb-4" data-id="gl4wgr4x6" data-path="src/pages/GamePage.tsx">Your Results</h3>
          <div className="grid grid-cols-3 gap-4 text-center" data-id="lr2qkhohu" data-path="src/pages/GamePage.tsx">
            <div data-id="cjfu83u58" data-path="src/pages/GamePage.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="01hyxzw2y" data-path="src/pages/GamePage.tsx">{gameResult?.score || 0}</div>
              <div className="text-xs text-gray-500" data-id="e2fox3ykb" data-path="src/pages/GamePage.tsx">Score</div>
            </div>
            <div data-id="bipbmivkh" data-path="src/pages/GamePage.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="x9apw6kqx" data-path="src/pages/GamePage.tsx">{gameResult?.accuracy || 0}%</div>
              <div className="text-xs text-gray-500" data-id="svdk69iwj" data-path="src/pages/GamePage.tsx">Accuracy</div>
            </div>
            <div data-id="tl5kr9rdx" data-path="src/pages/GamePage.tsx">
              <div className="text-2xl font-bold text-purple-600" data-id="2mriqapu6" data-path="src/pages/GamePage.tsx">
                {gameResult ? Math.round(gameResult.time / 1000) : 0}s
              </div>
              <div className="text-xs text-gray-500" data-id="778yjifqq" data-path="src/pages/GamePage.tsx">Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <Card data-id="qsgtihcal" data-path="src/pages/GamePage.tsx">
        <CardContent className="p-4" data-id="c5vyn7nzh" data-path="src/pages/GamePage.tsx">
          <h3 className="font-semibold text-gray-800 mb-3" data-id="21kyqjr9h" data-path="src/pages/GamePage.tsx">Performance Analysis</h3>
          <div className="space-y-2 text-sm" data-id="3jp5wutt4" data-path="src/pages/GamePage.tsx">
            {gameResult && gameResult.accuracy >= 90 &&
          <div className="text-green-600" data-id="8rdd7x459" data-path="src/pages/GamePage.tsx">• Excellent accuracy! Your focus is sharp.</div>
          }
            {gameResult && gameResult.accuracy >= 70 && gameResult.accuracy < 90 &&
          <div className="text-blue-600" data-id="rgccv8m2v" data-path="src/pages/GamePage.tsx">• Good performance! Keep practicing to improve.</div>
          }
            {gameResult && gameResult.accuracy < 70 &&
          <div className="text-orange-600" data-id="6y03zuv9c" data-path="src/pages/GamePage.tsx">• Room for improvement. Try a lower difficulty level.</div>
          }
            <div className="text-gray-600" data-id="d99iyrlcm" data-path="src/pages/GamePage.tsx">
              • This exercise helps strengthen your {gameType?.replace('-', ' ')} abilities.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3" data-id="hoqhcknnv" data-path="src/pages/GamePage.tsx">
        <Button
        onClick={handleRetry}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        size="lg" data-id="nf4uqkj0v" data-path="src/pages/GamePage.tsx">

          <RotateCcw className="w-5 h-5 mr-2" data-id="1ebvbzm5u" data-path="src/pages/GamePage.tsx" />
          Play Again
        </Button>
        <Button
        onClick={() => navigate('/')}
        variant="outline"
        className="w-full"
        size="lg" data-id="e99xfeadm" data-path="src/pages/GamePage.tsx">

          <Home className="w-5 h-5 mr-2" data-id="r9fsxkp82" data-path="src/pages/GamePage.tsx" />
          Back to Home
        </Button>
      </div>
    </div>;


  if (!currentGameConfig) {
    return (
      <MobileLayout showNavigation={false} data-id="vmx2n5iza" data-path="src/pages/GamePage.tsx">
        <div className="p-5 text-center" data-id="niperblu8" data-path="src/pages/GamePage.tsx">
          <h2 className="text-xl font-bold text-gray-800 mb-2" data-id="cexzc2xeo" data-path="src/pages/GamePage.tsx">Game Not Found</h2>
          <Button onClick={() => navigate('/')} data-id="rk7v79ahs" data-path="src/pages/GamePage.tsx">Return Home</Button>
        </div>
      </MobileLayout>);

  }

  return (
    <MobileLayout showNavigation={false} data-id="6grlzfx13" data-path="src/pages/GamePage.tsx">
      {gameState === 'setup' && renderSetupScreen()}
      {(gameState === 'playing' || gameState === 'paused') && renderGameScreen()}
      {gameState === 'completed' && renderCompletedScreen()}
    </MobileLayout>);

};

export default GamePage;