import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Brain, RotateCcw } from 'lucide-react';
import { useMLEngine } from '@/components/ml/MLEngine';
import VoiceCoach from '@/components/ml/VoiceCoach';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface MemoryGameProps {
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
  gameConfig: {
    gameId: string;
    name: string;
    difficulty: string;
  };
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onComplete, onExit, gameConfig }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const { isAnalyzing, recommendations, analyzePerfomance } = useMLEngine();

  const [gameState, setGameState] = useState<'instructions' | 'memorize' | 'recall' | 'feedback' | 'complete'>('instructions');
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [startTime, setStartTime] = useState(Date.now());
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [patternStartTime, setPatternStartTime] = useState(0);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(false);
  const [adaptiveDifficulty, setAdaptiveDifficulty] = useState(1);

  const gridSize = 9; // 3x3 grid
  const patternLength = Math.min(3 + currentLevel, 8); // Grows with level
  const memorizationTime = Math.max(3000 - currentLevel * 200, 1000); // Gets faster

  useEffect(() => {
    if (gameState === 'memorize') {
      generatePattern();
    }
  }, [gameState, currentLevel]);

  const generatePattern = () => {
    const newPattern = [];
    for (let i = 0; i < patternLength; i++) {
      newPattern.push(Math.floor(Math.random() * gridSize));
    }
    setPattern(newPattern);
    setUserPattern([]);
    showPattern(newPattern);
  };

  const showPattern = (patternToShow: number[]) => {
    setShowingPattern(true);
    setPatternStartTime(Date.now());
    let index = 0;

    const showNext = () => {
      if (index < patternToShow.length) {
        // Highlight current cell
        setTimeout(() => {
          index++;
          showNext();
        }, 600);
      } else {
        // Pattern shown completely, wait a bit then allow input
        setTimeout(() => {
          setShowingPattern(false);
          setGameState('recall');
        }, 500);
      }
    };

    showNext();
  };

  const handleCellClick = (cellIndex: number) => {
    if (gameState !== 'recall' || showingPattern) return;

    // Record reaction time
    const reactionTime = Date.now() - patternStartTime;
    setReactionTimes((prev) => [...prev, reactionTime]);

    const newUserPattern = [...userPattern, cellIndex];
    setUserPattern(newUserPattern);

    // Check if pattern is complete
    if (newUserPattern.length === pattern.length) {
      checkPattern(newUserPattern);
    }
  };

  const checkPattern = (userPattern: number[]) => {
    const correct = JSON.stringify(pattern) === JSON.stringify(userPattern);
    setIsCorrect(correct);
    setGameState('feedback');

    if (!correct) {
      setMistakesCount((prev) => prev + 1);
    }

    if (correct) {
      setScore(score + currentLevel * 10);
      setTimeout(() => {
        if (currentLevel >= 5) {
          // Game complete
          completeGame();
        } else {
          // Apply adaptive difficulty if available
          const newLevel = recommendations.difficulty ?
          recommendations.difficulty.newDifficulty : currentLevel + 1;
          setCurrentLevel(newLevel);
          setGameState('memorize');
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setTimeout(() => {
        if (newLives <= 0) {
          completeGame();
        } else {
          setGameState('memorize');
          setIsCorrect(null);
        }
      }, 1500);
    }
  };

  const completeGame = async () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const accuracy = score / (5 * 10) * 100; // Max possible score
    const avgReactionTime = reactionTimes.length > 0 ?
    reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length : 0;

    // Save performance data and get ML recommendations
    if (user) {
      try {
        // Save to database
        await window.ezsite.apis.tableCreate(9903, {
          user_id: user.ID,
          game_type: 'memory',
          session_id: `memory_${Date.now()}`,
          difficulty_level: currentLevel,
          score,
          accuracy,
          reaction_time: avgReactionTime,
          time_spent: timeSpent,
          mistakes_count: mistakesCount,
          performance_trend: accuracy > 70 ? 'improving' : accuracy > 50 ? 'stable' : 'declining'
        });

        // Get ML analysis
        await analyzePerfomance({
          score,
          accuracy,
          timeSpent,
          reactionTime: avgReactionTime,
          mistakesCount,
          difficultyLevel: currentLevel,
          gameType: 'memory'
        }, user.ID);

        // Show ML recommendations
        if (recommendations.difficulty) {
          toast({
            title: "Performance Analysis",
            description: recommendations.difficulty.reason,
            duration: 5000
          });
        }

      } catch (error) {
        console.error('Error saving performance data:', error);
      }
    }

    onComplete(score, accuracy, timeSpent);
  };

  const resetGame = () => {
    setCurrentLevel(1);
    setScore(0);
    setLives(3);
    setStartTime(Date.now());
    setGameState('memorize');
    setIsCorrect(null);
  };

  const renderInstructions = () =>
  <div className="text-center space-y-6 p-6" data-id="3ax6g3gbl" data-path="src/components/games/MemoryGame.tsx">
      <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center" data-id="omiep4ny4" data-path="src/components/games/MemoryGame.tsx">
        <Brain className="h-8 w-8 text-purple-600" data-id="z1hum5gha" data-path="src/components/games/MemoryGame.tsx" />
      </div>
      <div data-id="yvnhcwve9" data-path="src/components/games/MemoryGame.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="8gyqmgbkm" data-path="src/components/games/MemoryGame.tsx">Pattern Memory</h2>
        <p className="text-gray-600 leading-relaxed" data-id="exs1tmnz1" data-path="src/components/games/MemoryGame.tsx">
          Watch carefully as a sequence of squares lights up, then recreate the pattern by tapping the squares in the same order.
        </p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg space-y-2" data-id="so92e85my" data-path="src/components/games/MemoryGame.tsx">
        <h3 className="font-semibold text-purple-700" data-id="tnk5deko5" data-path="src/components/games/MemoryGame.tsx">How to Play:</h3>
        <ul className="text-sm text-purple-600 space-y-1" data-id="9y9tklsd3" data-path="src/components/games/MemoryGame.tsx">
          <li data-id="jzn2xujqu" data-path="src/components/games/MemoryGame.tsx">• Watch the pattern carefully</li>
          <li data-id="nlvtdw8qu" data-path="src/components/games/MemoryGame.tsx">• Tap squares in the same order</li>
          <li data-id="gwmgpgbvd" data-path="src/components/games/MemoryGame.tsx">• Patterns get longer each level</li>
          <li data-id="nmqh2ql58" data-path="src/components/games/MemoryGame.tsx">• You have 3 lives</li>
        </ul>
      </div>
      <Button
      onClick={() => {
        setStartTime(Date.now());
        setGameState('memorize');
      }}
      className="w-full bg-purple-600 hover:bg-purple-700 py-3" data-id="h229058r1" data-path="src/components/games/MemoryGame.tsx">

        Start Game
      </Button>
    </div>;


  const renderGrid = () => {
    const currentPatternIndex = showingPattern ?
    Math.floor((Date.now() - patternStartTime) / 600) % (pattern.length + 1) : -1;
    const highlightCell = showingPattern && currentPatternIndex < pattern.length ?
    pattern[currentPatternIndex] : -1;

    return (
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-4" data-id="v99jn6bpt" data-path="src/components/games/MemoryGame.tsx">
        {Array.from({ length: gridSize }, (_, index) => {
          const isHighlighted = highlightCell === index;
          const isUserSelected = userPattern.includes(index);
          const isInPattern = pattern.includes(index);
          const showCorrectPattern = gameState === 'feedback' && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={gameState !== 'recall'}
              className={`
                aspect-square rounded-xl border-3 transition-all duration-300 text-xl font-bold
                min-h-[80px] min-w-[80px] shadow-lg
                ${
              isHighlighted ?
              'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-700 text-white scale-110 shadow-purple-300' :
              isUserSelected ?
              'bg-gradient-to-br from-blue-300 to-blue-500 border-blue-600 text-white shadow-blue-200' :
              showCorrectPattern && isInPattern ?
              'bg-gradient-to-br from-green-300 to-green-500 border-green-600 text-white shadow-green-200' :
              'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400 hover:border-purple-500 hover:from-purple-50 hover:to-purple-100 text-gray-700 hover:shadow-purple-200'}
                ${

              gameState === 'recall' && !showingPattern ?
              'cursor-pointer active:scale-95 hover:scale-105' :
              'cursor-default'}
              `
              } data-id="iq3fdciyx" data-path="src/components/games/MemoryGame.tsx">

              {isUserSelected ? userPattern.indexOf(index) + 1 : ''}
            </button>);

        })}
      </div>);

  };

  const renderGameStats = () =>
  <div className="flex justify-between items-center mb-6" data-id="jj4gc83ns" data-path="src/components/games/MemoryGame.tsx">
      <div className="text-center" data-id="z94wxacci" data-path="src/components/games/MemoryGame.tsx">
        <div className="text-2xl font-bold text-purple-600" data-id="c3pmblbsg" data-path="src/components/games/MemoryGame.tsx">{currentLevel}</div>
        <div className="text-xs text-gray-600" data-id="njwcluckj" data-path="src/components/games/MemoryGame.tsx">Level</div>
      </div>
      <div className="text-center" data-id="ogtrsvlss" data-path="src/components/games/MemoryGame.tsx">
        <div className="text-2xl font-bold text-blue-600" data-id="nc8wr0wwu" data-path="src/components/games/MemoryGame.tsx">{score}</div>
        <div className="text-xs text-gray-600" data-id="v11ue3jh5" data-path="src/components/games/MemoryGame.tsx">Score</div>
      </div>
      <div className="text-center" data-id="6cjljafoo" data-path="src/components/games/MemoryGame.tsx">
        <div className="text-2xl font-bold text-red-600" data-id="1dwgxqiqk" data-path="src/components/games/MemoryGame.tsx">{lives}</div>
        <div className="text-xs text-gray-600" data-id="l7izt4r84" data-path="src/components/games/MemoryGame.tsx">Lives</div>
      </div>
    </div>;


  const renderFeedback = () =>
  <div className="text-center space-y-4" data-id="eqaebxz4r" data-path="src/components/games/MemoryGame.tsx">
      <div className={`text-6xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`} data-id="v0c3lvauq" data-path="src/components/games/MemoryGame.tsx">
        {isCorrect ? '✓' : '✗'}
      </div>
      <div className={`text-xl font-bold ${
    isCorrect ? 'text-green-600' : 'text-red-600'}`
    } data-id="xnzwokfaj" data-path="src/components/games/MemoryGame.tsx">
        {isCorrect ? 'Perfect!' : 'Not quite right'}
      </div>
      {!isCorrect &&
    <p className="text-gray-600" data-id="u9ne5fhyp" data-path="src/components/games/MemoryGame.tsx">The correct pattern was highlighted in green</p>
    }
    </div>;


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4" data-id="qac5zol7u" data-path="src/components/games/MemoryGame.tsx">
      <Card className="max-w-md mx-auto" data-id="fhcjhtdn3" data-path="src/components/games/MemoryGame.tsx">
        <CardContent className="p-6" data-id="vnsbi0rr2" data-path="src/components/games/MemoryGame.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-4" data-id="p8wnmf4nx" data-path="src/components/games/MemoryGame.tsx">
            <div data-id="shpatfvts" data-path="src/components/games/MemoryGame.tsx">
              <h1 className="text-lg font-bold text-gray-800" data-id="2oujndbeq" data-path="src/components/games/MemoryGame.tsx">{gameConfig.name}</h1>
              <Badge className="mt-1" data-id="j1pjsmuw6" data-path="src/components/games/MemoryGame.tsx">{gameConfig.difficulty}</Badge>
            </div>
            <div className="flex space-x-2" data-id="n93414m2q" data-path="src/components/games/MemoryGame.tsx">
              <Button variant="outline" size="sm" onClick={resetGame} data-id="86b1td19b" data-path="src/components/games/MemoryGame.tsx">
                <RotateCcw className="h-4 w-4" data-id="fd0hjm5hq" data-path="src/components/games/MemoryGame.tsx" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExit} data-id="7q7ocjvvx" data-path="src/components/games/MemoryGame.tsx">
                <X className="h-4 w-4" data-id="6ap49hjbv" data-path="src/components/games/MemoryGame.tsx" />
              </Button>
            </div>
          </div>

          {/* Voice Coach */}
          {gameState !== 'instructions' &&
          <div className="mb-4" data-id="7k2fq56n4" data-path="src/components/games/MemoryGame.tsx">
              <VoiceCoach
              gameType="memory"
              currentLevel={currentLevel}
              isEnabled={voiceCoachEnabled}
              onToggle={setVoiceCoachEnabled}
              performance={{
                accuracy: score / (currentLevel * 10) * 100,
                score,
                streak: isCorrect ? lives === 3 ? currentLevel : 0 : 0
              }} data-id="u06qhzk9q" data-path="src/components/games/MemoryGame.tsx" />

            </div>
          }

          {gameState === 'instructions' && renderInstructions()}
          
          {(gameState === 'memorize' || gameState === 'recall' || gameState === 'feedback') &&
          <div className="space-y-6" data-id="kh0p0duag" data-path="src/components/games/MemoryGame.tsx">
              {renderGameStats()}
              
              <div className="text-center" data-id="isayivnx8" data-path="src/components/games/MemoryGame.tsx">
                <div className="text-lg font-semibold text-gray-700 mb-2" data-id="wx2618x7p" data-path="src/components/games/MemoryGame.tsx">
                  {gameState === 'memorize' && 'Watch the pattern...'}
                  {gameState === 'recall' && `Tap ${pattern.length} squares in order`}
                  {gameState === 'feedback' && (isCorrect ? 'Great job!' : 'Try again!')}
                </div>
                
                {gameState === 'recall' &&
              <Progress
                value={userPattern.length / pattern.length * 100}
                className="h-2 mb-4" data-id="5aens4wvb" data-path="src/components/games/MemoryGame.tsx" />

              }
              </div>

              {gameState === 'feedback' && renderFeedback()}
              {gameState !== 'feedback' && renderGrid()}
              {gameState === 'feedback' && !isCorrect && renderGrid()}
            </div>
          }
        </CardContent>
      </Card>
    </div>);

};

export default MemoryGame;