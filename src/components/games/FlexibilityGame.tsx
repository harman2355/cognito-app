import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Shuffle, RotateCcw } from 'lucide-react';

interface FlexibilityGameProps {
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
  gameConfig: {
    gameId: string;
    name: string;
    difficulty: string;
  };
}

interface GameRule {
  name: string;
  instruction: string;
  checkAnswer: (item: string, response: string) => boolean;
}

const FlexibilityGame: React.FC<FlexibilityGameProps> = ({ onComplete, onExit, gameConfig }) => {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'complete'>('instructions');
  const [currentRule, setCurrentRule] = useState(0);
  const [currentItem, setCurrentItem] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(90);
  const [streak, setStreak] = useState(0);

  const rules: GameRule[] = [
  {
    name: "Color Rule",
    instruction: "Is it RED?",
    checkAnswer: (item: string, response: string) => {
      const isRed = item.includes('RED');
      return isRed && response === 'YES' || !isRed && response === 'NO';
    }
  },
  {
    name: "Shape Rule",
    instruction: "Is it a CIRCLE?",
    checkAnswer: (item: string, response: string) => {
      const isCircle = item.includes('CIRCLE');
      return isCircle && response === 'YES' || !isCircle && response === 'NO';
    }
  },
  {
    name: "Size Rule",
    instruction: "Is it LARGE?",
    checkAnswer: (item: string, response: string) => {
      const isLarge = item.includes('LARGE');
      return isLarge && response === 'YES' || !isLarge && response === 'NO';
    }
  }];


  const items = [
  'RED CIRCLE LARGE',
  'BLUE SQUARE SMALL',
  'RED TRIANGLE SMALL',
  'GREEN CIRCLE LARGE',
  'BLUE CIRCLE SMALL',
  'RED SQUARE LARGE',
  'GREEN TRIANGLE SMALL',
  'BLUE TRIANGLE LARGE'];


  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      completeGame();
    }
  }, [gameState, timeLeft]);

  // Generate new item every few seconds
  useEffect(() => {
    if (gameState === 'playing') {
      generateNewItem();
    }
  }, [gameState]);

  const generateNewItem = () => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setCurrentItem(randomItem);

    // Randomly switch rules (mental flexibility)
    if (Math.random() < 0.3) {// 30% chance to switch rule
      const newRule = Math.floor(Math.random() * rules.length);
      setCurrentRule(newRule);
    }
  };

  const handleResponse = (response: string) => {
    const rule = rules[currentRule];
    const isCorrect = rule.checkAnswer(currentItem, response);

    setTotalAnswers((prev) => prev + 1);

    if (isCorrect) {
      setScore((prev) => prev + 10 + streak * 2); // Bonus for streak
      setCorrectAnswers((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    // Generate next item
    setTimeout(() => {
      generateNewItem();
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
    setTimeLeft(90);
    setCurrentRule(0);
    setStreak(0);
  };

  const resetGame = () => {
    setGameState('instructions');
    setScore(0);
    setCorrectAnswers(0);
    setTotalAnswers(0);
    setTimeLeft(90);
    setCurrentRule(0);
    setStreak(0);
  };

  const renderInstructions = () =>
  <div className="text-center space-y-6 p-6" data-id="fjbke171o" data-path="src/components/games/FlexibilityGame.tsx">
      <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center" data-id="piggz85wo" data-path="src/components/games/FlexibilityGame.tsx">
        <Shuffle className="h-8 w-8 text-orange-600" data-id="8iqxd2jg0" data-path="src/components/games/FlexibilityGame.tsx" />
      </div>
      <div data-id="3m4d44jm7" data-path="src/components/games/FlexibilityGame.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="3jlryxyv8" data-path="src/components/games/FlexibilityGame.tsx">Task Switch</h2>
        <p className="text-gray-600 leading-relaxed" data-id="h6wzdsqn7" data-path="src/components/games/FlexibilityGame.tsx">
          Follow the current rule to respond YES or NO. The rule will change, so stay flexible!
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg space-y-2" data-id="l4cvfeje4" data-path="src/components/games/FlexibilityGame.tsx">
        <h3 className="font-semibold text-orange-700" data-id="d9qgghfzm" data-path="src/components/games/FlexibilityGame.tsx">How to Play:</h3>
        <ul className="text-sm text-orange-600 space-y-1" data-id="t7lbjqoob" data-path="src/components/games/FlexibilityGame.tsx">
          <li data-id="awci2s8w8" data-path="src/components/games/FlexibilityGame.tsx">• Items will appear with color, shape, and size</li>
          <li data-id="caoj8vtk7" data-path="src/components/games/FlexibilityGame.tsx">• Follow the current rule shown at the top</li>
          <li data-id="cqwqg8iqp" data-path="src/components/games/FlexibilityGame.tsx">• Answer YES or NO quickly</li>
          <li data-id="8jnu5na1f" data-path="src/components/games/FlexibilityGame.tsx">• Rules change randomly - stay alert!</li>
        </ul>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg" data-id="dypyg1jvk" data-path="src/components/games/FlexibilityGame.tsx">
        <p className="text-sm text-gray-600" data-id="wghir6dz0" data-path="src/components/games/FlexibilityGame.tsx">
          Example: If rule is "Is it RED?" and item is "BLUE CIRCLE LARGE", answer NO
        </p>
      </div>
      <Button
      onClick={startGame}
      className="w-full bg-orange-600 hover:bg-orange-700 py-3" data-id="gfaub61vz" data-path="src/components/games/FlexibilityGame.tsx">

        Start Game
      </Button>
    </div>;


  const renderGame = () => {
    const rule = rules[currentRule];
    const progress = (90 - timeLeft) / 90 * 100;

    return (
      <div className="space-y-6" data-id="65d9ix9aw" data-path="src/components/games/FlexibilityGame.tsx">
        {/* Progress and Stats */}
        <div className="space-y-2" data-id="qegjoxl02" data-path="src/components/games/FlexibilityGame.tsx">
          <div className="flex justify-between text-sm text-gray-600" data-id="vjo7qdjxq" data-path="src/components/games/FlexibilityGame.tsx">
            <span data-id="oa66e7g5s" data-path="src/components/games/FlexibilityGame.tsx">Time: {timeLeft}s</span>
            <span data-id="8arymgweh" data-path="src/components/games/FlexibilityGame.tsx">Score: {score}</span>
          </div>
          <Progress value={progress} className="h-2" data-id="vmdy3u38k" data-path="src/components/games/FlexibilityGame.tsx" />
        </div>

        {/* Current Rule */}
        <Card className="border-2 border-orange-200 bg-orange-50" data-id="jdaiikpq7" data-path="src/components/games/FlexibilityGame.tsx">
          <CardContent className="p-4 text-center" data-id="79sg4xsc7" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="text-sm text-orange-600 mb-1" data-id="areav1fhg" data-path="src/components/games/FlexibilityGame.tsx">Current Rule:</div>
            <div className="text-lg font-bold text-orange-700" data-id="sh3958et0" data-path="src/components/games/FlexibilityGame.tsx">{rule.instruction}</div>
          </CardContent>
        </Card>

        {/* Current Item */}
        <Card className="border-2 border-gray-200" data-id="9dta57la3" data-path="src/components/games/FlexibilityGame.tsx">
          <CardContent className="p-8 text-center" data-id="7cvkxc0go" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="text-3xl font-bold text-gray-800 mb-4" data-id="wuqcyh6yu" data-path="src/components/games/FlexibilityGame.tsx">
              {currentItem}
            </div>
            <div className="grid grid-cols-2 gap-4" data-id="8z7yfrotl" data-path="src/components/games/FlexibilityGame.tsx">
              <Button
                onClick={() => handleResponse('YES')}
                className="bg-green-600 hover:bg-green-700 text-white py-6 text-xl font-bold" data-id="cegxxh7ux" data-path="src/components/games/FlexibilityGame.tsx">

                YES
              </Button>
              <Button
                onClick={() => handleResponse('NO')}
                className="bg-red-600 hover:bg-red-700 text-white py-6 text-xl font-bold" data-id="4x74o3cpm" data-path="src/components/games/FlexibilityGame.tsx">

                NO
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4 text-center" data-id="wnong2vtw" data-path="src/components/games/FlexibilityGame.tsx">
          <div data-id="408wf2bqr" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="text-lg font-bold text-green-600" data-id="7tm06x45x" data-path="src/components/games/FlexibilityGame.tsx">{correctAnswers}</div>
            <div className="text-xs text-gray-600" data-id="5k4wjykdq" data-path="src/components/games/FlexibilityGame.tsx">Correct</div>
          </div>
          <div data-id="hhm006pol" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="text-lg font-bold text-orange-600" data-id="rxt0qkz4p" data-path="src/components/games/FlexibilityGame.tsx">{streak}</div>
            <div className="text-xs text-gray-600" data-id="3y3gu48w9" data-path="src/components/games/FlexibilityGame.tsx">Streak</div>
          </div>
          <div data-id="ayn7zcr28" data-path="src/components/games/FlexibilityGame.tsx">
            <div className="text-lg font-bold text-blue-600" data-id="amka0vheg" data-path="src/components/games/FlexibilityGame.tsx">{totalAnswers}</div>
            <div className="text-xs text-gray-600" data-id="rjlhssw2g" data-path="src/components/games/FlexibilityGame.tsx">Total</div>
          </div>
        </div>
      </div>);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-100 p-4" data-id="gqjmygnuc" data-path="src/components/games/FlexibilityGame.tsx">
      <Card className="max-w-md mx-auto" data-id="myvi32dit" data-path="src/components/games/FlexibilityGame.tsx">
        <CardContent className="p-6" data-id="b59ro5gla" data-path="src/components/games/FlexibilityGame.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-6" data-id="05h7sjjlp" data-path="src/components/games/FlexibilityGame.tsx">
            <div data-id="12yrtcmne" data-path="src/components/games/FlexibilityGame.tsx">
              <h1 className="text-lg font-bold text-gray-800" data-id="gqx7zxsnp" data-path="src/components/games/FlexibilityGame.tsx">{gameConfig.name}</h1>
              <Badge className="mt-1" data-id="3aqeu5fnf" data-path="src/components/games/FlexibilityGame.tsx">{gameConfig.difficulty}</Badge>
            </div>
            <div className="flex space-x-2" data-id="audw9uvjv" data-path="src/components/games/FlexibilityGame.tsx">
              <Button variant="outline" size="sm" onClick={resetGame} data-id="k7bwxdt2o" data-path="src/components/games/FlexibilityGame.tsx">
                <RotateCcw className="h-4 w-4" data-id="1sblzdymq" data-path="src/components/games/FlexibilityGame.tsx" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExit} data-id="rgq8pbmjo" data-path="src/components/games/FlexibilityGame.tsx">
                <X className="h-4 w-4" data-id="itgiio3yx" data-path="src/components/games/FlexibilityGame.tsx" />
              </Button>
            </div>
          </div>

          {gameState === 'instructions' && renderInstructions()}
          {gameState === 'playing' && renderGame()}
        </CardContent>
      </Card>
    </div>);

};

export default FlexibilityGame;