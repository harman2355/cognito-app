import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Eye, RotateCcw } from 'lucide-react';

interface AttentionGameProps {
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
  gameConfig: {
    gameId: string;
    name: string;
    difficulty: string;
  };
}

interface Target {
  id: number;
  x: number;
  y: number;
  isTarget: boolean;
  isClicked: boolean;
}

const AttentionGame: React.FC<AttentionGameProps> = ({ onComplete, onExit, gameConfig }) => {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'complete'>('instructions');
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState(Date.now());
  const [round, setRound] = useState(1);
  const maxRounds = 5;
  const maxMissed = 5;

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || missed >= maxMissed) {
      completeGame();
    }
  }, [gameState, timeLeft, missed]);

  // Generate targets periodically
  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(() => {
        generateTarget();
      }, Math.max(2000 - round * 200, 800)); // Gets faster each round

      return () => clearInterval(interval);
    }
  }, [gameState, round]);

  // Remove targets after a while
  useEffect(() => {
    const interval = setInterval(() => {
      setTargets((prev) => {
        const newTargets = prev.filter((target) => {
          if (!target.isClicked && Date.now() - target.id > 3000) {
            if (target.isTarget) {
              setMissed((m) => m + 1);
            }
            return false;
          }
          return true;
        });
        return newTargets;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const generateTarget = useCallback(() => {
    const isTarget = Math.random() > 0.3; // 70% chance of being a target
    const newTarget: Target = {
      id: Date.now(),
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: Math.random() * 70 + 15, // 15% to 85% of screen height
      isTarget,
      isClicked: false
    };

    setTargets((prev) => [...prev, newTarget]);
  }, []);

  const handleTargetClick = (targetId: number) => {
    setTargets((prev) =>
    prev.map((target) => {
      if (target.id === targetId && !target.isClicked) {
        if (target.isTarget) {
          setScore((s) => s + 10);
        } else {
          setMissed((m) => m + 1); // Penalty for clicking non-targets
        }
        return { ...target, isClicked: true };
      }
      return target;
    })
    );
  };

  const completeGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const totalPossibleScore = maxRounds * 30 * 10; // Rough estimate
    const accuracy = Math.max(0, Math.min(100, score / (score + missed * 10) * 100));
    onComplete(score, accuracy, timeSpent);
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setTargets([]);
    setRound(1);
  };

  const resetGame = () => {
    setGameState('instructions');
    setTargets([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(30);
    setRound(1);
  };

  const renderInstructions = () =>
  <div className="text-center space-y-6 p-6" data-id="6etss87su" data-path="src/components/games/AttentionGame.tsx">
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center" data-id="6pgszmxug" data-path="src/components/games/AttentionGame.tsx">
        <Eye className="h-8 w-8 text-blue-600" data-id="9ismq3gyi" data-path="src/components/games/AttentionGame.tsx" />
      </div>
      <div data-id="dhxjjgx1i" data-path="src/components/games/AttentionGame.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="6m7y95j9d" data-path="src/components/games/AttentionGame.tsx">Focus Target</h2>
        <p className="text-gray-600 leading-relaxed" data-id="g52mdekys" data-path="src/components/games/AttentionGame.tsx">
          Tap only the blue circles as quickly as possible. Avoid the red circles - they're distractors!
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg space-y-2" data-id="0np03rtyu" data-path="src/components/games/AttentionGame.tsx">
        <h3 className="font-semibold text-blue-700" data-id="3lsxmi5s9" data-path="src/components/games/AttentionGame.tsx">How to Play:</h3>
        <ul className="text-sm text-blue-600 space-y-1" data-id="0w7mwn3i4" data-path="src/components/games/AttentionGame.tsx">
          <li data-id="t9fezkyhf" data-path="src/components/games/AttentionGame.tsx">• Tap BLUE circles (+10 points)</li>
          <li data-id="wechpxc4w" data-path="src/components/games/AttentionGame.tsx">• Avoid RED circles (penalty)</li>
          <li data-id="9pctr5gfd" data-path="src/components/games/AttentionGame.tsx">• Missing blue circles costs points</li>
          <li data-id="v7in6d7h7" data-path="src/components/games/AttentionGame.tsx">• Game lasts 30 seconds</li>
        </ul>
      </div>
      <div className="flex space-x-4 justify-center" data-id="79iizwe1a" data-path="src/components/games/AttentionGame.tsx">
        <div className="text-center" data-id="ivguh9297" data-path="src/components/games/AttentionGame.tsx">
          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1" data-id="xhblbp3ix" data-path="src/components/games/AttentionGame.tsx"></div>
          <div className="text-xs text-gray-600" data-id="ouu8kyt9a" data-path="src/components/games/AttentionGame.tsx">Tap this!</div>
        </div>
        <div className="text-center" data-id="mpod0qvex" data-path="src/components/games/AttentionGame.tsx">
          <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-1" data-id="ssekbcrz8" data-path="src/components/games/AttentionGame.tsx"></div>
          <div className="text-xs text-gray-600" data-id="mkjjvlzhq" data-path="src/components/games/AttentionGame.tsx">Avoid this!</div>
        </div>
      </div>
      <Button
      onClick={startGame}
      className="w-full bg-blue-600 hover:bg-blue-700 py-3" data-id="f1ycsn5na" data-path="src/components/games/AttentionGame.tsx">

        Start Game
      </Button>
    </div>;


  const renderGame = () =>
  <div className="space-y-4" data-id="ljnpv7vwo" data-path="src/components/games/AttentionGame.tsx">
      {/* Game Stats */}
      <div className="flex justify-between items-center" data-id="9v9rnfk5a" data-path="src/components/games/AttentionGame.tsx">
        <div className="text-center" data-id="yjnb3w6ic" data-path="src/components/games/AttentionGame.tsx">
          <div className="text-xl font-bold text-blue-600" data-id="pqxdx3yar" data-path="src/components/games/AttentionGame.tsx">{score}</div>
          <div className="text-xs text-gray-600" data-id="wdqbb6xgo" data-path="src/components/games/AttentionGame.tsx">Score</div>
        </div>
        <div className="text-center" data-id="2td6toa4a" data-path="src/components/games/AttentionGame.tsx">
          <div className="text-xl font-bold text-red-600" data-id="x9r7m8ro7" data-path="src/components/games/AttentionGame.tsx">{missed}</div>
          <div className="text-xs text-gray-600" data-id="rtuom6eag" data-path="src/components/games/AttentionGame.tsx">Missed</div>
        </div>
        <div className="text-center" data-id="wv7zvj43p" data-path="src/components/games/AttentionGame.tsx">
          <div className="text-xl font-bold text-green-600" data-id="igsy3lb1d" data-path="src/components/games/AttentionGame.tsx">{timeLeft}</div>
          <div className="text-xs text-gray-600" data-id="fnt24y5g3" data-path="src/components/games/AttentionGame.tsx">Time</div>
        </div>
      </div>

      {/* Time Progress */}
      <Progress value={timeLeft / 30 * 100} className="h-2" data-id="x5nn7hpoq" data-path="src/components/games/AttentionGame.tsx" />

      {/* Game Area */}
      <div className="relative bg-gray-50 rounded-lg h-96 border-2 border-gray-200 overflow-hidden" data-id="lnfrcknn0" data-path="src/components/games/AttentionGame.tsx">
        <div className="absolute inset-0" data-id="gkpd0xrpo" data-path="src/components/games/AttentionGame.tsx">
          {targets.map((target) =>
        <button
          key={target.id}
          onClick={() => handleTargetClick(target.id)}
          className={`
                absolute w-12 h-12 rounded-full border-2 transition-all duration-200
                transform -translate-x-1/2 -translate-y-1/2
                ${
          target.isClicked ?
          'scale-75 opacity-50' :
          'scale-100 hover:scale-110 active:scale-95'}
                ${

          target.isTarget ?
          'bg-blue-500 border-blue-600 shadow-lg' :
          'bg-red-500 border-red-600 shadow-lg'}
              `
          }
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`
          }}
          disabled={target.isClicked} data-id="bvh3sodki" data-path="src/components/games/AttentionGame.tsx" />

        )}
        </div>
        
        {/* Instructions overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center" data-id="60scw6apl" data-path="src/components/games/AttentionGame.tsx">
          <p className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full" data-id="ok37uzykd" data-path="src/components/games/AttentionGame.tsx">
            Tap blue circles, avoid red ones!
          </p>
        </div>
      </div>

      {/* Accuracy Indicator */}
      <div className="text-center" data-id="cktzaheic" data-path="src/components/games/AttentionGame.tsx">
        <div className="text-sm text-gray-600" data-id="lctwp33dv" data-path="src/components/games/AttentionGame.tsx">
          Accuracy: {score > 0 ? Math.round(score / (score + missed * 10) * 100) : 0}%
        </div>
      </div>
    </div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4" data-id="xhe2dnplu" data-path="src/components/games/AttentionGame.tsx">
      <Card className="max-w-md mx-auto" data-id="q0w28aetw" data-path="src/components/games/AttentionGame.tsx">
        <CardContent className="p-6" data-id="nq3u9s8zz" data-path="src/components/games/AttentionGame.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-6" data-id="ltf4kuo98" data-path="src/components/games/AttentionGame.tsx">
            <div data-id="rep9h8a60" data-path="src/components/games/AttentionGame.tsx">
              <h1 className="text-lg font-bold text-gray-800" data-id="r1ejz0jmu" data-path="src/components/games/AttentionGame.tsx">{gameConfig.name}</h1>
              <Badge className="mt-1" data-id="5p9n2u15v" data-path="src/components/games/AttentionGame.tsx">{gameConfig.difficulty}</Badge>
            </div>
            <div className="flex space-x-2" data-id="3bg2zxnry" data-path="src/components/games/AttentionGame.tsx">
              <Button variant="outline" size="sm" onClick={resetGame} data-id="rnl4vhgyg" data-path="src/components/games/AttentionGame.tsx">
                <RotateCcw className="h-4 w-4" data-id="hwxcubdzz" data-path="src/components/games/AttentionGame.tsx" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExit} data-id="33w43ap9v" data-path="src/components/games/AttentionGame.tsx">
                <X className="h-4 w-4" data-id="4wqytgepf" data-path="src/components/games/AttentionGame.tsx" />
              </Button>
            </div>
          </div>

          {gameState === 'instructions' && renderInstructions()}
          {gameState === 'playing' && renderGame()}
        </CardContent>
      </Card>
    </div>);

};

export default AttentionGame;