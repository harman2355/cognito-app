import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Puzzle, Calculator, CheckCircle, XCircle } from 'lucide-react';

interface ProblemSolvingGameProps {
  level: number;
  difficulty: string;
  onComplete: (result: {score: number;accuracy: number;time: number;}) => void;
  isPaused: boolean;
}

type GamePhase = 'instruction' | 'playing' | 'completed';
type ProblemType = 'math' | 'logic' | 'pattern';

interface Problem {
  id: number;
  type: ProblemType;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  timeLimit: number;
}

const ProblemSolvingGame: React.FC<ProblemSolvingGameProps> = ({ level, difficulty, onComplete, isPaused }) => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('instruction');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [problemStartTime, setProblemStartTime] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState(30000);
  const [showExplanation, setShowExplanation] = useState(false);

  const totalProblems = 6;
  const baseTimeLimit = Math.max(30000 - level * 2000, 15000); // 30s to 15s

  const difficultyModifiers = {
    easy: { complexityMultiplier: 0.7, timeMultiplier: 1.2 },
    medium: { complexityMultiplier: 1.0, timeMultiplier: 1.0 },
    hard: { complexityMultiplier: 1.3, timeMultiplier: 0.8 },
    expert: { complexityMultiplier: 1.6, timeMultiplier: 0.6 },
    master: { complexityMultiplier: 2.0, timeMultiplier: 0.5 }
  };

  const currentDifficultyModifier = difficultyModifiers[difficulty as keyof typeof difficultyModifiers] || difficultyModifiers.medium;

  useEffect(() => {
    if (gamePhase === 'playing' && !isPaused && !showExplanation) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            handleAnswerSubmit(null);
            return currentProblem?.timeLimit || baseTimeLimit;
          }
          return newTime;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gamePhase, isPaused, showExplanation, currentProblem]);

  const generateMathProblem = useCallback((complexity: number): Problem => {
    const operations = ['+', '-', '*', '/'];
    const maxNumber = Math.floor(10 + complexity * 5);

    let question: string;
    let correctAnswer: number;
    let options: string[];

    if (complexity < 1) {
      // Simple addition/subtraction
      const a = Math.floor(Math.random() * maxNumber) + 1;
      const b = Math.floor(Math.random() * maxNumber) + 1;
      const op = Math.random() < 0.5 ? '+' : '-';

      if (op === '+') {
        question = `${a} + ${b} = ?`;
        correctAnswer = a + b;
      } else {
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        question = `${larger} - ${smaller} = ?`;
        correctAnswer = larger - smaller;
      }
    } else {
      // Multi-step problems
      const a = Math.floor(Math.random() * maxNumber) + 1;
      const b = Math.floor(Math.random() * maxNumber) + 1;
      const c = Math.floor(Math.random() * maxNumber) + 1;

      question = `(${a} + ${b}) × ${c} = ?`;
      correctAnswer = (a + b) * c;
    }

    // Generate options
    const wrongAnswers = [
    correctAnswer + Math.floor(Math.random() * 10) + 1,
    correctAnswer - Math.floor(Math.random() * 10) - 1,
    Math.floor(correctAnswer * 1.5)];


    const allOptions = [correctAnswer, ...wrongAnswers].
    sort(() => Math.random() - 0.5).
    map((n) => n.toString());

    const correctIndex = allOptions.indexOf(correctAnswer.toString());

    return {
      id: Date.now(),
      type: 'math',
      question,
      options: allOptions,
      correctAnswer: correctIndex,
      explanation: `The correct answer is ${correctAnswer}.`,
      timeLimit: Math.floor(baseTimeLimit * currentDifficultyModifier.timeMultiplier)
    };
  }, [baseTimeLimit, currentDifficultyModifier]);

  const generateLogicProblem = useCallback((complexity: number): Problem => {
    const logicProblems = [
    {
      question: "If all roses are flowers and some flowers are red, then:",
      options: [
      "All roses are red",
      "Some roses might be red",
      "No roses are red",
      "All flowers are roses"],

      correctAnswer: 1,
      explanation: "We can't conclude that all roses are red, but some roses might be red since some flowers are red."
    },
    {
      question: "What comes next in the sequence: 2, 6, 18, 54, ?",
      options: ["108", "162", "216", "270"],
      correctAnswer: 1,
      explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
    },
    {
      question: "If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?",
      options: ["5 minutes", "20 minutes", "100 minutes", "500 minutes"],
      correctAnswer: 0,
      explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes."
    }];


    const problem = logicProblems[Math.floor(Math.random() * logicProblems.length)];

    return {
      id: Date.now(),
      type: 'logic',
      timeLimit: Math.floor(baseTimeLimit * currentDifficultyModifier.timeMultiplier),
      ...problem
    };
  }, [baseTimeLimit, currentDifficultyModifier]);

  const generatePatternProblem = useCallback((complexity: number): Problem => {
    const patterns = [
    {
      question: "Which shape completes the pattern? ○ △ ○ △ ○ ?",
      options: ["○", "△", "□", "◇"],
      correctAnswer: 1,
      explanation: "The pattern alternates between circle and triangle."
    },
    {
      question: "What number comes next: 1, 4, 9, 16, 25, ?",
      options: ["30", "36", "42", "49"],
      correctAnswer: 1,
      explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6² = 36"
    },
    {
      question: "Complete the pattern: A1, C3, E5, G7, ?",
      options: ["H8", "I9", "I8", "J9"],
      correctAnswer: 1,
      explanation: "Letters skip one (A,C,E,G,I) and numbers increase by 2 (1,3,5,7,9)"
    }];


    const problem = patterns[Math.floor(Math.random() * patterns.length)];

    return {
      id: Date.now(),
      type: 'pattern',
      timeLimit: Math.floor(baseTimeLimit * currentDifficultyModifier.timeMultiplier),
      ...problem
    };
  }, [baseTimeLimit, currentDifficultyModifier]);

  const generateProblems = useCallback(() => {
    const newProblems: Problem[] = [];

    for (let i = 0; i < totalProblems; i++) {
      const complexity = (level + i * 0.5) * currentDifficultyModifier.complexityMultiplier;
      const problemTypes: ProblemType[] = ['math', 'logic', 'pattern'];
      const randomType = problemTypes[Math.floor(Math.random() * problemTypes.length)];

      let problem: Problem;

      switch (randomType) {
        case 'math':
          problem = generateMathProblem(complexity);
          break;
        case 'logic':
          problem = generateLogicProblem(complexity);
          break;
        case 'pattern':
          problem = generatePatternProblem(complexity);
          break;
      }

      newProblems.push(problem);
    }

    return newProblems;
  }, [level, currentDifficultyModifier, generateMathProblem, generateLogicProblem, generatePatternProblem]);

  const startGame = () => {
    const newProblems = generateProblems();
    setProblems(newProblems);
    setCurrentProblem(newProblems[0]);
    setCurrentProblemIndex(0);
    setTimeRemaining(newProblems[0].timeLimit);
    setProblemStartTime(Date.now());
    setGamePhase('playing');
    setStartTime(Date.now());
  };

  const handleAnswerSubmit = (answerIndex: number | null) => {
    if (!currentProblem) return;

    const isCorrect = answerIndex === currentProblem.correctAnswer;
    const timeTaken = Date.now() - problemStartTime;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      const timeBonus = Math.max(currentProblem.timeLimit - timeTaken, 0) / 100;
      const problemScore = Math.floor(100 + timeBonus);
      setScore((prev) => prev + problemScore);
    }

    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    setTimeout(() => {
      if (currentProblemIndex < totalProblems - 1) {
        nextProblem();
      } else {
        completeGame();
      }
    }, 3000);
  };

  const nextProblem = () => {
    const nextIndex = currentProblemIndex + 1;
    setCurrentProblemIndex(nextIndex);
    setCurrentProblem(problems[nextIndex]);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimeRemaining(problems[nextIndex].timeLimit);
    setProblemStartTime(Date.now());
  };

  const completeGame = () => {
    const finalTime = Date.now() - startTime;
    const accuracy = Math.round(correctAnswers / totalProblems * 100);
    setGamePhase('completed');

    setTimeout(() => {
      onComplete({
        score,
        accuracy,
        time: finalTime
      });
    }, 1000);
  };

  const getTypeIcon = (type: ProblemType) => {
    switch (type) {
      case 'math':
        return <Calculator className="w-4 h-4" data-id="3hzib3oi9" data-path="src/components/games/ProblemSolvingGame.tsx" />;
      case 'logic':
        return <Puzzle className="w-4 h-4" data-id="ql4vxvzk9" data-path="src/components/games/ProblemSolvingGame.tsx" />;
      case 'pattern':
        return <div className="w-4 h-4 bg-purple-600 rounded-sm" data-id="4t2q3g1p2" data-path="src/components/games/ProblemSolvingGame.tsx"></div>;
    }
  };

  const getTypeColor = (type: ProblemType) => {
    switch (type) {
      case 'math':
        return 'bg-blue-500';
      case 'logic':
        return 'bg-purple-500';
      case 'pattern':
        return 'bg-green-500';
    }
  };

  const renderPhaseContent = () => {
    switch (gamePhase) {
      case 'instruction':
        return (
          <div className="p-6 text-center space-y-4" data-id="npxyvkkak" data-path="src/components/games/ProblemSolvingGame.tsx">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto" data-id="b7w0bw7lo" data-path="src/components/games/ProblemSolvingGame.tsx">
              <Puzzle className="w-8 h-8 text-purple-600" data-id="b3trrr4vn" data-path="src/components/games/ProblemSolvingGame.tsx" />
            </div>
            <div data-id="fq2hq52ha" data-path="src/components/games/ProblemSolvingGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="j8dolrb5z" data-path="src/components/games/ProblemSolvingGame.tsx">Problem Solving Challenge</h3>
              <p className="text-gray-600 text-sm leading-relaxed" data-id="00maooud8" data-path="src/components/games/ProblemSolvingGame.tsx">
                Solve various types of problems including math, logic, and pattern recognition. 
                Each problem has a time limit!
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-left" data-id="86y59vaqi" data-path="src/components/games/ProblemSolvingGame.tsx">
              <div className="text-sm space-y-1" data-id="he8nn7w70" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div data-id="6y0yrbzix" data-path="src/components/games/ProblemSolvingGame.tsx"><strong data-id="5zlo0ygqu" data-path="src/components/games/ProblemSolvingGame.tsx">Problem Types:</strong> Math, Logic, Patterns</div>
                <div data-id="banuw0u9c" data-path="src/components/games/ProblemSolvingGame.tsx"><strong data-id="pafzdn1n5" data-path="src/components/games/ProblemSolvingGame.tsx">Total Problems:</strong> {totalProblems}</div>
                <div data-id="p99j5sb08" data-path="src/components/games/ProblemSolvingGame.tsx"><strong data-id="8z1u9ggqs" data-path="src/components/games/ProblemSolvingGame.tsx">Time per problem:</strong> {Math.round(baseTimeLimit * currentDifficultyModifier.timeMultiplier / 1000)}s</div>
                <div data-id="kw0o9ld0h" data-path="src/components/games/ProblemSolvingGame.tsx"><strong data-id="40ub9h6e1" data-path="src/components/games/ProblemSolvingGame.tsx">Difficulty:</strong> {difficulty}</div>
              </div>
            </div>
            <div className="flex justify-center gap-2" data-id="itxpyxg11" data-path="src/components/games/ProblemSolvingGame.tsx">
              <Badge className="bg-blue-500 text-white flex items-center gap-1" data-id="cf2lzi3tt" data-path="src/components/games/ProblemSolvingGame.tsx">
                <Calculator className="w-3 h-3" data-id="ihdpool83" data-path="src/components/games/ProblemSolvingGame.tsx" />
                Math
              </Badge>
              <Badge className="bg-purple-500 text-white flex items-center gap-1" data-id="j894jvb7i" data-path="src/components/games/ProblemSolvingGame.tsx">
                <Puzzle className="w-3 h-3" data-id="58r3jhyvi" data-path="src/components/games/ProblemSolvingGame.tsx" />
                Logic
              </Badge>
              <Badge className="bg-green-500 text-white" data-id="ovjburdjx" data-path="src/components/games/ProblemSolvingGame.tsx">
                Patterns
              </Badge>
            </div>
            <Button
              onClick={startGame}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white" data-id="9x35qafc7" data-path="src/components/games/ProblemSolvingGame.tsx">

              Start Problem Solving
            </Button>
          </div>);


      case 'playing':
        if (!currentProblem) return null;

        return (
          <div className="p-4 space-y-4" data-id="k4i9bsldf" data-path="src/components/games/ProblemSolvingGame.tsx">
            <div className="flex justify-between items-center" data-id="yeoy2wcj3" data-path="src/components/games/ProblemSolvingGame.tsx">
              <div data-id="7cf8z6zks" data-path="src/components/games/ProblemSolvingGame.tsx">
                <Badge className={`${getTypeColor(currentProblem.type)} text-white flex items-center gap-1`} data-id="d4rersqgl" data-path="src/components/games/ProblemSolvingGame.tsx">
                  {getTypeIcon(currentProblem.type)}
                  {currentProblem.type}
                </Badge>
              </div>
              <div className="text-right" data-id="wzy7ri3j6" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div className="text-sm text-gray-600" data-id="ffa48ny4d" data-path="src/components/games/ProblemSolvingGame.tsx">
                  Problem {currentProblemIndex + 1} of {totalProblems}
                </div>
                <div className="text-lg font-bold text-purple-600" data-id="37xekhj67" data-path="src/components/games/ProblemSolvingGame.tsx">{score}</div>
              </div>
            </div>
            
            <div className="space-y-2" data-id="qp1z5mpvh" data-path="src/components/games/ProblemSolvingGame.tsx">
              <div className="flex justify-between text-sm" data-id="80wb04qwa" data-path="src/components/games/ProblemSolvingGame.tsx">
                <span data-id="tja4anjk1" data-path="src/components/games/ProblemSolvingGame.tsx">Time Remaining</span>
                <span className={timeRemaining < 5000 ? 'text-red-600 font-bold' : 'text-gray-600'} data-id="b4eblmx3p" data-path="src/components/games/ProblemSolvingGame.tsx">
                  {Math.ceil(timeRemaining / 1000)}s
                </span>
              </div>
              <Progress
                value={timeRemaining / currentProblem.timeLimit * 100}
                className={`h-2 ${timeRemaining < 5000 ? 'bg-red-100' : ''}`} data-id="3tneifbqi" data-path="src/components/games/ProblemSolvingGame.tsx" />

            </div>
            
            <Card className="bg-gray-50" data-id="128acif05" data-path="src/components/games/ProblemSolvingGame.tsx">
              <CardContent className="p-4" data-id="nu9xwp19p" data-path="src/components/games/ProblemSolvingGame.tsx">
                <h4 className="font-semibold text-gray-800 mb-3 text-center" data-id="tc3n8csxu" data-path="src/components/games/ProblemSolvingGame.tsx">
                  {currentProblem.question}
                </h4>
              </CardContent>
            </Card>
            
            {!showExplanation ?
            <div className="space-y-2" data-id="p98h7ou0k" data-path="src/components/games/ProblemSolvingGame.tsx">
                {currentProblem.options.map((option, index) =>
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => handleAnswerSubmit(index)} data-id="qts4a6m89" data-path="src/components/games/ProblemSolvingGame.tsx">

                    <span className="font-semibold mr-2" data-id="8udhf14ow" data-path="src/components/games/ProblemSolvingGame.tsx">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
              )}
              </div> :

            <div className="space-y-3" data-id="6ufsd3y2l" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div className="space-y-2" data-id="ky10i6uf2" data-path="src/components/games/ProblemSolvingGame.tsx">
                  {currentProblem.options.map((option, index) => {
                  let buttonClass = "w-full text-left justify-start ";
                  if (index === currentProblem.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800";
                  } else if (index === selectedAnswer && index !== currentProblem.correctAnswer) {
                    buttonClass += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                  }

                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className={buttonClass}
                      disabled data-id="aq77i1i6o" data-path="src/components/games/ProblemSolvingGame.tsx">

                        <span className="font-semibold mr-2" data-id="ul3oihc30" data-path="src/components/games/ProblemSolvingGame.tsx">{String.fromCharCode(65 + index)}.</span>
                        {option}
                        {index === currentProblem.correctAnswer &&
                      <CheckCircle className="w-4 h-4 ml-auto text-green-600" data-id="gn2xveto6" data-path="src/components/games/ProblemSolvingGame.tsx" />
                      }
                        {index === selectedAnswer && index !== currentProblem.correctAnswer &&
                      <XCircle className="w-4 h-4 ml-auto text-red-600" data-id="4qnnkcxd5" data-path="src/components/games/ProblemSolvingGame.tsx" />
                      }
                      </Button>);

                })}
                </div>
                
                <Card className="bg-blue-50 border-blue-200" data-id="66qdgz4sm" data-path="src/components/games/ProblemSolvingGame.tsx">
                  <CardContent className="p-3" data-id="l8iyniq56" data-path="src/components/games/ProblemSolvingGame.tsx">
                    <div className="text-sm text-blue-800" data-id="11p591wvu" data-path="src/components/games/ProblemSolvingGame.tsx">
                      <strong data-id="kf9br02wz" data-path="src/components/games/ProblemSolvingGame.tsx">Explanation:</strong> {currentProblem.explanation}
                    </div>
                  </CardContent>
                </Card>
              </div>
            }
          </div>);


      case 'completed':
        const accuracy = Math.round(correctAnswers / totalProblems * 100);

        return (
          <div className="p-6 text-center space-y-4" data-id="2iowvfitx" data-path="src/components/games/ProblemSolvingGame.tsx">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto" data-id="d7ylhzsfv" data-path="src/components/games/ProblemSolvingGame.tsx">
              <CheckCircle className="w-8 h-8 text-green-600" data-id="wb25es08r" data-path="src/components/games/ProblemSolvingGame.tsx" />
            </div>
            <div data-id="49epkkir0" data-path="src/components/games/ProblemSolvingGame.tsx">
              <h3 className="text-lg font-bold text-gray-800 mb-2" data-id="xa44xq5fz" data-path="src/components/games/ProblemSolvingGame.tsx">Challenge Complete!</h3>
              <p className="text-gray-600 text-sm" data-id="2fkjkys97" data-path="src/components/games/ProblemSolvingGame.tsx">
                You've completed all {totalProblems} problems. Great work!
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center" data-id="jnk75k4l3" data-path="src/components/games/ProblemSolvingGame.tsx">
              <div data-id="hguzlqpmh" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div className="text-xl font-bold text-purple-600" data-id="f8h9g6t7p" data-path="src/components/games/ProblemSolvingGame.tsx">{score}</div>
                <div className="text-xs text-gray-500" data-id="rdfym5cld" data-path="src/components/games/ProblemSolvingGame.tsx">Final Score</div>
              </div>
              <div data-id="lgzaj2mc5" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div className="text-xl font-bold text-purple-600" data-id="sjbg68e47" data-path="src/components/games/ProblemSolvingGame.tsx">{accuracy}%</div>
                <div className="text-xs text-gray-500" data-id="i3kfdnq5h" data-path="src/components/games/ProblemSolvingGame.tsx">Accuracy</div>
              </div>
              <div data-id="v1o0fyhgs" data-path="src/components/games/ProblemSolvingGame.tsx">
                <div className="text-xl font-bold text-purple-600" data-id="cure8ieh5" data-path="src/components/games/ProblemSolvingGame.tsx">{correctAnswers}/{totalProblems}</div>
                <div className="text-xs text-gray-500" data-id="2k0h0jg6k" data-path="src/components/games/ProblemSolvingGame.tsx">Correct</div>
              </div>
            </div>
            <div className="text-sm text-gray-600" data-id="ssialj55n" data-path="src/components/games/ProblemSolvingGame.tsx">
              Processing results...
            </div>
          </div>);


      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto" data-id="6uinbtm4t" data-path="src/components/games/ProblemSolvingGame.tsx">
      <CardContent className="p-0" data-id="9cdyuuba0" data-path="src/components/games/ProblemSolvingGame.tsx">
        {renderPhaseContent()}
      </CardContent>
    </Card>);

};

export default ProblemSolvingGame;