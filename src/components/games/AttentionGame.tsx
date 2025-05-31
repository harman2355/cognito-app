import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Focus, AlertCircle } from 'lucide-react';

interface AttentionGameProps {
  level: number;
  difficulty: string;
  onComplete: (result: {score: number;accuracy: number;time: number;}) => void;
  isPaused: boolean;
}

type GamePhase = 'instruction' | 'playing' | 'completed';

interface Target {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
  color: string;
  size: number;
}

const AttentionGame: React.FC<AttentionGameProps> = ({ level, difficulty, onComplete, isPaused }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instruction');
  const [targets, setTargets] = useState<Target[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(5000); // 5 seconds per round

  const totalRounds = 8;
  const targetCount = Math.min(2 + level, 6);
  const distractorCount = Math.min(5 + level * 2, 20);
  const roundDuration = Math.max(5000 - level * 200, 3000); // 5s to 3s

  const difficultyModifiers = {
    easy: { sizeVariation: 0.8, colorVariation: 0.7, speedMultiplier: 0.8 },
    medium: { sizeVariation: 0.6, colorVariation: 0.5, speedMultiplier: 1.0 },
    hard: { sizeVariation: 0.4, colorVariation: 0.3, speedMultiplier: 1.2 },
    expert: { sizeVariation: 0.2, colorVariation: 0.2, speedMultiplier: 1.5 },
    master: { sizeVariation: 0.1, colorVariation: 0.1, speedMultiplier: 2.0 }
  };

  const currentDifficultyModifier = difficultyModifiers[difficulty as keyof typeof difficultyModifiers] || difficultyModifiers.medium;

  useEffect(() => {
    if (gamePhase === 'playing' && !isPaused) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            nextRound();
            return roundDuration;
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gamePhase, isPaused, roundDuration]);

  const generateTargets = useCallback(() => {
    const newTargets: Target[] = [];
    const containerWidth = 280;
    const containerHeight = 280;

    // Generate target objects (blue circles)
    for (let i = 0; i < targetCount; i++) {
      const target: Target = {
        id: newTargets.length,
        x: Math.random() * (containerWidth - 40) + 20,
        y: Math.random() * (containerHeight - 40) + 20,
        isTarget: true,
        color: '#3B82F6', // Blue
        size: 20 + Math.random() * 10 * currentDifficultyModifier.sizeVariation
      };
      newTargets.push(target);
    }

    // Generate distractor objects (red circles)
    for (let i = 0; i < distractorCount; i++) {
      const distractor: Target = {
        id: newTargets.length,
        x: Math.random() * (containerWidth - 40) + 20,
        y: Math.random() * (containerHeight - 40) + 20,
        isTarget: false,
        color: '#EF4444', // Red
        size: 15 + Math.random() * 15 * currentDifficultyModifier.sizeVariation
      };
      newTargets.push(distractor);
    }

    return newTargets;
  }, [targetCount, distractorCount, currentDifficultyModifier]);

  const startGame = () => {
    setGamePhase('playing');
    setStartTime(Date.now());
    setRoundStartTime(Date.now());
    setTimeRemaining(roundDuration);
    setTargets(generateTargets());
  };

  const handleTargetClick = (target: Target) => {
    if (gamePhase !== 'playing' || isPaused) return;

    const newTotalClicks = totalClicks + 1;
    setTotalClicks(newTotalClicks);

    if (target.isTarget) {
      const newCorrectClicks = correctClicks + 1;
      setCorrectClicks(newCorrectClicks);

      // Calculate score based on reaction time and accuracy
      const reactionTime = Date.now() - roundStartTime;
      const timeBonus = Math.max(1000 - reactionTime, 0) / 10;
      const roundScore = Math.floor(50 + timeBonus);
      setScore((prev) => prev + roundScore);

      // Remove clicked target
      setTargets((prev) => prev.filter((t) => t.id !== target.id));

      // Check if all targets found
      const remainingTargets = targets.filter((t) => t.isTarget && t.id !== target.id);
      if (remainingTargets.length === 0) {
        nextRound();
      }
    } else {
      // Clicked distractor - penalty
      setScore((prev) => Math.max(0, prev - 25));
    }
  };

  const nextRound = () => {
    if (currentRound < totalRounds) {
      setCurrentRound((prev) => prev + 1);
      setTargets(generateTargets());
      setRoundStartTime(Date.now());
      setTimeRemaining(roundDuration);
    } else {
      // Game complete
      const finalTime = Date.now() - startTime;
      const accuracy = totalClicks > 0 ? Math.round(correctClicks / totalClicks * 100) : 0;
      setGamePhase('completed');

      setTimeout(() => {
        onComplete({
          score,
          accuracy,
          time: finalTime
        });
      }, 1000);
    }
  };

  const renderGameArea = () =>
  <div className="relative w-full h-72 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200" data-id="ui3v48i1j" data-path="src/components/games/AttentionGame.tsx">
      {targets.map((target) =>
    <button
      key={target.id}
      className={`absolute rounded-full transition-all duration-200 hover:scale-110 ${
      target.isTarget ? 'ring-2 ring-blue-300' : ''}`
      }
      style={{
        left: `${target.x}px`,
        top: `${target.y}px`,
        width: `${target.size}px`,
        height: `${target.size}px`,
        backgroundColor: target.color,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => handleTargetClick(target)} data-id="ik8qwa5bj" data-path="src/components/games/AttentionGame.tsx" />

    )}
      
      {/* Instructions overlay */}
      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs" data-id="nwr5rzq8j" data-path="src/components/games/AttentionGame.tsx">
        Click only BLUE circles
      </div>
      
      {/* Stats overlay */}
      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs" data-id="rce2huuky" data-path="src/components/games/AttentionGame.tsx">
        Targets: {targets.filter((t) => t.isTarget).length}
      </div>
      
      {/* Time warning */}
      {timeRemaining < 2000 &&
    <div className="absolute inset-0 flex items-center justify-center" data-id="0a9kot7zr" data-path="src/components/games/AttentionGame.tsx">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse" data-id="xhgkw4a58" data-path="src/components/games/AttentionGame.tsx">
            {Math.ceil(timeRemaining / 1000)}s remaining!
          </div>
        </div>
    }
    </div>;


  const renderPhaseContent = () => {
    switch (gamePhase) {
      case 'instruction':
        return (
          <div className="p-6 text-center space-y-4" data-id="f2ddaznbw" data-path="src/components/games/AttentionGame.tsx">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto" data-id="odtus2alr" data-path="src/components/games/AttentionGame.tsx">
              <Target className="w-8 h-8 text-blue-600" data-id="xu4i7lfwf" data-path="src/components/games/AttentionGame.tsx" />
            </div>
            <div data-id="vv8bhmrlr" data-path="src/components/games/AttentionGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="iukr7ki5x" data-path="src/components/games/AttentionGame.tsx">Attention Training</h3>
              <p className="text-gray-600 text-sm leading-relaxed" data-id="p5cmqsuni" data-path="src/components/games/AttentionGame.tsx">
                Find and click all the BLUE circles while ignoring the red distractors. 
                You have limited time for each round!
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-left" data-id="z0qkf0u3s" data-path="src/components/games/AttentionGame.tsx">
              <div className="text-sm space-y-1" data-id="v81rrs4gk" data-path="src/components/games/AttentionGame.tsx">
                <div data-id="fkadnad5k" data-path="src/components/games/AttentionGame.tsx"><strong data-id="efioyoliu" data-path="src/components/games/AttentionGame.tsx">Objective:</strong> Click only blue circles</div>
                <div data-id="htadojxbd" data-path="src/components/games/AttentionGame.tsx"><strong data-id="5nf76ojtl" data-path="src/components/games/AttentionGame.tsx">Targets per round:</strong> {targetCount}</div>
                <div data-id="5wdsqv58z" data-path="src/components/games/AttentionGame.tsx"><strong data-id="48kbfkr68" data-path="src/components/games/AttentionGame.tsx">Time per round:</strong> {roundDuration / 1000}s</div>
                <div data-id="wao3hh3g8" data-path="src/components/games/AttentionGame.tsx"><strong data-id="whxe1ljo7" data-path="src/components/games/AttentionGame.tsx">Total rounds:</strong> {totalRounds}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-yellow-50 p-2 rounded" data-id="atkupxec0" data-path="src/components/games/AttentionGame.tsx">
              <AlertCircle className="w-4 h-4 text-yellow-600" data-id="ij8o5mikc" data-path="src/components/games/AttentionGame.tsx" />
              Clicking red circles will reduce your score!
            </div>
            <Button
              onClick={startGame}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" data-id="fwvfbzqop" data-path="src/components/games/AttentionGame.tsx">

              <Focus className="w-4 h-4 mr-2" data-id="29z1sta04" data-path="src/components/games/AttentionGame.tsx" />
              Start Attention Training
            </Button>
          </div>);


      case 'playing':
        return (
          <div className="p-4 space-y-4" data-id="6pxl3nzph" data-path="src/components/games/AttentionGame.tsx">
            <div className="flex justify-between items-center" data-id="lm41bgrz9" data-path="src/components/games/AttentionGame.tsx">
              <div className="text-center" data-id="z4w871bic" data-path="src/components/games/AttentionGame.tsx">
                <Badge className="bg-blue-500 text-white" data-id="xnrckpryr" data-path="src/components/games/AttentionGame.tsx">
                  Round {currentRound} of {totalRounds}
                </Badge>
              </div>
              <div className="text-center" data-id="daaqed43p" data-path="src/components/games/AttentionGame.tsx">
                <div className="text-lg font-bold text-blue-600" data-id="io7i10ijl" data-path="src/components/games/AttentionGame.tsx">{score}</div>
                <div className="text-xs text-gray-500" data-id="gs0787j3o" data-path="src/components/games/AttentionGame.tsx">Score</div>
              </div>
            </div>
            
            <div className="space-y-2" data-id="4vr09g6qk" data-path="src/components/games/AttentionGame.tsx">
              <div className="flex justify-between text-sm" data-id="5dtclfzqy" data-path="src/components/games/AttentionGame.tsx">
                <span data-id="ex0wo6gpw" data-path="src/components/games/AttentionGame.tsx">Time Remaining</span>
                <span className={timeRemaining < 2000 ? 'text-red-600 font-bold' : 'text-gray-600'} data-id="t0mx2raaq" data-path="src/components/games/AttentionGame.tsx">
                  {Math.ceil(timeRemaining / 1000)}s
                </span>
              </div>
              <Progress
                value={timeRemaining / roundDuration * 100}
                className={`h-2 ${timeRemaining < 2000 ? 'bg-red-100' : ''}`} data-id="zuqu6ukmq" data-path="src/components/games/AttentionGame.tsx" />

            </div>
            
            {renderGameArea()}
            
            <div className="grid grid-cols-2 gap-4 text-center text-sm" data-id="dwb4dorkk" data-path="src/components/games/AttentionGame.tsx">
              <div data-id="s2igytovd" data-path="src/components/games/AttentionGame.tsx">
                <div className="font-semibold text-green-600" data-id="oeovtbzzc" data-path="src/components/games/AttentionGame.tsx">{correctClicks}</div>
                <div className="text-gray-500" data-id="isad4wtvl" data-path="src/components/games/AttentionGame.tsx">Correct</div>
              </div>
              <div data-id="dnwivwt62" data-path="src/components/games/AttentionGame.tsx">
                <div className="font-semibold text-red-600" data-id="xzzvrmrd4" data-path="src/components/games/AttentionGame.tsx">{totalClicks - correctClicks}</div>
                <div className="text-gray-500" data-id="qkjcmrr8r" data-path="src/components/games/AttentionGame.tsx">Missed</div>
              </div>
            </div>
          </div>);


      case 'completed':
        const accuracy = totalClicks > 0 ? Math.round(correctClicks / totalClicks * 100) : 0;

        return (
          <div className="p-6 text-center space-y-4" data-id="m0fraj5co" data-path="src/components/games/AttentionGame.tsx">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto" data-id="hwwor5yyo" data-path="src/components/games/AttentionGame.tsx">
              <Target className="w-8 h-8 text-green-600" data-id="vhfet6ylp" data-path="src/components/games/AttentionGame.tsx" />
            </div>
            <div data-id="duybaa51a" data-path="src/components/games/AttentionGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="miow17fjb" data-path="src/components/games/AttentionGame.tsx">Training Complete!</h3>
              <p className="text-gray-600 text-sm" data-id="wmc8e7yhr" data-path="src/components/games/AttentionGame.tsx">
                You've completed all {totalRounds} rounds of attention training.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center" data-id="ewywc7kd6" data-path="src/components/games/AttentionGame.tsx">
              <div data-id="yo11dir55" data-path="src/components/games/AttentionGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="ab6tqu20i" data-path="src/components/games/AttentionGame.tsx">{score}</div>
                <div className="text-xs text-gray-500" data-id="jddqtp9ad" data-path="src/components/games/AttentionGame.tsx">Final Score</div>
              </div>
              <div data-id="egokmjuri" data-path="src/components/games/AttentionGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="8jyuxj7xn" data-path="src/components/games/AttentionGame.tsx">{accuracy}%</div>
                <div className="text-xs text-gray-500" data-id="w3fw38t2f" data-path="src/components/games/AttentionGame.tsx">Accuracy</div>
              </div>
              <div data-id="fbv0ew34t" data-path="src/components/games/AttentionGame.tsx">
                <div className="text-xl font-bold text-blue-600" data-id="lkrmu3i35" data-path="src/components/games/AttentionGame.tsx">{correctClicks}</div>
                <div className="text-xs text-gray-500" data-id="mo8z01q3r" data-path="src/components/games/AttentionGame.tsx">Targets Hit</div>
              </div>
            </div>
            <div className="text-sm text-gray-600" data-id="iuybe6hv9" data-path="src/components/games/AttentionGame.tsx">
              Processing results...
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-id="5at1b4yj9" data-path="src/components/games/AttentionGame.tsx">
      <CardContent className="p-0" data-id="zpfe0p9sh" data-path="src/components/games/AttentionGame.tsx">
        {renderPhaseContent()}
      </CardContent>
    </Card>);

};

export default AttentionGame;