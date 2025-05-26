import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, RotateCcw } from 'lucide-react';

interface ProblemSolvingGameProps {
  onComplete: (score: number, accuracy: number, timeSpent: number) => void;
  onExit: () => void;
  gameConfig: {
    gameId: string;
    name: string;
    difficulty: string;
  };
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const ProblemSolvingGame: React.FC<ProblemSolvingGameProps> = ({ onComplete, onExit, gameConfig }) => {
  const [gameState, setGameState] = useState<'instructions' | 'playing' | 'complete'>('instructions');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions] = useState<Question[]>([
  {
    id: 1,
    question: "If 3 + 5 = 8, what is 8 - 3?",
    options: ["3", "5", "8", "11"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which number comes next: 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "If all cats are animals, and Fluffy is a cat, then:",
    options: ["Fluffy is not an animal", "Fluffy is an animal", "Animals are cats", "Cats are not animals"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What is 15 ÷ 3?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Which pattern continues: ○●○●○?",
    options: ["○", "●", "○●", "●○"],
    correctAnswer: 1
  }]
  );
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(30);

  // Game timer
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 || currentQuestion >= questions.length) {
      completeGame();
    }
  }, [gameState, timeLeft, currentQuestion, questions.length]);

  const handleAnswer = (answerIndex: number) => {
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 20);
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeGame();
    }
  };

  const completeGame = () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    const accuracy = Math.round(correctAnswers / questions.length * 100);
    onComplete(score, accuracy, timeSpent);
  };

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestion(0);
    setTimeLeft(180); // 3 minutes for problem solving
  };

  const resetGame = () => {
    setGameState('instructions');
    setScore(0);
    setCorrectAnswers(0);
    setCurrentQuestion(0);
    setTimeLeft(180);
  };

  const renderInstructions = () =>
  <div className="text-center space-y-6 p-6" data-id="1luilv2xa" data-path="src/components/games/ProblemSolvingGame.tsx">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center" data-id="3s8slbn4b" data-path="src/components/games/ProblemSolvingGame.tsx">
        <Lightbulb className="h-8 w-8 text-green-600" data-id="htcc5lso5" data-path="src/components/games/ProblemSolvingGame.tsx" />
      </div>
      <div data-id="5d2cgl2v0" data-path="src/components/games/ProblemSolvingGame.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2" data-id="i0qzny2ro" data-path="src/components/games/ProblemSolvingGame.tsx">Problem Solving</h2>
        <p className="text-gray-600 leading-relaxed" data-id="52106hb7g" data-path="src/components/games/ProblemSolvingGame.tsx">
          Test your logical thinking and analytical skills with various problem types.
        </p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg space-y-2" data-id="cyssc14om" data-path="src/components/games/ProblemSolvingGame.tsx">
        <h3 className="font-semibold text-green-700" data-id="ejcz12t1x" data-path="src/components/games/ProblemSolvingGame.tsx">How to Play:</h3>
        <ul className="text-sm text-green-600 space-y-1" data-id="n3875j80g" data-path="src/components/games/ProblemSolvingGame.tsx">
          <li data-id="hmk8b06yd" data-path="src/components/games/ProblemSolvingGame.tsx">• Read each question carefully</li>
          <li data-id="nafxh0seo" data-path="src/components/games/ProblemSolvingGame.tsx">• Choose the best answer</li>
          <li data-id="ca8ky07aq" data-path="src/components/games/ProblemSolvingGame.tsx">• Work through {questions.length} problems</li>
          <li data-id="z2y23cwi8" data-path="src/components/games/ProblemSolvingGame.tsx">• Complete within 3 minutes</li>
        </ul>
      </div>
      <Button
      onClick={startGame}
      className="w-full bg-green-600 hover:bg-green-700 py-3" data-id="wp4upfpin" data-path="src/components/games/ProblemSolvingGame.tsx">

        Start Game
      </Button>
    </div>;


  const renderGame = () => {
    const question = questions[currentQuestion];
    const progress = (currentQuestion + 1) / questions.length * 100;

    return (
      <div className="space-y-6" data-id="82boeno78" data-path="src/components/games/ProblemSolvingGame.tsx">
        {/* Progress */}
        <div className="space-y-2" data-id="l89be7414" data-path="src/components/games/ProblemSolvingGame.tsx">
          <div className="flex justify-between text-sm text-gray-600" data-id="mknjah273" data-path="src/components/games/ProblemSolvingGame.tsx">
            <span data-id="48wd4m9lc" data-path="src/components/games/ProblemSolvingGame.tsx">Question {currentQuestion + 1} of {questions.length}</span>
            <span data-id="p5jza9hkl" data-path="src/components/games/ProblemSolvingGame.tsx">{timeLeft}s remaining</span>
          </div>
          <Progress value={progress} className="h-2" data-id="6c48jpo3p" data-path="src/components/games/ProblemSolvingGame.tsx" />
        </div>

        {/* Score */}
        <div className="text-center" data-id="wfyzr3hk2" data-path="src/components/games/ProblemSolvingGame.tsx">
          <div className="text-2xl font-bold text-green-600" data-id="q2ti6sumr" data-path="src/components/games/ProblemSolvingGame.tsx">{score}</div>
          <div className="text-sm text-gray-600" data-id="qz1ps6qqb" data-path="src/components/games/ProblemSolvingGame.tsx">Score</div>
        </div>

        {/* Question */}
        <Card className="border-2 border-green-100" data-id="pesdie98b" data-path="src/components/games/ProblemSolvingGame.tsx">
          <CardContent className="p-6" data-id="9l3aai1lx" data-path="src/components/games/ProblemSolvingGame.tsx">
            <h3 className="text-lg font-semibold mb-4 text-center" data-id="6tudpgeai" data-path="src/components/games/ProblemSolvingGame.tsx">
              {question.question}
            </h3>
            
            <div className="space-y-3" data-id="wozudc6sd" data-path="src/components/games/ProblemSolvingGame.tsx">
              {question.options.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start py-3 h-auto hover:bg-green-50 hover:border-green-300"
                onClick={() => handleAnswer(index)} data-id="t98uysy38" data-path="src/components/games/ProblemSolvingGame.tsx">

                  <div className="flex items-center space-x-3" data-id="fib2ymh8j" data-path="src/components/games/ProblemSolvingGame.tsx">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm font-semibold" data-id="070d72fef" data-path="src/components/games/ProblemSolvingGame.tsx">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span data-id="sus9cj7vj" data-path="src/components/games/ProblemSolvingGame.tsx">{option}</span>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>);

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 p-4" data-id="vph8608nr" data-path="src/components/games/ProblemSolvingGame.tsx">
      <Card className="max-w-md mx-auto" data-id="mw7rho1kq" data-path="src/components/games/ProblemSolvingGame.tsx">
        <CardContent className="p-6" data-id="602ix1ps7" data-path="src/components/games/ProblemSolvingGame.tsx">
          {/* Header */}
          <div className="flex items-center justify-between mb-6" data-id="lspznyidf" data-path="src/components/games/ProblemSolvingGame.tsx">
            <div data-id="6toif3tv2" data-path="src/components/games/ProblemSolvingGame.tsx">
              <h1 className="text-lg font-bold text-gray-800" data-id="u2uwxzl9z" data-path="src/components/games/ProblemSolvingGame.tsx">{gameConfig.name}</h1>
              <Badge className="mt-1" data-id="raj98a2k4" data-path="src/components/games/ProblemSolvingGame.tsx">{gameConfig.difficulty}</Badge>
            </div>
            <div className="flex space-x-2" data-id="vd08noww0" data-path="src/components/games/ProblemSolvingGame.tsx">
              <Button variant="outline" size="sm" onClick={resetGame} data-id="vhii1i5cy" data-path="src/components/games/ProblemSolvingGame.tsx">
                <RotateCcw className="h-4 w-4" data-id="0vkxs85ti" data-path="src/components/games/ProblemSolvingGame.tsx" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExit} data-id="kr8le268z" data-path="src/components/games/ProblemSolvingGame.tsx">
                <X className="h-4 w-4" data-id="x70maa5uk" data-path="src/components/games/ProblemSolvingGame.tsx" />
              </Button>
            </div>
          </div>

          {gameState === 'instructions' && renderInstructions()}
          {gameState === 'playing' && renderGame()}
        </CardContent>
      </Card>
    </div>);

};

export default ProblemSolvingGame;