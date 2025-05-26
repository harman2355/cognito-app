import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Zap, RotateCcw } from 'lucide-react';

interface SpeedGameProps {
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
  gameConfig: {
    gameId: string;
    name: string;
    difficulty: string;
  };
}

interface Challenge {
  id: number;
  type: 'color-match' | 'symbol-match' | 'number-sequence';
  target: string;
  options: string[];
  correctAnswer: number;
  timeLimit: number;
}

const SpeedGame: React.FC<SpeedGameProps> = ({ onComplete, onExit, gameConfig }) => {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'complete'>('instructions');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [challengeStartTime, setChallengeStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(60);
  const [reactionTime, setReactionTime] = useState<number[]>([]);

  const colors = ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣'];
  const symbols = ['⭐', '❤️', '🔶', '🔸', '🔹', '⚡'];
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      completeGame();
    }
  }, [gameState, timeLeft]);

  // Generate challenges
  useEffect(() => {
    if (gameState === 'playing' && !currentChallenge) {
      generateChallenge();
    }
  }, [gameState, currentChallenge]);

  const generateChallenge = useCallback(() => {
    const types: Challenge['type'][] = ['color-match', 'symbol-match', 'number-sequence'];
    const type = types[Math.floor(Math.random() * types.length)];

    let challenge: Challenge;

    switch (type) {
      case 'color-match':
        const targetColor = colors[Math.floor(Math.random() * colors.length)];
        const colorOptions = [targetColor];
        while (colorOptions.length < 4) {
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          if (!colorOptions.includes(randomColor)) {
            colorOptions.push(randomColor);
          }
        }
        challenge = {
          id: Date.now(),
          type: 'color-match',
          target: targetColor,
          options: colorOptions.sort(() => Math.random() - 0.5),
          correctAnswer: colorOptions.indexOf(targetColor),
          timeLimit: 3000
        };
        break;

      case 'symbol-match':
        const targetSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        const symbolOptions = [targetSymbol];
        while (symbolOptions.length < 4) {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          if (!symbolOptions.includes(randomSymbol)) {
            symbolOptions.push(randomSymbol);
          }
        }
        challenge = {
          id: Date.now(),
          type: 'symbol-match',
          target: targetSymbol,
          options: symbolOptions.sort(() => Math.random() - 0.5),
          correctAnswer: symbolOptions.indexOf(targetSymbol),
          timeLimit: 2500
        };
        break;

      case 'number-sequence':
        const sequence = [];
        const start = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < 3; i++) {
          sequence.push((start + i * 2).toString());
        }
        const nextNumber = (start + 3 * 2).toString();
        const numberOptions = [nextNumber];
        while (numberOptions.length < 4) {
          const randomNum = numbers[Math.floor(Math.random() * numbers.length)].toString();
          if (!numberOptions.includes(randomNum)) {
            numberOptions.push(randomNum);
          }
        }
        challenge = {
          id: Date.now(),
          type: 'number-sequence',
          target: sequence.join(', ') + ', ?',
          options: numberOptions.sort(() => Math.random() - 0.5),
          correctAnswer: numberOptions.indexOf(nextNumber),
          timeLimit: 4000
        };
        break;

      default:
        return;
    }

    setCurrentChallenge(challenge);
    setChallengeStartTime(Date.now());
  }, []);

  const handleAnswer = (answerIndex: number) => {
    if (!currentChallenge) return;

    const responseTime = Date.now() - challengeStartTime;
    const isCorrect = answerIndex === currentChallenge.correctAnswer;

    setTotalAnswers((prev) => prev + 1);
    setReactionTime((prev) => [...prev, responseTime]);

    if (isCorrect) {
      // Bonus points for speed
      const speedBonus = Math.max(0, (currentChallenge.timeLimit - responseTime) / 100);
      const points = Math.round(10 + speedBonus);
      setScore((prev) => prev + points);
      setCorrectAnswers((prev) => prev + 1);
    }

    // Brief pause before next challenge
    setCurrentChallenge(null);
    setTimeout(() => {
      if (timeLeft > 0) {
        generateChallenge();
      }
    }, 500);
  };

  const completeGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const accuracy = totalAnswers > 0 ? Math.round(correctAnswers / totalAnswers * 100) : 0;
    onComplete(score, accuracy, timeSpent);
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setTimeLeft(60);
    setReactionTime([]);
    setCurrentChallenge(null);
  };

  const resetGame = () => {
    setGameState('instructions');
    setScore(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setTimeLeft(60);
    setCurrentChallenge(null);
    setReactionTime([]);
  };

  const getAverageReactionTime = () => {
    if (reactionTime.length === 0) return 0;
    return Math.round(reactionTime.reduce((a, b) => a + b, 0) / reactionTime.length);
  };

  const renderInstructions = () =>
  <div className="text-center space-y-6 p-6" data-id="loutz09ps" data-path="src/components/games/SpeedGame.tsx">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center" data-id="ycf53fk6g" data-path="src/components/games/SpeedGame.tsx">
        <Zap className="h-8 w-8 text-red-600" data-id="0zufh7oad" data-path="src/components/games/SpeedGame.tsx" />
      </div>
      <div data-id="gqfviatvd" data-path="src/components/games/SpeedGame.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="ygq3i8rmm" data-path="src/components/games/SpeedGame.tsx">Quick Match</h2>
        <p className="text-gray-600 leading-relaxed" data-id="ohpluupc0" data-path="src/components/games/SpeedGame.tsx">
          Match symbols, colors, and complete sequences as fast as you can!
        </p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg space-y-2" data-id="jxgihwlob" data-path="src/components/games/SpeedGame.tsx">
        <h3 className="font-semibold text-red-700" data-id="y849gvbhr" data-path="src/components/games/SpeedGame.tsx">How to Play:</h3>
        <ul className="text-sm text-red-600 space-y-1" data-id="pcfl593sl" data-path="src/components/games/SpeedGame.tsx">
          <li data-id="8q3vfng8f" data-path="src/components/games/SpeedGame.tsx">• Match the target item from options</li>
          <li data-id="ryc694502" data-path="src/components/games/SpeedGame.tsx">• Complete sequences and patterns</li>
          <li data-id="6z8osxxue" data-path="src/components/games/SpeedGame.tsx">• Speed matters - faster = more points</li>
          <li data-id="aaayfl8fm" data-path="src/components/games/SpeedGame.tsx">• Game lasts 60 seconds</li>
        </ul>
      </div>
      <div className="flex justify-center space-x-4" data-id="xz7ii7tlf" data-path="src/components/games/SpeedGame.tsx">
        <div className="text-center" data-id="wz67dyl4s" data-path="src/components/games/SpeedGame.tsx">
          <div className="text-2xl mb-1" data-id="y6vw7aasc" data-path="src/components/games/SpeedGame.tsx">🔴</div>
          <div className="text-xs text-gray-600" data-id="btnlnj1rv" data-path="src/components/games/SpeedGame.tsx">Colors</div>
        </div>
        <div className="text-center" data-id="8tb6jibuz" data-path="src/components/games/SpeedGame.tsx">
          <div className="text-2xl mb-1" data-id="ou2hgfmdh" data-path="src/components/games/SpeedGame.tsx">⭐</div>
          <div className="text-xs text-gray-600" data-id="3b10i8zt7" data-path="src/components/games/SpeedGame.tsx">Symbols</div>
        </div>
        <div className="text-center" data-id="1i4tnxojy" data-path="src/components/games/SpeedGame.tsx">
          <div className="text-2xl mb-1" data-id="fod3mwbeg" data-path="src/components/games/SpeedGame.tsx">1,3,?</div>
          <div className="text-xs text-gray-600" data-id="yo6j0m8ut" data-path="src/components/games/SpeedGame.tsx">Sequences</div>
        </div>
      </div>
      <Button
      onClick={startGame}
      className="w-full bg-red-600 hover:bg-red-700 py-3" data-id="7qk747z5v" data-path="src/components/games/SpeedGame.tsx">

        Start Game
      </Button>
    </div>;


  const renderGame = () => {
    const progress = (60 - timeLeft) / 60 * 100;

    return (
      <div className="space-y-6" data-id="3yicvtol8" data-path="src/components/games/SpeedGame.tsx">
        {/* Progress and Stats */}
        <div className="space-y-2" data-id="tneqgha5j" data-path="src/components/games/SpeedGame.tsx">
          <div className="flex justify-between text-sm text-gray-600" data-id="qgvxy9xht" data-path="src/components/games/SpeedGame.tsx">
            <span data-id="wsgt87ry2" data-path="src/components/games/SpeedGame.tsx">Time: {timeLeft}s</span>
            <span data-id="72mr30ban" data-path="src/components/games/SpeedGame.tsx">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" data-id="etms5ybjw" data-path="src/components/games/SpeedGame.tsx" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center" data-id="b6angoau0" data-path="src/components/games/SpeedGame.tsx">
          <div data-id="pnb6qq756" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-lg font-bold text-green-600" data-id="gfioy8sr5" data-path="src/components/games/SpeedGame.tsx">{correctAnswers}</div>
            <div className="text-xs text-gray-600" data-id="028z8naz4" data-path="src/components/games/SpeedGame.tsx">Correct</div>
          </div>
          <div data-id="eqtwyb242" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-lg font-bold text-blue-600" data-id="yd0o3vr4v" data-path="src/components/games/SpeedGame.tsx">{getAverageReactionTime()}ms</div>
            <div className="text-xs text-gray-600" data-id="ffy9u7vpa" data-path="src/components/games/SpeedGame.tsx">Avg Time</div>
          </div>
          <div data-id="1zm8ejjrb" data-path="src/components/games/SpeedGame.tsx">
            <div className="text-lg font-bold text-purple-600" data-id="fw93hqqdx" data-path="src/components/games/SpeedGame.tsx">{totalAnswers}</div>
            <div className="text-xs text-gray-600" data-id="vcswq9x43" data-path="src/components/games/SpeedGame.tsx">Total</div>
          </div>
        </div>

        {/* Current Challenge */}
        {currentChallenge &&
        <Card className="border-2 border-red-200" data-id="ku1jlt2qa" data-path="src/components/games/SpeedGame.tsx">
            <CardContent className="p-6 text-center" data-id="atyw8h0fu" data-path="src/components/games/SpeedGame.tsx">
              <div className="mb-4" data-id="i7mim5vyz" data-path="src/components/games/SpeedGame.tsx">
                <div className="text-sm text-gray-600 mb-2" data-id="nl6mrdkpo" data-path="src/components/games/SpeedGame.tsx">
                  {currentChallenge.type === 'color-match' && 'Match the color:'}
                  {currentChallenge.type === 'symbol-match' && 'Match the symbol:'}
                  {currentChallenge.type === 'number-sequence' && 'Complete the sequence:'}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-4" data-id="ua0z41d71" data-path="src/components/games/SpeedGame.tsx">
                  {currentChallenge.target}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3" data-id="gdoecoka2" data-path="src/components/games/SpeedGame.tsx">
                {currentChallenge.options.map((option, index) =>
              <Button
                key={index}
                onClick={() => handleAnswer(index)}
                className="text-2xl py-6 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-800"
                variant="outline" data-id="9wie3n5l8" data-path="src/components/games/SpeedGame.tsx">

                    {option}
                  </Button>
              )}
              </div>
            </CardContent>
          </Card>
        }

        {!currentChallenge &&
        <Card className="border-2 border-gray-200" data-id="0fjcr03n4" data-path="src/components/games/SpeedGame.tsx">
            <CardContent className="p-8 text-center" data-id="tc8k1sfcf" data-path="src/components/games/SpeedGame.tsx">
              <div className="animate-pulse" data-id="rriftzw72" data-path="src/components/games/SpeedGame.tsx">
                <Zap className="h-12 w-12 text-red-500 mx-auto mb-2" data-id="9yj4c8q3i" data-path="src/components/games/SpeedGame.tsx" />
                <div className="text-gray-600" data-id="wkbv3sy77" data-path="src/components/games/SpeedGame.tsx">Get ready...</div>
              </div>
            </CardContent>
          </Card>
        }
      </div>);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-100 p-4" data-id="qweqz45nt" data-path="src/components/games/SpeedGame.tsx">
      <Card className="max-w-md mx-auto" data-id="gns2r29d7" data-path="src/components/games/SpeedGame.tsx">
        <CardContent className="p-6" data-id="t5rmoh9kr" data-path="src/components/games/SpeedGame.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-6" data-id="hppiwsvrj" data-path="src/components/games/SpeedGame.tsx">
            <div data-id="binhhirx9" data-path="src/components/games/SpeedGame.tsx">
              <h1 className="text-lg font-bold text-gray-800" data-id="6t58yim0o" data-path="src/components/games/SpeedGame.tsx">{gameConfig.name}</h1>
              <Badge className="mt-1" data-id="fe3sd0g9f" data-path="src/components/games/SpeedGame.tsx">{gameConfig.difficulty}</Badge>
            </div>
            <div className="flex space-x-2" data-id="3x5gzbtck" data-path="src/components/games/SpeedGame.tsx">
              <Button variant="outline" size="sm" onClick={resetGame} data-id="9y2t90rie" data-path="src/components/games/SpeedGame.tsx">
                <RotateCcw className="h-4 w-4" data-id="pzzzcu1ya" data-path="src/components/games/SpeedGame.tsx" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExit} data-id="xhthzrf28" data-path="src/components/games/SpeedGame.tsx">
                <X className="h-4 w-4" data-id="dsj18bxcv" data-path="src/components/games/SpeedGame.tsx" />
              </Button>
            </div>
          </div>

          {gameState === 'instructions' && renderInstructions()}
          {gameState === 'playing' && renderGame()}
        </CardContent>
      </Card>
    </div>);

};

export default SpeedGame;